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
const log = createLogger('useradd');
/**
 * @class Useradd
 * @description Implements the 'useradd' command to create a new user.
 */
class Useradd {
    static DESCRIPTION = 'Create a new user account.';

    #prompt;

    constructor(services) {
        this.#prompt = services.prompt;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       useradd - Create a new user account.\n\nSYNOPSIS\n       useradd [username] [password]\n\nDESCRIPTION\n       Creates a new user with the specified username and password.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // No autocomplete for username/password.
    }

    /**
     * Determines if the command is available in the current context.
     * For now, only 'guest' can add users. This can be updated for 'root' privileges later.
     * @param {object} services - A collection of all services.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(services) {
        return services.environment.getVariable('USER') === 'guest';
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        const username = args[1];
        let password = args[2];

        if (!username) {
            outputDiv.textContent = 'Usage: useradd <username>';
            return outputDiv;
        }

        // If password is not provided as an argument, prompt for it interactively.
        if (!password) {
            log.log('Password not provided, prompting user.');
            password = await this.#prompt.requestPassword();
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            log.log(`Attempting to create user: "${username}"`);
            const response = await fetch('/server/accounting.py?action=useradd', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            log.log('Server response:', result);
            outputDiv.textContent = result.message;
        } catch (error) {
            log.error('Network or parsing error during useradd:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Useradd };