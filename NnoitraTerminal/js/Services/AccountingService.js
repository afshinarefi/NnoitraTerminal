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
import { ApiManager } from '../Managers/ApiManager.js';
import { ENV_VARS } from '../Core/Variables.js';
import { EVENTS } from '../Core/Events.js';
import { STORAGE_APIS } from '../Core/StorageApis.js';
import { BaseService } from '../Core/BaseService.js';

// Define constants for hardcoded strings to improve maintainability.
const GUEST_USER = 'guest';
const GUEST_STORAGE_PREFIX = 'GUEST_STORAGE_';
const HISTORY_CATEGORY = 'HISTORY';

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
class AccountingService extends BaseService {
    #apiManager;

    constructor(eventBus, config = {}) {
        super(eventBus);
        this.#apiManager = new ApiManager(config.apiUrl);
        this.log.log('Initializing...');
    }

    get eventHandlers() {
        return {
            [EVENTS.LOGIN_REQUEST]: this.#handleLoginRequest.bind(this),
            [EVENTS.LOGOUT_REQUEST]: this.#handleLogoutRequest.bind(this),
            [EVENTS.PASSWORD_CHANGE_REQUEST]: this.#handleChangePasswordRequest.bind(this),
            [EVENTS.ADD_USER_REQUEST]: this.#handleAddUserRequest.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.IS_LOGGED_IN_REQUEST]: this.#handleIsLoggedInRequest.bind(this),
        };
    }

    async isLoggedIn() {
        const { value: token } = await this.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.TOKEN, category: 'LOCAL' });
        return !!token;
    }

    async start() {
        // On startup, broadcast the initial login state. This allows services
        // like HistoryService to load remote data for a logged-in user on page refresh.
        this.dispatch(EVENTS.USER_CHANGED_BROADCAST);
    }

    async login(username, password) {
        try {
            this.log.log(`Attempting login for user: "${username}"`);
            const result = await this.#apiManager.post('login', { username, password }, null);

            if (result.status === 'success') {

                this.log.log('Login successful. Setting session variables.');
                this.dispatch(EVENTS.VAR_SET_REQUEST, { key: ENV_VARS.TOKEN, value: result.token, category: 'LOCAL' }); // Set new ones
                this.dispatch(EVENTS.VAR_SET_REQUEST, { key: ENV_VARS.USER, value: result.user, category: 'LOCAL' });
                this.dispatch(EVENTS.VAR_SET_REQUEST, { key: ENV_VARS.TOKEN_EXPIRY, value: result.expires_at, category: 'LOCAL' });

                this.dispatch(EVENTS.USER_CHANGED_BROADCAST);
            }
            return result;
        } catch (error) {
            this.log.error('Network or parsing error during login:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    async logout() {
        try {
            const { value: token } = await this.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.TOKEN, category: 'LOCAL' });
            const result = await this.#apiManager.post('logout', {}, token);
            if (result.status === 'success' || (result.status === 'error' && result.message.includes('expired'))) {
                // Clear local session regardless of backend response if token is expired or logout is successful
                this.dispatch(EVENTS.VAR_DEL_REQUEST, { key: ENV_VARS.TOKEN, category: 'LOCAL' });
                this.dispatch(EVENTS.VAR_SET_REQUEST, { key: ENV_VARS.USER, value: GUEST_USER, category: 'LOCAL' });
                this.dispatch(EVENTS.VAR_DEL_REQUEST, { key: ENV_VARS.TOKEN_EXPIRY, category: 'LOCAL' });
                this.dispatch(EVENTS.USER_CHANGED_BROADCAST);
            }
            return result;
        } catch (error) {
            this.log.error('Network or parsing error during logout:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
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
            this.log.error('Network or parsing error during user creation:', error);
            return { status: 'error', message: `Error: ${error.message}` };
        }
    }

    async #handleAddUserRequest({ username, password, respond }) {
        const result = await this.#addUser(username, password);
        respond(result);
    }

    async #changePassword(oldPassword, newPassword) {
        const { value: token } = await this.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.TOKEN, category: 'LOCAL' });
        if (!token) {
            return { status: 'error', message: 'Not logged in.' };
        }
        try {
            this.log.log('Attempting password change...');
            this.log.log('Old password:', oldPassword);
            this.log.log('New password:', newPassword);
            const result = await this.#apiManager.post('change_password', { old_password: oldPassword, new_password: newPassword }, token);
            return result;
        } catch (error) {
            this.log.error('Network or parsing error during password change:', error);
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

    async #handleUpdateDefaultRequest({ key, respond }) {
        switch (key) {
            case ENV_VARS.USER:
                respond({ value: GUEST_USER });
                break;
            case ENV_VARS.TOKEN:
                respond({ value: '' });
                break;
            case ENV_VARS.HOME:
                // The HOME directory depends on the current user.
                respond({ value: `/home/${GUEST_USER}` });
                break;
        }
    }

}

export { AccountingService };