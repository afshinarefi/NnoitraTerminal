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
import { EVENTS } from '../Core/Events.js';
import { BaseService } from '../Core/BaseService.js';

// Define constants for hardcoded strings to improve maintainability.
const LOCAL_STORAGE_KEY = 'AREFI_LOCAL_ENV';

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
 * @dispatches `VAR_PERSIST_REQUEST` - When a variable needs to be saved remotely.
 * @dispatches `VAR_LOAD_REMOTE_REQUEST` - To get remote/userspace variables from AccountingService.
 * @dispatches `VAR_UPDATE_DEFAULT_REQUEST` - To get a default value for a variable that doesn't exist yet.
 */
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
            [EVENTS.VAR_GET_REMOTE_REQUEST]: this.#handleGetSystemVariable.bind(this),
            [EVENTS.VAR_GET_USERSPACE_REQUEST]: this.#handleGetUserSpaceVariable.bind(this),
            [EVENTS.ENV_RESET_REQUEST]: this.#handleReset.bind(this),
            [EVENTS.VAR_SET_TEMP_REQUEST]: this.#handleSetTempVariable.bind(this),
            [EVENTS.VAR_SET_LOCAL_REQUEST]: this.#handleSetLocalVariable.bind(this),
            [EVENTS.VAR_SET_REMOTE_REQUEST]: this.#handleSetVariableRemote.bind(this),
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
        const localData = this.#readAllLocal();
        let value = localData[upperKey];

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
        return this.#handleGetRemoteVariable({ key, respond }, 'USERSPACE');
    }

    async #handleGetSystemVariable({ key, respond }) {
        return this.#handleGetRemoteVariable({ key, respond }, 'REMOTE');
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

    #readAllLocal() {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!stored) return {};
        try {
            return JSON.parse(stored);
        } catch (e) {
            this.log.error('Failed to parse local environment variables from localStorage:', e);
            return {};
        }
    }

    #writeAllLocal(data) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            this.log.error('Failed to write to localStorage:', e);
        }
    }

    #handleSetTempVariable({ key, value }) {
        this.#setTempVariable(key.toUpperCase(), value);
    }

    #handleSetLocalVariable({ key, value }) {
        this.#setLocalVariable(key.toUpperCase(), value);
    }

    #handleSetVariableRemote({ key, value }) {
        this.#setRemoteVariable(key.toUpperCase(), value, 'REMOTE');
    }

    #handleSetVariableUserspace({ key, value }) {
        this.#setRemoteVariable(key.toUpperCase(), value, 'USERSPACE');
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
        const localData = this.#readAllLocal();
        localData[key] = value;
        this.#writeAllLocal(localData);
    }

    #setRemoteVariable(key, value, category) {
        if (!this.#validate(key, value)) return;
        // The `persist` flag is now implicitly true for remote variables.
        // Default values are handled by the getter methods and don't call this.
        this.dispatch(EVENTS.VAR_PERSIST_REQUEST, { key, value, category });
    }

	async isReadOnly(key) {
		const upperKey = key.toUpperCase();
        // A variable is considered read-only if it exists in any category other than USERSPACE.
        // We must check each category.
        if (this.#tempVariables.has(upperKey)) return true;
        if (this.#readAllLocal().hasOwnProperty(upperKey)) return true;
        const { variables: remoteData } = await this.request(EVENTS.VAR_LOAD_REMOTE_REQUEST, { category: 'REMOTE' });
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
        this.#setRemoteVariable(key, value, 'USERSPACE');
        respond({ success: true });
    }

    async #handleUserChanged({ isLoggedIn }) {
        if (!isLoggedIn) {
            // On logout, we just need to clear local storage.
            // Remote variables are gated by the AccountingService, so no client-side clearing is needed.
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }

	removeVariable(key) {
        const upperKey = key.toUpperCase();
        // This is now more complex. Let's assume it's for local/temp for now.
        if (this.#tempVariables.has(upperKey)) {
            this.#tempVariables.delete(upperKey);
        }
        const localData = this.#readAllLocal();
        if (localData.hasOwnProperty(upperKey)) {
            delete localData[upperKey];
            this.#writeAllLocal(localData);
        }
        // Deleting remote variables would need a new event and backend endpoint.
	}

    #handleGetAllCategorized({ respond }) {
        // This is now an async operation as it needs to fetch remote data.
        (async () => {
            const categorized = {
                TEMP: {},
                LOCAL: {},
                REMOTE: {},
                USERSPACE: {},
            };

            categorized.TEMP = Object.fromEntries(this.#tempVariables);
            categorized.LOCAL = this.#readAllLocal();

            const { variables: remoteData } = await this.request(EVENTS.VAR_LOAD_REMOTE_REQUEST, { category: 'ENV' });
            Object.assign(categorized.REMOTE, remoteData.REMOTE || {});
            Object.assign(categorized.USERSPACE, remoteData.USERSPACE || {});

            respond({ categorized });
        })();
    }

	#handleReset() {
		this.log.log('Resetting environment service completely...');
		localStorage.removeItem(LOCAL_STORAGE_KEY);
        this.#tempVariables.clear();
	}
}

export { EnvironmentService };