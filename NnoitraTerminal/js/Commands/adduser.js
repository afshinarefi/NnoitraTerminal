/**
 * Nnoitra Terminal
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
import { BaseCommand } from '../Core/BaseCommand.js';
/**
 * @class AddUser
 * @description Implements the 'adduser' command for creating new users.
 */
class AddUser extends BaseCommand {
    static DESCRIPTION = 'Add a new user.';

    #prompt;
    #addUser;

    constructor(services) {
        super(services);
        this.#prompt = this.services.prompt;
        this.#addUser = this.services.addUser;
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

    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);

        const username = args[1];

        if (!username) {
            outputDiv.textContent = 'adduser: missing username operand.';
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/;
        if (!usernameRegex.test(username)) {
            outputDiv.textContent = `adduser: invalid username '${username}'. Usernames must be 3-32 characters and contain only letters, numbers, and underscores.`;
            return;
        }

        try {
            // Prompt for password
            const password = await this.#prompt('Password: ', { isSecret: true, allowHistory: false, allowAutocomplete: false });
            if (password === null) throw new Error('Operation cancelled.');
            outputDiv.innerHTML += 'Password received.<br>';

            // Prompt for password confirmation
            const confirmPassword = await this.#prompt('Confirm password: ', { isSecret: true, allowHistory: false, allowAutocomplete: false });
            if (confirmPassword === null) throw new Error('Operation cancelled.');
            outputDiv.innerHTML += 'Confirmation received.<br>';

            if (password !== confirmPassword) {
                outputDiv.innerHTML += '<br>adduser: Passwords do not match. User not created.';
                return;
            }

            outputDiv.innerHTML += 'Creating user...';

            const result = await this.#addUser(username, password);

            outputDiv.innerHTML += `<br>${result.status === 'success' ? `User '${username}' created successfully.` : `adduser: ${result.message}`}`;
        } catch (error) {
            this.log.error('Error during user creation:', error);
            outputDiv.innerHTML += '<br>adduser: Operation cancelled.';
        }
    }
}

export { AddUser };