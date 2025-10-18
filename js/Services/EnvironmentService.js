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
// EnvironmentManager.js
import { createLogger } from './LogService.js';

/**
 * @class EnvironmentService
 * @description Manages environment variables for the terminal session.
 * Stores variables as key-value pairs, typically in uppercase, following shell conventions.
 */

const log = createLogger('EnvService');

// Define variable categories
export const VAR_CATEGORIES = {
	TEMP: 'TEMP',     // In-memory only for the current session
	LOCAL: 'LOCAL',   // Persisted in browser localStorage
	REMOTE: 'REMOTE',  // Persisted on the server, not directly user-modifiable
    USERSPACE: 'USERSPACE' // Persisted on the server, user-modifiable via `export`
};

class EnvironmentService {
	/** @private {Map<string, string>} #variables - A private Map to hold all environment variables. */
	#variables = new Map();
	/** @private {Map<string, object>} #definitions - A private Map to hold variable definitions. */
	#definitions = new Map();
	/** @private {LoginService} #loginService - Reference to the LoginService for remote persistence. */
	#loginService;

	/**
	 * Initializes the EnvironmentService with an optional set of initial variables.
	 * Variable keys are automatically converted to uppercase for consistency.
	 * @param {Object.<string, string>} [initialEnv={}] - An object containing initial environment variables.
	 *   Example: `{ USER: 'guest', PWD: '/' }`.
	 */
	constructor(services) {
		// This service is special and is created first. Other services will be injected later.
	}

	/**
	 * Initializes the service by loading variables from local storage.
	 * This should be called after all variables have been registered.
	 */
	init() {
		this.#loadFromStorage();
	}

	/**
	 * Injects the LoginService after it has been created to avoid circular dependencies.
	 * @param {LoginService} loginService - The LoginService instance.
	 */
	setLoginService(loginService) {
		this.#loginService = loginService;
	}

	/**
	 * Registers a variable's definition (category and default value).
	 * @param {string} key - The variable name.
	 * @param {{category: string, defaultValue?: string}} definition - The definition object.
	 */
	registerVariable(key, { category, defaultValue }) {
		const upperKey = key.toUpperCase();
		this.#definitions.set(upperKey, { category, defaultValue });
		// Set the default value if the variable isn't already set from a higher priority source (like remote).
		if (defaultValue !== undefined && !this.#variables.has(upperKey)) {
			this.#variables.set(upperKey, defaultValue);
		}
	}

