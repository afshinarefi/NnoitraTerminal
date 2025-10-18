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
/**
 * @class FilesystemService
 * @description Manages a virtual filesystem based on a JSON structure fetched from the server.
 * This service provides methods to navigate, list contents, and retrieve information about files and directories.
 */
import { createLogger } from './LogService.js';
import { VAR_CATEGORIES } from './EnvironmentService.js';
import { ApiService } from './ApiService.js';
const log = createLogger('FS');

class FilesystemService {
    /**
     * Normalizes a path, removing redundant slashes and resolving '.' and '..'.
     * @param {string} path - The path to normalize.
     * @returns {string} The normalized path.
     */
    normalizePath(path) {
        const parts = [];
        const pathSegments = path.split('/').filter(p => p);

        for (const segment of pathSegments) {
            if (segment === '.' || segment === '') {
                continue;
            } else if (segment === '..') {
                if (parts.length > 0) {
                    parts.pop();
                }
            } else {
                parts.push(segment);
            }
        }
        return '/' + parts.join('/');
    }
    /** @private {Object} #filesystemTree - The in-memory representation of the filesystem. */
    #filesystemTree = {};
    /** @private {string} #currentPath - The current working directory in the virtual filesystem. */
    #currentPath = '/';
    #environmentService;
    #apiService;

    /**
     * Creates an instance of FilesystemService.
     * @param {string} initialPath - The initial path for the filesystem service. Defaults to '/'.
     */
    constructor(services) {
        this.#environmentService = services.environment;
        this.#apiService = new ApiService(services, '/server/filesystem.py');
        // The initial PWD is now set by the Terminal component.
        this.#currentPath = this.#environmentService.getVariable('PWD');
    }

