/**
 * Arefi Terminal
 * Copyright (C) 2025 Arefi
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
import { createLogger } from '../Managers/LogManager.js';
import { ApiManager } from '../Managers/ApiManager.js';

const log = createLogger('FSBusService');

// Constants
const API_ENDPOINT = '/server/filesystem.py';
const VAR_PWD = 'PWD';

/**
 * @class FilesystemBusService
 * @description Manages the virtual filesystem, communicating exclusively via the event bus.
 *
 * @listens for `fs-list-contents-request` - Responds with the contents of a directory.
 * @listens for `fs-is-file-request` - Responds with a boolean indicating if a path is a file.
 * @listens for `fs-is-directory-request` - Responds with a boolean indicating if a path is a directory.
 * @listens for `fs-autocomplete-path-request` - Responds with path completion suggestions.
 * @listens for `variable-changed-broadcast` - To update its internal current path when PWD changes.
 *
 * @dispatches `fs-list-contents-response`
 * @dispatches `fs-is-file-response`
 * @dispatches `fs-is-directory-response`
 * @dispatches `fs-autocomplete-path-response`
 * @dispatches `variable-get-request` - To get the initial PWD.
 */
class FilesystemBusService {
    #eventBus;
    #eventNames;
    #apiManager;
    #filesystemTree = {};
    #currentPath = '/';

    static EVENTS = {
        PROVIDE_LIST_CONTENTS: 'provideListContents',
        PROVIDE_IS_FILE: 'provideIsFile',
        PROVIDE_IS_DIRECTORY: 'provideIsDirectory',
        PROVIDE_AUTOCOMPLETE: 'provideAutocomplete',
        LISTEN_VAR_CHANGED: 'listenVarChanged',
        USE_LIST_CONTENTS_RESPONSE: 'useListContentsResponse',
        USE_IS_FILE_RESPONSE: 'useIsFileResponse',
        USE_IS_DIRECTORY_RESPONSE: 'useIsDirectoryResponse',
        USE_AUTOCOMPLETE_RESPONSE: 'useAutocompleteResponse',
        USE_VAR_GET: 'useVarGet'
    };