	/** @private Loads LOCAL variables from localStorage. */
	#loadFromStorage() {
		for (const [key, def] of this.#definitions.entries()) {
			if (def.category === VAR_CATEGORIES.LOCAL) {
				const value = localStorage.getItem(key);
				// Only load from storage if it's not already set (e.g., by a default)
				if (value) this.#variables.set(key, value);
			}
		}
	}

	/**
	 * Retrieves the value of an environment variable.
	 * @param {string} key - The name of the variable to retrieve (case-insensitive for lookup).
	 * @returns {string | undefined} The variable's value, or `undefined` if the variable is not set.
	 */	getVariable(key) {
		const upperKey = key.toUpperCase();
		return this.#variables.get(upperKey);
	}

	/**
	 * Retrieves the definition object for a variable.
	 * @param {string} key - The name of the variable.
	 * @returns {object | undefined} The definition object or undefined.
	 */
	getDefinition(key) {
		const upperKey = key.toUpperCase();
		return this.#definitions.get(upperKey);
	}

	/**
	 * Sets or updates the value of an environment variable.
	 * Keys are stored as provided (case-sensitive), but lookup can be case-insensitive depending on usage.
	 * @param {string} key - The name of the variable.
	 * @param {string} value - The new string value for the variable.
	 * @param {string} [category=null] - The category to assign to a new variable.
	 */	setVariable(key, value, category = null) {
		const upperKey = key.toUpperCase();

		// Coerce numbers to strings to handle timestamps like TOKEN_EXPIRY.
		if (typeof value === 'number') {
			value = String(value);
		}

		if (!upperKey || typeof value !== 'string') {
			log.error("Invalid key or value provided to setVariable:", { key, value, type: typeof value });
			return;
		}

		this.#variables.set(upperKey, value);

		let def = this.#definitions.get(upperKey);
		if (!def) {
			// If it's a new, ad-hoc variable, assign it a definition so it can be categorized.
			def = { category: category || VAR_CATEGORIES.TEMP };
			this.#definitions.set(upperKey, def);
		}

		if (def.category === VAR_CATEGORIES.LOCAL) {
			localStorage.setItem(upperKey, value);
		} else if (def.category === VAR_CATEGORIES.REMOTE || def.category === VAR_CATEGORIES.USERSPACE) {
			this.#saveRemoteVariable(upperKey, value);
		}
	}

	/**
	 * Checks if a variable is read-only (i.e., not in USERSPACE).
	 * @param {string} key - The variable name.
	 * @returns {boolean} True if the variable is read-only.
	 */
	isReadOnly(key) {
		const upperKey = key.toUpperCase();
		const def = this.#definitions.get(upperKey);
		return def && def.category !== VAR_CATEGORIES.USERSPACE;
	}

	/**
	 * Exports a variable, creating it in the USERSPACE category if it doesn't exist
	 * or updating it if it's already a USERSPACE variable.
	 * @param {string} key - The name of the variable.
	 * @param {string} value - The new value for the variable.
	 * @returns {boolean} True on success, false if permission is denied.
	 */
	exportVariable(key, value) {
		const upperKey = key.toUpperCase();
		if (this.isReadOnly(upperKey)) {
			return false; // Permission denied
		}
		// This will either create a new ad-hoc variable or update an existing one.
		this.setVariable(key, value, VAR_CATEGORIES.USERSPACE);
		return true;
	}

	/** @private Saves a single REMOTE variable to the backend. */
	async #saveRemoteVariable(key, value) {
		const token = this.getVariable('TOKEN');
		if (!token || !this.#loginService) {
			return; // Don't save for guests or if loginService isn't ready
		}

		try {
			await this.#loginService.post('set_data', {
				category: 'ENV',
				key: key,
				value: value
			});
		} catch (error) {
			log.error(`Failed to save remote variable ${key}:`, error);
		}
	}

	/**
	 * Removes an environment variable from the session.
	 * @param {string} key - The name of the variable to remove.
	 */
	removeVariable(key) {		const upperKey = key.toUpperCase();
		this.#variables.delete(upperKey);
		const def = this.#definitions.get(upperKey);
		if (def && def.category === VAR_CATEGORIES.LOCAL) {
			localStorage.removeItem(upperKey);
		}
	}

	/**
	 * Checks if an environment variable is defined.
	 * @param {string} key - The name of the variable to check.
	 * @returns {boolean} `true` if the variable is set, `false` otherwise.
	 */	hasVariable(key) {
		const upperKey = key.toUpperCase();
		return this.#variables.has(upperKey);
	}

	/**
	 * Returns a plain JavaScript object containing all currently set environment variables.
	 * This is useful for debugging or for scenarios where a plain object representation is needed.
	 * @returns {Object.<string, string>} A copy of all environment variables as a plain object.
	 */	getAllVariables() {
		return Object.fromEntries(this.#variables);
	}

	/**
	 * Returns a plain JavaScript object containing all currently set environment variables,
	 * categorized by their scope (TEMP, LOCAL, REMOTE).
	 * @returns {{TEMP: Object.<string, string>, LOCAL: Object.<string, string>, REMOTE: Object.<string, string>}}
	 */
	getAllVariablesCategorized() {
		const categorized = {
			[VAR_CATEGORIES.TEMP]: {},
			[VAR_CATEGORIES.LOCAL]: {},
			[VAR_CATEGORIES.REMOTE]: {},
			[VAR_CATEGORIES.USERSPACE]: {}
		};
		// Ensure all defined USERSPACE vars have a home, even if not set.
		for (const [key, def] of this.#definitions.entries()) {
			if (def.category === VAR_CATEGORIES.USERSPACE && !this.#variables.has(key)) {
				categorized.USERSPACE[key] = def.defaultValue || '';
			}
		}

		for (const [key, value] of this.#variables.entries()) {
			const def = this.#definitions.get(key);
			const category = def ? def.category : VAR_CATEGORIES.TEMP; // Default ad-hoc vars to TEMP
			categorized[category][key] = value;
		}

		return categorized;
	}

	/** Fetches remote variables and loads them into the environment. */
	async fetchRemoteVariables() {
		const token = this.getVariable('TOKEN');
		if (!token || !this.#loginService) {
			return; // No user logged in
		}

		try {
			const result = await this.#loginService.post('get_data', { category: 'ENV' });
			if (result && result.status === 'success' && result.data) {
				for (const [key, value] of Object.entries(result.data)) {
					// If a fetched variable doesn't have a predefined definition,
					// it must be a user-created one, so we register its definition.
					if (!this.#definitions.has(key)) {
						this.registerVariable(key, { category: VAR_CATEGORIES.USERSPACE });
					}
					this.#variables.set(key, value); // Set the variable's value.
				}
			}
		} catch (error) {
			log.error('Failed to fetch remote environment variables:', error);
		}
	}

	/** Clears remote variables from memory, typically on logout. */
	clearRemoteVariables() {
		for (const [key, def] of this.#definitions.entries()) {
			if (def.category === VAR_CATEGORIES.REMOTE || def.category === VAR_CATEGORIES.USERSPACE) {
				this.#variables.set(key, def.defaultValue);
			}
		}
	}
}

export { EnvironmentService };
