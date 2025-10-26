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
import { ApiManager } from '../Managers/ApiManager.js';
import { ENV_VARS } from '../Core/Variables.js';
import { EVENTS } from '../Core/Events.js';

const log = createLogger('AccountingService');

// Define constants for hardcoded strings to improve maintainability.
const API_ENDPOINT = '/Api/Accounting.py';
const GUEST_USER = 'guest';

/**
 * @class AccountingService
 * @description Handles user authentication and session management via the event bus.
 *
 * @listens for `variable-persist-request` - Handles requests to save environment variables.
 * @listens for `command-persist-request` - Handles requests to save history commands.
 * @listens for `history-load-request` - Handles requests to load remote history.
 *
 * @dispatches `user-changed-broadcast` - When the user logs in or out.
 * @dispatches `variable-set-request` - To set session-related environment variables.
 * @dispatches `variable-get-request` - To get session-related environment variables.
 * @dispatches `environment-reset-request` - To reset the environment service.
 */
class AccountingService {
    #eventBus;
    #apiManager;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#apiManager = new ApiManager(API_ENDPOINT);
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerListeners() {
        // Listen for responses to the initial variable check
        this.#eventBus.listen(EVENTS.VAR_PERSIST_REQUEST, (payload) => this.#handlePersistVariable(payload), this.constructor.name);
        this.#eventBus.listen(EVENTS.COMMAND_PERSIST_REQUEST, (payload) => this.#handlePersistCommand(payload), this.constructor.name);
        this.#eventBus.listen(EVENTS.HISTORY_LOAD_REQUEST, (payload) => this.#handleHistoryLoad(payload), this.constructor.name);
        this.#eventBus.listen(EVENTS.LOGIN_REQUEST, this.#handleLoginRequest.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.LOGOUT_REQUEST, this.#handleLogoutRequest.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.PASSWORD_CHANGE_REQUEST, this.#handleChangePasswordRequest.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.ADD_USER_REQUEST, this.#handleAddUserRequest.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, this.#handleUpdateDefaultRequest.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.VAR_LOAD_REMOTE_REQUEST, this.#handleLoadRemoteVariables.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.IS_LOGGED_IN_REQUEST, this.#handleIsLoggedInRequest.bind(this), this.constructor.name);
    }

    async isLoggedIn() {
        const token = await this.#getEnvVariable(ENV_VARS.TOKEN);
        return !!token;
    }

    async start() {
        // Request initial state now that all services are listening.
        await this.validateSession();
    }

