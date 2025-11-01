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
 * @class Passwd
 * @description Implements the 'passwd' command for changing a user's password.
 */
class Passwd extends BaseCommand {
    static DESCRIPTION = 'Change user password.';

    #prompt;
    #changePassword;

    constructor(services) {
        super(services);
        this.#prompt = this.services.prompt;
        this.#changePassword = this.services.changePassword;
    }

    static man() {
        return `
NAME
       passwd - change user password

SYNOPSIS
       passwd

DESCRIPTION
       The passwd command changes the password for the current user.
       You will be prompted for your old password, and then for the new password twice.
`;
    }

    /**
     * Determines if the command is available. Only logged-in users can change their password.
     * @param {object} context - The current application context.
     * @param {boolean} context.isLoggedIn - Whether a user is currently logged in.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(context) {
        return true;
    }

    async execute(args) { // Made async for consistency
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        const promptOptions = { isSecret: true, allowHistory: false, allowAutocomplete: false };

        try {
            const oldPassword = await this.#prompt('Old password: ', promptOptions);
            if (oldPassword === null) throw new Error('Operation cancelled.');
            outputDiv.textContent += 'Old password received.\n';

            const newPassword = await this.#prompt('New password: ', promptOptions);
            if (newPassword === null) throw new Error('Operation cancelled.');
            outputDiv.textContent += 'New password received.\n';

            const confirmPassword = await this.#prompt('Confirm new password: ', promptOptions);
            if (confirmPassword === null) throw new Error('Operation cancelled.');
            outputDiv.textContent += 'Confirmation received.\n';

            if (newPassword !== confirmPassword) {
                outputDiv.textContent += '\npasswd: Passwords do not match. Password not changed.';
                return outputDiv;
            }

            if (!newPassword) {
                outputDiv.textContent += '\npasswd: Password cannot be empty.';
                return outputDiv;
            }

            outputDiv.textContent += 'Changing password...';
            const result = await this.#changePassword(oldPassword, newPassword);
            // Append the final result to the existing acknowledgments
            outputDiv.textContent += `\n${result.message}`;

        } catch (error) {
            // A timeout on the prompt means the user cancelled (e.g., Ctrl+C)
            this.log.warn('Password change operation cancelled or failed:', error);
            outputDiv.textContent += 'passwd: Operation cancelled.';
        }

        return outputDiv;
    }
}

export { Passwd };