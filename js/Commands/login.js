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
const log = createLogger('login');
/**
 * @class Login
 * @description Implements the 'login' command for user authentication.
 */
class Login {
    static DESCRIPTION = 'Log in as a user.';

    #prompt; // Function to request user input
    #login;  // Function to perform login

    constructor(services) {
        this.#prompt = services.prompt;
        this.#login = services.login;
    }

    static man() {
        return `NAME\n       login - Log in to the system.\n\nSYNOPSIS\n       login [username]\n\nDESCRIPTION\n       Authenticates the user and starts a session.`;
    }

    async autocompleteArgs(currentArgs) { // Made async for consistency
        // Only provide a hint for the first argument (the username).
        if (currentArgs.length > 1) {
            return [];
        }
        return {
            suggestions: [],
            description: '<USERNAME>'
        };
    }

    /**
     * Determines if the command is available in the current context.
     * @param {object} context - The current application context.
     * @param {boolean} context.isLoggedIn - Whether a user is currently logged in.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(context) {
        return !context.isLoggedIn;
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        const username = args[1];

        if (!username) {
            outputDiv.textContent = 'Usage: login <username>';
            return outputDiv;
        }

        // Always prompt for the password interactively for security reasons.
        log.log('Prompting user for password.');
        const password = await this.#prompt('Password: ', { isSecret: true, allowHistory: false, allowAutocomplete: false });

        try {
            const loginResult = await this.#login(username, password);
            outputDiv.textContent = loginResult.message;
        } catch (error) {
            log.error('Network or parsing error during login:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Login };