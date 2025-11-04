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
        LOCAL: [EVENTS.STORAGE_API_REQUEST,'SESSION'],
        REMOTE: [EVENTS.STORAGE_API_REQUEST, 'SESSION']
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
            ID: 0
        },
        '/home': { 
            DEVICE: this.#storageServices.REMOTE,
            ID: 1
        },
        '/home/guest': {
            DEVICE: this.#storageServices.LOCAL,
            ID: 2
        },
        '/var/local': {
            DEVICE: this.#storageServices.LOCAL,
            ID: 3
        },
        '/var/remote': {
            DEVICE: this.#storageServices.REMOTE,
            ID: 4
        },
        '/var/session': {
            DEVICE: this.#storageServices.SESSION,
            ID: 5
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
            [EVENTS.FS_GET_TREE_REQUEST]: this.#handleGetTreeRequest.bind(this),
        };
    }

    #findMountPoint(path) { // Note: This method does not need to be async
        // Get mount points and sort them by length, descending.
        // This ensures that a more specific path ('/home/guest') is matched before a less specific one ('/home').
        const sortedMounts = Object.keys(this.#filesystem).sort((a, b) => b.length - a.length);

        for (const mountPath of sortedMounts) {
            if (path.startsWith(mountPath)) {
                const mountInfo = this.#filesystem[mountPath];
                const { DEVICE: device, ID: id } = mountInfo;
                // The subPath is what remains after the mount point path.
                let subPath = path.substring(mountPath.length);

                if (subPath.startsWith('/')) {
                    subPath = subPath.slice(1);
                }
                return { device, id, subPath };
            }
        }
    }

    async #findFile({device, id, path}) {
        const rootUUID = '00000000-0000-0000-0000-000000000000';
        
        // Normalize path and split into components, filtering out empty strings from slashes.
        const parts = path.split('/').filter(p => p.length > 0);

        if (parts.length === 0) {
            // The path is the root directory itself.
            return rootUUID;
        }

        let currentUUID = rootUUID;

        for (const part of parts) {
            // Request the content of the current directory node from the specified device.
            const { result: directoryNode, error } = await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.GET_NODE,
                data: { key: currentUUID, id }
            });

            if (error || !directoryNode) {
                throw new Error(`Path not found: Could not read directory with UUID ${currentUUID}`);
            }

            if (directoryNode.meta.type !== 'directory') {
                throw new Error(`Path resolution failed: Node ${currentUUID} is not a directory.`);
            }

            // Find the UUID of the next part in the directory's content.
            const childEntry = directoryNode.content.find(entry => entry.name === part);
            if (!childEntry) {
                throw new Error(`Path not found: '${part}' does not exist in directory.`);
            }

            currentUUID = childEntry.uuid;
        }

        return currentUUID;
    }

    async #createDir({device, id, path}) {
        const rootUUID = '00000000-0000-0000-0000-000000000000';
        const parts = path.split('/').filter(p => p.length > 0);

        if (parts.length === 0) {
            return rootUUID; // Path is just '/', which already exists.
        }

        let parentUUID = rootUUID;
        let finalUUID = rootUUID;

        for (const part of parts) {
            let childUUID;
            let lockId;

            try {
                // Lock the parent directory to ensure atomic read-modify-write.
                ({ result: { lockId } } = await this.request(device[0], {
                    storageName: device[1],
                    api: STORAGE_APIS.LOCK_NODE,
                    data: { key: parentUUID, id }
                }));

                const { result: parentNode } = await this.request(device[0], {
                    storageName: device[1],
                    api: STORAGE_APIS.GET_NODE,
                    data: { key: parentUUID, lockId, id }
                });

                if (!parentNode || parentNode.meta.type !== 'directory') {
                    throw new Error(`Cannot create directory: Parent path is not a directory.`);
                }

                const childEntry = parentNode.content.find(entry => entry.name === part);

                if (childEntry) {
                    // Entry exists, check if it's a directory.
                    const { result: childNode } = await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.GET_NODE, data: { key: childEntry.uuid, id }});
                    if (childNode.meta.type !== 'directory') {
                        throw new Error(`Cannot create directory: '${part}' already exists and is not a directory.`);
                    }
                    childUUID = childEntry.uuid;
                } else {
                    // Entry does not exist, create it.
                    childUUID = crypto.randomUUID();
                    const newDirNode = { meta: { type: 'directory' }, content: [] };
                    parentNode.content.push({ name: part, uuid: childUUID });

                    // Write the new directory node and the updated parent node.
                    await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.SET_NODE, data: { key: childUUID, node: newDirNode, lockId, id }});
                    await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.SET_NODE, data: { key: parentUUID, node: parentNode, lockId, id }});
                }
            } finally {
                if (lockId) {
                    await this.request(device[0], {
                        storageName: device[1],
                        api: STORAGE_APIS.UNLOCK_NODE,
                        data: { key: parentUUID, lockId, id }
                    });
                }
            }
            parentUUID = childUUID;
        }

        return parentUUID;
    }

    async #createFile({device, id, path, content}) {
        // 1. Separate parent path and filename.
        const lastSlashIndex = path.lastIndexOf('/');
        const parentPath = lastSlashIndex > 0 ? path.substring(0, lastSlashIndex) : (lastSlashIndex === 0 ? '/' : '');
        const fileName = path.substring(lastSlashIndex + 1);

        if (!fileName) {
            throw new Error('Cannot create a file with an empty name.');
        }

        // 2. Create parent directories and get the parent directory's UUID.
        const parentUUID = await this.#createDir({ device, id, path: parentPath });

        // 3. Create the new file node and its UUID.
        const fileUUID = crypto.randomUUID();
        const fileNode = {
            meta: { type: 'file' },
            content: content
        };

        let lockId;
        try {
            // 4. Lock the parent directory for atomic update.
            ({ result: { lockId } } = await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.LOCK_NODE,
                data: { key: parentUUID, id }
            }));

            // Write the new file node itself.
            await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.SET_NODE,
                data: { key: fileUUID, node: fileNode, lockId, id }
            });

            // Read the parent directory's current state.
            const { result: parentNode } = await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.GET_NODE,
                data: { key: parentUUID, lockId, id }
            });

            // Add the new file to the parent's content list.
            parentNode.content.push({ name: fileName, uuid: fileUUID });

            // Write the updated parent directory back.
            await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.SET_NODE,
                data: { key: parentUUID, node: parentNode, lockId, id }
            });

        } finally {
            if (lockId) {
                await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.UNLOCK_NODE, data: { key: parentUUID, lockId, id }});
            }
        }

        return fileUUID;
    }

    async #getFile({device, id, path}) {
        // 1. Find the UUID of the file.
        const fileUUID = await this.#findFile({ device, id, path });

        // 2. Request the file node from the storage device using its UUID.
        const { result: fileNode, error } = await this.request(device[0], {
            storageName: device[1],
            api: STORAGE_APIS.GET_NODE,
            data: { key: fileUUID, id }
        });

        if (error || !fileNode) {
            throw new Error(`File not found at path: ${path}`);
        }

        // 3. Ensure the node is a file.
        if (fileNode.meta.type !== 'file') {
            throw new Error(`Path is not a file: ${path}`);
        }

        // 4. Return the content of the file.
        return fileNode.content;
    }

    async #getTree() {
        const rootMount = this.#findMountPoint('/');
        if (!rootMount) {
            throw new Error("Filesystem root is not defined.");
        }

        // Memoization cache to avoid re-processing the same directory UUID on the same device.
        const visited = new Map();

        const traverse = async (device, id, nodeUUID, currentVirtualPath) => {
            const visitedKey = `${id}:${nodeUUID}`;
            if (visited.has(visitedKey)) {
                return visited.get(visitedKey);
            }

            // Create the object for this directory and cache it immediately to handle cycles.
            const directoryObject = {};
            visited.set(visitedKey, directoryObject);

            // Get the real contents from the storage device.
            const { result: node } = await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.GET_NODE,
                data: { key: nodeUUID, id }
            });

            if (node && node.meta.type !== 'directory') {
                return null; // Represents a file in the final tree structure
            }

            // 1. Add real children from the storage node.
            if (node && node.content) {
                for (const child of node.content) {
                    const childVirtualPath = resolvePath(currentVirtualPath, child.name);
                    const mount = this.#findMountPoint(childVirtualPath);
                    const isNewMount = mount.subPath === '';
                    const nextDevice = isNewMount ? mount.device : device;
                    const nextId = isNewMount ? mount.id : id;
                    const nextUUID = isNewMount ? '00000000-0000-0000-0000-000000000000' : child.uuid;
                    directoryObject[child.name] = await traverse(nextDevice, nextId, nextUUID, childVirtualPath);
                }
            }
            return directoryObject;
        };

        const finalTree = {};
        const allMountPaths = Object.keys(this.#filesystem).sort();

        for (const path of allMountPaths) {
            const parts = path.split('/').filter(p => p);
            let currentLevel = finalTree;
            for (const part of parts) {
                currentLevel[part] = currentLevel[part] || {};
                currentLevel = currentLevel[part];
            }
        }
        
        // This is a simplified merge, a more robust solution would merge deeply.
        const realTree = await traverse(rootMount.device, rootMount.id, '00000000-0000-0000-0000-000000000000', '/');
        Object.assign(finalTree, realTree); // Simple merge for now.

        return finalTree;
    }

    async #handleGetTreeRequest({ respond }) {
        try {
            const tree = await this.#getTree();
            console.warn(tree);
            respond({ tree });
        } catch (error) {
            this.log.error('Failed to get filesystem tree:', error);
            respond({ error });
        }
    }

    #handleReadFileRequest({ path, respond }) {

        if (path == '/var/remote/USERSPACE/PS1') {
            respond({ contents: '[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}'});
        } else if (path === '/var/local/ENV/USER') {
            respond({ contents: 'guest' });
        } else if (path === '/var/session/ENV/HOST') {
            respond({ contents: 'localhost' });
        } else if (path === '/var/session/ENV/PWD') {
            respond({ contents: '/' });
        } else if (path === '/var/remote/SYSTEM/THEME') {
            respond({ contents: 'yellow' });
        } else if (path === '/var/session/ENV/UUID') {
            respond({ contents: '00000000-0000-0000-0000-000000000000' });
        } else if (path === '/var/session/ENV/HOME') {
            respond({ contents: '/home/guest' });
        } else if (path === '/var/remote/SYSTEM/ALIAS') {
            respond({ contents: '{"cd": "cd .."}'});
        } else if (path === '/home/guest/.nnoitra_history') {
            respond({contents: 'A\nB\nC\nD\nE\nF'});
        } else if (path === '/var/remote/SYSTEM/HISTSIZE') {
            respond({contents: '10'});
        } else if (path === '/var/local/ENV/TOKEN') {
            respond({contents: ''});
        } else if (path === '/var/session/ENV/TEST') {
            respond({contents: '123'});
        } else {
        this.log.warn(`Dummy handling FS_READ_FILE_REQUEST for path: ${path}`);
        const dummyContent = `This is dummy content for the file at ${path}.`;
        respond({ contents: dummyContent });
        }
    }

    #handleWriteFile({ path, content, respond }) {
        this.log.warn(`Dummy handling FS_WRITE_FILE_REQUEST for path: ${path} with content: ${content}`);
    }

    #handleGetDirectoryContents({ path, respond }) {
        this.log.warn(`Dummy handling FS_GET_DIRECTORY_CONTENTS_REQUEST for path: ${path}`);
        const dummyContents = {
            directories: [{ name: 'dummy_dir' }],
            files: [{ name: 'TEST', size: 123 }]
        };
        respond({ contents: dummyContents });
    }

    #handleMakeDirectory({ path, respond }) {
        this.log.warn(`Dummy handling FS_MAKE_DIRECTORY_REQUEST for path: ${path}`);
        respond({ success: true });
    }

    #handleDeleteFile({ path, respond }) {
        this.log.warn(`Dummy handling FS_DELETE_FILE_REQUEST for path: ${path}`);
        respond({ success: true });
    }

    #handleRemoveDirectory({ path, respond }) {
        this.log.warn(`Dummy handling FS_REMOVE_DIRECTORY_REQUEST for path: ${path}`);
        respond({ success: true });
    }

    #handleChangeDirectory({ path, respond }) {
        this.log.warn(`Dummy handling FS_CHANGE_DIRECTORY_REQUEST for path: ${path}`);
        this.dispatch(EVENTS.VAR_SET_REQUEST, { key: ENV_VARS.PWD, value: path, category: 'TEMP' });
        respond({ success: true });
    }

    #handleResolvePathRequest({ path, respond }) {
        this.log.warn(`Dummy handling FS_RESOLVE_PATH_REQUEST for path: ${path}`);
        respond({ path: `/dummy/resolved/${path.replace(/[^a-zA-Z0-9]/g, '_')}` });
    }

    #handleGetPublicUrl({ path, respond }) {
        this.log.warn(`Dummy handling FS_GET_PUBLIC_URL_REQUEST for path: ${path}`);
        respond({ url: `/dummy/public/${path}` });
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        this.log.warn(`Dummy handling VAR_UPDATE_DEFAULT_REQUEST for key: ${key}`);
        if (key === ENV_VARS.PWD) {
            respond({ value: DEFAULT_PWD });
        }
    }

}

export { FilesystemService };