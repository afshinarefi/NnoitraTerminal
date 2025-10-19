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
import { createLogger } from './LogManager.js';
import { VAR_CATEGORIES } from './constants.js';
import { ApiManager } from './ApiManager.js';

const log = createLogger('LoginBusService');

// Define constants for hardcoded strings to improve maintainability.
const API_ENDPOINT = '/server/accounting.py';
const VAR_USER = 'USER';
const VAR_TOKEN = 'TOKEN';
const VAR_TOKEN_EXPIRY = 'TOKEN_EXPIRY';
const GUEST_USER = 'guest';

/**
 * @class LoginBusService
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
class LoginBusService {
    #eventBus;
    #eventNames;
    #apiManager;
    #user = GUEST_USER;
    #token = null;

    static EVENTS = {
        PROVIDE_PERSIST_VAR: 'providePersistVar',
        PROVIDE_PERSIST_CMD: 'providePersistCmd',
        PROVIDE_HISTORY_LOAD: 'provideHistoryLoad',
        USE_USER_CHANGED: 'useUserChanged',
        USE_VAR_SET: 'useVarSet',
        USE_VAR_GET: 'useVarGet',
        USE_ENV_RESET: 'useEnvReset',
        LISTEN_VAR_GET_RESPONSE: 'listenVarGetResponse'
    };

    constructor(eventBus, eventNameConfig, services) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
        this.#apiManager = new ApiManager(services, API_ENDPOINT);
        this.#registerListeners();
        log.log('Initializing...');

        // Listen for responses to the initial variable check
        this.#eventBus.listen(this.#eventNames[LoginBusService.EVENTS.LISTEN_VAR_GET_RESPONSE], (payload) => {
            if (payload.key === VAR_USER) this.#user = payload.value || GUEST_USER;
            if (payload.key === VAR_TOKEN) this.#token = payload.value;
        });

        // Request initial state
        this.#eventBus.dispatch(this.#eventNames[LoginBusService.EVENTS.USE_VAR_GET], { key: VAR_USER });
        this.#eventBus.dispatch(this.#eventNames[LoginBusService.EVENTS.USE_VAR_GET], { key: VAR_TOKEN });
    }

    #registerListeners() {
        this.#eventBus.listen(this.#eventNames[LoginBusService.EVENTS.PROVIDE_PERSIST_VAR], (payload) => this.#handlePersistVariable(payload));
        this.#eventBus.listen(this.#eventNames[LoginBusService.EVENTS.PROVIDE_PERSIST_CMD], (payload) => this.#handlePersistCommand(payload));
        // PROVIDE_HISTORY_LOAD listener will be added when that service is refactored.
    }

    isLoggedIn() {
        return !!this.#token;
    }

    async login(username, password) {
        try {
            log.log(`Attempting login for user: "${username}"`);
            const result = await this.#apiManager.post('login', { username, password });

            if (result.status === 'success') {
                this.#eventBus.dispatch(this.#eventNames[LoginBusService.EVENTS.USE_ENV_RESET], {});

                log.log('Login successful. Setting session variables.');
                this.#dispatchSetVariable(VAR_TOKEN, result.token, VAR_CATEGORIES.LOCAL);
                this.#dispatchSetVariable(VAR_USER, result.user, VAR_CATEGORIES.LOCAL);
                this.#dispatchSetVariable(VAR_TOKEN_EXPIRY, result.expires_at, VAR_CATEGORIES.LOCAL);

                this.#eventBus.dispatch(this.#eventNames[LoginBusService.EVENTS.USE_USER_CHANGED], { user: result.user, isLoggedIn: true });
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
            const result = await this.#apiManager.post('logout');
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
        this.#eventBus.dispatch(this.#eventNames[LoginBusService.EVENTS.USE_ENV_RESET], {});
        this.#dispatchSetVariable(VAR_USER, GUEST_USER, VAR_CATEGORIES.LOCAL);
        this.#eventBus.dispatch(this.#eventNames[LoginBusService.EVENTS.USE_USER_CHANGED], { user: GUEST_USER, isLoggedIn: false });
    }

    #dispatchSetVariable(key, value, category) {
        this.#eventBus.dispatch(this.#eventNames[LoginBusService.EVENTS.USE_VAR_SET], { key, value, category });
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
        });
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
        });
    }
}

export { LoginBusService };