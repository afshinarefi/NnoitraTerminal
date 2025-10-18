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
    #listeners = {};

    constructor(services) {
        super();
        this.#environmentService = services.environment;
        this.#apiService = new ApiService(services, '/server/accounting.py');

        // On initial load, if no user is set (from a restored session), default to guest.
        if (!this.#environmentService.hasVariable('USER')) {
            this.#environmentService.setVariable('USER', 'guest', VAR_CATEGORIES.LOCAL);
        }
    }

    // Override addEventListener to store listeners locally
    addEventListener(type, listener) {
        if (!this.#listeners[type]) this.#listeners[type] = [];
        this.#listeners[type].push(listener);
    }

    /**
     * Checks if a user is currently logged in.
     * @returns {boolean} True if a session token exists.
     */
    isLoggedIn() {
        const token = this.#environmentService.getVariable('TOKEN');
        return !!token; // Ensure it's a boolean and handles empty string case
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
                // First, completely reset the current environment (e.g., clear guest state).
                this.#environmentService.reset();

                log.log('Login successful. Setting session variables.');
                this.#environmentService.setVariable('TOKEN', result.token, VAR_CATEGORIES.LOCAL);
                this.#environmentService.setVariable('USER', result.user, VAR_CATEGORIES.LOCAL);
                this.#environmentService.setVariable('TOKEN_EXPIRY', result.expires_at, VAR_CATEGORIES.LOCAL);
                // Announce that login was successful so other services can react.
                // Wait for the event listeners (like the one in Terminal.js that loads remote data) to complete.
                await this.dispatchEvent('login-success');
            }
            return result;
        } catch (error) {
            log.error('Network or parsing error during login:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    /**
     * Validates the current session token with the backend.
     * This also extends the session's lifetime on the server.
     * @returns {Promise<object>} The result from the server.
     */
    async validateSession() {
        if (!this.isLoggedIn()) {
            log.log('No session to validate.');
            // Return a consistent error format.
            return { status: 'error', message: 'No token found locally.' };
        }
        log.log('Validating session with backend.');
        return this.#apiService.post('validate');
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
        log.log('Clearing local session and resetting environment.');
        // Resetting the environment service will clear all variables and their localStorage entries.
        this.#environmentService.reset();
        // After resetting, explicitly set the user to guest for the new session.
        this.#environmentService.setVariable('USER', 'guest', VAR_CATEGORIES.LOCAL);
        this.dispatchEvent('logout-success');
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
        // Explicitly block any persistence/authenticated requests for the guest user.
        // This is the authoritative check, reinforcing that LoginService owns this logic.
        if (!this.isLoggedIn() || this.#environmentService.getVariable('USER') === 'guest') {
            log.warn(`API call "${action}" blocked: User is guest or not logged in.`);
            return null;
        }
        return this.#apiService.post(action, data);
    }

    /**
     * Custom dispatchEvent that can await async listeners.
     * @param {string} type - The event type.
     * @returns {Promise<void>}
     */
    async dispatchEvent(type) {
        const eventListeners = this.#listeners[type] || [];
        const promises = [];
        for (const listener of eventListeners) {
            const result = listener(); // Assuming listener returns a promise
            if (result instanceof Promise) promises.push(result);
        }
        await Promise.all(promises);
    }
}