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
const log = createLogger('adduser');
/**
 * @class Adduser
 * @description Implements the 'adduser' command to create a new user.
 */
class Adduser {
    static DESCRIPTION = 'Add a new user interactively.';

    #prompt;

    constructor(services) {
        this.#prompt = services.prompt;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       adduser - Add a new user account.\n\nSYNOPSIS\n       adduser [username]\n\nDESCRIPTION\n       Interactively creates a new user with the specified username and prompts for a password.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // No autocomplete for username/password.
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        const username = args[1];
        let password = args[2];

        if (!username) {
            outputDiv.textContent = 'Usage: adduser <username>';
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

export { Adduser };