    /**
     * Initializes the filesystem service by fetching the directory tree from the server.
     * @returns {Promise<void>} A promise that resolves when the filesystem tree is loaded.
     */
    async init() {
        try {
            const data = await this.#apiService.get();
            // If backend returns {directories: [...], files: [...]}, map to expected tree
            if (Array.isArray(data.directories) && Array.isArray(data.files)) {
                // Root node only, build tree with metadata objects
                const tree = {};
                tree._directories = data.directories;
                tree._files = data.files;
                this.#filesystemTree = tree;
            } else {
                this.#filesystemTree = data;
            }
            log.log('Filesystem tree loaded:', this.#filesystemTree);
        } catch (error) {
            log.error('Failed to load filesystem tree:', error);
            this.#filesystemTree = {};
        }
    }

    /**
     * Gets the current working directory.
     * @returns {string} The current path.
     */
    getCurrentPath() {
        return this.#currentPath;
    }

    /**
     * Sets the current working directory.
     * @param {string} path - The new path to set as the current working directory.
     * @returns {boolean} True if the path was successfully set, false otherwise.
     */
    setCurrentPath(path) {
        // Normalize path (e.g., remove double slashes, resolve '..', '.')
    const normalizedPath = this.normalizePath(path);
        if (this.#getNodeAtPath(normalizedPath)) {
            this.#currentPath = normalizedPath;
            this.#environmentService.setVariable('PWD', normalizedPath);
            return true;
        }
        return false;
    }

    /**
     * Lists the contents of a given directory, fetching and caching on demand.
     * @param {string} path - The path to the directory to list. Defaults to the current path.
     * @returns {Promise<{files: string[], directories: string[]}|null>} Promise resolving to contents or null if not a directory.
     */
    async listContents(path = this.#currentPath) {
        const normalizedPath = this.normalizePath(path);
        let node = this.#getNodeAtPath(normalizedPath);
        let shouldFetch = false;
        if (node && typeof node === 'object' && !Array.isArray(node)) {
            const files = node._files || [];
            const directories = node._directories || [];
            // If both are empty, treat as not loaded and fetch from backend
            if (files.length === 0 && directories.length === 0) {
                shouldFetch = true;
            } else {
                log.log(`listContents cache hit for ${normalizedPath}:`, { files, directories });
                return { files, directories };
            }
        } else {
            shouldFetch = true;
        }
        if (shouldFetch) {
            try {
                const pathForApi = normalizedPath.replace(/^\//, '');
                const data = await this.#apiService.get({ path: pathForApi });
                log.log(`Backend response for ${normalizedPath}:`, data);
                if (Array.isArray(data.directories) && Array.isArray(data.files)) {
                    // Build node and cache it
                    node = {};
                    node._directories = data.directories;
                    node._files = data.files;
                    // Insert into tree
                    this.#setNodeAtPath(normalizedPath, node);
                    log.log(`Cached node for ${normalizedPath}:`, { files: data.files, directories: data.directories });
                    return { files: data.files, directories: data.directories };
                }
            } catch (error) {
                log.error('Failed to fetch directory contents:', error);
            }
        }
        return null;
    }
    /**
     * Sets a node at a given path in the tree (for caching fetched directories).
     * @private
     * @param {string} path - The absolute path.
     * @param {Object} node - The node to set.
     */
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

    /**
     * Checks if a given path exists in the filesystem.
     * This method is now async to ensure it can fetch parent directories if they are not cached.
     * @param {string} path - The path to check.
     * @returns {Promise<boolean>} A promise that resolves to true if the path exists, false otherwise.
     */
    async pathExists(path) {
        const parentPath = this.#getParentPath(path);
        // Ensure the parent directory's contents are loaded into the cache.
        await this.listContents(parentPath);
        return !!this.#getNodeAtPath(path);
    }

    /**
     * Checks if a given path is a directory.
     * This method is now async to ensure it can fetch parent directories if they are not cached.
     * @param {string} path - The path to check.
     * @returns {Promise<boolean>} A promise that resolves to true if the path is a directory, false otherwise.
     */
    async isDirectory(path) {
        // For directories, we check the path itself, not its parent.
        // listContents will return null if the path is not a directory.
        const contents = await this.listContents(path);
        if (contents) return true;

        // Fallback check for the root directory, which might not be fetched in the same way.
        const node = this.#getNodeAtPath(path);
        return node && typeof node === 'object' && !Array.isArray(node);
    }

    /**
     * Checks if a given path is a file.
     * @param {string} path - The path to check.
     * @returns {Promise<boolean>} A promise that resolves to true if the path is a file, false otherwise.
     */
    async isFile(path) {
        const parentPath = this.#getParentPath(path);
        const fileName = this.#getFileName(path);

        // Ensure the parent directory's contents are loaded into the cache.
        await this.listContents(parentPath);

        // Now that the cache is populated, check for the file.
        const parentNode = this.#getNodeAtPath(parentPath);
        return !!(parentNode && Array.isArray(parentNode._files) && parentNode._files.some(f => f.name === fileName));
    }

    /**
     * Resolves a relative path against the current working directory.
     * @private
     * @param {string} path - The path to resolve.
     * @returns {string} The absolute resolved path.
     */
    #resolvePath(path) {
        const parts = this.#currentPath.split('/').filter(p => p);
        const targetParts = path.split('/').filter(p => p);

        if (path.startsWith('/')) {
            parts.length = 0; // Absolute path, clear current parts
        }

        for (const part of targetParts) {
            if (part === '..') {
                if (parts.length > 0) {
                    parts.pop();
                }
            } else if (part !== '.') {
                parts.push(part);
            }
        }
        return '/' + parts.join('/');
    }

    /**
     * Normalizes a path, removing redundant slashes and resolving '.' and '..'.
     * @private
     * @param {string} path - The path to normalize.
     * @returns {string} The normalized path.
     */
    // REMOVED: #normalizePath private method

    /**
     * Retrieves the node (directory or file) at a given path.
     * @private
     * @param {string} path - The absolute path to the node.
     * @returns {Object|string[]|null} The node at the path, or null if not found.
     */
    #getNodeAtPath(path) {
    const resolvedPath = this.normalizePath(path);
        const parts = resolvedPath.split('/').filter(p => p);
        let currentNode = this.#filesystemTree;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (currentNode && typeof currentNode === 'object' && !Array.isArray(currentNode)) {
                if (i === parts.length - 1 && currentNode._files && currentNode._files.includes(part)) {
                    // It's a file
                    return part; // Return the file name itself as a marker
                }
                currentNode = currentNode[part];
            } else {
                return null; // Path segment not found or not a directory
            }
        }
        return currentNode;
    }

    /**
     * Gets the parent path of a given path.
     * @private
     * @param {string} path - The path.
     * @returns {string} The parent path.
     */
    #getParentPath(path) {
    const normalizedPath = this.normalizePath(path);
        const parts = normalizedPath.split('/').filter(p => p);
        if (parts.length === 0) {
            return '/';
        }
        parts.pop();
        return '/' + parts.join('/');
    }

    /**
     * Gets the file name from a given path.
     * @private
     * @param {string} path - The path.
     * @returns {string} The file name.
     */
    #getFileName(path) {
    const normalizedPath = this.normalizePath(path);
        const parts = normalizedPath.split('/').filter(p => p);
        return parts.length > 0 ? parts[parts.length - 1] : '';
    }

    /**
     * Provides path autocompletion suggestions.
     * @param {string} input - The partial path input by the user.
     * @param {boolean} includeFiles - Whether to include files in suggestions.
     * @returns {Promise<string[]>} A promise that resolves to an array of completion suggestions.
     */
    async autocompletePath(input, includeFiles = true) {
        const isAbsolute = input.startsWith('/');
        const fullPath = isAbsolute ? input : this.getCurrentPath().replace(/\/$/, '') + '/' + input;

        let parentPath, partial;
        if (input.endsWith('/') || input === '') {
            parentPath = this.normalizePath(fullPath);
            partial = '';
        } else {
            const lastSlashIndex = fullPath.lastIndexOf('/');
            // If there's no slash, parent is root, otherwise it's the path up to the last slash.
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
}

export { FilesystemService };
