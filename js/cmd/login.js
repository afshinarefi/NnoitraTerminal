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
import { createLogger } from '../Services/LogService.js';
const log = createLogger('login');
/**
 * @class Login
 * @description Implements the 'login' command for user authentication.
 */
class Login {
    static DESCRIPTION = 'Log in as a user.';

    #prompt;
    #loginService;

    constructor(services) {
        this.#prompt = services.prompt;
        this.#loginService = services.login;
    }

    static man() {
        return `NAME\n       login - Log in to the system.\n\nSYNOPSIS\n       login [username]\n\nDESCRIPTION\n       Authenticates the user and starts a session.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // No autocomplete for username/password.
    }

    /**
     * Determines if the command is available in the current context.
     * @param {object} services - A collection of all services.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(services) {
        return !services.login.isLoggedIn();
    }

    /**
     * Hashes a string using SHA-256.
     * @param {string} string - The string to hash.
     * @returns {Promise<string>} A promise that resolves to the hex-encoded hash.
     */
    async #hashString(string) {
        const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(string));
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        const username = args[1];
        let password = args[2];

        if (!username) {
            outputDiv.textContent = 'Usage: login <username>';
            return outputDiv;
        }

        // If password is not provided as an argument, prompt for it interactively.
        if (!password) {
            log.log('Password not provided, prompting user.');
            password = await this.#prompt.read('Password', true);
        }

        try {
            const loginResult = await this.#loginService.login(username, password);
            outputDiv.textContent = loginResult.message;
        } catch (error) {
            log.error('Network or parsing error during login:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Login };