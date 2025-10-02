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
/**
 * @class Logout
 * @description Implements the 'logout' command to end a user session.
 */
class Logout {
    static DESCRIPTION = 'Log out of the current session.';

    #environmentService;
    #historyService;

    constructor(services) {
        this.#environmentService = services.environment;
        this.#historyService = services.history;
    }

    static man() {
        return `NAME\n       logout - Log out of the system.\n\nSYNOPSIS\n       logout\n\nDESCRIPTION\n       Ends the current user session.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return [];
    }

    /**
     * Determines if the command is available in the current context.
     * @param {object} services - A collection of all services.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(services) {
        return services.environment.hasVariable('TOKEN');
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        const token = this.#environmentService.getVariable('TOKEN');

        // If there's no token, we are already logged out.
        // Ensure the state is clean and inform the user.
        if (!token) {
            this.#environmentService.removeVariable('TOKEN');
            this.#environmentService.removeVariable('TOKEN_EXPIRY');
            this.#environmentService.setVariable('USER', 'guest');
            outputDiv.textContent = 'Already logged out.';
            return outputDiv;
        }

        const formData = new FormData();
        formData.append('token', token);

        try {
            const response = await fetch('/server/accounting.py?action=logout', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            outputDiv.textContent = result.message;

            // Always clear the local session on logout, even if the server reports the token was already expired.
            // The only time we don't clear is on a network failure.
            if (result.status === 'success' || (result.status === 'error' && result.message.includes('expired'))) {
                this.#environmentService.removeVariable('TOKEN');
                this.#environmentService.removeVariable('TOKEN_EXPIRY');
                this.#environmentService.setVariable('USER', 'guest'); // Reset to default user
                this.#environmentService.clearRemoteVariables(); // Reset remote vars to defaults
                this.#historyService.clearHistory(); // Clear the history from memory
            }
        } catch (error) {
            outputDiv.textContent = `Error during logout: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Logout };