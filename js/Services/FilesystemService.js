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
import { ENV_VARS } from '../Core/Variables.js';
import { EVENTS } from '../Core/Events.js';
import { createLogger } from '../Managers/LogManager.js';
import { ApiManager } from '../Managers/ApiManager.js';

const log = createLogger('FilesystemService');

const DEFAULT_PWD = '/';

/**
 * @class FilesystemService
 * @description Manages all interactions with the virtual filesystem via the event bus.
 *
 * @listens for `FS_AUTOCOMPLETE_PATH_REQUEST` - Responds with path suggestions.
 * @listens for `FS_GET_DIRECTORY_CONTENTS_REQUEST` - Responds with directory contents.
 * @listens for `FS_GET_FILE_CONTENTS_REQUEST` - Responds with file contents.
 *
 * @dispatches `FS_AUTOCOMPLETE_PATH_RESPONSE` - The path suggestions.
 * @dispatches `FS_GET_DIRECTORY_CONTENTS_RESPONSE` - The directory contents.
 * @dispatches `FS_GET_FILE_CONTENTS_RESPONSE` - The file contents.
 */
class FilesystemService {
    #eventBus;
    #apiManager;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#apiManager = new ApiManager('/Api/Filesystem.py');
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.FS_AUTOCOMPLETE_PATH_REQUEST, this.#handleAutocompletePath.bind(this));
        this.#eventBus.listen(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, this.#handleGetDirectoryContents.bind(this));
        this.#eventBus.listen(EVENTS.FS_GET_FILE_CONTENTS_REQUEST, this.#handleGetFileContents.bind(this));
        this.#eventBus.listen(EVENTS.FS_CHANGE_DIRECTORY_REQUEST, this.#handleChangeDirectory.bind(this));
        this.#eventBus.listen(EVENTS.FS_RESOLVE_PATH_REQUEST, this.#handleResolvePathRequest.bind(this));
        this.#eventBus.listen(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, this.#handleUpdateDefaultRequest.bind(this));
    }

    async #handleAutocompletePath({ path, includeFiles, respond }) {
        const suggestions = await this.#autocompletePath(path, includeFiles);
        respond({ suggestions });
    }

    async #handleGetDirectoryContents({ path, respond }) {
        try {
            const contents = await this.#getDirectoryContents(path);
            respond({ contents });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleGetFileContents({ path, respond }) {
        try {
            const contents = await this.#getFileContents(path);
            respond({ contents });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleChangeDirectory({ path, respond }) {
        try {
            // The backend's 'resolve' action now handles path resolution relative to PWD.
            const newPath = await this.#resolveAndValidatePath(path, true);
            this.#eventBus.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key: ENV_VARS.PWD, value: newPath });
            respond({ success: true });
        } catch (error) {
            respond({ error });
        }
    }

    async #handleResolvePathRequest({ path, respond }) {
        try {
            const resolvedPath = await this.#resolveAndValidatePath(path, false);
            respond({ path: resolvedPath });
        } catch (error) {
            respond({ error });
        }
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        if (key === ENV_VARS.PWD) {
            this.#eventBus.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key, value: DEFAULT_PWD });
            respond({ value: DEFAULT_PWD });
        }
    }

    /**
     * Provides autocomplete suggestions for a given path.
     * @param {string} inputPath - The partial path to autocomplete.
     * @param {boolean} includeFiles - Whether to include files in the suggestions.
     * @returns {Promise<string[]>} A promise that resolves to an array of suggestions.
     */
    async #autocompletePath(inputPath, includeFiles = false) {
        // Determine the directory to list and the part to complete.
        let dirToList = '/';
        let partToComplete = inputPath;

        if (!inputPath) {
            // If input is empty, we list the current directory.
            dirToList = '.';
            partToComplete = '';
        } else if (inputPath.endsWith('/')) {
            dirToList = inputPath;
            partToComplete = '';
        } else {
            const lastSlashIndex = inputPath.lastIndexOf('/');
            dirToList = (lastSlashIndex === -1) ? '.' : inputPath.substring(0, lastSlashIndex + 1);
            partToComplete = (lastSlashIndex === -1) ? inputPath : inputPath.substring(lastSlashIndex + 1);
        }

        try {
            // Use the existing 'ls' action to get directory contents.
            const contents = await this.#getDirectoryContents(dirToList);
            const suggestions = [];

            // Filter directories
            if (contents.directories) {
                contents.directories.forEach(dir => {
                    if (dir.name.startsWith(partToComplete)) {
                        // If we are completing from the root, don't prepend the root slash.
                        // The suggestion should be relative to the input.
                        let prefix = (dirToList === '/' || dirToList === './' || dirToList === '.') ? '' : dirToList;
                        // If the original input was an absolute path, ensure the suggestion is too.
                        if (inputPath.startsWith('/') && !prefix.startsWith('/')) prefix = '/' + prefix;
                        suggestions.push(prefix + dir.name + '/');
                    }
                });
            }

            // Filter files if requested
            if (includeFiles && contents.files) {
                contents.files.forEach(file => {
                    if (file.name.startsWith(partToComplete)) {
                        let prefix = (dirToList === '/' || dirToList === './' || dirToList === '.') ? '' : dirToList;
                        // If the original input was an absolute path, ensure the suggestion is too.
                        if (inputPath.startsWith('/') && !prefix.startsWith('/')) prefix = '/' + prefix;
                        suggestions.push(prefix + file.name);
                    }
                });
            }

            return suggestions.sort();
        } catch (error) {
            log.error('Error fetching path completions:', error);
            return [];
        }
    }

    async #getDirectoryContents(path) {
        const { values: { PWD: pwd } } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.PWD });
        return this.#makeApiRequest('ls', { path, pwd });
    }

    async #getFileContents(path) {
        const { values: { PWD: pwd } } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.PWD });
        const response = await this.#makeApiRequest('cat', { path, pwd });
        return response.content;
    }

    async #makeApiRequest(action, params = {}) {
        try {
            const data = await this.#apiManager.get({ action, ...params });
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            log.error(`Error during API request for action "${action}" with path "${params.path}":`, error);
            throw error;
        }
    }

    async #resolveAndValidatePath(path, mustBeDir) {
        const { values: { PWD: pwd } } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.PWD });
        const data = await this.#makeApiRequest('resolve', {
            path,
            pwd,
            must_be_dir: mustBeDir
        });
        return data.path;
    }
}

export { FilesystemService };