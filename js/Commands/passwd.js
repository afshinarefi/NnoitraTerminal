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
const log = createLogger('passwd');

/**
 * @class Passwd
 * @description Implements the 'passwd' command for changing a user's password.
 */
class Passwd {
    static DESCRIPTION = 'Change user password.';

    #prompt;
    #loginService;

    constructor(services) {
        this.#prompt = services.prompt;
        this.#loginService = services.login;
        log.log('Initializing...');
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
     * @param {object} services - A collection of all services.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(services) {
        return services.login.isLoggedIn();
    }

    async execute(args) {
        log.log('Executing...');
        const outputDiv = document.createElement('div');

        try {
            const oldPassword = await this.#prompt.read('Old password', true);
            if (oldPassword === null) { // User cancelled with Ctrl+C
                outputDiv.textContent = 'passwd: Operation cancelled.';
                return outputDiv;
            }

            const newPassword = await this.#prompt.read('New password', true);
            if (newPassword === null) {
                outputDiv.textContent = 'passwd: Operation cancelled.';
                return outputDiv;
            }

            const confirmPassword = await this.#prompt.read('Confirm new password', true);
            if (confirmPassword === null) {
                outputDiv.textContent = 'passwd: Operation cancelled.';
                return outputDiv;
            }

            if (newPassword !== confirmPassword) {
                outputDiv.textContent = 'passwd: Passwords do not match. Password not changed.';
                return outputDiv;
            }

            const result = await this.#loginService.changePassword(oldPassword, newPassword);
            outputDiv.textContent = result.message;

        } catch (error) {
            log.error('Error during password change:', error);
            outputDiv.textContent = 'passwd: An unexpected error occurred.';
        }

        return outputDiv;
    }
}

export { Passwd };