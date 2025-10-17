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

    #environmentService;
    #prompt;
    #historyService;

    constructor(services) {
        this.#environmentService = services.environment;
        this.#prompt = services.prompt;
        this.#historyService = services.history;
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
        return !services.environment.hasVariable('TOKEN');
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
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            log.log(`Attempting login for user: "${username}"`);
            const loginResponse = await fetch('/server/accounting.py?action=login', {
                method: 'POST',
                body: formData
            });
            const loginResult = await loginResponse.json();
            outputDiv.textContent = loginResult.message;

            if (loginResult.status === 'success') {
                log.log('Login successful. Setting session variables.');
                this.#environmentService.setVariable('TOKEN', loginResult.token);
                this.#environmentService.setVariable('USER', loginResult.user);
                this.#environmentService.setVariable('TOKEN_EXPIRY', loginResult.expires_at);
                // Fetch remote environment variables for the logged-in user
                await this.#environmentService.fetchRemoteVariables();
                // Fetch remote command history for the logged-in user
                await this.#historyService.loadRemoteHistory();
            } else {
                log.warn('Login failed:', loginResult.message);
            }
        } catch (error) {
            log.error('Network or parsing error during login:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Login };