    async login(username, password) {
        try {
            log.log(`Attempting login for user: "${username}"`);
            const result = await this.#apiManager.post('login', { username, password }, null);

            if (result.status === 'success') {
                this.#eventBus.dispatch(EVENTS.ENV_RESET_REQUEST, {});

                log.log('Login successful. Setting session variables.');
                this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN, value: result.token });
                this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.USER, value: result.user });
                this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN_EXPIRY, value: result.expires_at });

                this.#eventBus.dispatch(EVENTS.USER_CHANGED_BROADCAST, { user: result.user, isLoggedIn: true });
            }
            return result;
        } catch (error) {
            log.error('Network or parsing error during login:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    async logout() {
        if (!(await this.isLoggedIn())) {
            this.clearLocalSession();
            return { status: 'success', message: 'Already logged out.' };
        }

        try {
            const token = await this.#getEnvVariable(ENV_VARS.TOKEN);
            const result = await this.#apiManager.post('logout', {}, token);
            if (result.status === 'success' || (result.status === 'error' && result.message.includes('expired'))) {
                // Clear local session regardless of backend response if token is expired or logout is successful
                this.clearLocalSession(); 
            }
            return result;
        } catch (error) {
            log.error('Network or parsing error during logout:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    clearLocalSession() {
        log.log('Clearing local session and resetting environment.');
        this.#eventBus.dispatch(EVENTS.ENV_RESET_REQUEST, {});
        this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN, value: '' });
        this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN_EXPIRY, value: '' });
        this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.USER, value: GUEST_USER });
        this.#eventBus.dispatch(EVENTS.USER_CHANGED_BROADCAST, { user: GUEST_USER, isLoggedIn: false });
    }

    async validateSession() {
        try {
            const user = await this.#getEnvVariable(ENV_VARS.USER);
            const token = await this.#getEnvVariable(ENV_VARS.TOKEN);

            if (token && user && user !== GUEST_USER) {
                log.log(`Found token for user "${user}". Validating session...`);
                const result = await this.#apiManager.post('validate', { token }, token); // Pass token for auth

                if (result.status === 'success') {
                    log.log('Session is valid. User is logged in.');
                    // Ensure environment variables are set (they should be if we fetched them)
                    this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN, value: token });
                    this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.USER, value: user });
                    this.#eventBus.dispatch(EVENTS.USER_CHANGED_BROADCAST, { user: user, isLoggedIn: true });
                    return;
                }
                // If validation fails, clear the session.
                log.warn('Session validation failed or token expired. Clearing local session.');
                this.clearLocalSession(); // This will broadcast the user change to guest.

            } else {
                log.log('No active session found. Operating as guest.');
                this.clearLocalSession();
            }
        } catch (error) {
            log.error("Error during session validation:", error);
            this.clearLocalSession();
        }
    }

    async #getEnvVariable(key) {
        const { values } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { key });
        return values ? values[key] : undefined;
    }
    
    async #handleLoginRequest({ username, password, respond }) {
        const result = await this.login(username, password);
        respond(result);
    }

    async #handleLogoutRequest({ respond }) {
        const result = await this.logout();
        respond(result);
    }

    async #addUser(username, password) {
        try {
            const result = await this.#apiManager.post('add_user', { username, password });
            return result;
        } catch (error) {
            log.error('Network or parsing error during user creation:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    async #handleAddUserRequest({ username, password, respond }) {
        const result = await this.#addUser(username, password);
        respond(result);
    }

    async #changePassword(oldPassword, newPassword) {
        const token = await this.#getEnvVariable(ENV_VARS.TOKEN);
        if (!token) {
            return { status: 'error', message: 'Not logged in.' };
        }
        try {
            log.log('Attempting password change...');
            log.log('Old password:', oldPassword);
            log.log('New password:', newPassword);
            const result = await this.#apiManager.post('change_password', { old_password: oldPassword, new_password: newPassword }, token);
            return result;
        } catch (error) {
            log.error('Network or parsing error during password change:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    async #handleChangePasswordRequest({ oldPassword, newPassword, respond }) {
        const result = await this.#changePassword(oldPassword, newPassword);
        respond(result);
    }

    async #handleIsLoggedInRequest({ respond }) {
        const loggedIn = await this.isLoggedIn();
        respond({ isLoggedIn: loggedIn });
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        switch (key) {
            case ENV_VARS.USER:
                this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.USER, value: GUEST_USER });
                respond({ value: GUEST_USER });
                break;
            case ENV_VARS.TOKEN:
                this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN, value: '' });
                respond({ value: '' });
                break;
        }
    }

    async #handlePersistVariable(payload) {
        const user = await this.#getEnvVariable(ENV_VARS.USER);
        if (user === GUEST_USER || !(await this.isLoggedIn())) {
            log.warn(`Persistence for variable "${payload.key}" blocked: User is guest or not logged in.`);
            return;
        }
        const token = await this.#getEnvVariable(ENV_VARS.TOKEN);
        this.#apiManager.post('set_data', {
            category: payload.category,
            key: payload.key,
            value: payload.value
        }, token);
    }

    async #handlePersistCommand(payload) {
        const user = await this.#getEnvVariable(ENV_VARS.USER);
        if (user === GUEST_USER || !(await this.isLoggedIn())) {
            log.warn(`Persistence for command "${payload.command}" blocked: User is guest or not logged in.`);
            return;
        }
        const token = await this.#getEnvVariable(ENV_VARS.TOKEN);
        this.#apiManager.post('set_data', {
            category: 'HISTORY',
            key: Date.now(),
            value: payload.command
        }, token);
    }

    async #handleHistoryLoad({ respond }) {
        const user = await this.#getEnvVariable(ENV_VARS.USER);
        if (user === GUEST_USER || !(await this.isLoggedIn())) {
            log.warn('History load blocked: User is guest or not logged in.');
            if (respond) respond({ history: [] });
            return;
        }
        try {
            const token = await this.#getEnvVariable(ENV_VARS.TOKEN);
            const result = await this.#apiManager.post('get_data', {
                category: 'HISTORY'
            }, token);

            log.log("History data received from server:", result);
            if (respond) {
                respond({ history: result.data || [] });
            }
        } catch (error) {
            log.error("Failed to load history from server:", error);
            if (respond) respond({ history: [], error });
        }
    }

    async #handleLoadRemoteVariables({ respond }) {
        const user = await this.#getEnvVariable(ENV_VARS.USER);
        if (user === GUEST_USER || !(await this.isLoggedIn())) {
            log.warn('Remote variable load blocked: User is guest or not logged in.');
            if (respond) respond({ variables: {} });
            return;
        }
        try {
            const token = await this.#getEnvVariable(ENV_VARS.TOKEN);
            const result = await this.#apiManager.post('get_data', {
                category: 'ENV' // Special category to get all env vars
            }, token);

            log.log("Remote variables received from server:", result);
            if (respond) {
                respond({ variables: result.data || {} });
            }
        } catch (error) {
            log.error("Failed to load remote variables from server:", error);
            if (respond) respond({ variables: {}, error });
        }
    }
}

export { AccountingService };