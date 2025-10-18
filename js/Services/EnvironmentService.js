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

class EnvironmentService extends EventTarget {
	/** @private {Map<string, Map<string, string>>} #categorizedVariables - A nested map storing variables by category. */
	#categorizedVariables = new Map([
		[VAR_CATEGORIES.TEMP, new Map()],
		[VAR_CATEGORIES.LOCAL, new Map()],
		[VAR_CATEGORIES.REMOTE, new Map()],
		[VAR_CATEGORIES.USERSPACE, new Map()]
	]);

	/**
	 * Initializes the EnvironmentService with an optional set of initial variables.
	 * Variable keys are automatically converted to uppercase for consistency.
	 * @param {object} services - An object containing service dependencies.
	 */
	constructor(services) {
		super();
		// This service is special and is created first. Other services will be injected later.
		// No direct dependencies needed in constructor.
	}

	/**
	 * Initializes the service by loading variables from local storage.
	 * This should be called after all variables have been registered.
	 */
	init() {
		this.#loadFromStorage();
	}

	/**
	 * @private Loads LOCAL variables from localStorage into the service's state.
	 */
	#loadFromStorage() {
		const storedLocalVars = localStorage.getItem('AREFI_LOCAL_ENV');
		if (storedLocalVars) {
			try {
				const localObj = JSON.parse(storedLocalVars);
				// Overwrite the in-memory local map with the one from storage.
				for (const [key, value] of Object.entries(localObj)) {
					this.#categorizedVariables.get(VAR_CATEGORIES.LOCAL).set(key, value);
				}
			} catch (e) {
				log.error("Failed to parse local environment variables from localStorage:", e);
			}
		}
	}

	/**
	 * @private Serializes the entire LOCAL variables map and saves it to localStorage.
	 */
	#persistLocalVariables() {
		const localMap = this.#categorizedVariables.get(VAR_CATEGORIES.LOCAL);
		const localObj = Object.fromEntries(localMap);
		log.log('Persisting local variables to localStorage:', localObj);
		localStorage.setItem('AREFI_LOCAL_ENV', JSON.stringify(localObj));
	}

	/**
	 * Retrieves the value of an environment variable.
	 * @param {string} key - The name of the variable to retrieve (case-insensitive for lookup).
	 * @returns {string | undefined} The variable's value, or `undefined` if the variable is not set.
	 */	getVariable(key) {
		const upperKey = key.toUpperCase();
		// Search through all categories to find the variable.
		for (const categoryMap of this.#categorizedVariables.values()) {
			if (categoryMap.has(upperKey)) {
				return categoryMap.get(upperKey);
			}
		}
		return undefined;
	}

	/**
	 * Sets or updates the value of an environment variable.
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

		// Ensure the category exists. Default to TEMP for ad-hoc variables.
		const targetCategory = category && this.#categorizedVariables.has(category) ? category : VAR_CATEGORIES.TEMP;

		// Remove the key from any other category to prevent duplicates.
		for (const [cat, catMap] of this.#categorizedVariables.entries()) {
			if (cat !== targetCategory) catMap.delete(upperKey);
		}

		this.#categorizedVariables.get(targetCategory).set(upperKey, value);

		if (targetCategory === VAR_CATEGORIES.LOCAL) {
			this.#persistLocalVariables();
		} else if (targetCategory === VAR_CATEGORIES.REMOTE || targetCategory === VAR_CATEGORIES.USERSPACE) {
			this.#saveRemoteVariable(upperKey, value);
		}

		// Announce that a variable was set so other components can react.
		this.dispatchEvent(new CustomEvent('variable-set', {
			detail: {
				key: upperKey,
				value: value
			}
		}));
	}

	/**
	 * Checks if a variable is read-only (i.e., not in USERSPACE).
	 * @param {string} key - The variable name.
	 * @returns {boolean} True if the variable is read-only.
	 */
	isReadOnly(key) {
		const upperKey = key.toUpperCase();
		// A variable is read-only if it exists in any category other than USERSPACE.
		for (const [category, catMap] of this.#categorizedVariables.entries()) {
			if (category !== VAR_CATEGORIES.USERSPACE && catMap.has(upperKey)) {
				return true;
			}
		}
		return false;
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
		// Dispatch an event to request saving the variable.
		// The Terminal component will listen for this and orchestrate the save.
		log.log(`Dispatching 'save-remote-variable' for key: ${key}`);
		this.dispatchEvent(new CustomEvent('save-remote-variable', {
			detail: {
				key: key,
				value: value,
			}
		}));
	}

	/**
	 * Removes an environment variable from the session.
	 * @param {string} key - The name of the variable to remove.
	 */
	removeVariable(key) {		const upperKey = key.toUpperCase();
		for (const [category, catMap] of this.#categorizedVariables.entries()) {
			if (catMap.has(upperKey)) {
				catMap.delete(upperKey);
				if (category === VAR_CATEGORIES.LOCAL) {
					// Re-persist the entire local map after removing an item.
					this.#persistLocalVariables();
				}
				break; // Assume variable names are unique across categories
			}
		}
	}

	/**
	 * Checks if an environment variable is defined.
	 * @param {string} key - The name of the variable to check.
	 * @returns {boolean} `true` if the variable is set, `false` otherwise.
	 */	hasVariable(key) {
		const upperKey = key.toUpperCase();
		for (const catMap of this.#categorizedVariables.values()) {
			if (catMap.has(upperKey)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns a plain JavaScript object containing all currently set environment variables.
	 * This is useful for debugging or for scenarios where a plain object representation is needed.
	 * @returns {Object.<string, string>} A copy of all environment variables as a plain object.
	 */	getAllVariables() {
		const allVars = {};
		for (const catMap of this.#categorizedVariables.values()) {
			Object.assign(allVars, Object.fromEntries(catMap));
		}
		return allVars;
	}

	/**
	 * Returns a plain JavaScript object containing all currently set environment variables,
	 * categorized by their scope (TEMP, LOCAL, REMOTE).
	 * @returns {{TEMP: Object.<string, string>, LOCAL: Object.<string, string>, REMOTE: Object.<string, string>}}
	 */
	getAllVariablesCategorized() {
		const categorized = {};
		for (const [category, catMap] of this.#categorizedVariables.entries()) {
			// Return a plain object copy for each category
			categorized[category] = Object.fromEntries(catMap);
		}
		return categorized;
	}

	/**
	 * Loads remote variables from a data object.
	 * @param {object} data - The key-value object of remote variables.
	 */
	loadRemoteVariables(data) {
		// First, clear any existing remote or user-space variables.
		this.#categorizedVariables.get(VAR_CATEGORIES.REMOTE).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.USERSPACE).clear();

		if (data) {
			for (const [key, value] of Object.entries(data)) {
				// All fetched variables are either REMOTE or USERSPACE.
				// We can infer the category based on a predefined list or default to USERSPACE.
				const category = (key === 'ALIAS') ? VAR_CATEGORIES.REMOTE : VAR_CATEGORIES.USERSPACE;
				this.setVariable(key, value, category);
			}
		}
	}

	/**
	 * Resets the entire service to a pristine state.
	 * - Clears all in-memory variables from all categories.
	 * - Clears all associated 'LOCAL' variables from localStorage.
	 * This is a destructive operation used for login/logout transitions.
	 */
	reset() {
		log.log('Resetting environment service completely...');

		// Clear associated localStorage items
		localStorage.removeItem('AREFI_LOCAL_ENV');

		// Clear all in-memory maps
		this.#categorizedVariables.get(VAR_CATEGORIES.TEMP).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.LOCAL).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.REMOTE).clear();
		this.#categorizedVariables.get(VAR_CATEGORIES.USERSPACE).clear();
	}

}

export { EnvironmentService };
