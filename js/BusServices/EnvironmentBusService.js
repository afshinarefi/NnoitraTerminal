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
import { createLogger } from './LogManager.js';
import { VAR_CATEGORIES } from './constants.js';

const log = createLogger('EnvBusService');

// Define constants for hardcoded strings to improve maintainability.
const LOCAL_STORAGE_KEY = 'AREFI_LOCAL_ENV';

/**
 * @class EnvironmentBusService
 * @description Manages the terminal's environment variables. It is a self-contained state
 * manager that communicates with the rest of the system exclusively via the event bus.
 *
 * @listens for `variable-get-request` - Responds to requests for a variable's value.
 * @listens for `variable-set-request` - Responds to requests to set a variable.
 * @listens for `environment-reset-request` - Responds to requests to reset the environment.
 *
 * @dispatches `variable-persist-request` - When a variable needs to be saved remotely.
 * @dispatches `variable-changed-broadcast` - When any variable's value changes.
 * @dispatches `variable-get-response` - The value in response to a get request.
 */
class EnvironmentBusService {
    #eventBus;
    #eventNames;
	#categorizedVariables = new Map([
		[VAR_CATEGORIES.TEMP, new Map()],
		[VAR_CATEGORIES.LOCAL, new Map()],
		[VAR_CATEGORIES.REMOTE, new Map()],
		[VAR_CATEGORIES.USERSPACE, new Map()]
	]);
    
    // Internal enum-like object for event roles.
    static EVENTS = {
        PROVIDE_GET: 'provideGet',
        PROVIDE_SET: 'provideSet',
        PROVIDE_RESET: 'provideReset',
        USE_PERSIST: 'usePersist',
        USE_CHANGED: 'useChanged',
        USE_GET_RESPONSE: 'useGetResponse'
    };

	constructor(eventBus, eventNameConfig) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
        this.#registerListeners();
		log.log('Initializing...');
	}

    #registerListeners() {
        this.#eventBus.listen(this.#eventNames[EnvironmentBusService.EVENTS.PROVIDE_GET], (payload) => this.#handleGetVariable(payload));
        this.#eventBus.listen(this.#eventNames[EnvironmentBusService.EVENTS.PROVIDE_SET], (payload) => this.setVariable(payload.key, payload.value, payload.category));
        this.#eventBus.listen(this.#eventNames[EnvironmentBusService.EVENTS.PROVIDE_RESET], () => this.reset());
    }

	init() {
		this.#loadFromStorage();
	}

	#loadFromStorage() {
		const storedLocalVars = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedLocalVars) {
			try {
				const localObj = JSON.parse(storedLocalVars);
				for (const [key, value] of Object.entries(localObj)) {
					this.#categorizedVariables.get(VAR_CATEGORIES.LOCAL).set(key, value);
				}
			} catch (e) {
				log.error("Failed to parse local environment variables from localStorage:", e);
			}
		}
	}

	#persistLocalVariables() {
		const localMap = this.#categorizedVariables.get(VAR_CATEGORIES.LOCAL);
		const localObj = Object.fromEntries(localMap);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localObj));
	}

    #handleGetVariable({ key, correlationId }) {
        const value = this.getVariable(key);
        this.#eventBus.dispatch(this.#eventNames[EnvironmentBusService.EVENTS.USE_GET_RESPONSE], { key, value, correlationId });
    }

	getVariable(key) {
		const upperKey = key.toUpperCase();
		for (const categoryMap of this.#categorizedVariables.values()) {
			if (categoryMap.has(upperKey)) {
				return categoryMap.get(upperKey);
			}
		}
		return undefined;
	}

	setVariable(key, value, category = null) {
		const upperKey = key.toUpperCase();

		if (typeof value === 'number') {
			value = String(value);
		}

		if (!upperKey || typeof value !== 'string') {
			log.error("Invalid key or value provided to setVariable:", { key, value, type: typeof value });
			return;
		}

		const targetCategory = category && this.#categorizedVariables.has(category) ? category : VAR_CATEGORIES.TEMP;

		for (const [cat, catMap] of this.#categorizedVariables.entries()) {
			if (cat !== targetCategory) catMap.delete(upperKey);
		}

		this.#categorizedVariables.get(targetCategory).set(upperKey, value);

		if (targetCategory === VAR_CATEGORIES.LOCAL) {
			this.#persistLocalVariables();
		} else if (targetCategory === VAR_CATEGORIES.REMOTE || targetCategory === VAR_CATEGORIES.USERSPACE) {
			this.#eventBus.dispatch(this.#eventNames[EnvironmentBusService.EVENTS.USE_PERSIST], { key: upperKey, value });
		}

		this.#eventBus.dispatch(this.#eventNames[EnvironmentBusService.EVENTS.USE_CHANGED], { key: upperKey, value });
	}

	isReadOnly(key) {
		const upperKey = key.toUpperCase();
		for (const [category, catMap] of this.#categorizedVariables.entries()) {
			if (category !== VAR_CATEGORIES.USERSPACE && catMap.has(upperKey)) {
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
		this.setVariable(key, value, VAR_CATEGORIES.USERSPACE);
		return true;
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

	loadRemoteVariables(data) {
		this.#categorizedVariables.get(VAR_CATEGORIES.REMOTE).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.USERSPACE).clear();

		if (data) {
			for (const [key, value] of Object.entries(data)) {
				// Treat all loaded variables as USERSPACE. Specific variables like ALIAS
				// are managed by their own services (e.g., CommandBusService), which will set the correct category.
				this.setVariable(key, value, VAR_CATEGORIES.USERSPACE);
			}
		}
	}

	reset() {
		log.log('Resetting environment service completely...');
		localStorage.removeItem(LOCAL_STORAGE_KEY);

		this.#categorizedVariables.get(VAR_CATEGORIES.TEMP).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.LOCAL).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.REMOTE).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.USERSPACE).clear();
	}
}

export { EnvironmentBusService };