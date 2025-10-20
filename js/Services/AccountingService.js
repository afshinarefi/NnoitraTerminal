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
import { EVENTS } from './Events.js';

const log = createLogger('AccountingService');

// Define constants for hardcoded strings to improve maintainability.
const API_ENDPOINT = '/Server/Accounting.py';
const VAR_USER = 'USER';
const VAR_TOKEN = 'TOKEN';
const VAR_TOKEN_EXPIRY = 'TOKEN_EXPIRY';
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
    #user = GUEST_USER;
    #token = null;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#apiManager = new ApiManager(API_ENDPOINT);
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerListeners() {
        // Listen for responses to the initial variable check
        this.#eventBus.listen(EVENTS.VAR_PERSIST_REQUEST, (payload) => this.#handlePersistVariable(payload));
        this.#eventBus.listen(EVENTS.COMMAND_PERSIST_REQUEST, (payload) => this.#handlePersistCommand(payload));
        this.#eventBus.listen(EVENTS.HISTORY_LOAD_REQUEST, (payload) => this.#handleHistoryLoad(payload));
        this.#eventBus.listen(EVENTS.LOGIN_REQUEST, this.#handleLoginRequest.bind(this));
        this.#eventBus.listen(EVENTS.LOGOUT_REQUEST, this.#handleLogoutRequest.bind(this));
        this.#eventBus.listen(EVENTS.PASSWORD_CHANGE_REQUEST, this.#handleChangePasswordRequest.bind(this));
        this.#eventBus.listen(EVENTS.IS_LOGGED_IN_REQUEST, this.#handleIsLoggedInRequest.bind(this));
    }

    isLoggedIn() {
        return !!this.#token;
    }

    async start() {
        // Request initial state now that all services are listening.
        try {
            const { values } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { keys: [VAR_USER, VAR_TOKEN] });
            this.#handleInitialStateResponse(values);
        } catch (error) {
            log.error("Failed to get initial state from EnvironmentService:", error);
            // If the request fails, proceed with default guest state.
            this.#user = GUEST_USER;
            this.#token = null;
            this.#dispatchSetVariable(VAR_USER, GUEST_USER, VAR_CATEGORIES.LOCAL);
        }
    }

    async login(username, password) {
        try {
            log.log(`Attempting login for user: "${username}"`);
            const result = await this.#apiManager.post('login', { username, password }, null);

            if (result.status === 'success') {
                this.#eventBus.dispatch(EVENTS.ENV_RESET_REQUEST, {});

                log.log('Login successful. Setting session variables.');
                this.#dispatchSetVariable(VAR_TOKEN, result.token, VAR_CATEGORIES.LOCAL);
                this.#dispatchSetVariable(VAR_USER, result.user, VAR_CATEGORIES.LOCAL);
                this.#dispatchSetVariable(VAR_TOKEN_EXPIRY, result.expires_at, VAR_CATEGORIES.LOCAL);

                // Internally store the token for future API calls
                this.#token = result.token;

                this.#eventBus.dispatch(EVENTS.USER_CHANGED_BROADCAST, { user: result.user, isLoggedIn: true });
            }
            return result;
        } catch (error) {
            log.error('Network or parsing error during login:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    async logout() {
        if (!this.isLoggedIn()) {
            this.clearLocalSession();
            return { status: 'success', message: 'Already logged out.' };
        }

        try {
            const result = await this.#apiManager.post('logout', {}, this.#token);
            if (result.status === 'success' || (result.status === 'error' && result.message.includes('expired'))) {
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
        this.#token = null;
        this.#dispatchSetVariable(VAR_USER, GUEST_USER, VAR_CATEGORIES.LOCAL);
        this.#eventBus.dispatch(EVENTS.USER_CHANGED_BROADCAST, { user: GUEST_USER, isLoggedIn: false });
    }

    async #handleLoginRequest({ username, password, respond }) {
        const result = await this.login(username, password);
        respond(result);
    }

    async #handleLogoutRequest({ respond }) {
        const result = await this.logout();
        respond(result);
    }

    async #changePassword(oldPassword, newPassword) {
        if (!this.isLoggedIn()) {
            return { status: 'error', message: 'Not logged in.' };
        }
        try {
            const result = await this.#apiManager.post('change_password', { old_password: oldPassword, new_password: newPassword }, this.#token);
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

    #handleIsLoggedInRequest({ respond }) {
        respond({ isLoggedIn: this.isLoggedIn() });
    }

    #dispatchSetVariable(key, value) {
        // This service only ever sets LOCAL variables.
        this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key, value });
    }

    #handlePersistVariable(payload) {
        if (this.#user === GUEST_USER || !this.isLoggedIn()) {
            log.warn(`Persistence for variable "${payload.key}" blocked: User is guest or not logged in.`);
            return;
        }
        this.#apiManager.post('set_data', {
            category: 'ENV',
            key: payload.key,
            value: payload.value
        }, this.#token);
    }

    #handlePersistCommand(payload) {
        if (this.#user === GUEST_USER || !this.isLoggedIn()) {
            log.warn(`Persistence for command "${payload.command}" blocked: User is guest or not logged in.`);
            return;
        }
        this.#apiManager.post('set_data', {
            category: 'HISTORY',
            key: Date.now(),
            value: payload.command
        }, this.#token);
    }

    async #handleHistoryLoad(payload) {
        if (this.#user === GUEST_USER || !this.isLoggedIn()) {
            log.warn(`History load blocked: User is guest or not logged in.`);
            return;
        }
        const result = await this.#apiManager.post('get_data', {
            category: 'HISTORY'
        }, this.#token);

        // Dispatch a response event that HistoryService will listen for.
        // This part of the flow needs to be completed in HistoryService.
        log.log("History data received from server:", result);
    }

    #handleInitialStateResponse(values) {
        // Handle USER variable
        if (values.hasOwnProperty(VAR_USER) && values[VAR_USER]) {
            this.#user = values[VAR_USER];
        } else {
            this.#user = GUEST_USER;
            // If no user is set, explicitly set the environment to the guest user.
            this.#dispatchSetVariable(VAR_USER, GUEST_USER, VAR_CATEGORIES.LOCAL);
        }

        // Handle TOKEN variable
        this.#token = values[VAR_TOKEN] || null;
    }
}

export { AccountingService };