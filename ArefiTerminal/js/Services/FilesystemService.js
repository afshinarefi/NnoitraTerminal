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
import { ApiManager } from '../Managers/ApiManager.js';
import { BaseService } from '../Core/BaseService.js';

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
class FilesystemService extends BaseService{
    #apiManager;

    constructor(eventBus, config = {}) {
        super(eventBus);
        this.#apiManager = new ApiManager(config.apiUrl);
        this.log.log('Initializing...');
    }

    get eventHandlers() {
        return {
            [EVENTS.FS_GET_FILE_CONTENTS_REQUEST]: this.#handleGetFileContents.bind(this),
            [EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST]: this.#handleGetDirectoryContents.bind(this),
            [EVENTS.FS_CHANGE_DIRECTORY_REQUEST]: this.#handleChangeDirectory.bind(this),
            [EVENTS.FS_RESOLVE_PATH_REQUEST]: this.#handleResolvePathRequest.bind(this),
            [EVENTS.FS_GET_PUBLIC_URL_REQUEST]: this.#handleGetPublicUrl.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this)
        };
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
            this.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key: ENV_VARS.PWD, value: newPath });
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

    async #handleGetPublicUrl({ path, respond }) {
        try {
            // Use the dedicated 'get_public_url' API action.
            const { value: pwd } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.PWD });
            const data = await this.#makeApiRequest('get_public_url', { path, pwd });
            respond({ url: data.url });
        } catch (error) {
            respond({ error });
        }
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        if (key === ENV_VARS.PWD) {
            this.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key, value: DEFAULT_PWD });
            respond({ value: DEFAULT_PWD });
        }
    }

    async #getDirectoryContents(path) {
        const { value: pwd } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.PWD });
        return this.#makeApiRequest('ls', { path, pwd });
    }

    async #getFileContents(path) {
        const { value: pwd } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.PWD });
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
            this.log.error(`Error during API request for action "${action}" with path "${params.path}":`, error);
            throw error;
        }
    }

    async #resolveAndValidatePath(path, mustBeDir) {
        const { value: pwd } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.PWD });
        const data = await this.#makeApiRequest('resolve', {
            path,
            pwd,
            must_be_dir: mustBeDir
        });
        return data.path;
    }
}

export { FilesystemService };