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
	#tempVariables = new Map();

	constructor(eventBus) {
        super(eventBus);
		this.log.log('Initializing...');
	}

    get eventHandlers() {
        return {
            [EVENTS.VAR_GET_TEMP_REQUEST]: this.#handleGetTempVariable.bind(this),
            [EVENTS.VAR_GET_LOCAL_REQUEST]: this.#handleGetLocalVariable.bind(this),
            [EVENTS.VAR_GET_SYSTEM_REQUEST]: this.#handleGetSystemVariable.bind(this),
            [EVENTS.VAR_GET_USERSPACE_REQUEST]: this.#handleGetUserSpaceVariable.bind(this),
            [EVENTS.ENV_RESET_REQUEST]: this.#handleReset.bind(this),
            [EVENTS.VAR_SET_TEMP_REQUEST]: this.#handleSetTempVariable.bind(this),
            [EVENTS.VAR_SET_LOCAL_REQUEST]: this.#handleSetLocalVariable.bind(this),
            [EVENTS.VAR_SET_SYSTEM_REQUEST]: this.#handleSetVariableRemote.bind(this),
            [EVENTS.VAR_SET_USERSPACE_REQUEST]: this.#handleSetVariableUserspace.bind(this),
            [EVENTS.VAR_EXPORT_REQUEST]: this.#handleExportVariable.bind(this),
            [EVENTS.USER_CHANGED_BROADCAST]: this.#handleUserChanged.bind(this),
            [EVENTS.GET_ALL_CATEGORIZED_VARS_REQUEST]: this.#handleGetAllCategorized.bind(this)
        };
    }

	start() {
		// No longer loading from storage at startup. This is now lazy.
        // No startup logic needed.
	}

    async #handleGetTempVariable({ key, respond }) {
        const upperKey = key.toUpperCase();
        let value = this.#tempVariables.get(upperKey);

        if (value === undefined) {
            this.log.log(`Temp variable "${upperKey}" is undefined, requesting its default value.`);
            const response = await this.request(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, { key: upperKey });
            value = response.value;
            // The owner provides the default, and we set it here.
            if (value !== undefined) {
                this.#setTempVariable(upperKey, value);
            }
        }
        respond({ value });
    }

    async #handleGetLocalVariable({ key, respond }) {
        const upperKey = key.toUpperCase();
        const { value: storedValue } = await this.request(EVENTS.LOAD_LOCAL_VAR, { key: upperKey, namespace: ENV_NAMESPACE });
        let value = storedValue;

        if (value === undefined) {
            this.log.log(`Local variable "${upperKey}" is undefined, requesting its default value.`);
            const response = await this.request(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, { key: upperKey });
            value = response.value;
            // The owner provides the default, and we set it here.
            if (value !== undefined) {
                this.#setLocalVariable(upperKey, value);
            }
        }
        respond({ value });
    }

    async #handleGetUserSpaceVariable({ key, respond }) {
        return this.#handleGetRemoteVariable({ key, respond }, USERSPACE_NAMESPACE);
    }

    async #handleGetSystemVariable({ key, respond }) {
        return this.#handleGetRemoteVariable({ key, respond }, SYSTEM_NAMESPACE);
    }


    async #handleGetRemoteVariable({ key, respond }, category) {
        const upperKey = key.toUpperCase();
        let value;

        // Request from AccountingService on-demand.
        const { variables } = await this.request(EVENTS.VAR_LOAD_REMOTE_REQUEST, { key: upperKey, category });
        value = variables ? variables[upperKey] : undefined;

        if (value === undefined) {
            this.log.log(`Remote/Userspace variable "${upperKey}" is undefined, requesting its default value.`);
            const response = await this.request(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, { key: upperKey });
            value = response.value;
            // The owner provides the default, and we set it here.
            if (value !== undefined) {
                this.#setRemoteVariable(upperKey, value, category);
            }
        }
        respond({ value });
    }

    #handleSetTempVariable({ key, value }) {
        this.#setTempVariable(key.toUpperCase(), value);
    }

    #handleSetLocalVariable({ key, value }) {
        this.#setLocalVariable(key.toUpperCase(), value);
    }

    #handleSetVariableRemote({ key, value }) {
        this.#setRemoteVariable(key.toUpperCase(), value, SYSTEM_NAMESPACE);
    }

    #handleSetVariableUserspace({ key, value }) {
        this.#setRemoteVariable(key.toUpperCase(), value, USERSPACE_NAMESPACE);
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

    #setTempVariable(key, value) {
        if (!this.#validate(key, value)) return;
        this.#tempVariables.set(key, value);
    }

    #setLocalVariable(key, value) {
        if (!this.#validate(key, value)) return;
        this.dispatch(EVENTS.SAVE_LOCAL_VAR, { key, value, namespace: ENV_NAMESPACE });
    }

    #setRemoteVariable(key, value, category) {
        if (!this.#validate(key, value)) return;
        // The `persist` flag is now implicitly true for remote variables.
        // Default values are handled by the getter methods and don't call this.
        this.dispatch(EVENTS.VAR_SAVE_REMOTE_REQUEST, { key, value, category });
    }

	async isReadOnly(key) {
		const upperKey = key.toUpperCase();
        // A variable is considered read-only if it exists in any category other than USERSPACE.
        // We must check each category.
        if (this.#tempVariables.has(upperKey)) return true; // Check temp variables first.
        const { value: localValue } = await this.request(EVENTS.LOAD_LOCAL_VAR, { key: upperKey, namespace: ENV_NAMESPACE });
        if (localValue !== undefined) return true; // Check local variables
        const { variables: remoteData } = await this.request(EVENTS.VAR_LOAD_REMOTE_REQUEST, { category: SYSTEM_NAMESPACE });
        if (remoteData && remoteData.hasOwnProperty(upperKey)) return true;

		return false; // Simplified: `export` command will now manage this logic.
	}

    async #handleExportVariable({ key, value, respond }) {
        const upperKey = key.toUpperCase();
        const isReadonly = await this.isReadOnly(upperKey);
        if (isReadonly) {
            respond({ success: false });
            return;
        }
        this.#setRemoteVariable(key, value, USERSPACE_NAMESPACE);
        respond({ success: true });
    }

    async #handleUserChanged({ isLoggedIn }) {
        if (!isLoggedIn) {
            // On logout, we just need to clear local storage.
            this.dispatch(EVENTS.RESET_LOCAL_VAR, { namespace: ENV_NAMESPACE }); // Clear all local storage
        }
    }

    #handleGetAllCategorized({ respond }) {
        // This is now an async operation as it needs to fetch remote data.
        (async () => {
            const categorized = {
                TEMP: {},
                LOCAL: {},
                SYSTEM: {},
                USERSPACE: {},
            };

            categorized.TEMP = Object.fromEntries(this.#tempVariables);
            categorized.LOCAL = (await this.request(EVENTS.LOAD_LOCAL_VAR, { namespace: ENV_NAMESPACE })).value;

            const { variables: remoteData } = await this.request(EVENTS.VAR_LOAD_REMOTE_REQUEST, { category: [SYSTEM_NAMESPACE, USERSPACE_NAMESPACE] });
            Object.assign(categorized.SYSTEM, remoteData.SYSTEM || {});
            Object.assign(categorized.USERSPACE, remoteData.USERSPACE || {});

            respond({ categorized });
        })();
    }

	#handleReset() {
		this.log.log('Resetting environment service completely...');
		this.dispatch(EVENTS.RESET_LOCAL_VAR, { namespace: ENV_NAMESPACE }); // Clear all local storage
        this.#tempVariables.clear();
	}
}

export { EnvironmentService };