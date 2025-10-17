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
import { createLogger } from './LogService.js';
import { VAR_CATEGORIES } from './EnvironmentService.js';
import { ApiService } from './ApiService.js';

const log = createLogger('LoginService');

/**
 * @class LoginService
 * @description Handles user authentication, session management, and related environment variables.
 */
export class LoginService extends EventTarget {
    #environmentService;
    #apiService;

    constructor(services) {
        super();
        this.#environmentService = services.environment;
        this.#apiService = new ApiService(services, '/server/accounting.py');
        this.#environmentService.registerVariable('USER', { category: VAR_CATEGORIES.LOCAL, defaultValue: 'guest' });
        this.#environmentService.registerVariable('TOKEN', { category: VAR_CATEGORIES.LOCAL });
        this.#environmentService.registerVariable('TOKEN_EXPIRY', { category: VAR_CATEGORIES.LOCAL });
    }

    /**
     * Checks if a user is currently logged in.
     * @returns {boolean} True if a session token exists.
     */
    isLoggedIn() {
        return this.#environmentService.hasVariable('TOKEN');
    }

    /**
     * Attempts to log in a user with the given credentials.
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise<object>} The result from the server.
     */
    async login(username, password) {
        try {
            log.log(`Attempting login for user: "${username}"`);
            const result = await this.#apiService.post('login', { username, password });

            if (result.status === 'success') {
                log.log('Login successful. Setting session variables.');
                this.#environmentService.setVariable('TOKEN', result.token);
                this.#environmentService.setVariable('USER', result.user);
                this.#environmentService.setVariable('TOKEN_EXPIRY', result.expires_at);
                // Announce that login was successful so other services can react.
                this.dispatchEvent(new CustomEvent('login-success'));
            }
            return result;
        } catch (error) {
            log.error('Network or parsing error during login:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    /**
     * Logs out the current user.
     * @returns {Promise<object>} The result from the server.
     */
    async logout() {
        if (!this.isLoggedIn()) {
            this.clearLocalSession();
            return { status: 'success', message: 'Already logged out.' };
        }

        try {
            log.log('Sending logout request to server.');
            const result = await this.#apiService.post('logout');

            // Always clear local data on logout attempt, unless there was a network failure.
            if (result.status === 'success' || (result.status === 'error' && result.message.includes('expired'))) {
                this.clearLocalSession();
            }
            return result;
        } catch (error) {
            log.error('Network or parsing error during logout:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    /**
     * Clears all local session data (token, user, etc.) and resets to guest state.
     */
    clearLocalSession() {
        log.log('Clearing local session data.');
        this.#environmentService.removeVariable('TOKEN');
        this.#environmentService.removeVariable('TOKEN_EXPIRY');
        this.#environmentService.setVariable('USER', 'guest'); // Reset to default user
        this.#environmentService.clearRemoteVariables(); // Reset remote vars to defaults
        // Announce that the session is cleared so other services can reset.
        this.dispatchEvent(new CustomEvent('logout-success'));
    }

    /**
     * Attempts to add a new user.
     * @param {string} username - The username for the new user.
     * @param {string} password - The password for the new user.
     * @returns {Promise<object>} The result from the server.
     */
    async addUser(username, password) {
        log.log(`Attempting to add user: "${username}"`);
        return this.#apiService.post('useradd', { username, password });
    }

    /**
     * Attempts to change the password for the current user.
     * @param {string} oldPassword - The user's current password.
     * @param {string} newPassword - The desired new password.
     * @returns {Promise<object>} The result from the server.
     */
    async changePassword(oldPassword, newPassword) {
        if (!this.isLoggedIn()) {
            return { status: 'error', message: 'You must be logged in to change your password.' };
        }
        log.log('Attempting to change password for current user.');
        return this.#apiService.post('passwd', {
            old_password: oldPassword,
            new_password: newPassword
        });
    }

    /**
     * Acts as a gateway for making authenticated API calls.
     * It ensures the user is logged in before forwarding the request to the ApiService.
     * @param {string} action - The API action to perform.
     * @param {Object} [data={}] - The data to send with the request.
     * @returns {Promise<object|null>} The JSON response from the server, or null if not logged in.
     */
    async post(action, data = {}) {
        if (!this.isLoggedIn()) {
            log.warn(`API call "${action}" blocked: User not logged in.`);
            return null;
        }
        return this.#apiService.post(action, data);
    }
}