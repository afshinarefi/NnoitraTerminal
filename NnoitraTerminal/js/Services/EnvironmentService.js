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
// Define constants for hardcoded strings to improve maintainability.
const TEMP_NAMESPACE = 'TEMP';
const LOCAL_NAMESPACE = 'LOCAL';
const ENV_NAMESPACE = 'ENV';
const SYSTEM_NAMESPACE = 'SYSTEM';
const USERSPACE_NAMESPACE = 'USERSPACE';


/**
 * @class EnvironmentService
 * @description Manages the terminal's environment variables. It is a self-contained state
 * manager that communicates with the rest of the system exclusively via the event bus.
 *
 * @listens for `VAR_GET_REQUEST` - Responds to requests for a variable's value.
 * @listens for `VAR_SET_REQUEST` - Responds to requests to set a variable.
 * @listens for `ENV_RESET_REQUEST` - Responds to requests to reset the environment.
 * @listens for `USER_CHANGED_BROADCAST` - Clears local storage on logout.
 *
 * @dispatches `VAR_SAVE_REMOTE_REQUEST` - When a variable needs to be saved remotely.
 * @dispatches `VAR_LOAD_SYSTEM_REQUEST` - To get remote/userspace variables from AccountingService.
 * @dispatches `VAR_UPDATE_DEFAULT_REQUEST` - To get a default value for a variable that doesn't exist yet.
 */
import { EVENTS } from '../Core/Events.js';
import { BaseService } from '../Core/BaseService.js';
class EnvironmentService extends BaseService{
	#categoryPaths = {
        TEMP: `/var/session/${ENV_NAMESPACE}`,
        LOCAL: `/var/local/${ENV_NAMESPACE}`,
        SYSTEM: `/var/remote/${SYSTEM_NAMESPACE}`,
        USERSPACE: `/var/remote/${USERSPACE_NAMESPACE}`
    };

	constructor(eventBus) {
        super(eventBus);
		this.log.log('Initializing...');
	}

    get eventHandlers() {
        return {
            [EVENTS.GET_ALL_CATEGORIZED_VARS_REQUEST]: this.#handleGetAllCategorized.bind(this),
            [EVENTS.VAR_GET_REQUEST]: this.#handleGetVariable.bind(this),
            [EVENTS.VAR_SET_REQUEST]: this.#handleSetVariable.bind(this),
            [EVENTS.VAR_DEL_REQUEST]: this.#handleDeleteVariable.bind(this),
        };
    }

    async #handleGetVariable({ key, category, respond }) {
        const upperKey = key.toUpperCase();
        const basePath = this.#categoryPaths[category];
        if (!basePath) {
            const error = new Error(`Invalid variable category: ${category}`);
            this.log.error(error.message);
            respond({ error });
            return;
        }
        const filePath = `${basePath}/${upperKey}`;
        this.log.log(filePath);

        const { contents, error } = await this.request(EVENTS.FS_READ_FILE_REQUEST, { path: filePath });

        if (!error && contents !== undefined) {
            respond({ value: contents });
        } else {
            this.log.log(`Variable file "${filePath}" not found, requesting default value.`);
            const { value } = await this.request(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, { key: upperKey });
            if (value !== undefined) {
                this.dispatch(EVENTS.FS_WRITE_FILE_REQUEST, { path: filePath, content: value });
            }
            respond({ value });
        }
    }
    
    #validate(key, value) {
		if (typeof value === 'number') {
			value = String(value);
		}

		if (!key || (value !== null && typeof value !== 'string')) {
			this.log.error("Invalid key or value provided to setVariable:", { key, value, type: typeof value });
			return false;
		}
        return true;
    }

    #handleSetVariable({ key, value, category }) {
        const upperKey = key.toUpperCase();
        if (!this.#validate(upperKey, value)) return;

        const basePath = this.#categoryPaths[category];
        if (!basePath) return this.log.error(`Invalid variable category for set: ${category}`);

        const filePath = `${basePath}/${upperKey}`;
        this.dispatch(EVENTS.FS_WRITE_FILE_REQUEST, { path: filePath, content: value });
    }

    #handleDeleteVariable({ key, category }) {
        const upperKey = key.toUpperCase();
        const basePath = this.#categoryPaths[category];
        if (!basePath) return this.log.error(`Invalid variable category for delete: ${category}`);

        const filePath = `${basePath}/${upperKey}`;
        this.dispatch(EVENTS.FS_DELETE_FILE_REQUEST, { path: filePath });
    }

    async #handleGetAllCategorized({ respond }) {
        const categorized = {
            TEMP: {},
            LOCAL: {},
            SYSTEM: {},
            USERSPACE: {},
        };

        for (const [category, path] of Object.entries(this.#categoryPaths)) {
            try {
                const { contents } = await this.request(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path });
                console.warn('XYZ', contents, path);
                for (const file of contents.files) {
                    const { contents: fileContent } = await this.request(EVENTS.FS_READ_FILE_REQUEST, { path: `${path}/${file.name}` });
                    categorized[category][file.name.toUpperCase()] = fileContent;
                }
            } catch (e) {
                this.log.warn(`Could not list variables in ${path}:`, e.message);
            }
        }

        respond({ categorized });
    }
}

export { EnvironmentService };