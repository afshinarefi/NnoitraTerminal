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
 * @class Logout
 * @description Implements the 'logout' command to end a user session.
 */
class Logout extends BaseCommand {
    static DESCRIPTION = 'Log out of the current session.';

    #logout;

    constructor(services) {
        super(services);
        this.#logout = this.services.logout;
    }

    static man() {
        return `NAME\n       logout - Log out of the system.\n\nSYNOPSIS\n       logout\n\nDESCRIPTION\n       Ends the current user session.`;
    }

    /**
     * Determines if the command is available in the current context.
     * @param {object} context - The current application context.
     * @param {boolean} context.isLoggedIn - Whether a user is currently logged in.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(context) {
        return context.isLoggedIn;
    }

    async execute(args) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        try {
            const result = await this.#logout();
            outputDiv.textContent = result.message;
        } catch (error) {
            this.log.error('Network or parsing error during logout:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Logout };