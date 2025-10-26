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
const log = createLogger('adduser');

/**
 * @class AddUser
 * @description Implements the 'adduser' command for creating new users.
 */
class AddUser {
    static DESCRIPTION = 'Add a new user.';

    #prompt;
    #addUser;

    constructor(services) {
        this.#prompt = services.prompt;
        this.#addUser = services.addUser;
        log.log('Initializing...');
    }

    static man() {
        return `
NAME
       adduser - Add a new user.

SYNOPSIS
       adduser [username]

DESCRIPTION
       The adduser command creates a new user account. You will be prompted to enter and confirm a password.
       Usernames must be between 3 and 32 characters and can only contain letters, numbers, and underscores.
`;
    }
    
    async autocompleteArgs(currentArgs) { // Made async for consistency
        return {
            suggestions: [],
            description: '<USERNAME>'
        };
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        const username = args[1];

        if (!username) {
            outputDiv.textContent = 'adduser: missing username operand.';
            return outputDiv;
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/;
        if (!usernameRegex.test(username)) {
            outputDiv.textContent = `adduser: invalid username '${username}'. Usernames must be 3-32 characters and contain only letters, numbers, and underscores.`;
            return outputDiv;
        }

        try {
            // Prompt for password
            const password = await this.#prompt('Password: ', { isSecret: true, allowHistory: false });
            if (password === null) { // User cancelled with Ctrl+C
                outputDiv.textContent = 'adduser: Operation cancelled.';
                return outputDiv;
            }

            // Prompt for password confirmation
            const confirmPassword = await this.#prompt('Confirm password: ', { isSecret: true, allowHistory: false });
            if (confirmPassword === null) { // User cancelled with Ctrl+C
                outputDiv.textContent = 'adduser: Operation cancelled.';
                return outputDiv;
            }

            if (password !== confirmPassword) {
                outputDiv.textContent = 'adduser: Passwords do not match. User not created.';
                return outputDiv;
            }

            outputDiv.textContent = 'Creating user...';

            const result = await this.#addUser(username, password);

            if (result.status === 'success') {
                outputDiv.textContent = `User '${username}' created successfully.`;
            } else {
                outputDiv.textContent = `adduser: ${result.message}`;
            }
        } catch (error) {
            log.error('Error during user creation:', error);
            outputDiv.textContent = 'adduser: An unexpected error occurred.';
        }

        return outputDiv;
    }
}

export { AddUser };