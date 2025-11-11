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
import { normalizePath } from '../Utils/PathUtil.js';

const DEFAULT_PWD = '/';

/**
 * @class FilesystemService
 * @description Manages all interactions with the virtual filesystem via the event bus.
 *
 * @listens for `FS_AUTOCOMPLETE_PATH_REQUEST` - Responds with path suggestions.
 * @listens for `FS_GET_DIRECTORY_CONTENTS_REQUEST` - Responds with directory contents.
 * @listens for `FS_GET_FILE_CONTENTS_REQUEST` - Responds with file contents.
 */
class FilesystemService extends BaseService {
    #storageServices = {
        SESSION: [EVENTS.STORAGE_API_REQUEST,'SESSION'],
        LOCAL: [EVENTS.STORAGE_API_REQUEST,'SESSION'],
        REMOTE: [EVENTS.STORAGE_API_REQUEST, 'SESSION']
    };

    #root = {
            DEVICE: this.#storageServices.SESSION,
            ID: 0,
            UUID: '00000000-0000-0000-0000-000000000000'
    };

    #baseMounts = {
        '/home': { 
            DEVICE: this.#storageServices.REMOTE,
            ID: 1,
            UUID: '00000000-0000-0000-0000-000000000000'
        },
        '/home/guest': {
            DEVICE: this.#storageServices.LOCAL,
            ID: 2,
            UUID: '00000000-0000-0000-0000-000000000000'
        },
        '/var/local': {
            DEVICE: this.#storageServices.LOCAL,
            ID: 3,
            UUID: '00000000-0000-0000-0000-000000000000'
        },
        '/var/remote': {
            DEVICE: this.#storageServices.REMOTE,
            ID: 4,
            UUID: '00000000-0000-0000-0000-000000000000'
        },
        '/var/session': {
            DEVICE: this.#storageServices.SESSION,
            ID: 5,
            UUID: '00000000-0000-0000-0000-000000000000'
        }
    };


    constructor(eventBus, config = {}) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    get eventHandlers() {
        return {
            [EVENTS.FS_READ_FILE_REQUEST]: this.#handleReadFileRequest.bind(this),
            [EVENTS.FS_WRITE_FILE_REQUEST]: this.#handleWriteFileRequest.bind(this),
            [EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST]: this.#handleGetDirectoryContents.bind(this),
            [EVENTS.FS_MAKE_DIRECTORY_REQUEST]: this.#handleMakeDirectory.bind(this),
            [EVENTS.FS_DELETE_FILE_REQUEST]: this.#handleDeleteFile.bind(this),
            [EVENTS.FS_REMOVE_DIRECTORY_REQUEST]: this.#handleRemoveDirectory.bind(this),
            [EVENTS.FS_CHANGE_DIRECTORY_REQUEST]: this.#handleChangeDirectory.bind(this),
            [EVENTS.FS_RESOLVE_PATH_REQUEST]: this.#handleResolvePathRequest.bind(this),
            //[EVENTS.FS_GET_PUBLIC_URL_REQUEST]: this.#handleGetPublicUrl.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.FS_GET_TREE_REQUEST]: this.#handleGetTreeRequest.bind(this)
        };
    }

    start() {
        this.log.log('Starting...');
        this.#createMountPoints();
    }

    async #createMountPoints() {
        const mountPaths = Object.keys(this.#baseMounts).sort();

        for (const path of mountPaths) {
            const mountInfo = this.#baseMounts[path];
            // #createMount is recursive and will create any necessary parent directories.
            // We start the creation process from the absolute root of the filesystem.
            await this.#createMount({
                path: path,
                mountPointDevice: mountInfo.DEVICE,
                mountPointId: mountInfo.ID,
                mountPointUUID: mountInfo.UUID
            });
        }
    }

    /**
     * A generic, recursive-style function to create a node at a given path.
     * It ensures all parent directories exist, creating them if necessary.
     * It uses a callback to define the final node to be created.
     * @private
     */
    async #_createNodeRecursive({ path, createNodeFn }) {
        const parts = normalizePath(path);
        const { DEVICE: device, ID: id, UUID: rootUUID } = this.#root;

        // Ensure the root directory for the initial device exists before starting traversal.
        const rootNode = await this.#getNode(device, id, rootUUID);
        if (!rootNode) {
            this.log.log(`Root UUID for device ID ${id} not found. Creating it.`);
            const newRootDir = { meta: { type: 'directory' }, content: [] };
            await this.#setNode(device, id, rootUUID, newRootDir);
        }

        // Start the recursive traversal from the absolute root.
        return await this.#traverse(device, id, rootUUID, parts, createNodeFn);
    }
    
    async #lockNode(device, id, parentUUID) {
        const { result: parentNode } = await this.request(device[0], {
            storageName: device[1],
            api: STORAGE_APIS.LOCK_NODE,
            data: { key: parentUUID, id }
        });
        return parentNode.lockId;
    }

    async #unlockNode(device, id, parentUUID, lockId) {
        await this.request(device[0], {
            storageName: device[1],
            api: STORAGE_APIS.UNLOCK_NODE,
            data: { key: parentUUID, lockId, id }
        });
    }

    async #getNode(device, id, uuid, lockId) {
        const { result: parentNode } = await this.request(device[0], {
            storageName: device[1],
            api: STORAGE_APIS.GET_NODE,
            data: { key: uuid, lockId, id },
        });
        return parentNode;
    }

    async #setNode(device, id, uuid, node, lockId) {
        const { result: parentNode } = await this.request(device[0], {
            storageName: device[1],
            api: STORAGE_APIS.SET_NODE,
            data: { key: uuid, lockId, id, node },
        });
        return parentNode;
    }

    async #traverse (currentDevice, currentId, parentUUID, remainingParts, createNodeFn) {
        // Base case: If there are no more parts, we have successfully found or created the parent directory.
        // We must also check if the final resolved node is a mount point and return its target instead.
        if (remainingParts.length === 0) {
            const finalNode = await this.#getNode(currentDevice, currentId, parentUUID);
            if (finalNode && finalNode.meta.type === 'mount') {
                return {
                    parentUUID: finalNode.meta.targetUUID,
                    device: finalNode.meta.targetDevice,
                    id: finalNode.meta.targetId
                };
            }
            return {
                parentUUID,
                device: currentDevice,
                id: currentId
            };
        }

        const [part, ...nextRemainingParts] = remainingParts;
        const isLastPart = nextRemainingParts.length === 0;
        let lockId;

        try {
            lockId = await this.#lockNode(currentDevice, currentId, parentUUID);
            const parentNode = await this.#getNode(currentDevice, currentId, parentUUID, lockId);

            if (!parentNode || parentNode.meta.type !== 'directory') throw new Error(`Cannot create node: Parent path is not a directory.`);

            const childEntry = parentNode.content.find(entry => entry.name === part);

            if (childEntry) {
                
                if (isLastPart) {
                    // The final part of the path exists. Check if it's a mount point.
                    const childNode = await this.#getNode(currentDevice, currentId, childEntry.uuid);
                    if (childNode && childNode.meta.type === 'mount') {
                        // It's a mount point, return the target's info.
                        return {
                            parentUUID: childNode.meta.targetUUID,
                            device: childNode.meta.targetDevice,
                            id: childNode.meta.targetId
                        };
                    }
                    // It's not a mount point (likely a directory), return its info.
                    return {
                        parentUUID: childEntry.uuid,
                        device: currentDevice,
                        id: currentId
                    };
                }

                const childNode = await this.#getNode(currentDevice, currentId, childEntry.uuid);
                                
                if (childNode.meta.type === 'mount') {
                    return await this.#traverse(childNode.meta.targetDevice, childNode.meta.targetId, childNode.meta.targetUUID, nextRemainingParts, createNodeFn);
                } else if (childNode.meta.type === 'directory') { 
                    return await this.#traverse(currentDevice, currentId, childEntry.uuid, nextRemainingParts, createNodeFn);
                }
                else throw new Error(`Path conflict: '${part}' exists and is not a directory.`);
                
            } else {
                // Child does not exist, so we create it.
                const childUUID = crypto.randomUUID();
                const newNode = isLastPart ? createNodeFn() : { meta: { type: 'directory' }, content: [] };

                await this.#setNode(currentDevice, currentId, childUUID, newNode);
                parentNode.content.push({ name: part, uuid: childUUID });
                await this.#setNode(currentDevice, currentId, parentUUID, parentNode, lockId);

                // Otherwise, continue creating the rest of the path from the newly created directory.
                return await this.#traverse(currentDevice, currentId, childUUID, nextRemainingParts, createNodeFn);
            }
        } finally {
            if (lockId) {
                await this.#unlockNode(currentDevice, currentId, parentUUID, lockId);
            }
        }
    }

    async #readFile({ path }) {
        // Use #_createNodeRecursive to find the node. The createNodeFn will throw an error
        // because we don't want #readFile to create a file if it doesn't exist.
        const { parentUUID, device, id } = await this.#_createNodeRecursive({
            path: path,
            createNodeFn: () => { throw new Error('File not found.'); }
        });

        // The UUID returned by a successful "find" operation is the UUID of the node itself.
        const node = await this.#getNode(device, id, parentUUID);

        if (!node) {
            // This case should theoretically not be hit if _createNodeRecursive succeeds, but it's good practice.
            throw new Error('File not found.');
        }

        if (node.meta.type !== 'file') {
            throw new Error('Path is not a file.');
        }

        return node.content;
    }

    async #writeFile({ path, content }) {
        // 1. Separate parent path and filename.
        const parts = normalizePath(path);
        if (parts.length === 0) {
            throw new Error('Cannot write to a file with an empty name.');
        }
        const fileName = parts.pop();
        const parentPath = '/' + parts.join('/');

        // 2. Find the parent directory. This will also create it if it doesn't exist.
        const { parentUUID, device: parentDevice, id: parentId } = await this.#_createNodeRecursive({
            path: parentPath,
            createNodeFn: () => ({ meta: { type: 'directory' }, content: [] }) // This part only runs if a segment needs creation
        });
        console.warn(parentUUID, parentPath);
        let lockId;
        try {
            // 3. Lock the parent directory to safely check for the file and update it.
            // Use the resolved parentDevice and parentId from the traversal.
            lockId = await this.#lockNode(parentDevice, parentId, parentUUID);

            // 4. Read the parent directory to check if the file already exists.
            const parentNode = await this.#getNode(parentDevice, parentId, parentUUID, lockId);

            const childEntry = parentNode.content.find(entry => entry.name === fileName);

            if (childEntry) {
                // --- FILE EXISTS, UPDATE IT ---
                const fileUUID = childEntry.uuid;
                const childLockId = await this.#lockNode(parentDevice, parentId, fileUUID);
                const existingNode = await this.#getNode(parentDevice, parentId, fileUUID, childLockId);

                if (existingNode.meta.type !== 'file') {
                    throw new Error(`Cannot write file: '${fileName}' exists and is not a file.`);
                }

                existingNode.content = content;

                await this.#setNode(parentDevice, parentId, fileUUID, existingNode, childLockId);
                await this.#unlockNode(parentDevice, parentId, fileUUID, childLockId);
                return fileUUID;
            } else {
                // --- FILE DOES NOT EXIST, CREATE IT ---
                const fileUUID = crypto.randomUUID();
                const fileNode = {
                    meta: { type: 'file' },
                    content: content
                };

                // Write the new file node.
                await this.#setNode(parentDevice, parentId, fileUUID, fileNode);

                // Add the new file to the parent's content list.
                parentNode.content.push({ name: fileName, uuid: fileUUID });

                // Write the updated parent directory back.
                await this.#setNode(parentDevice, parentId, parentUUID, parentNode, lockId);

                return fileUUID;
            }
        } finally {
            if (lockId) {
                await this.#unlockNode(parentDevice, parentId, parentUUID, lockId);
            }
        }
    }

    async #createMount({ path, mountPointDevice, mountPointId, mountPointUUID }) {
        // Ensure the target directory for the mount point exists on the target device.
        const targetNode = await this.#getNode(mountPointDevice, mountPointId, mountPointUUID);

        // If the target directory doesn't exist, create it.
        if (!targetNode) {
            this.log.log(`Mount target UUID ${mountPointUUID} for device ID ${mountPointId} not found. Creating it.`);
            const newRootDir = { meta: { type: 'directory' }, content: [] };
            await this.#setNode(mountPointDevice, mountPointId, mountPointUUID, newRootDir);
        }

        // Now, create the mount point node itself in the source filesystem.
        const createNodeFn = () => ({
            meta: { type: 'mount', targetDevice: mountPointDevice, targetId: mountPointId, targetUUID: mountPointUUID },
            content: null,
        });

        return this.#_createNodeRecursive({ path, createNodeFn });
    }

    async #createDir({ path }) {
        const createNodeFn = () => ({ meta: { type: 'directory' }, content: [] });
        return this.#_createNodeRecursive({ path, createNodeFn });
    }

    async #findFile({path}) {
        // Use the traversal logic to find the node. If it doesn't exist, this will throw.
        const { parentUUID } = await this.#_createNodeRecursive({
            path: path,
            createNodeFn: () => { throw new Error('File not found.'); }
        });
        // The UUID returned is the UUID of the found file/directory itself.
        return parentUUID;
    }

    async #getTree() {
        // Memoization cache to avoid re-processing the same directory UUID on the same device.

        const traverse = async (device, id, nodeUUID, visited) => {
            const visitedKey = `${id}:${nodeUUID}`;
            if (visited.has(visitedKey)) {
                return { '[cycle]': {} }; // Mark cycles to prevent infinite loops
            }

            const node = await this.#getNode(device, id, nodeUUID);

            if (!node) return {};

            // If we hit a mount point, we traverse its target instead.
            if (node.meta.type === 'mount') {
                visited.set(visitedKey, {}); // Cache to detect cycles before traversing into the mount
                return await traverse(node.meta.targetDevice, node.meta.targetId, node.meta.targetUUID, visited);
            }

            if (node.meta.type !== 'directory') {
                return null; // Represents a file leaf in the tree
            }

            const directoryObject = {};
            visited.set(visitedKey, directoryObject); // Cache before recursing

            for (const child of node.content) {
                // Recursively traverse each child. The child's node will determine if it's a file, dir, or mount.
                directoryObject[child.name] = await traverse(device, id, child.uuid, visited);
            }
            return directoryObject;
        };
        
        // Start the traversal from the absolute root of the filesystem.
        return await traverse(this.#root.DEVICE, this.#root.ID, this.#root.UUID, new Map());
    }

    async #handleGetTreeRequest({ respond }) {
        try {
            const tree = await this.#getTree();
            respond({ tree });
        } catch (error) {
            this.log.error('Failed to get filesystem tree:', error);
            respond({ error });
        }
    }

    async #handleReadFileRequest({ path, respond }) {
        if (path == '/var/remote/USERSPACE/PS1') {
            respond({ contents: '[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}'});
            return;
        } else if (path === '/var/local/ENV/USER') {
            respond({ contents: 'guest' });
            return;
        } else if (path === '/var/session/ENV/HOST') {
            respond({ contents: 'localhost' });
            return;
        } else if (path === '/var/session/ENV/PWD') {
            respond({ contents: '/' });
            return;
        } else if (path === '/var/remote/SYSTEM/THEME2') {
            respond({ contents: 'yellow' });
            return;
        } else if (path === '/var/session/ENV/UUID') {
            respond({ contents: '00000000-0000-0000-0000-000000000000' });
            return;
        } else if (path === '/var/session/ENV/HOME') {
            respond({ contents: '/home/guest' });
            return;
        } else if (path === '/var/remote/SYSTEM/ALIAS') {
            respond({ contents: '{"cd": "cd .."}'});
            return;
        } else if (path === '/home/guest/.nnoitra_history2') {
            respond({contents: 'A\nB\nC\nD\nE\nF'});
            return;
        } else if (path === '/var/remote/SYSTEM/HISTSIZE') {
            respond({contents: '10'});
            return;
        } else if (path === '/var/local/ENV/TOKEN') {
            respond({contents: ''});
            return;
        } else if (path === '/var/session/ENV/TEST') {
            respond({contents: '123'});
            return;
        }

        try {
            const contents = await this.#readFile({ path });
            respond({ contents });
        } catch (error) {
            this.log.error(`Failed to read file '${path}':`, error);
            respond({ error });
        }
    }

    async #handleWriteFileRequest({ path, content, respond }) {
        console.warn({ path, content, respond });
        try {
            await this.#writeFile({
                path,
                content
            });
        } catch (error) {
            this.log.error(`Failed to write file '${path}':`, error);
        }
    }

    async #handleGetDirectoryContents({ path, respond }) {
        try {
            const { parentUUID, device, id } = await this.#_createNodeRecursive({
                path: path,
                createNodeFn: () => { throw new Error('Directory not found.'); }
            });
            const node = await this.#getNode(device, id, parentUUID);
            if (!node || node.meta.type !== 'directory') {
                throw new Error('Path is not a directory.');
            }
            const contents = {
                directories: node.content.filter(c => c.type === 'directory'),
                files: node.content.filter(c => c.type === 'file'),
            };
            respond({ contents });
        } catch (error) {
            this.log.error(`Failed to get directory contents for '${path}':`, error);
            respond({ error });
        }
    }

    async #handleMakeDirectory({ path, respond }) {
        try {
            // The #createDir function handles recursive creation, ensuring all
            // parent directories in the path are created if they don't exist.
            // We start the process from the absolute root of the filesystem.
            await this.#createDir({ path: path });
            respond({ success: true });
        } catch (error) {
            this.log.error(`Failed to create directory '${path}':`, error);
            respond({ error });
        }
    }

    async #handleDeleteFile({ path, respond }) {
        // This is a simplified delete. A full implementation would also remove the
        // entry from its parent directory's content list, which requires locking.
        try {
            const { parentUUID, device, id } = await this.#_createNodeRecursive({
                path: path,
                createNodeFn: () => { throw new Error('File not found.'); }
            });
            await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.DELETE_NODE,
                data: { key: parentUUID, id }
            });
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleRemoveDirectory({ path, respond }) {
        // This is a simplified delete. A full implementation would check if the
        // directory is empty and remove it from its parent.
        try {
            const { parentUUID, device, id } = await this.#_createNodeRecursive({
                path: path,
                createNodeFn: () => { throw new Error('Directory not found.'); }
            });
            await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.DELETE_NODE,
                data: { key: parentUUID, id }
            });
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleChangeDirectory({ path, respond }) {
        try {
            const { parentUUID } = await this.#_createNodeRecursive({
                path,
                createNodeFn: () => { throw new Error('Directory not found.'); }
            });
            // A successful resolution means the directory exists.
            this.dispatch(EVENTS.VAR_SET_REQUEST, { key: ENV_VARS.PWD, value: path, category: 'TEMP' });
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleResolvePathRequest({ path, respond }) {
        // This is a simplified version. A full implementation might need to check
        // if the resolved path actually exists, depending on requirements.
        respond({ path });
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        this.log.warn(`Dummy handling VAR_UPDATE_DEFAULT_REQUEST for key: ${key}`);
        if (key === ENV_VARS.PWD) {
            respond({ value: DEFAULT_PWD });
        }
    }

}

export { FilesystemService };