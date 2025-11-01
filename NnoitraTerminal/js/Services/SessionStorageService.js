/**
 * Nnoitra Terminal
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
import { BaseStorageService } from './BaseStorageService.js';

/**
 * @class SessionStorageService
 * @description Implements an in-memory, temporary storage backend.
 * All data is lost when the page is reloaded.
 */
class SessionStorageService extends BaseStorageService {
    static STORAGE_NAME = 'SESSION';

    // A simple in-memory map to act as the filesystem.
    // Keys are full paths, values are file contents (string).
    // Directories are implicitly defined by the paths of the files.
    #data = new Map();
    // A set to explicitly track directory paths, allowing for empty directories.
    #directories = new Set();

    constructor(eventBus) {
        super(eventBus);
        // You could pre-populate with some default files/directories here if needed.
        // e.g., this.#data.set('/tmp/example.txt', 'This is a temporary file.');

        // The root directory always exists.
        this.#directories.add('/');
    }

    /**
     * Lists the contents of a given path.
     * @param {object} data
     * @param {string} data.path - The path of the directory to list.
     * @returns {Promise<{files: Array, directories: Array}>}
     */
    async listPath({ path }) {
        const normalizedPath = path === '/' ? '' : path;
        const pathPrefix = normalizedPath ? normalizedPath + '/' : '/';
        const files = [];
        const directories = new Set();

        // Find all files in the current path
        for (const entryPath of this.#data.keys()) {
            if (entryPath.startsWith(pathPrefix)) {
                const relativePath = entryPath.substring(pathPrefix.length);
                if (!relativePath.includes('/')) {
                    files.push({ name: relativePath, size: this.#data.get(entryPath).length });
                }
            }
        }

        // Find all explicit subdirectories in the current path
        for (const dirPath of this.#directories) {
            if (dirPath.startsWith(pathPrefix) && dirPath !== path) {
                const relativePath = dirPath.substring(pathPrefix.length);
                const firstPart = relativePath.split('/')[0];
                if (firstPart) {
                    directories.add(firstPart);
                }
            }
        }

        return {
            files,
            directories: Array.from(directories).map(name => ({ name }))
        };
    }

    /**
     * Reads the content of a file.
     * @param {object} data
     * @param {string} data.path - The path of the file to read.
     * @returns {Promise<string>} The file content.
     */
    async readFile({ path }) {
        if (!this.#data.has(path)) {
            throw new Error('File not found.');
        }
        return this.#data.get(path);
    }

    /**
     * Writes content to a file, overwriting if it exists.
     * @param {object} data
     * @param {string} data.path - The path of the file to write.
     * @param {string} data.content - The content to write.
     */
    async writeFile({ path, content }) {
        // Ensure parent directory exists
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        this.#ensureDirectoryExists(parentPath);

        this.#data.set(path, content);
    }

    /**
     * Deletes a file.
     * @param {object} data
     * @param {string} data.path - The path of the file to delete.
     */
    async deleteFile({ path }) {
        if (!this.#data.has(path)) {
            throw new Error('File not found.');
        }
        this.#data.delete(path);
    }

    /**
     * Creates a directory. In this in-memory model, directories are implicit,
     * so this method doesn't need to do anything but succeed.
     */
    async makeDirectory({ path }) {
        this.#ensureDirectoryExists(path);
    }

    /**
     * Removes a directory. This will remove all files and subdirectories within it.
     * @param {object} data
     * @param {string} data.path - The path of the directory to remove.
     */
    async removeDirectory({ path }) {
        const prefix = path === '/' ? '/' : path + '/';
        // Remove all files within the directory
        for (const key of this.#data.keys()) {
            if (key.startsWith(prefix)) {
                this.#data.delete(key);
            }
        }
        // Remove the directory and all subdirectories
        for (const dir of this.#directories) {
            if (dir.startsWith(path)) {
                this.#directories.delete(dir);
            }
        }
    }

    async getMetaData({ path }) {
        // This simple in-memory storage doesn't have complex metadata.
        // We can return basic information.
        const isFile = this.#data.has(path);
        return {
            path: path,
            isFile: isFile,
            isDirectory: this.#directories.has(path),
            publicUrl: null // Session storage is not publicly accessible
        };
    }

    /**
     * Ensures a directory path and all its parents are explicitly created.
     * @param {string} path - The full path of the directory to create.
     * @private
     */
    #ensureDirectoryExists(path) {
        const parts = path.split('/').filter(p => p);
        let currentPath = '';
        for (const part of parts) {
            currentPath += '/' + part;
            this.#directories.add(currentPath);
        }
    }
}

export { SessionStorageService };