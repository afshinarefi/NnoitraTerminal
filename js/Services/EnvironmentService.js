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
const VAR_CATEGORIES = {
	TEMP: 'TEMP',     // In-memory only for the current session
	LOCAL: 'LOCAL',   // Persisted in browser localStorage
	REMOTE: 'REMOTE'  // Persisted on the server for the logged-in user
};

// Define the properties of each environment variable
const VAR_DEFINITIONS = {
	'USER': { category: VAR_CATEGORIES.LOCAL, defaultValue: 'guest' },
	'HOST': { category: VAR_CATEGORIES.TEMP, defaultValue: window.location.host },
	'PWD': { category: VAR_CATEGORIES.TEMP, defaultValue: '/' },
	'TOKEN': { category: VAR_CATEGORIES.LOCAL },
	'TOKEN_EXPIRY': { category: VAR_CATEGORIES.LOCAL },
	'HISTSIZE': { category: VAR_CATEGORIES.REMOTE, defaultValue: '1000' },
	'ALIAS': { category: VAR_CATEGORIES.REMOTE, defaultValue: '{}' }
};

class EnvironmentService {
	/** @private {Map<string, string>} #variables - A private Map to hold all environment variables. */
	#variables = new Map();

	/**
	 * Initializes the EnvironmentService with an optional set of initial variables.
	 * Variable keys are automatically converted to uppercase for consistency.
	 * @param {Object.<string, string>} [initialEnv={}] - An object containing initial environment variables.
	 *   Example: `{ USER: 'guest', PWD: '/' }`.
	 */
	constructor() {
		this.#initializeDefaults();
		this.#loadFromStorage();
	}

	/** @private Initializes variables with their default values. */
	#initializeDefaults() {
		for (const [key, def] of Object.entries(VAR_DEFINITIONS)) {
			if (def.defaultValue !== undefined) {
				this.#variables.set(key, def.defaultValue);
			}
		}
	}

	/** @private Loads LOCAL variables from localStorage. */
	#loadFromStorage() {
		for (const [key, def] of Object.entries(VAR_DEFINITIONS)) {
			if (def.category === VAR_CATEGORIES.LOCAL) {
				const value = localStorage.getItem(key);
				if (value) {
					this.#variables.set(key, value);
				}
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
	 * Sets or updates the value of an environment variable.
	 * Keys are stored as provided (case-sensitive), but lookup can be case-insensitive depending on usage.
	 * @param {string} key - The name of the variable.
	 * @param {string} value - The new string value for the variable.
	 */	setVariable(key, value) {
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

		const def = VAR_DEFINITIONS[upperKey];
		if (!def) return; // Ad-hoc variable, treat as TEMP

		if (def.category === VAR_CATEGORIES.LOCAL) {
			localStorage.setItem(upperKey, value);
		} else if (def.category === VAR_CATEGORIES.REMOTE) {
			this.#saveRemoteVariable(upperKey, value);
		}
	}

	/** @private Saves a single REMOTE variable to the backend. */
	async #saveRemoteVariable(key, value) {
		const token = this.getVariable('TOKEN');
		if (!token || this.getVariable('USER') === 'guest') {
			return; // Don't save for guests
		}

		const formData = new FormData();
		formData.append('token', token);
		formData.append('var_name', key);
		formData.append('var_value', value);

		try {
			await fetch('/server/accounting.py?action=set_env', { method: 'POST', body: formData });
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
		const def = VAR_DEFINITIONS[upperKey];
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
			[VAR_CATEGORIES.REMOTE]: {}
		};

		for (const [key, value] of this.#variables.entries()) {
			const def = VAR_DEFINITIONS[key];
			const category = def ? def.category : VAR_CATEGORIES.TEMP; // Default ad-hoc vars to TEMP
			categorized[category][key] = value;
		}

		return categorized;
	}

	/**
	 * Retrieves all defined aliases as an object.
	 * @returns {Object.<string, string>} An object of aliases.
	 */
	getAliases() {
		const aliasString = this.getVariable('ALIAS');
		if (aliasString) {
			try {
				return JSON.parse(aliasString);
			} catch (e) {
				log.error("Error parsing ALIAS environment variable:", e);
				return {};
			}
		}
		return {};
	}

	/**
	 * Sets the aliases object in the environment.
	 * @param {Object.<string, string>} aliases - The object of aliases to store.
	 */
	setAliases(aliases) {
		this.setVariable('ALIAS', JSON.stringify(aliases));
	}

	/** Fetches remote variables and loads them into the environment. */
	async fetchRemoteVariables() {
		const token = this.getVariable('TOKEN');
		if (!token || this.getVariable('USER') === 'guest') {
			return; // No user logged in
		}

		const formData = new FormData();
		formData.append('token', token);

		try {
			const response = await fetch('/server/accounting.py?action=get_env', { method: 'POST', body: formData });
			const result = await response.json();
			if (result.status === 'success' && result.env) {
				for (const [key, value] of Object.entries(result.env)) {
					this.#variables.set(key, value);
				}
			}
		} catch (error) {
			log.error('Failed to fetch remote environment variables:', error);
		}
	}

	/** Clears remote variables from memory, typically on logout. */
	clearRemoteVariables() {
		for (const [key, def] of Object.entries(VAR_DEFINITIONS)) {
			if (def.category === VAR_CATEGORIES.REMOTE) {
				this.#variables.set(key, def.defaultValue);
			}
		}
	}
}

export { EnvironmentService };
