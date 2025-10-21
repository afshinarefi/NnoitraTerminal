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
        // This is a placeholder for fetching file content. For now, it simulates an error.
        respond({ error: new Error('File not found.') });
    }

    #handleChangeDirectory({ path }) {
        // In a more complex system, this would first validate that 'path' is a real directory.
        // For now, it directly updates the PWD environment variable.
        this.#eventBus.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key: ENV_VARS.PWD, value: path });
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        if (key === ENV_VARS.PWD) {
            this.#eventBus.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key, value: '~' });
            respond({ value: '~' });
        }
    }

    /**
     * Provides autocomplete suggestions for a given path.
     * @param {string} inputPath - The partial path to autocomplete.
     * @param {boolean} includeFiles - Whether to include files in the suggestions.
     * @returns {Promise<string[]>} A promise that resolves to an array of suggestions.
     */
    async #autocompletePath(inputPath, includeFiles = false) {
        try {
            const data = await this.#apiManager.get({
                action: 'autocomplete',
                path: inputPath,
                files: includeFiles
            });
            return data.suggestions || [];
        } catch (error) {
            log.error('Error fetching path completions:', error);
            return [];
        }
    }

    async #getDirectoryContents(path) {
        try {
            const data = await this.#apiManager.get({
                action: 'ls',
                path: path
            });
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            log.error(`Error getting contents for path "${path}":`, error);
            throw error;
        }
    }
}

export { FilesystemService };