    constructor(eventBus, eventNameConfig) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
        this.#apiManager = new ApiManager(API_ENDPOINT);
        this.#registerListeners();
        log.log('Initializing...');
    }

    async start() {
        // Request initial PWD and load the root of the filesystem.
        this.#eventBus.dispatch(this.#eventNames[FilesystemBusService.EVENTS.USE_VAR_GET], { key: VAR_PWD });
        try {
            const data = await this.#apiManager.get();
            if (Array.isArray(data.directories) && Array.isArray(data.files)) {
                this.#filesystemTree = {
                    _directories: data.directories,
                    _files: data.files
                };
            } else {
                this.#filesystemTree = data;
            }
            log.log('Filesystem tree loaded:', this.#filesystemTree);
        } catch (error) {
            log.error('Failed to load filesystem tree:', error);
            this.#filesystemTree = {};
        }
    }

    #registerListeners() {
        this.#eventBus.listen(this.#eventNames[FilesystemBusService.EVENTS.LISTEN_VAR_CHANGED], (payload) => {
            if (payload.key === VAR_PWD) {
                this.#currentPath = payload.value;
            }
        });

        this.#eventBus.listen(this.#eventNames[FilesystemBusService.EVENTS.PROVIDE_LIST_CONTENTS], async (payload) => {
            const contents = await this.listContents(payload.path);
            this.#eventBus.dispatch(this.#eventNames[FilesystemBusService.EVENTS.USE_LIST_CONTENTS_RESPONSE], { ...payload, contents });
        });

        this.#eventBus.listen(this.#eventNames[FilesystemBusService.EVENTS.PROVIDE_IS_FILE], async (payload) => {
            const isFile = await this.isFile(payload.path);
            this.#eventBus.dispatch(this.#eventNames[FilesystemBusService.EVENTS.USE_IS_FILE_RESPONSE], { ...payload, isFile });
        });

        this.#eventBus.listen(this.#eventNames[FilesystemBusService.EVENTS.PROVIDE_IS_DIRECTORY], async (payload) => {
            const isDirectory = await this.isDirectory(payload.path);
            this.#eventBus.dispatch(this.#eventNames[FilesystemBusService.EVENTS.USE_IS_DIRECTORY_RESPONSE], { ...payload, isDirectory });
        });

        this.#eventBus.listen(this.#eventNames[FilesystemBusService.EVENTS.PROVIDE_AUTOCOMPLETE], async (payload) => {
            const suggestions = await this.autocompletePath(payload.input, payload.includeFiles);
            this.#eventBus.dispatch(this.#eventNames[FilesystemBusService.EVENTS.USE_AUTOCOMPLETE_RESPONSE], { ...payload, suggestions });
        });
    }

    normalizePath(path) {
        const parts = [];
        const pathSegments = path.split('/').filter(p => p);

        for (const segment of pathSegments) {
            if (segment === '.' || segment === '') continue;
            if (segment === '..') {
                if (parts.length > 0) parts.pop();
            } else {
                parts.push(segment);
            }
        }
        return '/' + parts.join('/');
    }

    async listContents(path = this.#currentPath) {
        const normalizedPath = this.normalizePath(path);
        let node = this.#getNodeAtPath(normalizedPath);

        if (node && typeof node === 'object' && !Array.isArray(node) && (node._files || node._directories)) {
            return { files: node._files || [], directories: node._directories || [] };
        }

        try {
            const pathForApi = normalizedPath.replace(/^\//, '');
            const data = await this.#apiManager.get({ path: pathForApi });
            if (Array.isArray(data.directories) && Array.isArray(data.files)) {
                node = { _directories: data.directories, _files: data.files };
                this.#setNodeAtPath(normalizedPath, node);
                return { files: data.files, directories: data.directories };
            }
        } catch (error) {
            log.error('Failed to fetch directory contents:', error);
        }
        return null;
    }

    async isFile(path) {
        const parentPath = this.#getParentPath(path);
        const fileName = this.#getFileName(path);
        await this.listContents(parentPath); // Ensure parent is cached
        const parentNode = this.#getNodeAtPath(parentPath);
        return !!(parentNode && Array.isArray(parentNode._files) && parentNode._files.some(f => f.name === fileName));
    }

    async isDirectory(path) {
        const contents = await this.listContents(path);
        return contents !== null;
    }

    async autocompletePath(input, includeFiles = true) {
        const isAbsolute = input.startsWith('/');
        const fullPath = isAbsolute ? input : this.#currentPath.replace(/\/$/, '') + '/' + input;

        let parentPath, partial;
        if (input.endsWith('/') || input === '') {
            parentPath = this.normalizePath(fullPath);
            partial = '';
        } else {
            const lastSlashIndex = fullPath.lastIndexOf('/');
            parentPath = this.normalizePath(lastSlashIndex > 0 ? fullPath.substring(0, lastSlashIndex) : '/');
            partial = fullPath.substring(lastSlashIndex + 1);
        }

        const contents = await this.listContents(parentPath);
        if (!contents) return [];

        const prefix = input.substring(0, input.lastIndexOf('/') + 1);
        const directorySuggestions = (contents.directories || [])
            .filter(d => d && typeof d.name === 'string' && d.name.startsWith(partial))
            .map(d => prefix + d.name + '/');

        const fileSuggestions = includeFiles ? (contents.files || [])
            .filter(f => f && typeof f.name === 'string' && f.name.startsWith(partial))
            .map(f => prefix + f.name) : [];

        return [...directorySuggestions, ...fileSuggestions];
    }

    #getNodeAtPath(path) {
        const resolvedPath = this.normalizePath(path);
        const parts = resolvedPath.split('/').filter(p => p);
        let currentNode = this.#filesystemTree;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (currentNode && typeof currentNode === 'object' && !Array.isArray(currentNode)) {
                if (i === parts.length - 1 && currentNode._files && currentNode._files.some(f => f.name === part)) {
                    return part;
                }
                currentNode = currentNode[part];
            } else {
                return null;
            }
        }
        return currentNode;
    }

    #setNodeAtPath(path, node) {
        const parts = this.normalizePath(path).split('/').filter(p => p);
        let currentNode = this.#filesystemTree;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                currentNode[part] = node;
            } else {
                if (!currentNode[part] || typeof currentNode[part] !== 'object') {
                    currentNode[part] = { _directories: [], _files: [] };
                }
                currentNode = currentNode[part];
            }
        }
    }

    #getParentPath(path) {
        const normalizedPath = this.normalizePath(path);
        const parts = normalizedPath.split('/').filter(p => p);
        if (parts.length === 0) return '/';
        parts.pop();
        return '/' + parts.join('/');
    }

    #getFileName(path) {
        const normalizedPath = this.normalizePath(path);
        const parts = normalizedPath.split('/').filter(p => p);
        return parts.length > 0 ? parts[parts.length - 1] : '';
    }
}

export { FilesystemBusService };