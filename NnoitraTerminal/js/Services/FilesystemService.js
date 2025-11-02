/**
 * Nnoitra Terminal
 * Copyright (C) 2024 Arefi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { ENV_VARS } from '../Core/Variables.js';
import { EVENTS } from '../Core/Events.js';
import { STORAGE_APIS } from '../Core/StorageApis.js';
import { BaseService } from '../Core/BaseService.js';
import { resolvePath } from '../Utils/PathUtil.js';

const DEFAULT_PWD = '/';

/**
 * @class FilesystemService
 * @description Manages all interactions with the virtual filesystem via the event bus.
 *
 * @listens for `FS_AUTOCOMPLETE_PATH_REQUEST` - Responds with path suggestions.
 * @listens for `FS_GET_DIRECTORY_CONTENTS_REQUEST` - Responds with directory contents.
 * @listens for `FS_GET_FILE_CONTENTS_REQUEST` - Responds with file contents.
 */
class FilesystemService extends BaseService{
    #storageServices = {
        SESSION: [EVENTS.STORAGE_API_REQUEST,'SESSION'],
        LOCAL: [EVENTS.STORAGE_API_REQUEST,'LOCAL'],
        REMOTE: [EVENTS.STORAGE_API_REQUEST, 'REMOTE']
    };

    /**
     * @private
     * @description Defines the root of the virtual filesystem (VFS).
     * The VFS architecture is as follows:
     * 1. There are three node types: 'file', 'directory', and 'mount'.
     * 2. A node (identified by a UUID) does not store its own name. Its name is stored
     *    by its parent directory.
     * 3. The entire filesystem has a single root ('/') which lives in SESSION storage.
     * 4. A 'directory' node's content is a list of [uuid, name] pairs for its children.
     * 5. A 'mount' node acts as a gateway to another filesystem. Its metadata contains
     *    the target storage service ('SESSION', 'LOCAL', 'REMOTE') and the UUID of the
     *    directory it is mounted to on that service.
     * 6. Path resolution starts at the root and traverses the directory tree. When a 'mount'
     *    node is encountered, the VFS seamlessly crosses over to the target storage service
     *    and continues the traversal from the mounted directory's UUID.
     *
     * For example, the root directory in SESSION storage contains a 'mount' node for '/home'.
     * This mount node points to the UUID of the '/home' directory located in REMOTE storage.
     */
    #filesystem = {
        '/': { 
            DEVICE: this.#storageServices.SESSION, 
            UUID:'91e05212-d341-41f2-a4dd-615240ac62fc'
        },
        '/home': { 
            DEVICE: this.#storageServices.REMOTE,
            UUID: 'a3771916-158b-47af-a78c-1151538590f0'
        },
        '/home/guest': {
            DEVICE: this.#storageServices.LOCAL,
            UUID: '897ba474-ff01-4312-bc06-4127dd49fc3c'
        },
        '/var/local': {
            DEVICE: this.#storageServices.LOCAL,
            UUID: 'eb8ac8ed-cc20-4286-aded-1b0810c1e99c'
        },
        '/var/remote': {
            DEVICE: this.#storageServices.REMOTE,
            UUID: '3c77ca09-8bb7-4e63-bea8-5c08ec325264'
        },
        '/var/session': {
            DEVICE: this.#storageServices.SESSION,
            UUID: '867486bd-2424-40b7-afb1-7e651fbd0bb9'
        }
    };

    constructor(eventBus, config = {}) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    get eventHandlers() {
        return {
            [EVENTS.FS_READ_FILE_REQUEST]: this.#handleReadFileRequest.bind(this),
            [EVENTS.FS_WRITE_FILE_REQUEST]: this.#handleWriteFile.bind(this),
            [EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST]: this.#handleGetDirectoryContents.bind(this),
            [EVENTS.FS_MAKE_DIRECTORY_REQUEST]: this.#handleMakeDirectory.bind(this),
            [EVENTS.FS_DELETE_FILE_REQUEST]: this.#handleDeleteFile.bind(this),
            [EVENTS.FS_REMOVE_DIRECTORY_REQUEST]: this.#handleRemoveDirectory.bind(this),
            [EVENTS.FS_CHANGE_DIRECTORY_REQUEST]: this.#handleChangeDirectory.bind(this),
            [EVENTS.FS_RESOLVE_PATH_REQUEST]: this.#handleResolvePathRequest.bind(this),
            [EVENTS.FS_GET_PUBLIC_URL_REQUEST]: this.#handleGetPublicUrl.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
        };
    }

    /**
     * Resolves a virtual path to its storage service and the UUID of the target node.
     * @param {string} path The virtual path.
     * @returns {Promise<{storageName: string, uuid: string}>}
     * @private
     */
    async #resolvePathToStorage(path) {
        // This method is now internal and assumes it's being called by a public handler
        // that has already resolved the path and fetched necessary context.
        const resolvedPath = await this.#getResolvedPath(path); // This now needs to be fixed

        // 2. Start traversal from the absolute root of the VFS.
        let { storageName, uuid: currentUuid } = await this.#initializeVFS();

        // 3. If the path is just the root, we're done.
        if (resolvedPath === '/') {
            return { storageName, uuid: currentUuid };
        }

        // 4. Traverse the path parts one by one.
        const parts = resolvedPath.substring(1).split('/');
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLastPart = i === parts.length - 1;

            // The `traverseStep` function will handle moving one level down the directory tree,
            // including crossing mount points.
            const result = await this.#traverseStep(storageName, currentUuid, part);

            if (result.notFound) {
                // If the part was not found and it's the last part of the path,
                // it might be a file or directory we intend to create.
                // Return the parent's info so the calling function can proceed.
                if (isLastPart) {
                    return { storageName, parentUuid: currentUuid, childName: part };
                } else {
                    throw new Error(`Path not found: ${part} in ${path}`);
                }
            }

            // Update context for the next iteration.
            storageName = result.storageName;
            currentUuid = result.uuid;
        }

        // 5. Return the final resolved node information.
        return { storageName, uuid: currentUuid };
    }

    /**
     * Resolves a user-provided path into a clean, absolute path string.
     * @param {string} path - The user-provided path.
     * @returns {Promise<string>} The absolute path.
     * @private
     */
    async #getResolvedPath(path) {
        let homeDir = '/home/guest'; // Provide a safe default.
        // This is the critical fix: Only request the HOME variable if the path
        // explicitly uses a tilde (~). This breaks the circular dependency that
        // occurs during startup when resolving absolute paths for other variables.
        if (path.startsWith('~')) {
            const { value } = await this.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.HOME, category: 'TEMP' });
            homeDir = value;
        }
        // For resolving absolute paths (like /var/local/...), the PWD is not needed.
        // We can safely pass '/' as the PWD to the utility.
        return resolvePath(path, '/', homeDir);
    }
    /**
     * Ensures the VFS root node exists and returns its initial context.
     * @returns {Promise<{storageName: string, uuid: string}>}
     * @private
     */
    async #initializeVFS() {
        const { DEVICE: [_, storageName], UUID: rootUuid } = this.#filesystem['/'];
        let rootNode = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: rootUuid });
        if (!rootNode) {
            rootNode = {
                meta: { type: 'directory' },
                content: JSON.stringify([])
            };
            await this.#makeStorageRequest(storageName, STORAGE_APIS.SET_NODE, { key: rootUuid, node: rootNode });
        }
        return { storageName, uuid: rootUuid };
    }

    /**
     * Traverses a single step down the directory tree from a parent node.
     * @param {string} storageName - The storage service of the parent.
     * @param {string} parentUuid - The UUID of the parent directory.
     * @param {string} childName - The name of the child to find.
     * @returns {Promise<{storageName: string, uuid: string}|{notFound: boolean}>}
     * @private
     */
    async #traverseStep(storageName, parentUuid, childName) {
        const parentNode = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: parentUuid });

        if (!parentNode || parentNode.meta.type !== 'directory') {
            throw new Error(`Path component is not a directory.`);
        }

        const children = JSON.parse(parentNode.content || '[]');
        const childEntry = children.find(entry => entry[1] === childName);

        if (!childEntry) {
            return { notFound: true };
        }

        let childUuid = childEntry[0];
        const childNode = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: childUuid });

        // If the child is a mount point, switch context to the target storage and UUID.
        if (childNode.meta.type === 'mount') {
            return { storageName: childNode.meta.targetStorage, uuid: childNode.meta.targetUuid };
        }

        return { storageName, uuid: childUuid };
    }

    async #writeFile(path, content) {
        const { storageName, parentUuid, childName, uuid } = await this.#resolvePathToStorage(path);
        let fileUuid = uuid;

        if (!fileUuid) { // File doesn't exist, create it
            // We need a valid parent directory to create a file in.
            if (!parentUuid || !childName) throw new Error('Cannot create file in a non-existent directory.');
            
            // Create the new file node.
            fileUuid = crypto.randomUUID();
            const fileNode = { meta: { type: 'file' }, content };
            await this.#makeStorageRequest(storageName, STORAGE_APIS.SET_NODE, { key: fileUuid, node: fileNode });

            // --- Read-Modify-Write with Lock ---
            // Acquire a lock on the parent directory to safely modify its content list.
            const { lockId } = await this.#makeStorageRequest(storageName, STORAGE_APIS.LOCK_NODE, { key: parentUuid });
            try {
                // 1. Read: Get the parent directory node.
                const parentNode = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: parentUuid, lockId });
                const children = JSON.parse(parentNode.content);
                // 2. Modify: Add the new [uuid, name] pair to the list.
                children.push([fileUuid, childName]);
                parentNode.content = JSON.stringify(children);
                // 3. Write: Save the updated parent node.
                await this.#makeStorageRequest(storageName, STORAGE_APIS.SET_NODE, { key: parentUuid, node: parentNode, lockId });
            } finally {
                // Always release the lock, even if an error occurred.
                await this.#makeStorageRequest(storageName, STORAGE_APIS.UNLOCK_NODE, { key: parentUuid, lockId });
            }

        } else { // File exists, overwrite content
            const fileNode = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: fileUuid });
            // You can't use #writeFile on a directory.
            if (fileNode.meta.type === 'directory') throw new Error('Cannot write to a directory.');
            // Update the content and save the node.
            fileNode.content = content;
            await this.#makeStorageRequest(storageName, STORAGE_APIS.SET_NODE, { key: fileUuid, node: fileNode });
        }
    }

    async #readFile(path) {
        const { storageName, uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('File not found.');
        const node = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: uuid });
        // Ensure the path points to a file.
        if (!node || node.meta.type !== 'file') throw new Error('Path is not a file.');
        return node.content;
    }

    async #deleteFile(path) {
        const { storageName, uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('File not found.');
        // This is a simplified delete. A real one would also remove it from parent's content array.
        await this.#makeStorageRequest(storageName, STORAGE_APIS.DELETE_NODE, { key: uuid });
    }

    async #makeDirectory(path) {
        const resolvedPath = await this.#getResolvedPath(path);
        if (resolvedPath === '/') return; // Cannot create root

        let { storageName, uuid: currentUuid } = await this.#initializeVFS();
        const parts = resolvedPath.substring(1).split('/');

        for (const part of parts) {
            if (!part) continue;

            const result = await this.#traverseStep(storageName, currentUuid, part);

            if (result.notFound) {
                // Directory doesn't exist, so create it.
                const newDirUuid = crypto.randomUUID();
                const dirNode = { meta: { type: 'directory' }, content: JSON.stringify([]) };
                await this.#makeStorageRequest(storageName, STORAGE_APIS.SET_NODE, { key: newDirUuid, node: dirNode });

                // --- Read-Modify-Write with Lock to add it to the parent ---
                const { lockId } = await this.#makeStorageRequest(storageName, STORAGE_APIS.LOCK_NODE, { key: currentUuid });
                try {
                    const parentNode = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: currentUuid, lockId });
                    const children = JSON.parse(parentNode.content);
                    children.push([newDirUuid, part]);
                    parentNode.content = JSON.stringify(children);
                    await this.#makeStorageRequest(storageName, STORAGE_APIS.SET_NODE, { key: currentUuid, node: parentNode, lockId });
                } finally {
                    await this.#makeStorageRequest(storageName, STORAGE_APIS.UNLOCK_NODE, { key: currentUuid, lockId });
                }
                currentUuid = newDirUuid;
            } else {
                // Directory exists, continue traversal.
                storageName = result.storageName;
                currentUuid = result.uuid;
            }
        }
    }

    async #removeDirectory(path) {
        const { storageName, uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('Directory not found.');
        // This is a simplified delete. A real one would be recursive and remove from parent.
        await this.#makeStorageRequest(storageName, STORAGE_APIS.DELETE_NODE, { key: uuid });
    }

    async #getMetaData(path) {
        const { storageName, uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) return { path, isDirectory: false, isFile: false };
        // Fetch the node and return its metadata.
        const node = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: uuid });
        return {
            path,
            isDirectory: node.meta.type === 'directory' || node.meta.type === 'mount',
            isFile: node.meta.type === 'file',
        };
    }

    async #listDirectory(path) {
        const { storageName, uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('Directory not found.');
        const node = await this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: uuid });
        // Ensure the path points to a directory or mount.
        if (node.meta.type !== 'directory' && node.meta.type !== 'mount') throw new Error('Not a directory.');

        // Content is an array of [uuid, name] pairs.
        const childEntries = JSON.parse(node.content || '[]');

        // Fetch all child nodes to get their types.
        const childrenNodes = await Promise.all(
            childEntries.map(entry => this.#makeStorageRequest(storageName, STORAGE_APIS.GET_NODE, { key: entry[0] }))
        );

        // Combine the name from the parent with the type from the child.
        return childrenNodes.map((childNode, index) => {
            return { name: childEntries[index][1], ...childNode.meta };
        });
    }

    async #handleWriteFile({ path, content, respond }) {
        try {
            await this.#writeFile(path, content);
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleDeleteFile({ path, respond }) {
        try {
            await this.#deleteFile(path);
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleMakeDirectory({ path, respond }) {
        try {
            await this.#makeDirectory(path);
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleRemoveDirectory({ path, respond }) {
        try {
            await this.#removeDirectory(path);
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleReadFileRequest({ path, respond }) {
        try {
            const contents = await this.#readFile(path);
            respond({ contents });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleGetDirectoryContents({ path, respond }) {
        try {
            const contents = await this.#listDirectory(path);
            respond({ contents });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleChangeDirectory({ path, respond }) {
        try {
            // To change directory, we resolve the path and check if it's a directory.
            const meta = await this.#getMetaData(path);
            if (!meta.isDirectory) {
                throw new Error('Not a directory');
            }
            const newPath = meta.path;
            this.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key: ENV_VARS.PWD, value: newPath });
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleResolvePathRequest({ path, respond }) {
        try {
            const resolvedPath = await this.#getResolvedPath(path);
            respond({ path: resolvedPath });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleGetPublicUrl({ path, respond }) {
        try {
            // For now, public URLs are just the resolved path.
            const resolvedPath = await this.#getResolvedPath(path);
            respond({ url: resolvedPath });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleUpdateDefaultRequest({ key, respond }) {
        if (key === ENV_VARS.PWD) {
            // The default PWD should be the user's home directory.
            //const { value: homeDir } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.HOME });
            // EnvironmentService will set the variable after receiving this default value.
            respond({ value: DEFAULT_PWD });
        }
    }

    /**
     * Makes a request to a storage backend.
     * @param {string} storageName - The name of the storage service (e.g., 'SESSION').
     * @param {string} api - The API method to call (from STORAGE_APIS).
     * @param {object} data - The data payload for the API method.
     * @returns {Promise<any>}
     * @private
     */
    async #makeStorageRequest(storageName, api, data) {
        const { result, error } = await this.request(EVENTS.STORAGE_API_REQUEST, {
            storageName, api, data
        });
        if (error) throw error;
        return result;
    }
}

export { FilesystemService };