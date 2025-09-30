// EnvironmentManager.js

/**
 * @class EnvironmentService
 * @description Manages environment variables for the terminal session.
 * Stores variables as key-value pairs, typically in uppercase, following shell conventions.
 */
class EnvironmentService {
	/** @private {Map<string, string>} #variables - A private Map to hold all environment variables. */
	#variables = new Map();

	/** @private {string[]} #persistentKeys - A list of keys to persist in localStorage. */
	#persistentKeys = ['USER', 'TOKEN', 'TOKEN_EXPIRY'];

	/**
	 * Initializes the EnvironmentService with an optional set of initial variables.
	 * Variable keys are automatically converted to uppercase for consistency.
	 * @param {Object.<string, string>} [initialEnv={}] - An object containing initial environment variables.
	 *   Example: `{ USER: 'guest', PWD: '/' }`.
	 */	constructor(initialEnv = {}) {
		// Load persistent variables from localStorage first.
		this.#loadFromStorage();

		// Initialize the internal map with provided variables.
		for (const [key, value] of Object.entries(initialEnv)) {
			this.setVariable(key, value); 
		}
	}

	/**
	 * @private
	 * Loads persistent variables from localStorage into the service.
	 */
	#loadFromStorage() {
		this.#persistentKeys.forEach(key => {
			const value = localStorage.getItem(key);
			if (value) {
				this.#variables.set(key, value);
			}
		});
	}

	/**
	 * Retrieves the value of an environment variable.
	 * @param {string} key - The name of the variable to retrieve (case-insensitive for lookup).
	 * @returns {string | undefined} The variable's value, or `undefined` if the variable is not set.
	 */	getVariable(key) {
		return this.#variables.get(key);
	}

	/**
	 * Sets or updates the value of an environment variable.
	 * Keys are stored as provided (case-sensitive), but lookup can be case-insensitive depending on usage.
	 * @param {string} key - The name of the variable.
	 * @param {string} value - The new string value for the variable.
	 */	setVariable(key, value) {
		if (!key || typeof key !== 'string' || typeof value !== 'string') {
			// Basic validation for key and value types.
			console.error("Invalid key or value provided to EnvironmentService.");
			return;
		}
		this.#variables.set(key, value);

		// If the key is one that should be persisted, save it to localStorage.
		if (this.#persistentKeys.includes(key)) {
			localStorage.setItem(key, value);
		}
	}

	/**
	 * Removes an environment variable from the session.
	 * @param {string} key - The name of the variable to remove.
	 */
	removeVariable(key) {
		this.#variables.delete(key);

		// If the key is one that was persisted, remove it from localStorage.
		if (this.#persistentKeys.includes(key)) {
			localStorage.removeItem(key);
		}
	}

	/**
	 * Checks if an environment variable is defined.
	 * @param {string} key - The name of the variable to check.
	 * @returns {boolean} `true` if the variable is set, `false` otherwise.
	 */	hasVariable(key) {
		return this.#variables.has(key);
	}

	/**
	 * Returns a plain JavaScript object containing all currently set environment variables.
	 * This is useful for debugging or for scenarios where a plain object representation is needed.
	 * @returns {Object.<string, string>} A copy of all environment variables as a plain object.
	 */	getAllVariables() {
		return Object.fromEntries(this.#variables);
	}
}

export { EnvironmentService };
