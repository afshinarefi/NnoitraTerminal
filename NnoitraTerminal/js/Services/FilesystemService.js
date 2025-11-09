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
            [EVENTS.FS_WRITE_FILE_REQUEST]: this.#handleWriteFile.bind(this),
            [EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST]: this.#handleGetDirectoryContents.bind(this),
            [EVENTS.FS_MAKE_DIRECTORY_REQUEST]: this.#handleMakeDirectory.bind(this),
            [EVENTS.FS_DELETE_FILE_REQUEST]: this.#handleDeleteFile.bind(this),
            [EVENTS.FS_REMOVE_DIRECTORY_REQUEST]: this.#handleRemoveDirectory.bind(this),
            [EVENTS.FS_CHANGE_DIRECTORY_REQUEST]: this.#handleChangeDirectory.bind(this),
            [EVENTS.FS_RESOLVE_PATH_REQUEST]: this.#handleResolvePathRequest.bind(this),
            [EVENTS.FS_GET_PUBLIC_URL_REQUEST]: this.#handleGetPublicUrl.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.FS_GET_TREE_REQUEST]: this.#handleGetTreeRequest.bind(this)
        };
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
                device: this.#root.DEVICE,
                id: this.#root.ID,
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
    async #_createNodeRecursive({ device, id, path, createNodeFn }) {
        const rootUUID = '00000000-0000-0000-0000-000000000000';

        // Ensure the root directory for this device/id exists.
        const { result: rootNode } = await this.request(device[0], {
            storageName: device[1],
            api: STORAGE_APIS.GET_NODE,
            data: { key: rootUUID, id },
        });

        if (!rootNode) {
            this.log.log(`Root UUID for device ID ${id} not found. Creating it.`);
            const newRootDir = { meta: { type: 'directory' }, content: [] };
            await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.SET_NODE,
                data: { key: rootUUID, node: newRootDir, id },
            });
        }

        const parts = normalizePath(path);
        if (parts.length === 0) return rootUUID; // Path is just '/', which already exists.

        let parentUUID = rootUUID;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLastPart = i === parts.length - 1;
            let childUUID;
            let lockId;

            try {
                ({ result: { lockId } } = await this.request(device[0], {
                    storageName: device[1],
                    api: STORAGE_APIS.LOCK_NODE,
                    data: { key: parentUUID, id },
                }));

                const { result: parentNode } = await this.request(device[0], {
                    storageName: device[1],
                    api: STORAGE_APIS.GET_NODE,
                    data: { key: parentUUID, lockId, id },
                });

                if (!parentNode || parentNode.meta.type !== 'directory') throw new Error(`Cannot create node: Parent path is not a directory.`);

                const childEntry = parentNode.content.find(entry => entry.name === part);

                if (childEntry) {
                    const { result: childNode } = await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.GET_NODE, data: { key: childEntry.uuid, id } });
                    
                    // If we encounter a mount point, we need to switch our context
                    // to the new device and continue from there.
                    if (childNode.meta.type === 'mount') {
                        device = childNode.meta.targetDevice;
                        id = childNode.meta.targetId;
                        parentUUID = childNode.meta.targetUUID;
                        // Since we've switched to a new root, we need to re-evaluate the next part
                        // in the context of this new root. We can do this by just continuing the loop.
                        continue;
                    } else if (childNode.meta.type !== 'directory' && !isLastPart) throw new Error(`Path conflict: '${part}' exists and is not a directory.`);
                    childUUID = childEntry.uuid;
                } else {
                    childUUID = crypto.randomUUID();
                    const newNode = isLastPart ? createNodeFn() : { meta: { type: 'directory' }, content: [] };

                    await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.SET_NODE, data: { key: childUUID, node: newNode, id } });
                    parentNode.content.push({ name: part, uuid: childUUID });
                    await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.SET_NODE, data: { key: parentUUID, node: parentNode, lockId, id } });
                }
            } finally {
                if (lockId) {
                    await this.request(device[0], { storageName: device[1], api: STORAGE_APIS.UNLOCK_NODE, data: { key: parentUUID, lockId, id }});
                }
            }
            parentUUID = childUUID;
        }
        return parentUUID;
    }
    
    async #createMount({ device, id, path, mountPointDevice, mountPointId, mountPointUUID }) {
        // Ensure the target directory for the mount point exists on the target device.
        const { result: targetNode } = await this.request(mountPointDevice[0], {
            storageName: mountPointDevice[1],
            api: STORAGE_APIS.GET_NODE,
            data: { key: mountPointUUID, id: mountPointId },
        });

        // If the target directory doesn't exist, create it.
        if (!targetNode) {
            this.log.log(`Mount target UUID ${mountPointUUID} for device ID ${mountPointId} not found. Creating it.`);
            const newRootDir = { meta: { type: 'directory' }, content: [] };
            await this.request(mountPointDevice[0], {
                storageName: mountPointDevice[1],
                api: STORAGE_APIS.SET_NODE,
                data: { key: mountPointUUID, node: newRootDir, id: mountPointId },
            });
        }

        // Now, create the mount point node itself in the source filesystem.
        const createNodeFn = () => ({
            meta: { type: 'mount', targetDevice: mountPointDevice, targetId: mountPointId, targetUUID: mountPointUUID },
            content: null,
        });

        return this.#_createNodeRecursive({ device, id, path, createNodeFn });
    }

    async #createDir({ device, id, path }) {
        const createNodeFn = () => ({ meta: { type: 'directory' }, content: [] });
        return this.#_createNodeRecursive({ device, id, path, createNodeFn });
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

    #handleWriteFile({ path, content, respond }) {
        this.log.warn(`Dummy handling FS_WRITE_FILE_REQUEST for path: ${path} with content: ${content}`);
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

    async #getTree() {
        // Memoization cache to avoid re-processing the same directory UUID on the same device.
        const visited = new Map();

        const traverse = async (device, id, nodeUUID) => {
            const visitedKey = `${id}:${nodeUUID}`;
            if (visited.has(visitedKey)) {
                return { '[cycle]': {} }; // Mark cycles to prevent infinite loops
            }

            const { result: node } = await this.request(device[0], {
                storageName: device[1],
                api: STORAGE_APIS.GET_NODE,
                data: { key: nodeUUID, id }
            });

            if (!node) return {};

            // If we hit a mount point, we traverse its target instead.
            if (node.meta.type === 'mount') {
                visited.set(visitedKey, {}); // Cache to detect cycles
                return await traverse(node.meta.targetDevice, node.meta.targetId, node.meta.targetUUID);
            }

            if (node.meta.type !== 'directory') {
                return null; // Represents a file leaf in the tree
            }

            const directoryObject = {};
            visited.set(visitedKey, directoryObject); // Cache before recursing

            for (const child of node.content) {
                // Recursively traverse each child. The child's node will determine if it's a file, dir, or mount.
                directoryObject[child.name] = await traverse(device, id, child.uuid);
            }
            return directoryObject;
        };
        
        // Start the traversal from the absolute root of the filesystem.
        return await traverse(this.#root.DEVICE, this.#root.ID, this.#root.UUID);
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





    #handleGetDirectoryContents({ path, respond }) {
        this.log.warn(`Dummy handling FS_GET_DIRECTORY_CONTENTS_REQUEST for path: ${path}`);
        const dummyContents = {
            directories: [{ name: 'dummy_dir' }],
            files: [{ name: 'TEST', size: 123 }]
        };
        respond({ contents: dummyContents });
    }

    async #handleMakeDirectory({ path, respond }) {
        try {
            // The #createDir function handles recursive creation, ensuring all
            // parent directories in the path are created if they don't exist.
            // We start the process from the absolute root of the filesystem.
            await this.#createDir({
                device: this.#root.DEVICE,
                id: this.#root.ID,
                path: path
            });
            respond({ success: true });
        } catch (error) {
            this.log.error(`Failed to create directory '${path}':`, error);
            respond({ error });
        }
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