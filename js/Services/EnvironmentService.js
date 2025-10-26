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
import { EVENTS } from '../Core/Events.js';
const log = createLogger('EnvironmentService');

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
 *
 * @dispatches `VAR_PERSIST_REQUEST` - When a variable needs to be saved remotely.
 * @dispatches `VAR_CHANGED_BROADCAST` - When any variable's value changes.
 * @dispatches `VAR_GET_RESPONSE` - The value in response to a get request.
 */
class EnvironmentService {
    static VAR_CATEGORIES = {
        TEMP: 'TEMP',
        LOCAL: 'LOCAL',
        REMOTE: 'REMOTE',
        USERSPACE: 'USERSPACE'
    };

    #eventBus;
	#categorizedVariables = new Map();
    #pendingFetches = new Set(); // Tracks variables currently being fetched to prevent recursion.
    #isLazyLoading = false; // A global lock to prevent re-entry into the lazy-load process.
    
	constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
		log.log('Initializing...');
	}

    #registerListeners() {
        this.#eventBus.listen(EVENTS.VAR_GET_REQUEST, (payload) => this.#handleGetVariable(payload), this.constructor.name);
        this.#eventBus.listen(EVENTS.ENV_RESET_REQUEST, () => this.reset(), this.constructor.name);
        this.#eventBus.listen(EVENTS.VAR_SET_TEMP_REQUEST, (payload) => this.setVariable(payload.key, payload.value, EnvironmentService.VAR_CATEGORIES.TEMP), this.constructor.name);
        this.#eventBus.listen(EVENTS.VAR_SET_LOCAL_REQUEST, (payload) => this.setVariable(payload.key, payload.value, EnvironmentService.VAR_CATEGORIES.LOCAL), this.constructor.name);
        this.#eventBus.listen(EVENTS.VAR_SET_REMOTE_REQUEST, (payload) => this.setVariable(payload.key, payload.value, EnvironmentService.VAR_CATEGORIES.REMOTE), this.constructor.name);
        this.#eventBus.listen(EVENTS.VAR_SET_USERSPACE_REQUEST, (payload) => this.setVariable(payload.key, payload.value, EnvironmentService.VAR_CATEGORIES.USERSPACE), this.constructor.name);
        this.#eventBus.listen(EVENTS.VAR_EXPORT_REQUEST, this.#handleExportVariable.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.USER_CHANGED_BROADCAST, this.#handleUserChanged.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.GET_ALL_CATEGORIZED_VARS_REQUEST, this.#handleGetAllCategorized.bind(this), this.constructor.name);
    }

	start() {
		// No longer loading from storage at startup. This is now lazy.
	}

	#loadFromStorage() {
        log.log('Lazily loading variables from localStorage...');
        const localMap = new Map();
        this.#categorizedVariables.set(EnvironmentService.VAR_CATEGORIES.LOCAL, localMap);
		const storedLocalVars = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedLocalVars) {
			try {
				const localObj = JSON.parse(storedLocalVars);
				for (const [key, value] of Object.entries(localObj)) {
					localMap.set(key.toUpperCase(), value);
				}
			} catch (e) {
				log.error('Failed to parse local environment variables from localStorage:', e);
			}
		}
	}

	#persistLocalVariables() {
		const localMap = this.#categorizedVariables.get(EnvironmentService.VAR_CATEGORIES.LOCAL);
        if (!localMap) {
            // Nothing to persist if the category was never used.
            return;
        }
		const localObj = Object.fromEntries(localMap);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localObj));
	}

    async #handleGetVariable({ key, keys, respond }) {
        if (!respond) return; // Not a request-response event

        const values = {};
        const keysToProcess = keys || (key ? [key] : []);
        for (const k of keysToProcess) {
            values[k] = await this.getVariable(k);
        }
        const wasSent = respond({ values });
        if (!wasSent) {
            log.warn('Attempted to respond to a request that has already timed out.');
        }
    }

	async getVariable(key) {
		const upperKey = key.toUpperCase();

        // Prevent recursive calls for the same variable.
        // If we are already fetching this key, return undefined to break the loop.
        if (this.#pendingFetches.has(upperKey)) {
            log.warn(`Recursive call detected for variable "${upperKey}". Breaking loop.`);
            return undefined;
        }

        // 1. Check all currently loaded categories.
        let existingValue = this.#getVariableSync(upperKey);
        if (existingValue !== undefined) {
            return existingValue;
        }

        // 2. If not found, perform a one-time lazy load of all categories that haven't been loaded yet.
        await this.#lazyLoadAllCategories();
        existingValue = this.#getVariableSync(upperKey);
        if (existingValue !== undefined) {
            return existingValue;
        }

        // 3. If the variable is still not found after all lazy-loading, it's a new variable.
        // Trigger the update-default flow to get its default value from its owner.
        log.log(`Variable "${upperKey}" is undefined, requesting its default value from its owner.`);
        
        try {
            this.#pendingFetches.add(upperKey); // Lock this key
            const { value } = await this.#eventBus.request(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, { key: upperKey });
            return value;
        } finally {
            this.#pendingFetches.delete(upperKey); // Unlock this key
        }
	}

    async #lazyLoadAllCategories() {
        // If a lazy-load is already in progress, do not start another one.
        // This is the key to breaking the recursive loop.
        if (this.#isLazyLoading) {
            return;
        }
        this.#isLazyLoading = true;

        try {
            const loadPromises = [];

            if (!this.#categorizedVariables.has(EnvironmentService.VAR_CATEGORIES.LOCAL)) {
                this.#loadFromStorage(); // This is synchronous
            }

            if (!this.#categorizedVariables.has(EnvironmentService.VAR_CATEGORIES.REMOTE)) {
                loadPromises.push(this.#loadRemoteVariables());
            }

            await Promise.all(loadPromises);
        } finally {
            this.#isLazyLoading = false; // Always release the lock
        }
    }

    #getVariableSync(upperKey) {
		for (const categoryMap of this.#categorizedVariables.values()) {
			if (categoryMap && categoryMap.has(upperKey)) {
				return categoryMap.get(upperKey);
			}
		}
		return undefined;
	}

	setVariable(key, value, category = null, persist = true) {
		const upperKey = key.toUpperCase();

		if (typeof value === 'number') {
			value = String(value);
		}

		if (!upperKey || (value !== null && typeof value !== 'string')) {
			log.error("Invalid key or value provided to setVariable:", { key, value, type: typeof value });
			return;
		}

		const targetCategory = category && Object.values(EnvironmentService.VAR_CATEGORIES).includes(category)
            ? category
            : EnvironmentService.VAR_CATEGORIES.TEMP;

		for (const [cat, catMap] of this.#categorizedVariables.entries()) {
            // Ensure the map exists before trying to delete from it
			if (cat !== targetCategory) catMap.delete(upperKey);
		}

        // Ensure the target map is initialized
        if (!this.#categorizedVariables.has(targetCategory)) {
            this.#categorizedVariables.set(targetCategory, new Map());
        }
		this.#categorizedVariables.get(targetCategory).set(upperKey, value);

		if (persist && targetCategory === EnvironmentService.VAR_CATEGORIES.LOCAL) {
			this.#persistLocalVariables();
		} else if (persist && (targetCategory === EnvironmentService.VAR_CATEGORIES.REMOTE || targetCategory === EnvironmentService.VAR_CATEGORIES.USERSPACE)) {
			this.#eventBus.dispatch(EVENTS.VAR_PERSIST_REQUEST, { key: upperKey, value, category: targetCategory });
		}

		this.#eventBus.dispatch(EVENTS.VAR_CHANGED_BROADCAST, { key: upperKey, value });
	}

	isReadOnly(key) {
		const upperKey = key.toUpperCase();
		for (const [category, catMap] of this.#categorizedVariables.entries()) {
			if (category !== EnvironmentService.VAR_CATEGORIES.USERSPACE && catMap.has(upperKey)) {
				return true;
			}
		}
		return false;
	}

	exportVariable(key, value) {
		const upperKey = key.toUpperCase();
		if (this.isReadOnly(upperKey)) {
			return false;
		}
		this.setVariable(key, value, EnvironmentService.VAR_CATEGORIES.USERSPACE);
		return true;
	}

    #handleExportVariable({ key, value, respond }) {
        const success = this.exportVariable(key, value);
        respond({ success });
    }

    async #handleUserChanged({ isLoggedIn }) {
        if (!isLoggedIn) {
            this.resetRemoteVariables();
        }
    }

	removeVariable(key) {
        const upperKey = key.toUpperCase();
		for (const [category, catMap] of this.#categorizedVariables.entries()) {
			if (catMap.has(upperKey)) {
				catMap.delete(upperKey);
				if (category === VAR_CATEGORIES.LOCAL) {
					this.#persistLocalVariables();
				}
				break;
			}
		}
	}

	hasVariable(key) {
		const upperKey = key.toUpperCase();
		for (const catMap of this.#categorizedVariables.values()) {
			if (catMap.has(upperKey)) {
				return true;
			}
		}
		return false;
	}

	getAllVariables() {
		const allVars = {};
		for (const catMap of this.#categorizedVariables.values()) {
            Object.assign(allVars, Object.fromEntries(catMap));
		}
		return allVars;
	}

	getAllVariablesCategorized() {
		const categorized = {};
		for (const [category, catMap] of this.#categorizedVariables.entries()) {
			categorized[category] = Object.fromEntries(catMap);
		}
		return categorized;
	}

    #handleGetAllCategorized({ respond }) {
        const categorized = this.getAllVariablesCategorized();
        respond({ categorized });
    }

	async #loadRemoteVariables() {
        log.log('Lazily loading remote environment variables...');
        const { variables: data } = await this.#eventBus.request(EVENTS.VAR_LOAD_REMOTE_REQUEST);
        log.log('Loading remote variables into environment:', data);

		if (data) {
            // Load variables into their correct categories
            if (data.REMOTE) {
                for (const [key, value] of Object.entries(data.REMOTE)) {
                    this.setVariable(key, value, EnvironmentService.VAR_CATEGORIES.REMOTE, false);
                }
            }
            if (data.USERSPACE) {
                for (const [key, value] of Object.entries(data.USERSPACE)) {
                    this.setVariable(key, value, EnvironmentService.VAR_CATEGORIES.USERSPACE, false);
                }
            }
		}
        // Broadcast that variables have changed.
        this.#eventBus.dispatch(EVENTS.VAR_CHANGED_BROADCAST, { key: '*', value: null });
	}

	reset() {
		log.log('Resetting environment service completely...');
		localStorage.removeItem(LOCAL_STORAGE_KEY);
        this.#categorizedVariables.clear();
        this.#pendingFetches.clear();
        this.#isLazyLoading = false;
	}

    resetRemoteVariables() {
        log.log('Clearing remote and userspace variables.');
        this.#categorizedVariables.delete(EnvironmentService.VAR_CATEGORIES.REMOTE);
        this.#categorizedVariables.delete(EnvironmentService.VAR_CATEGORIES.USERSPACE);
    }
}

export { EnvironmentService };