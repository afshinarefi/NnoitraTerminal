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
            [EVENTS.VAR_SAVE_REMOTE_REQUEST]: this.#handlePersistVariable.bind(this),
            [EVENTS.COMMAND_PERSIST_REQUEST]: this.#handlePersistCommand.bind(this),
            [EVENTS.HISTORY_LOAD_REQUEST]: this.#handleHistoryLoad.bind(this),
            [EVENTS.LOGIN_REQUEST]: this.#handleLoginRequest.bind(this),
            [EVENTS.LOGOUT_REQUEST]: this.#handleLogoutRequest.bind(this),
            [EVENTS.PASSWORD_CHANGE_REQUEST]: this.#handleChangePasswordRequest.bind(this),
            [EVENTS.ADD_USER_REQUEST]: this.#handleAddUserRequest.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.VAR_LOAD_REMOTE_REQUEST]: this.#handleLoadRemoteVariables.bind(this),
            [EVENTS.VAR_DEL_REMOTE_REQUEST]: this.#handleDeleteRemoteVariable.bind(this),
            [EVENTS.IS_LOGGED_IN_REQUEST]: this.#handleIsLoggedInRequest.bind(this),
        };
    }

    async isLoggedIn() {
        const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
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
                this.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN, value: result.token }); // Set new ones
                this.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.USER, value: result.user });
                this.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN_EXPIRY, value: result.expires_at });

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
            const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
            const result = await this.#apiManager.post('logout', {}, token);
            if (result.status === 'success' || (result.status === 'error' && result.message.includes('expired'))) {
                // Clear local session regardless of backend response if token is expired or logout is successful
                this.dispatch(EVENTS.VAR_DEL_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
                this.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key: ENV_VARS.USER, value: GUEST_USER });
                this.dispatch(EVENTS.VAR_DEL_LOCAL_REQUEST, { key: ENV_VARS.TOKEN_EXPIRY });
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
        const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
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

    #handleUpdateDefaultRequest({ key, respond }) {
        switch (key) {
            case ENV_VARS.USER:
                respond({ value: GUEST_USER });
                break;
            case ENV_VARS.TOKEN:
                respond({ value: '' });
                break;
        }
    }

    async #handlePersistVariable(payload) {
        const { value: user } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.USER });
        if (user === GUEST_USER) {
            const storageKey = `${GUEST_STORAGE_PREFIX}${payload.category}_${payload.key}`;
            const node = { meta: { type: 'variable' }, content: payload.value };
            this.#makeStorageRequest('LOCAL', STORAGE_APIS.SET_NODE, { key: storageKey, node });
        } else {
            const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
            this.#apiManager.post('set_data', {
                category: payload.category,
                key: payload.key,
                value: payload.value,
            }, token);
        }
    }

    async #handleDeleteRemoteVariable(payload) {
        const { value: user } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.USER });
        if (user === GUEST_USER) {
            const storageKey = `${GUEST_STORAGE_PREFIX}${payload.category}_${payload.key}`;
            this.#makeStorageRequest('LOCAL', STORAGE_APIS.DELETE_NODE, { key: storageKey });
        } else {
            const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
            this.#apiManager.post('delete_data', {
                category: payload.category,
                key: payload.key,
            }, token);
        }
    }


    async #handlePersistCommand(payload) {
        
        const { value: user } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.USER });
        // For guest users, we perform a read-modify-write on a single history key.
        if (user === GUEST_USER) {
            const historyKey = `${GUEST_STORAGE_PREFIX}${HISTORY_CATEGORY}`;
            // Acquire a lock to ensure atomicity of the read-modify-write operation.
            const { lockId } = await this.#makeStorageRequest('LOCAL', STORAGE_APIS.LOCK_NODE, { key: historyKey });
            try {
                // Read the existing history array.
                const node = await this.#makeStorageRequest('LOCAL', STORAGE_APIS.GET_NODE, { key: historyKey, lockId });
                const history = node?.content || [];
                // Add the new command.
                history.push(payload.command);
                // Write the updated array back.
                const newNode = { meta: { type: 'history' }, content: history };
                await this.#makeStorageRequest('LOCAL', STORAGE_APIS.SET_NODE, { key: historyKey, node: newNode, lockId });
            } finally {
                // Always release the lock.
                await this.#makeStorageRequest('LOCAL', STORAGE_APIS.UNLOCK_NODE, { key: historyKey, lockId });
            }
        } else {
            // For logged-in users, continue saving each command individually to the remote backend.
            const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
            this.#apiManager.post('set_data', {
                category: HISTORY_CATEGORY,
                key: new Date().toISOString(),
                value: command
            }, token);
        }
    }

    async #handleHistoryLoad({ respond }) {
        const { value: user } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.USER });
        if (user === GUEST_USER) {
            // Read the single history key. This is a read-only operation, so no lock is needed.
            const historyKey = `${GUEST_STORAGE_PREFIX}${HISTORY_CATEGORY}`;
            const node = await this.#makeStorageRequest('LOCAL', STORAGE_APIS.GET_NODE, { key: historyKey });
            const historyArray = node?.content || [];
            if (respond) respond({ history: historyArray });
        } else {
            try {
                const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
                const result = await this.#apiManager.post('get_data', {
                    category: HISTORY_CATEGORY
                }, token);

                this.log.log("History data received from server:", result);
                // The backend returns an object with timestamps as keys. We want the values, sorted by key (timestamp).
                const sortedCommands = Object.keys(result.data || {}).sort().map(key => result.data[key]);

                if (respond) {
                    respond({ history: sortedCommands });
                }
            } catch (error) {
                this.log.error("Failed to load history from server:", error);
                if (respond) respond({ history: [], error });
            }
        }
    }

    async #handleLoadRemoteVariables({ key, category, respond }) {
        const { value: user } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.USER });
        if (user === GUEST_USER) {
            const variables = {};
            const categories = Array.isArray(category) ? category : [category];

            for (const cat of categories) {
                if (key !== undefined) {
                    // This is a read-only operation, so no lock is needed.
                    const storageKey = `${GUEST_STORAGE_PREFIX}${cat}_${key}`;
                    const node = await this.#makeStorageRequest('LOCAL', STORAGE_APIS.GET_NODE, { key: storageKey });
                    const value = node ? node.content : undefined;
                    if (value !== undefined) {
                        variables[key] = value;
                    }
                } else {
                    // This is a read-only operation, so no lock is needed.
                    const prefix = `${GUEST_STORAGE_PREFIX}${cat}_`;
                    const keys = await this.#makeStorageRequest('LOCAL', STORAGE_APIS.LIST_KEYS_WITH_PREFIX, { key: prefix });
                    const catVars = {};
                    for (const storageKey of keys) {
                        const node = await this.#makeStorageRequest('LOCAL', STORAGE_APIS.GET_NODE, { key: storageKey });
                        if (node) {
                            const varName = storageKey.substring(prefix.length);
                            catVars[varName] = node.content;
                        }
                    }
                    if (Array.isArray(category)) {
                        variables[cat] = catVars;
                    } else {
                        Object.assign(variables, catVars);
                    }
                }
            }
            if (respond) respond({ variables });
        } else { // Logged-in user logic remains the same
            try {
                const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });

                const result = await this.#apiManager.post('get_data', {
                    category: category,
                    key: key // Pass key along, though backend might not use it for 'ENV'
                }, token);

                this.log.log("Remote variables received from server:", result);
                if (respond) {
                    respond({ variables: result.data || {} });
                }
            } catch (error) {
                this.log.error("Failed to load remote variables from server:", error);
                if (respond) respond({ variables: {}, error });
            }
        }
    }

    /**
     * Makes a request to a storage backend.
     * @param {string} storageName - The name of the storage service (e.g., 'SESSION').
     * @param {string} api - The API method to call (from STORAGE_APIS).
     * @param {object} data - The data payload for the API method.
     * @returns {Promise<any>}
     * @private
     */
    async #makeStorageRequest(storageName, api, data) {
        const { result, error } = await this.request(EVENTS.STORAGE_API_REQUEST, {
            storageName,
            api,
            data
        });
        if (error) throw error;
        return result;
    }
}

export { AccountingService };