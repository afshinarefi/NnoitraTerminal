(() => {

function $parcel$extendImportMap(map) {
  Object.assign(parcelRequire.i ??= {}, map);
}

var $parcel$bundleURL;
function $parcel$resolve(url) {
  url = parcelRequire.i?.[url] || url;
  if (!$parcel$bundleURL) {
    try {
      throw new Error();
    } catch (err) {
      var matches = ('' + err.stack).match(
        /(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g,
      );
      if (matches) {
        $parcel$bundleURL = matches[0];
      } else {
        return $parcel$distDir + url;
      }
    }
  }
  return new URL($parcel$distDir + url, $parcel$bundleURL).toString();
}

      var $parcel$global = globalThis;
    var $parcel$distDir = "./";

var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire166b"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire166b"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
var $e415f539f646a2f9$exports = {};
$parcel$extendImportMap({
    "H44nx": "motd.6d76bb23.txt",
    "ccCIq": "version.f0799af7.txt",
    "euAS4": "UbuntuMono-R.54fdcd79.ttf",
    "4acmQ": "UbuntuMono-B.1f21d913.ttf",
    "jRB9m": "UbuntuMono-RI.0df7809e.ttf",
    "6rugH": "UbuntuMono-BI.2127d1cf.ttf"
});

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
 */ // By importing the Terminal component, we ensure its custom element is defined.
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
 */ /**
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
 */ /**
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
 */ /**
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
 */ /**
 * @description A set of categories to enable for logging.
 * To disable all logging, make this set empty: `new Set()`.
 * To enable all logging, you can use a special '*' value or list all categories.
 * Example categories: 'FS', 'CommandService', 'Autocomplete', 'Terminal'
 */ const $ffd8896b0637a9c5$var$ACTIVE_LOG_CATEGORIES = new Map([
    // --- Services ---
    [
        'EventBus',
        true
    ],
    [
        'EnvironmentService',
        true
    ],
    [
        'AccountingService',
        true
    ],
    [
        'CommandService',
        true
    ],
    [
        'FilesystemService',
        true
    ],
    [
        'HistoryService',
        true
    ],
    [
        'HintService',
        true
    ],
    [
        'InputService',
        true
    ],
    [
        'TerminalService',
        true
    ],
    [
        'ThemeService',
        true
    ],
    [
        'FaviconService',
        true
    ],
    [
        'LocalStorageService',
        true
    ],
    [
        'AutocompleteService',
        true
    ],
    // --- Components ---
    [
        'TerminalPrompt',
        false
    ],
    [
        'TerminalSymbol',
        false
    ],
    [
        'HintBox',
        false
    ],
    [
        'Terminal',
        false
    ],
    [
        'CommandBlock',
        false
    ],
    // --- Commands ---
    [
        'login',
        false
    ],
    [
        'logout',
        false
    ],
    [
        'ls',
        false
    ],
    [
        'cat',
        false
    ],
    [
        'env',
        true
    ],
    [
        'history',
        false
    ],
    [
        'history',
        true
    ],
    [
        'cd',
        true
    ],
    [
        'view',
        true
    ]
]);
const $ffd8896b0637a9c5$var$noop = ()=>{}; // The no-operation function.
const $ffd8896b0637a9c5$var$loggerCache = new Map();
function $ffd8896b0637a9c5$export$fe2e61603b61130d(category) {
    if ($ffd8896b0637a9c5$var$loggerCache.has(category)) return $ffd8896b0637a9c5$var$loggerCache.get(category);
    const isEnabled = $ffd8896b0637a9c5$var$ACTIVE_LOG_CATEGORIES.get(category) || false;
    const logger = {
        log: isEnabled ? console.log.bind(console, `[${category}]`) : $ffd8896b0637a9c5$var$noop,
        warn: isEnabled ? console.warn.bind(console, `[${category}]`) : $ffd8896b0637a9c5$var$noop,
        error: isEnabled ? console.error.bind(console, `[${category}]`) : $ffd8896b0637a9c5$var$noop
    };
    $ffd8896b0637a9c5$var$loggerCache.set(category, logger);
    return logger;
}


const $9919a9f5491eef72$var$log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)('EventBus');
/**
 * @class EventBusService
 * @description A simple, central event bus for decoupled communication between services.
 */ class $9919a9f5491eef72$export$5087227eb54526 {
    #listeners = new Map();
    #pendingRequests = new Map();
    constructor(){
        $9919a9f5491eef72$var$log.log('Initializing...');
    }
    /**
     * Registers a listener for an event.
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} callback - The function to execute when the event is dispatched.
     * @param {string} [listenerName='anonymous'] - The name of the service or component listening.
     */ listen(eventName, callback, listenerName = 'anonymous') {
        if (!this.#listeners.has(eventName)) this.#listeners.set(eventName, []);
        this.#listeners.get(eventName).push({
            callback: callback,
            name: listenerName
        });
    }
    /**
     * Dispatches an event to all registered listeners.
     * @param {string} eventName - The name of the event to dispatch.
     * @param {*} [payload] - The data to pass to the listeners.
     */ dispatch(eventName, payload) {
        $9919a9f5491eef72$var$log.log(`Dispatching event "${eventName}" with payload: ${JSON.stringify(payload)}`);
        if (this.#listeners.has(eventName)) // Schedule the execution of listeners asynchronously.
        // This allows the dispatch method to return immediately (fire-and-forget).
        Promise.resolve().then(async ()=>{
            // We get the list of listeners at the time of execution.
            const listeners = this.#listeners.get(eventName);
            if (listeners) // Execute each listener in its own asynchronous microtask.
            // This prevents one listener from blocking another.                    
            listeners.forEach((listener)=>{
                // We don't await here. This ensures each listener is
                // invoked independently.
                $9919a9f5491eef72$var$log.log(`Dispatching event "${eventName}" to listener "${listener.name}"`);
                Promise.resolve().then(()=>listener.callback(payload));
            });
        });
    }
    /**
     * Dispatches a request and returns a promise that resolves with the response.
     * The dispatched event payload will be augmented with a `respond` function.
     * @param {string} eventName - The name of the request event to dispatch.
     * @param {*} payload - The data for the request.
     * @param {number} [timeout=5000] - Timeout in milliseconds.
     * @returns {Promise<any>} A promise that resolves with the response payload.
     */ request(eventName, payload = {}, timeout = 6000) {
        const correlationId = `${eventName}-${Date.now()}-${Math.random()}`;
        return new Promise((resolve, reject)=>{
            // Store the promise handlers
            this.#pendingRequests.set(correlationId, {
                resolve: resolve,
                reject: reject
            });
            // Set up a timeout to reject the promise if no response is received
            let timeoutId = null;
            if (timeout > 0) timeoutId = setTimeout(()=>{
                if (this.#pendingRequests.has(correlationId)) {
                    this.#pendingRequests.get(correlationId).reject(new Error(`Request timed out for event "${eventName} with payload: ${JSON.stringify(payload)}"`));
                    this.#pendingRequests.delete(correlationId);
                }
            }, timeout);
            // Create the payload for the dispatched event, including the `respond` function
            const requestPayload = {
                ...payload,
                respond: (responsePayload)=>{
                    if (this.#pendingRequests.has(correlationId)) {
                        if (timeoutId) clearTimeout(timeoutId); // Clear the timeout since we got a response
                        $9919a9f5491eef72$var$log.log(`Response received for event "${eventName}": ${JSON.stringify(responsePayload)}`);
                        this.#pendingRequests.get(correlationId).resolve(responsePayload);
                        this.#pendingRequests.delete(correlationId);
                        return true; // Response was successfully delivered
                    }
                    // The request timed out or was already fulfilled.
                    return false;
                }
            };
            this.dispatch(eventName, requestPayload);
        });
    }
}


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
 */ // Define constants for hardcoded strings to improve maintainability.
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
 */ /**
 * @description Central repository for all event names used in the application's event bus.
 */ const $e7af321b64423fde$export$fa3d5b535a2458a1 = {
    // Environment
    GET_ALL_CATEGORIZED_VARS_REQUEST: 'get-all-categorized-vars-request',
    VAR_EXPORT_REQUEST: 'variable-export-request',
    VAR_GET_LOCAL_REQUEST: 'variable-get-local-request',
    VAR_GET_SYSTEM_REQUEST: 'variable-get-system-request',
    VAR_GET_TEMP_REQUEST: 'variable-get-temp-request',
    VAR_GET_USERSPACE_REQUEST: 'variable-get-userspace-request',
    VAR_SET_LOCAL_REQUEST: 'variable-set-local-request',
    VAR_SET_SYSTEM_REQUEST: 'variable-set-system-request',
    VAR_SET_TEMP_REQUEST: 'variable-set-temp-request',
    VAR_SET_USERSPACE_REQUEST: 'variable-set-userspace-request',
    VAR_DEL_LOCAL_REQUEST: 'variable-delete-local-request',
    VAR_DEL_SYSTEM_REQUEST: 'variable-delete-system-request',
    VAR_DEL_TEMP_REQUEST: 'variable-delete-temp-request',
    VAR_DEL_USERSPACE_REQUEST: 'variable-delete-userspace-request',
    // Local Storage
    LOAD_LOCAL_VAR: 'load-local-variable',
    RESET_LOCAL_VAR: 'reset-local-variable',
    SAVE_LOCAL_VAR: 'save-local-variable',
    DELETE_LOCAL_VAR: 'delete-local-variable',
    // Accounting & User
    VAR_UPDATE_DEFAULT_REQUEST: 'variable-update-default-request',
    USER_CHANGED_BROADCAST: 'user-changed-broadcast',
    LOGIN_REQUEST: 'login-request',
    LOGOUT_REQUEST: 'logout-request',
    PASSWORD_CHANGE_REQUEST: 'password-change-request',
    ADD_USER_REQUEST: 'add-user-request',
    IS_LOGGED_IN_REQUEST: 'is-logged-in-request',
    VAR_SAVE_REMOTE_REQUEST: 'variable-save-remote-request',
    VAR_LOAD_REMOTE_REQUEST: 'variable-load-remote-request',
    VAR_DEL_REMOTE_REQUEST: 'variable-delete-remote-request',
    // History
    HISTORY_PREVIOUS_REQUEST: 'history-previous-request',
    HISTORY_NEXT_REQUEST: 'history-next-request',
    HISTORY_INDEXED_RESPONSE: 'history-indexed-response',
    HISTORY_LOAD_REQUEST: 'history-load-request',
    HISTORY_GET_ALL_REQUEST: 'history-get-all-request',
    COMMAND_PERSIST_REQUEST: 'command-persist-request',
    // Command & Execution
    COMMAND_EXECUTE_BROADCAST: 'command-execute-broadcast',
    COMMAND_EXECUTION_FINISHED_BROADCAST: 'command-execution-finished-broadcast',
    AUTOCOMPLETE_REQUEST: 'autocomplete-request',
    AUTOCOMPLETE_BROADCAST: 'autocomplete-broadcast',
    GET_AUTOCOMPLETE_SUGGESTIONS_REQUEST: 'get-autocomplete-suggestions-request',
    GET_ALIASES_REQUEST: 'get-aliases-request',
    SET_ALIASES_REQUEST: 'set-aliases-request',
    GET_COMMAND_LIST_REQUEST: 'get-command-list-request',
    GET_COMMAND_META_REQUEST: 'get-command-meta-request',
    // Input
    INPUT_REQUEST: 'input-request',
    // UI
    CLEAR_SCREEN_REQUEST: 'clear-screen-request',
    THEME_CHANGED_BROADCAST: 'theme-changed-broadcast',
    UI_SCROLL_TO_BOTTOM_REQUEST: 'ui-scroll-to-bottom-request',
    SET_THEME_REQUEST: 'set-theme-request',
    GET_VALID_THEMES_REQUEST: 'get-valid-themes-request',
    MEDIA_REQUEST: 'media-request',
    // Filesystem
    FS_CHANGE_DIRECTORY_REQUEST: 'fs-change-directory-request',
    FS_IS_DIR_REQUEST: 'fs-is-directory-request',
    FS_GET_DIRECTORY_CONTENTS_REQUEST: 'fs-get-directory-contents-request',
    FS_READ_FILE_REQUEST: 'fs-read-file-request',
    FS_WRITE_FILE_REQUEST: 'fs-write-file-request',
    FS_DELETE_FILE_REQUEST: 'fs-delete-file-request',
    FS_MAKE_DIRECTORY_REQUEST: 'fs-make-directory-request',
    FS_REMOVE_DIRECTORY_REQUEST: 'fs-remove-directory-request',
    FS_GET_PUBLIC_URL_REQUEST: 'fs-get-public-url-request',
    FS_RESOLVE_PATH_REQUEST: 'fs-resolve-path-request',
    // Unified Storage API
    STORAGE_API_REQUEST: 'storage-api-request'
};


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
/**
 * @class BaseService
 * @description Provides a foundational class for all services. It automates
 * the setup of the event bus, logger, and event listener registration.
 */ class $6684178f93132198$export$3b34f4e23c444fa8 {
    #eventBus;
    #log;
    constructor(eventBus){
        if (!eventBus) throw new Error('BaseService requires an eventBus.');
        this.#eventBus = eventBus;
        this.#log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)(this.constructor.name);
        this.log.log('Initializing...');
    }
    /**
     * Factory method to create and initialize a service instance.
     * This ensures the instance is fully constructed before `start()` is called,
     * resolving initialization order issues with private fields in child classes.
     * @param {EventBus} eventBus The application's event bus.
     * @returns {this} A new, initialized instance of the service.
     */ static create(eventBus, config = {}) {
        const instance = new this(eventBus, config);
        instance.#registerListeners();
        return instance;
    }
    /**
     * Child classes can override this method to perform specific startup logic
     * after all services have been constructed and listeners are registered.
     * This method is called by the main application entry point.
     */ start() {
    // To be overridden by child classes for post-initialization logic.
    }
    get log() {
        return this.#log;
    }
    /**
     * Dispatches an event on the event bus.
     * @param {string} eventName - The name of the event to dispatch.
     * @param {object} [payload] - The data to send with the event.
     */ dispatch(eventName, payload = {}) {
        this.#eventBus.dispatch(eventName, payload);
    }
    /**
     * Sends a request on the event bus and awaits a response.
     * @param {string} eventName - The name of the request event.
     * @param {object} [payload] - The data to send with the request.
     * @returns {Promise<any>} A promise that resolves with the response.
     */ request(eventName, payload, timeout = 0) {
        return this.#eventBus.request(eventName, payload, timeout);
    }
    /**
     * Child classes must override this getter to return a map of event names
     * to their corresponding handler methods. The handlers will be automatically
     * bound and registered.
     * @returns {Object.<string, Function>}
     */ get eventHandlers() {
        return {};
    }
    #registerListeners() {
        const handlers = this.eventHandlers;
        for (const [eventName, handler] of Object.entries(handlers))this.#eventBus.listen(eventName, handler, this.constructor.name);
    }
}


const $1b934ed4cb64b454$var$TEMP_NAMESPACE = 'TEMP';
const $1b934ed4cb64b454$var$LOCAL_NAMESPACE = 'LOCAL';
const $1b934ed4cb64b454$var$ENV_NAMESPACE = 'ENV';
const $1b934ed4cb64b454$var$SYSTEM_NAMESPACE = 'SYSTEM';
const $1b934ed4cb64b454$var$USERSPACE_NAMESPACE = 'USERSPACE';
class $1b934ed4cb64b454$export$e4a82699f51b6a33 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    #tempVariables = new Map();
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_ALL_CATEGORIZED_VARS_REQUEST]: this.#handleGetAllCategorized.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).USER_CHANGED_BROADCAST]: this.#handleUserChanged.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_LOCAL_REQUEST]: this.#handleGetLocalVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_SYSTEM_REQUEST]: this.#handleGetSystemVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST]: this.#handleGetTempVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_USERSPACE_REQUEST]: this.#handleGetUserSpaceVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_LOCAL_REQUEST]: this.#handleSetLocalVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_SYSTEM_REQUEST]: this.#handleSetVariableRemote.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_TEMP_REQUEST]: this.#handleSetTempVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_USERSPACE_REQUEST]: this.#handleSetVariableUserspace.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_LOCAL_REQUEST]: this.#handleDeleteLocalVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_SYSTEM_REQUEST]: this.#handleDeleteSystemVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_TEMP_REQUEST]: this.#handleDeleteTempVariable.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_USERSPACE_REQUEST]: this.#handleDeleteUserspaceVariable.bind(this)
        };
    }
    start() {
    // No longer loading from storage at startup. This is now lazy.
    // No startup logic needed.
    }
    async #handleGetTempVariable({ key: key, respond: respond }) {
        const upperKey = key.toUpperCase();
        let value = this.#tempVariables.get(upperKey);
        if (value === undefined) {
            this.log.log(`Temp variable "${upperKey}" is undefined, requesting its default value.`);
            const response = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST, {
                key: upperKey
            });
            value = response.value;
            // The owner provides the default, and we set it here.
            if (value !== undefined) this.#setTempVariable(upperKey, value);
        }
        respond({
            value: value
        });
    }
    async #handleGetLocalVariable({ key: key, respond: respond }) {
        const upperKey = key.toUpperCase();
        const filePath = `/var/local/${$1b934ed4cb64b454$var$ENV_NAMESPACE}/${upperKey}`;
        try {
            const { contents: contents } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_READ_FILE_REQUEST, {
                path: filePath
            });
            respond({
                value: contents
            });
        } catch (error) {
            // If file not found, get default and write it.
            this.log.log(`Local variable file "${filePath}" not found, requesting default value.`);
            const { value: value } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST, {
                key: upperKey
            });
            if (value !== undefined) await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_WRITE_FILE_REQUEST, {
                path: filePath,
                content: value
            });
            respond({
                value: value
            });
        }
    }
    async #handleGetUserSpaceVariable({ key: key, respond: respond }) {
        return this.#handleGetRemoteVariable({
            key: key,
            respond: respond
        }, $1b934ed4cb64b454$var$USERSPACE_NAMESPACE);
    }
    async #handleGetSystemVariable({ key: key, respond: respond }) {
        return this.#handleGetRemoteVariable({
            key: key,
            respond: respond
        }, $1b934ed4cb64b454$var$SYSTEM_NAMESPACE);
    }
    async #handleGetRemoteVariable({ key: key, respond: respond }, category) {
        const upperKey = key.toUpperCase();
        const filePath = `/var/remote/${category}/${upperKey}`;
        try {
            const { contents: contents } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_READ_FILE_REQUEST, {
                path: filePath
            });
            respond({
                value: contents
            });
        } catch (error) {
            // If file not found, get default and write it.
            this.log.log(`Remote variable file "${filePath}" not found, requesting default value.`);
            const { value: value } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST, {
                key: upperKey
            });
            if (value !== undefined) await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_WRITE_FILE_REQUEST, {
                path: filePath,
                content: value
            });
            respond({
                value: value
            });
        }
    }
    #handleSetTempVariable({ key: key, value: value }) {
        this.#setTempVariable(key.toUpperCase(), value);
    }
    #handleSetLocalVariable({ key: key, value: value }) {
        this.#setLocalVariable(key.toUpperCase(), value);
    }
    #handleSetVariableRemote({ key: key, value: value }) {
        this.#setRemoteVariable(key.toUpperCase(), value, $1b934ed4cb64b454$var$SYSTEM_NAMESPACE);
    }
    #handleSetVariableUserspace({ key: key, value: value }) {
        this.#setRemoteVariable(key.toUpperCase(), value, $1b934ed4cb64b454$var$USERSPACE_NAMESPACE);
    }
    #handleDeleteTempVariable({ key: key }) {
        this.#deleteTempVariable(key.toUpperCase());
    }
    #handleDeleteLocalVariable({ key: key }) {
        this.#deleteLocalVariable(key.toUpperCase());
    }
    #handleDeleteSystemVariable({ key: key }) {
        this.#deleteRemoteVariable(key.toUpperCase(), $1b934ed4cb64b454$var$SYSTEM_NAMESPACE);
    }
    #handleDeleteUserspaceVariable({ key: key }) {
        this.#deleteRemoteVariable(key.toUpperCase(), $1b934ed4cb64b454$var$USERSPACE_NAMESPACE);
    }
    #validate(key, value) {
        if (typeof value === 'number') value = String(value);
        if (!key || value !== null && typeof value !== 'string') {
            this.log.error("Invalid key or value provided to setVariable:", {
                key: key,
                value: value,
                type: typeof value
            });
            return false;
        }
        return true;
    }
    #setTempVariable(key, value) {
        if (!this.#validate(key, value)) return;
        this.#tempVariables.set(key, value);
    }
    #setLocalVariable(key, value) {
        if (!this.#validate(key, value)) return;
        const filePath = `/var/local/${$1b934ed4cb64b454$var$ENV_NAMESPACE}/${key}`;
        this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_WRITE_FILE_REQUEST, {
            path: filePath,
            content: value
        });
    }
    #setRemoteVariable(key, value, category) {
        if (!this.#validate(key, value)) return;
        const filePath = `/var/remote/${category}/${key}`;
        this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_WRITE_FILE_REQUEST, {
            path: filePath,
            content: value
        });
    }
    #deleteTempVariable(key) {
        this.#tempVariables.delete(key);
    }
    #deleteLocalVariable(key) {
        const filePath = `/var/local/${$1b934ed4cb64b454$var$ENV_NAMESPACE}/${key}`;
        this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_DELETE_FILE_REQUEST, {
            path: filePath
        });
    }
    #deleteRemoteVariable(key, category) {
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_REMOTE_REQUEST, {
            key: key,
            category: category
        });
    }
    async #handleUserChanged() {
        this.#tempVariables.clear();
    }
    #handleGetAllCategorized({ respond: respond }) {
        // This is now an async operation as it needs to fetch remote data.
        (async ()=>{
            const categorized = {
                TEMP: {},
                LOCAL: {},
                SYSTEM: {},
                USERSPACE: {}
            };
            categorized.TEMP = Object.fromEntries(this.#tempVariables);
            const processCategory = async (path, category)=>{
                try {
                    const { contents: contents } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_GET_DIRECTORY_CONTENTS_REQUEST, {
                        path: path
                    });
                    for (const file of contents){
                        const { contents: fileContent } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_READ_FILE_REQUEST, {
                            path: `${path}/${file.name}`
                        });
                        categorized[category][file.name] = fileContent;
                    }
                } catch (e) {
                    this.log.warn(`Could not list variables in ${path}:`, e.message);
                }
            };
            await Promise.all([
                processCategory(`/var/local/${$1b934ed4cb64b454$var$ENV_NAMESPACE}`, 'LOCAL'),
                processCategory(`/var/remote/${$1b934ed4cb64b454$var$SYSTEM_NAMESPACE}`, 'SYSTEM'),
                processCategory(`/var/remote/${$1b934ed4cb64b454$var$USERSPACE_NAMESPACE}`, 'USERSPACE')
            ]);
            respond({
                categorized: categorized
            });
        })();
    }
}


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
 */ /**
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
const $fa0ff2eef523a395$var$log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)('ApiManager');
class $fa0ff2eef523a395$export$cd2fa11040f69795 {
    #apiEndpoint;
    constructor(endpoint){
        this.#apiEndpoint = endpoint;
    }
    /**
     * Makes a POST request to the backend API, automatically including the session token.
     * @param {string} action - The action to perform (e.g., 'login', 'get_env').
     * @param {Object} [data={}] - An object containing the data to send.
     * @param {string|null} [token=null] - The session token to include, if any.
     * @returns {Promise<object>} The JSON response from the server.
     */ async post(action, data = {}, token = null) {
        const formData = new FormData();
        if (token) formData.append('token', token);
        for (const [key, value] of Object.entries(data))formData.append(key, value);
        $fa0ff2eef523a395$var$log.log(`Making API call: action=${action}`);
        const response = await fetch(`${this.#apiEndpoint}?action=${action}`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) throw new Error(`Invalid response from server: Expected JSON but received ${contentType}. Is the server running with the --cgi flag?`);
        return response.json();
    }
    /**
     * Makes a GET request to the backend API.
     * @param {Object} [data={}] - An object containing data to be sent as URL query parameters.
     * @returns {Promise<object>} The JSON response from the server.
     */ async get(data = {}) {
        const url = new URL(this.#apiEndpoint, window.location.origin);
        for (const [key, value] of Object.entries(data))url.searchParams.append(key, value);
        $fa0ff2eef523a395$var$log.log(`Making API call (GET): url=${url}`);
        const response = await fetch(url, {
            method: 'GET'
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) throw new Error(`Invalid response from server: Expected JSON but received ${contentType}. Is the server running with the --cgi flag?`);
        return response.json();
    }
}


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
 */ /**
 * @description Central repository for shared constant values, such as environment variable names.
 */ const $f3db42d7289ab17e$export$d71b24b7fe068ed = {
    // Core Prompt/System Variables
    PS1: 'PS1',
    HOST: 'HOST',
    PWD: 'PWD',
    USER: 'USER',
    HOME: 'HOME',
    UUID: 'UUID',
    // User-configurable Variables
    HISTSIZE: 'HISTSIZE',
    THEME: 'THEME',
    ALIAS: 'ALIAS',
    // Session/Authentication Variables
    TOKEN: 'TOKEN',
    TOKEN_EXPIRY: 'TOKEN_EXPIRY'
};



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
 */ /**
 * @description Central repository for all storage API method names.
 * This prevents the use of "magic strings" when dispatching STORAGE_API_REQUEST events.
 */ const $fa4d2f5b4bb4a3ef$export$95d56908f64857f4 = {
    GET_NODE: 'getNode',
    SET_NODE: 'setNode',
    DELETE_NODE: 'deleteNode',
    LIST_KEYS_WITH_PREFIX: 'listKeysWithPrefix',
    LOCK_NODE: 'lockNode',
    UNLOCK_NODE: 'unlockNode'
};



// Define constants for hardcoded strings to improve maintainability.
const $34004656f0914987$var$GUEST_USER = 'guest';
const $34004656f0914987$var$GUEST_STORAGE_PREFIX = 'GUEST_STORAGE_';
const $34004656f0914987$var$HISTORY_CATEGORY = 'HISTORY';
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
 */ class $34004656f0914987$export$f63b2c629ff23c50 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    #apiManager;
    constructor(eventBus, config = {}){
        super(eventBus);
        this.#apiManager = new (0, $fa0ff2eef523a395$export$cd2fa11040f69795)(config.apiUrl);
        this.log.log('Initializing...');
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).LOGIN_REQUEST]: this.#handleLoginRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).LOGOUT_REQUEST]: this.#handleLogoutRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).PASSWORD_CHANGE_REQUEST]: this.#handleChangePasswordRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).ADD_USER_REQUEST]: this.#handleAddUserRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).IS_LOGGED_IN_REQUEST]: this.#handleIsLoggedInRequest.bind(this)
        };
    }
    async isLoggedIn() {
        const { value: token } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_LOCAL_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN
        });
        return !!token;
    }
    async start() {
        // On startup, broadcast the initial login state. This allows services
        // like HistoryService to load remote data for a logged-in user on page refresh.
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).USER_CHANGED_BROADCAST);
    }
    async login(username, password) {
        try {
            this.log.log(`Attempting login for user: "${username}"`);
            const result = await this.#apiManager.post('login', {
                username: username,
                password: password
            }, null);
            if (result.status === 'success') {
                this.log.log('Login successful. Setting session variables.');
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN,
                    value: result.token
                }); // Set new ones
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).USER,
                    value: result.user
                });
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN_EXPIRY,
                    value: result.expires_at
                });
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).USER_CHANGED_BROADCAST);
            }
            return result;
        } catch (error) {
            this.log.error('Network or parsing error during login:', error);
            return {
                status: 'error',
                message: `Error: ${error.message}`
            };
        }
    }
    async logout() {
        try {
            const { value: token } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_LOCAL_REQUEST, {
                key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN
            });
            const result = await this.#apiManager.post('logout', {}, token);
            if (result.status === 'success' || result.status === 'error' && result.message.includes('expired')) {
                // Clear local session regardless of backend response if token is expired or logout is successful
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN
                });
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).USER,
                    value: $34004656f0914987$var$GUEST_USER
                });
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN_EXPIRY
                });
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).USER_CHANGED_BROADCAST);
            }
            return result;
        } catch (error) {
            this.log.error('Network or parsing error during logout:', error);
            return {
                status: 'error',
                message: `Error: ${error.message}`
            };
        }
    }
    async #handleLoginRequest({ username: username, password: password, respond: respond }) {
        const result = await this.login(username, password);
        respond(result);
    }
    async #handleLogoutRequest({ respond: respond }) {
        const result = await this.logout();
        respond(result);
    }
    async #addUser(username, password) {
        try {
            const result = await this.#apiManager.post('add_user', {
                username: username,
                password: password
            });
            return result;
        } catch (error) {
            this.log.error('Network or parsing error during user creation:', error);
            return {
                status: 'error',
                message: `Error: ${error.message}`
            };
        }
    }
    async #handleAddUserRequest({ username: username, password: password, respond: respond }) {
        const result = await this.#addUser(username, password);
        respond(result);
    }
    async #changePassword(oldPassword, newPassword) {
        const { value: token } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_LOCAL_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN
        });
        if (!token) return {
            status: 'error',
            message: 'Not logged in.'
        };
        try {
            this.log.log('Attempting password change...');
            this.log.log('Old password:', oldPassword);
            this.log.log('New password:', newPassword);
            const result = await this.#apiManager.post('change_password', {
                old_password: oldPassword,
                new_password: newPassword
            }, token);
            return result;
        } catch (error) {
            this.log.error('Network or parsing error during password change:', error);
            return {
                status: 'error',
                message: `Error: ${error.message}`
            };
        }
    }
    async #handleChangePasswordRequest({ oldPassword: oldPassword, newPassword: newPassword, respond: respond }) {
        const result = await this.#changePassword(oldPassword, newPassword);
        respond(result);
    }
    async #handleIsLoggedInRequest({ respond: respond }) {
        const loggedIn = await this.isLoggedIn();
        respond({
            isLoggedIn: loggedIn
        });
    }
    async #handleUpdateDefaultRequest({ key: key, respond: respond }) {
        switch(key){
            case (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).USER:
                respond({
                    value: $34004656f0914987$var$GUEST_USER
                });
                break;
            case (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).TOKEN:
                respond({
                    value: ''
                });
                break;
            case (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HOME:
                // The HOME directory depends on the current user.
                const { value: user } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).USER
                });
                respond({
                    value: `/home/${user}`
                });
                break;
        }
    }
}


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


const $aa7bd8a129968d33$var$DEFAULT_HISTSIZE = '1000';
const $aa7bd8a129968d33$var$HISTORY_FILE = '.nnoitra_history';
/**
 * @class HistoryBusService
 * @description Manages command history, communicating exclusively via the event bus.
 *
 * @listens for `HISTORY_PREVIOUS_REQUEST` - Responds with the previous command in history.
 * @listens for `HISTORY_NEXT_REQUEST` - Responds with the next command in history.
 * @listens for `COMMAND_EXECUTE_BROADCAST` - Adds the executed command to its internal history.
 * @listens for `VAR_GET_RESPONSE` - For the HISTSIZE value.
 *
 * @dispatches `COMMAND_PERSIST_REQUEST` - When a new command needs to be saved remotely.
 * @dispatches `HISTORY_LOAD_REQUEST` - To request the loading of remote history.
 * @dispatches `HISTORY_INDEXED_RESPONSE` - The requested history item.
 * @dispatches `VAR_GET_REQUEST` - To get the HISTSIZE variable.
 * @dispatches `VAR_SET_REQUEST` - To set the HISTSIZE variable.
 */ class $aa7bd8a129968d33$export$682fe5af4326291 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    #navigationHistoryCache = null;
    #cursorIndex = 0;
    #isNavigating = false;
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_PREVIOUS_REQUEST]: this.#handleGetPrevious.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_NEXT_REQUEST]: this.#handleGetNext.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).COMMAND_EXECUTE_BROADCAST]: this.#handleAddCommand.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_GET_ALL_REQUEST]: this.#handleGetAllHistory.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).USER_CHANGED_BROADCAST]: this.#handleUserChanged.bind(this)
        };
    }
    #handleAddCommand({ commandString: commandString }) {
        this.addCommand(commandString);
        this.resetCursor();
    }
    #handleUpdateDefaultRequest({ key: key, respond: respond }) {
        if (key === (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HISTSIZE) respond({
            value: $aa7bd8a129968d33$var$DEFAULT_HISTSIZE
        });
    }
    async #handleUserChanged() {
        // When user changes, clear any cached history and reset cursor.
        this.#navigationHistoryCache = null;
        this.resetCursor();
    }
    async addCommand(command) {
        const trimmedCommand = command.trim();
        if (!trimmedCommand) return;
        const { value: home } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HOME
        });
        const historyFilePath = `${home}/${$aa7bd8a129968d33$var$HISTORY_FILE}`;
        let history = [];
        try {
            const { contents: contents } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_READ_FILE_REQUEST, {
                path: historyFilePath
            });
            history = contents.split('\n').filter((line)=>line.trim() !== '');
        } catch (error) {
            // File probably doesn't exist, which is fine. We'll create it.
            this.log.log(`History file not found at ${historyFilePath}. A new one will be created.`);
        }
        // Prevent adding duplicate consecutive commands
        if (history.length > 0 && history[history.length - 1] === trimmedCommand) return;
        history.push(trimmedCommand);
        // Enforce HISTSIZE limit
        const { value: histsizeStr } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_SYSTEM_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HISTSIZE
        });
        const histsize = parseInt(histsizeStr || $aa7bd8a129968d33$var$DEFAULT_HISTSIZE, 10);
        if (history.length > histsize) history.splice(0, history.length - histsize);
        // Write the updated history back to the file
        await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_WRITE_FILE_REQUEST, {
            path: historyFilePath,
            content: history.join('\n')
        });
        this.resetCursor();
    }
    resetCursor() {
        this.#cursorIndex = 0;
        this.#isNavigating = false;
        this.#navigationHistoryCache = null;
    }
    async #handleGetPrevious() {
        if (!this.#isNavigating) {
            const history = await this.#loadHistoryFromFile();
            // History from accounting is oldest-to-newest. We need newest-to-oldest for navigation.
            this.#navigationHistoryCache = history.slice().reverse();
            this.#isNavigating = true;
        }
        if (this.#cursorIndex < this.#navigationHistoryCache.length) this.#cursorIndex++;
        const response = {
            command: this.#navigationHistoryCache[this.#cursorIndex - 1] || '',
            index: this.#cursorIndex
        };
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_INDEXED_RESPONSE, response);
    }
    async #handleGetNext() {
        if (this.#cursorIndex > 0) this.#cursorIndex--;
        const response = {
            command: this.#navigationHistoryCache ? this.#navigationHistoryCache[this.#cursorIndex - 1] || '' : '',
            index: this.#cursorIndex
        };
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_INDEXED_RESPONSE, response);
    }
    #handleGetAllHistory({ respond: respond }) {
        // The history is stored with the most recent command at index 0.
        // For display, we want oldest to newest. Accounting service now provides it in this order.
        (async ()=>{
            const history = await this.#loadHistoryFromFile();
            if (!history || history.length === 0) {
                respond({
                    history: []
                });
                return;
            }
            // The `history` command numbers from 1 to N, oldest to newest.
            const displayHistory = history.map((item, index)=>` ${String(index + 1).padStart(String(history.length).length)}:  ${item}`);
            respond({
                history: displayHistory
            });
        })();
    }
    async #loadHistoryFromFile() {
        const { value: home } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HOME
        });
        const historyFilePath = `${home}/${$aa7bd8a129968d33$var$HISTORY_FILE}`;
        try {
            const { contents: contents } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_READ_FILE_REQUEST, {
                path: historyFilePath
            });
            return contents.split('\n').filter((line)=>line.trim() !== '');
        } catch (error) {
            this.log.warn(`Could not load history file: ${error.message}`);
            return [];
        }
    }
}


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

const $a669e8ae43fdb238$var$log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)('ServiceApiManager');
class $a669e8ae43fdb238$export$241fc32970302a31 {
    #eventBus;
    constructor(eventBus){
        this.#eventBus = eventBus;
    }
    // --- UI Gateway Methods ---
    async prompt(promptText, options = {}) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).INPUT_REQUEST, {
            prompt: promptText,
            options: options
        }, 0);
        return response.value;
    }
    clearScreen() {
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).CLEAR_SCREEN_REQUEST);
    }
    scrollToBottom() {
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).UI_SCROLL_TO_BOTTOM_REQUEST);
    }
    async requestMedia(src) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).MEDIA_REQUEST, {
            src: src
        });
        return response.mediaElement;
    }
    // --- User/Accounting Gateway Methods ---
    async login(username, password) {
        return await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).LOGIN_REQUEST, {
            username: username,
            password: password
        });
    }
    async logout() {
        return await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).LOGOUT_REQUEST, {});
    }
    async changePassword(oldPassword, newPassword) {
        return await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).PASSWORD_CHANGE_REQUEST, {
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    }
    async addUser(username, password) {
        return await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).ADD_USER_REQUEST, {
            username: username,
            password: password
        });
    }
    async isLoggedIn() {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).IS_LOGGED_IN_REQUEST, {});
        return response.isLoggedIn;
    }
    // --- Filesystem Gateway Methods ---
    async isDirectory(path) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_IS_DIR_REQUEST, {
            path: path
        });
        return response.isDirectory;
    }
    async getDirectoryContents(path) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_GET_DIRECTORY_CONTENTS_REQUEST, {
            path: path
        });
        if (response.error) throw new Error(response.error.message || 'Failed to get directory contents.');
        return response.contents;
    }
    async getFileContents(path) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_GET_FILE_CONTENTS_REQUEST, {
            path: path
        });
        if (response.error) throw new Error(response.error.message || 'Failed to get file contents.');
        return response.contents;
    }
    async getPublicUrl(path) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_GET_PUBLIC_URL_REQUEST, {
            path: path
        });
        return response.url;
    }
    async resolvePath(path, mustBeDir = false) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_RESOLVE_PATH_REQUEST, {
            path: path,
            mustBeDir: mustBeDir
        });
        if (response.error) throw response.error;
        return response.path;
    }
    // --- History Gateway Methods ---
    async getHistory() {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_GET_ALL_REQUEST, {});
        return response.history;
    }
    // --- Environment Gateway Methods ---
    async changeDirectory(path) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_CHANGE_DIRECTORY_REQUEST, {
            path: path
        });
        if (response.error) // The error object from the service is a standard Error, so we can re-throw it.
        throw response.error;
    }
    setTempVariable(key, value) {
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_TEMP_REQUEST, {
            key: key,
            value: value
        });
    }
    setLocalVariable(key, value) {
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_LOCAL_REQUEST, {
            key: key,
            value: value
        });
    }
    setSystemVariable(key, value) {
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_SYSTEM_REQUEST, {
            key: key,
            value: value
        });
    }
    async getSystemVariable(key, value) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_SYSTEM_REQUEST, {
            key: key
        });
        return response;
    }
    setUserspaceVariable(key, value) {
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_USERSPACE_REQUEST, {
            key: key,
            value: value
        });
    }
    deleteUserspaceVariable(key) {
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_DEL_USERSPACE_REQUEST, {
            key: key
        });
    }
    async getAllCategorizedVariables() {
        const { categorized: categorized } = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_ALL_CATEGORIZED_VARS_REQUEST, {});
        return categorized;
    }
    // --- Alias Gateway Methods ---
    async getAliases() {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_ALIASES_REQUEST, {});
        return response.aliases;
    }
    setAliases(aliases) {
        // This is a fire-and-forget dispatch
        this.#eventBus.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).SET_ALIASES_REQUEST, {
            aliases: aliases
        });
    }
    // --- Command Introspection Gateway Methods ---
    async getCommandList() {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_COMMAND_LIST_REQUEST, {});
        return response.commands;
    }
    async getCommandMeta(commandName, metaKey) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_COMMAND_META_REQUEST, {
            commandName: commandName,
            metaKey: metaKey
        });
        return response.value;
    }
    // --- Theme Gateway Methods ---
    async setTheme(themeName) {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).SET_THEME_REQUEST, {
            themeName: themeName
        });
        return response.theme;
    }
    async getValidThemes() {
        const response = await this.#eventBus.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_VALID_THEMES_REQUEST, {});
        return response.themes;
    }
}


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
 */ /**
 * Tokenizes an input string based on shell-like rules for quotes and escapes.
 *
 * - Special characters (delimiters): space, slash, equals.
 * - Backslash `\` escapes the next character.
 * - Single `'` and double `"` quotes create string literals where delimiters are ignored.
 * - Unclosed quotes extend to the end of the input.
 * - Delimiters are appended to the token preceding them.
 *
 * @param {string} inputText The string to tokenize.
 * @returns {string[]} An array of tokens.
 */ function $8a497e5e96e95e64$export$660b2ee2d4fb4eff(inputText) {
    const tokens = [];
    const tokenizers = [
        ' ',
        '/',
        '='
    ];
    const quotes = [
        "'",
        '"'
    ];
    const escapes = [
        '\\'
    ];
    let currentToken = '';
    let inQuote = null; // Can be ' or "
    let isEscaped = false;
    const finalizeToken = (delimiter = '')=>{
        tokens.push(currentToken + delimiter);
        currentToken = '';
    };
    for(let i = 0; i < inputText.length; i++){
        const char = inputText[i];
        if (isEscaped) {
            currentToken += char;
            isEscaped = false;
        } else if (quotes.includes(char)) inQuote = inQuote === char ? null : inQuote || char;
        else if (escapes.includes(char)) isEscaped = true;
        else if (inQuote) currentToken += char; // Always a generic character when in a quote
        else if (tokenizers.includes(char)) finalizeToken(char);
        else currentToken += char;
    }
    finalizeToken();
    return tokens;
}
function $8a497e5e96e95e64$export$fac44ee5b035f737(tokens) {
    const tokenizers = [
        ' ',
        '/',
        '='
    ];
    const specialChars = [
        ' ',
        '/',
        '=',
        "'",
        '"',
        '\\'
    ];
    return tokens.map((token)=>{
        if (!token) return ''; // Handle empty tokens
        let body = token;
        let delimiter = '';
        const lastChar = token.slice(-1);
        // If the token ends with a delimiter, separate it from the body.
        if (token.length > 0 && tokenizers.includes(lastChar)) {
            body = token.slice(0, -1);
            delimiter = lastChar;
        }
        let escapedBody = '';
        for (const char of body)if (specialChars.includes(char)) escapedBody += '\\' + char;
        else escapedBody += char;
        return escapedBody + delimiter;
    }).join(''); // The original tokenize function includes delimiters in the tokens.
}



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
 */ /**
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
/**
 * @class BaseCommand
 * @description Provides a foundational class for all terminal commands.
 * It automates logger creation and provides default implementations for common command methods.
 */ class $0a4c644366d85fc4$export$da09ae580dcf9f05 {
    /** @protected {object} services - A collection of service functions injected by CommandService. */ #services;
    /** @protected {Logger} log - A logger instance for the command. */ #log;
    /**
     * Creates an instance of BaseCommand.
     * @param {object} services - A collection of service functions injected by CommandService.
     */ constructor(services){
        this.#services = services;
        // The logger name will be the class name of the concrete command.
        this.#log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)(this.constructor.name.toLowerCase());
        this.#log.log('Initializing...');
    }
    /**
     * Provides access to the injected services.
     * @returns {object} The services object.
     */ get services() {
        return this.#services;
    }
    /**
     * Provides access to the command's logger.
     * @returns {Logger} The logger instance.
     */ get log() {
        return this.#log;
    }
    /**
     * Provides autocomplete suggestions for the arguments of the command.
     * Child classes should override this if they need custom autocomplete logic.
     * @param {string[]} currentArgs - The arguments typed so far.
     * @returns {Promise<string[]|{suggestions: string[], description: string}>} An array of suggested arguments or an object with suggestions and a description.
     */ async autocompleteArgs(currentArgs) {
        return []; // By default, commands take no arguments or have no autocomplete.
    }
    /**
     * Executes the command. Child classes MUST override this.
     * @param {string[]} args - An array of arguments passed to the command.
     * @returns {Promise<HTMLElement>} A promise that resolves with an HTML element containing the command's output.
     * @throws {Error} If not overridden by a child class.
     */ async execute(args) {
        throw new Error(`Command '${this.constructor.name}' must implement the 'execute' method.`);
    }
}


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
 */ /**
 * Fetches and parses a JSON file from a given URL.
 * @param {string} url - The URL of the JSON file to fetch.
 * @returns {Promise<object>} A promise that resolves with the parsed JSON object.
 * @throws {Error} Throws an error if the network response is not ok.
 */ async function $268f5c7225abb997$export$6d1804898cf16c80(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for url: ${url}`);
    return response.json();
}
async function $268f5c7225abb997$export$7d79caac809a3f17(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for url: ${url}`);
    return response.text();
}


var $fed81596da0f4423$exports = {};
$fed81596da0f4423$exports = $parcel$resolve("H44nx");


/**
 * @class Welcome
 * @description Implements the 'welcome' command, displaying an ASCII art welcome message.
 */ class $e0c064800146e1d9$export$23191e4434a9e834 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DATA_FILE = new URL($fed81596da0f4423$exports);
    /**
     * @static
     * @type {string}
     * @description A brief description of the welcome command.
     */ static DESCRIPTION = 'A short introduction.';
    constructor(services){
        super(services);
    }
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputPre = document.createElement('div');
        outputPre.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and line breaks
        if (outputElement) outputElement.appendChild(outputPre);
        try {
            const welcomeText = await (0, $268f5c7225abb997$export$7d79caac809a3f17)($e0c064800146e1d9$export$23191e4434a9e834.DATA_FILE); // Use static property
            this.log.log(`Welcome message loaded successfully. ${welcomeText.length} characters.`);
            outputPre.textContent = welcomeText;
        } catch (error) {
            this.log.error('Error loading welcome message:', error);
            outputPre.textContent = 'Error: Could not load welcome message.';
        }
    }
    /**
     * Provides a detailed manual page for the welcome command.
     * @static
     * @returns {string} The detailed manual text.
     */ static man() {
        return `NAME\n       welcome - A friendly introduction to the terminal.\n\nDESCRIPTION\n       The welcome command displays a greeting message and basic instructions for using the terminal.\n       It is typically the first command executed when the terminal starts.\n\nUSAGE\n       welcome\n\n       This command takes no arguments.\n\nEXAMPLES\n       $ welcome\n       (Displays the welcome message.)`;
    }
}


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
const $d0a0d313036150a9$export$4051a07651545597 = [
    {
        "Type": "Image",
        "Source": "/fs/photos/2024/2024.04.08.jpg",
        "Id": "profile-picture"
    },
    {
        "Type": "Text",
        "Title": "Name",
        "Value": "Afshin Arefi"
    },
    {
        "Type": "Text",
        "Title": "Description",
        "Value": "I am a software engineer mostly interested in low level programming, data pipelines, and data manipulation. Currently I am working at Huawei as a Senior Compiler Engineer working with llvm, the kernel, and the loader."
    },
    {
        "Type": "Text",
        "Title": "Email",
        "Value": "arefi.afshin@gmail.com"
    },
    {
        "Type": "Text",
        "Title": "LinkedIn",
        "Value": "https://www.linkedin.com/in/arefiafshin/"
    }
];


/**
 * @class About
 * @description Implements the 'about' command, which displays personal information from a JSON file.
 */ class $8006e978d23dfa7a$export$c8424c4d8ba2150 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'A short introduction.';
    #requestMedia;
    constructor(services){
        super(services);
        this.#requestMedia = services.requestMedia;
    }
    static man() {
        return `NAME\n       about - Display information about the author.\n\nSYNOPSIS\n       about\n\nDESCRIPTION\n       The about command displays a short bio, contact information, and a profile picture.`;
    }
    async autocompleteArgs(currentArgs) {
        return []; // 'about' command takes no arguments.
    }
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = outputElement; // Use the provided container directly
        try {
            for (const item of (0, $d0a0d313036150a9$export$4051a07651545597)){
                const wrapper = document.createElement('div');
                let element;
                if (item.Type === 'Text') {
                    element = document.createElement('p');
                    const title = document.createElement('span');
                    title.textContent = item.Title;
                    title.classList.add('about-title');
                    element.appendChild(title);
                    element.appendChild(document.createTextNode(': '));
                    if (item.Value.startsWith('http')) {
                        const link = document.createElement('a');
                        link.href = item.Value;
                        link.textContent = item.Value;
                        link.target = '_blank';
                        element.appendChild(link);
                    } else element.appendChild(document.createTextNode(item.Value));
                } else if (item.Type === 'Image') {
                    element = await this.#requestMedia(item.Source);
                    element.id = item.Id;
                }
                if (element) {
                    wrapper.appendChild(element);
                    outputDiv.appendChild(wrapper);
                }
            }
        } catch (error) {
            this.log.error('Failed to fetch about information:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }
    }
}


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
/**
 * @class Env
 * @description Implements the 'env' command, which lists all current environment variables.
 */ class $746ab3f555bc367e$export$6c0517834721cef7 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    /**
     * @static
     * @type {string}
     * @description A brief description of the env command.
     */ static DESCRIPTION = 'List current environment variables.';
    /** @private {Function} #getAllCategorizedVariables - Function to get all categorized variables. */ #getAllCategorizedVariables;
    /**
     * Creates an instance of Env.
     * @param {object} services - The object containing all services.
     */ constructor(services){
        super(services);
        this.#getAllCategorizedVariables = this.services.getAllCategorizedVariables;
    }
    /**
     * Executes the env command.
     * Retrieves all environment variables from the EnvironmentService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLPreElement>} A promise that resolves with a `<pre>` HTML element containing the environment variables.
     */ async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const categorizedVars = await this.#getAllCategorizedVariables();
        let output = '';
        const formatCategory = (title, vars)=>{
            if (Object.keys(vars).length === 0) return '';
            let categoryOutput = `<br># ${title} Variables<br>`;
            for (const [key, value] of Object.entries(vars)){
                // Check if the value contains spaces or is a JSON-like string, and quote it if so.
                // Also ensure the value is a string before calling string methods on it.
                if (typeof value === 'string' && (/\s/.test(value) || value.startsWith('{') && value.endsWith('}'))) categoryOutput += `${key}="${value}"<br>`;
                else if (value !== undefined && value !== null) categoryOutput += `${key}=${value}<br>`;
                else categoryOutput += `${key}=${value}<br>`;
            }
            return categoryOutput;
        };
        // Using "Session" as a more user-friendly name for "Temporary"
        output += formatCategory('Session (In-Memory)', categorizedVars.TEMP || {});
        output += formatCategory('Local (Browser Storage)', categorizedVars.LOCAL);
        output += formatCategory('Remote (User Account)', categorizedVars.SYSTEM);
        output += formatCategory('User (Configurable)', categorizedVars.USERSPACE);
        outputDiv.innerHTML = output.trim();
    }
    /**
     * Provides a detailed manual page for the env command.
     * @static
     * @returns {string} The detailed manual text.
     */ static man() {
        return `NAME\n       env - Display environment variables.\n\nSYNOPSIS\n       env [OPTION]...\n\nDESCRIPTION\n       The env command prints the current environment variables to standard output.\n       Each variable is displayed on a new line in the format KEY=VALUE.\n\nOPTIONS\n       Currently, this command does not support any options.\n\nEXAMPLES\n       $ env\n       (Displays all current environment variables.)`;
    }
}


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
/**
 * @class Help
 * @description Implements the 'help' command, which lists all available commands and their descriptions.
 */ class $58f4ca654afc80a2$export$1be7516c0280bee8 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    /**
     * @static
     * @type {string}
     * @description A brief description of the help command.
     */ static DESCRIPTION = 'Lists available commands.';
    #getCommandList;
    #getCommandMeta;
    /**
     * Creates an instance of Help.
     * @param {CommandService} commandService - The CommandService instance to interact with.
     */ constructor(services){
        super(services);
        this.#getCommandList = this.services.getCommandList;
        this.#getCommandMeta = this.services.getCommandMeta;
    }
    /**
     * Provides a detailed manual page for the help command.
     * @static
     * @returns {string} The detailed manual text.
     */ static man() {
        return `NAME\n       help - Display information about available commands.\n\nSYNOPSIS\n       help\n\nDESCRIPTION\n       The help command lists all commands available in the terminal, along with a brief description for each.\n       It is useful for discovering what commands can be used.\n\nUSAGE\n       help\n\n       This command takes no arguments.\n\nEXAMPLES\n       $ help\n       (Displays a list of all commands and their descriptions.)`;
    }
    /**
     * Executes the help command.
     * Retrieves all registered commands and their descriptions from the CommandService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the list of commands.
     */ async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        // Use the injected service function to get the list of commands.
        const commands = await this.#getCommandList();
        if (commands.length === 0) {
            outputDiv.textContent = 'No commands available.';
            return;
        }
        // Find the length of the longest command name for alignment.
        const maxLength = Math.max(...commands.map((cmd)=>cmd.length));
        const padding = maxLength + 4;
        let helpText = '';
        // Asynchronously fetch the description for each command.
        for (const cmdName of commands){
            const description = await this.#getCommandMeta(cmdName, 'DESCRIPTION') || 'No description available.';
            helpText += `${cmdName.padEnd(padding)} : ${description}<br>`;
        }
        outputDiv.innerHTML = helpText;
    }
}


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
/**
 * @class Man
 * @description Implements the 'man' command, which displays the manual page for a given command.
 */ class $89dee8d09878550f$export$dd86fb79665233fb extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    /**
     * @static
     * @type {string}
     * @description A brief description of the man command.
     */ static DESCRIPTION = 'Shows the manual page for a command.';
    /** @private {CommandService} #commandService - Reference to the CommandService. */ #getCommandList;
    #getCommandMeta;
    constructor(services){
        super(services);
        this.#getCommandList = this.services.getCommandList;
        this.#getCommandMeta = this.services.getCommandMeta;
    }
    /**
     * Provides a detailed manual page for the man command.
     * @static
     * @returns {string} The detailed manual text.
     */ static man() {
        return `NAME\n       man - Display the manual page for a command.\n\nSYNOPSIS\n       man <command>\n\nDESCRIPTION\n       The man command displays the manual page for the specified command.\n       If no command is specified, it will prompt for a command name.\n\nUSAGE\n       man <command>\n\nEXAMPLES\n       $ man help\n       (Displays the manual page for the 'help' command.)`;
    }
    /**
     * Provides autocomplete suggestions for the arguments of the man command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested arguments.
     */ async autocompleteArgs(currentArgs) {
        if (currentArgs.length > 1) return [];
        const commandList = await this.#getCommandList();
        const input = currentArgs[0] || '';
        // If input is already a valid command name, do not suggest anything further.
        if (commandList.includes(input)) return [];
        if (input) return commandList.filter((cmd)=>cmd.startsWith(input));
        // If typing the second or later argument, do not suggest anything
        return [];
    }
    /**
     * Executes the man command.
     * Displays the manual page for the specified command.
     * @param {string[]} args - An array of arguments passed to the command.
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the manual page.
     */ async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        if (args.length <= 1) {
            outputDiv.textContent = 'Usage: man <command>\nPlease specify a command name.';
            return;
        }
        const cmdName = args[1];
        if (!cmdName) {
            outputDiv.textContent = 'Usage: man <command>\nPlease specify a command name.';
            return;
        }
        const lowerCmdName = cmdName.toLowerCase();
        // Debug: print all command names and lookup result
        const commandList = await this.#getCommandList();
        this.log.log('Searching for command:', lowerCmdName);
        let exactMatch = commandList.find((cmd)=>cmd.toLowerCase() === lowerCmdName);
        let manContent = exactMatch ? await this.#getCommandMeta(exactMatch, 'man') : undefined;
        this.log.log('Exact match found:', exactMatch);
        if (!manContent) {
            // Try unique partial match (case-insensitive)
            const matches = commandList.filter((cmd)=>cmd.toLowerCase().startsWith(lowerCmdName));
            this.log.log('Partial matches found:', matches);
            if (matches.length === 1) {
                manContent = await this.#getCommandMeta(matches[0], 'man');
                this.log.log('Unique partial match found:', matches[0]);
            } else if (matches.length > 1) {
                outputDiv.textContent = `man: ambiguous command '${cmdName}'; possibilities: ${matches.join(' ')}`;
                this.log.warn('Ambiguous command:', {
                    input: cmdName,
                    matches: matches
                });
                return;
            } else {
                outputDiv.textContent = `No manual entry for '${cmdName}'.`;
                return;
            }
        }
        if (manContent) {
            this.log.log('Displaying man page.');
            outputDiv.style.whiteSpace = 'pre-wrap';
            outputDiv.textContent = manContent;
        } else {
            this.log.warn(`No man page function found for command: "${cmdName}"`);
            outputDiv.textContent = `No manual entry for '${cmdName}'.`;
        }
    }
}


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
/**
 * @class History
 * @description Implements the 'history' command, which displays the command history.
 */ class $704f97d014e3d2c7$export$84202caead5689ba extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    /**
     * @static
     * @type {string}
     * @description A brief description of the history command.
     */ static DESCRIPTION = 'Shows the command history.';
    #getHistory;
    /**
     * Creates an instance of History.
     */ constructor(services){
        super(services);
        this.#getHistory = this.services.getHistory;
    }
    /**
     * Provides a detailed manual page for the history command.
     * @static
     * @returns {string} The detailed manual text.
     */ static man() {
        return `NAME\n       history - Display the command history.\n\nSYNOPSIS\n       history\n\nDESCRIPTION\n       The history command displays a list of previously entered commands.\n\nUSAGE\n       history\n\nEXAMPLES\n       $ history\n       (Displays the list of commands entered in this session.)`;
    }
    /**
     * Executes the history command.
     * Displays the command history.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the history.
     */ async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const historyData = await this.#getHistory();
        if (!historyData || historyData.length === 0) {
            outputDiv.textContent = 'No history available.';
            return;
        }
        // The data is now pre-formatted by HistoryService.
        const historyText = historyData.join('<br>');
        outputDiv.innerHTML = historyText;
    }
}


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
 */ /**
 * Creates a simple list element from an array of items.
 * @param {Array<string|{text: string, style: object}>} items - An array of strings or objects to display in the list.
 * @returns {HTMLUListElement} The generated UL element.
 */ function $c61f1fac801ee4e9$export$5897d8d7c7a3d871(items) {
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    if (!items || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = '(empty)';
        ul.appendChild(li);
    } else items.forEach((item)=>{
        const li = document.createElement('li');
        if (typeof item === 'string') li.textContent = item;
        else if (typeof item === 'object' && item.text) {
            li.textContent = item.text;
            Object.assign(li.style, item.style);
        }
        ul.appendChild(li);
    });
    return ul;
}
function $c61f1fac801ee4e9$export$b27ec03c767c18ba(contents) {
    const files = Array.isArray(contents?.files) ? contents.files : [];
    const directories = Array.isArray(contents?.directories) ? contents.directories : [];
    const directoryItems = directories.map((dir)=>({
            text: `${dir.name}/`,
            style: {
                color: 'var(--nnoitra-color-directory)'
            }
        }));
    const fileItems = files.map((file)=>{
        const size = file.size !== null ? `(${file.size}b)` : '';
        return `${file.name} ${size}`;
    });
    const allItems = [
        ...directoryItems,
        ...fileItems
    ];
    return $c61f1fac801ee4e9$export$5897d8d7c7a3d871(allItems.length > 0 ? allItems : [
        '(empty directory)'
    ]);
}


/**
 * @class Ls
 * @description Implements the 'ls' command, which lists the contents of a directory using FilesystemService.
 */ class $f1cb7247a06daf47$export$e4ed7772d4272afd extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    #getDirectoryContents;
    #autocompletePath;
    /**
     * Creates an instance of Ls.
     * @param {object} funcs - A collection of functions passed by the command service.
     * @param {Function} funcs.getDirectoryContents - A function to retrieve directory contents.
     * @param {Function} funcs.autocompletePath - A function for path autocompletion.
     */ constructor(funcs){
        super(funcs);
        this.#getDirectoryContents = this.services.getDirectoryContents; // This is still needed for execute
        this.#autocompletePath = this.services.autocompletePath;
    }
    static man() {
        return `NAME\n       ls - List directory contents.\n\nSYNOPSIS\n       ls [directory]\n\nDESCRIPTION\n       The ls command lists files and directories in the specified location.\n       If no location is given, it lists the current directory.`;
    }
    async autocompleteArgs(currentArgs) {
        // Reconstruct the path from all non-option arguments.
        const pathArg = currentArgs.filter((arg)=>!arg.trim().startsWith('-')).join('');
        try {
            // Get all contents of the target directory. If path is empty, use current dir.
            const contents = await this.#getDirectoryContents(pathArg || '.');
            // Format the full paths for all items. AutocompleteService will handle filtering.
            const directories = (contents.directories || []).map((dir)=>dir.name + '/');
            const files = (contents.files || []).map((file)=>file.name);
            return [
                ...directories,
                ...files
            ].sort();
        } catch (error) {
            this.log.warn(`Autocomplete failed for path "${pathArg}":`, error);
            return []; // On error, return no suggestions.
        }
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = outputElement; // Use the provided container directly
        const pathArg = args[1] || '.';
        try {
            const contents = await this.#getDirectoryContents(pathArg);
            if (typeof contents === 'string') {
                const pre = document.createElement('pre');
                pre.innerText = contents;
                outputDiv.appendChild(pre);
                return;
            }
            // Delegate all formatting and list creation to the utility.
            const ul = (0, $c61f1fac801ee4e9$export$b27ec03c767c18ba)(contents);
            outputDiv.appendChild(ul);
        } catch (error) {
            this.log.warn(`Cannot access path: "${pathArg}"`, error);
            outputDiv.textContent = `ls: cannot access '${pathArg}': ${error.message}`;
        }
    }
}


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
/**
 * @class Cd
 * @description Implements the 'cd' command, which changes the current working directory using FilesystemService.
 */ class $db5013326dab5472$export$ba0ebedd619a044f extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Change the current working directory.';
    #changeDirectory;
    #getDirectoryContents;
    constructor(services){
        super(services);
        this.#changeDirectory = this.services.changeDirectory;
        this.#getDirectoryContents = this.services.getDirectoryContents;
    }
    static man() {
        return `NAME\n       cd - Change the current directory.\n\nSYNOPSIS\n       cd [directory]\n\nDESCRIPTION\n       The cd command changes the current working directory to the specified location.\n       If no location is given, it changes to the root directory.`;
    }
    async autocompleteArgs(currentArgs) {
        const pathArg = currentArgs.join('');
        const lastSlashIndex = pathArg.lastIndexOf('/');
        const dirToList = lastSlashIndex === -1 ? '.' : pathArg.substring(0, lastSlashIndex + 1) || '/';
        try {
            // Get all contents of the target directory.
            const contents = await this.#getDirectoryContents(dirToList);
            const suggestions = [];
            // For 'cd', we only suggest directories. AutocompleteService will handle filtering.
            return (contents.directories || []).map((dir)=>dir.name + '/').sort();
        } catch (error) {
            this.log.warn(`Autocomplete failed for path "${pathArg}":`, error);
            return []; // On error, return no suggestions.
        }
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const pathArg = args.slice(1).join('').trim() || '/';
        try {
            await this.#changeDirectory(pathArg);
        } catch (error) {
            outputDiv.textContent = `cd: ${pathArg}: ${error.message}`;
        }
    }
}


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
class $f56f4db7338f947e$export$15fe218ce13d3b19 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Print the content of a FILE';
    #getFileContents;
    #getDirectoryContents;
    constructor(services){
        super(services);
        this.#getFileContents = this.services.getFileContents;
        this.#getDirectoryContents = this.services.getDirectoryContents;
    }
    static man() {
        return `NAME\n       cat - Concatenate and print files.\n\nSYNOPSIS\n       cat [FILE]...\n\nDESCRIPTION\n       The cat command reads files sequentially, writing them to the standard output.`;
    }
    async autocompleteArgs(currentArgs) {
        // Reconstruct the path from all argument tokens.
        const pathArg = currentArgs.join('');
        try {
            // Get all contents of the target directory. If path is empty, use current dir.
            const contents = await this.#getDirectoryContents(pathArg || '.');
            const supportedFormats = /\.txt$/i;
            // Suggest all directories for navigation.
            const directories = (contents.directories || []).map((dir)=>dir.name + '/');
            // Suggest only files with supported .txt format.
            const files = (contents.files || []).filter((file)=>supportedFormats.test(file.name)).map((file)=>file.name);
            return [
                ...directories,
                ...files
            ].sort();
        } catch (error) {
            this.log.warn(`Autocomplete failed for path "${pathArg}":`, error);
            return []; // On error, return no suggestions.
        }
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputPre = document.createElement('pre');
        if (outputElement) outputElement.appendChild(outputPre);
        const filePathArg = args.slice(1).join('').trim();
        if (!filePathArg) {
            this.log.warn('Missing file operand.');
            outputPre.textContent = 'cat: missing file operand';
            return;
        }
        try {
            const content = await this.#getFileContents(filePathArg);
            outputPre.textContent = content;
        } catch (error) {
            this.log.error(`Failed to get file content for "${filePathArg}":`, error);
            outputPre.textContent = `cat: ${filePathArg}: ${error.message}`;
        }
    }
}


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
/**
 * @class Clear
 * @description Implements the 'clear' command, which clears the terminal output.
 */ class $a42c2ef9b96a7e14$export$47d037774b685574 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Clear the terminal output.';
    #clearScreen;
    constructor(services){
        super(services);
        this.#clearScreen = this.services.clearScreen;
    }
    /**
     * Executes the clear command by dispatching a terminal-clear event
     * @param {string[]} args - Command arguments (not used)
     * @returns {HTMLElement} An empty div, as this command produces no visible output.
     */ execute(args, outputElement) {
        this.log.log('Executing clear command.');
        this.#clearScreen();
    }
    /**
     * Returns manual page content for the clear command
     * @returns {string} The manual page content
     */ static man() {
        return `NAME
       clear - Clear the terminal output.

SYNOPSIS
       clear

DESCRIPTION
       The clear command erases all output in the terminal window.`;
    }
}


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
/**
 * @class View
 * @description Implements the 'view' command, which displays an image or video file.
 */ class $7461451f701afbcc$export$27a5bd065ad55220 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'View a photo or video.';
    #getDirectoryContents;
    #getPublicUrl;
    #requestMedia;
    constructor(services){
        super(services);
        this.#getDirectoryContents = this.services.getDirectoryContents;
        this.#getPublicUrl = this.services.getPublicUrl;
        this.#requestMedia = this.services.requestMedia;
    }
    static man() {
        return `NAME\n       view - Display an image or video file.\n\nSYNOPSIS\n       view [file]\n\nDESCRIPTION\n       The view command displays the specified image (png, jpg, gif) or video (mp4, webm) file.\n       The path can be absolute or relative to the current directory.`;
    }
    async autocompleteArgs(currentArgs) {
        // Reconstruct the path from all argument tokens.
        const pathArg = currentArgs.join('');
        try {
            // Get all contents of the target directory. If path is empty, use current dir.
            const contents = await this.#getDirectoryContents(pathArg || '.');
            const supportedFormats = /\.(png|jpg|jpeg|gif|webp|mp4|webm)$/i;
            // Suggest all directories.
            const directories = (contents.directories || []).map((dir)=>dir.name + '/');
            // Suggest only files with supported formats.
            const files = (contents.files || []).filter((file)=>supportedFormats.test(file.name)).map((file)=>file.name);
            return [
                ...directories,
                ...files
            ].sort();
        } catch (error) {
            this.log.warn(`Autocomplete failed for path "${pathArg}":`, error);
            return []; // On error, return no suggestions.
        }
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        // Reconstruct the file path from all argument tokens.
        const commandArgs = args.slice(1);
        const filePathArg = commandArgs.join('').trim();
        if (!filePathArg) {
            this.log.warn('Missing file operand.');
            outputDiv.textContent = 'view: missing file operand';
            return;
        }
        const supportedFormats = /\.(png|jpg|jpeg|gif|webp|mp4|webm)$/i;
        if (!supportedFormats.test(filePathArg)) {
            this.log.warn(`File is not a supported media type: "${filePathArg}"`);
            outputDiv.textContent = `view: ${filePathArg}: Unsupported file type.`;
            return;
        }
        const mediaSrc = await this.#getPublicUrl(filePathArg);
        const mediaElement = await this.#requestMedia(mediaSrc);
        outputDiv.appendChild(mediaElement);
    }
}


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
/**
 * @class AddUser
 * @description Implements the 'adduser' command for creating new users.
 */ class $014619ac3a5e9bb8$export$a2fae8d9b81b1013 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Add a new user.';
    #prompt;
    #addUser;
    constructor(services){
        super(services);
        this.#prompt = this.services.prompt;
        this.#addUser = this.services.addUser;
    }
    static man() {
        return `
NAME
       adduser - Add a new user.

SYNOPSIS
       adduser [username]

DESCRIPTION
       The adduser command creates a new user account. You will be prompted to enter and confirm a password.
       Usernames must be between 3 and 32 characters and can only contain letters, numbers, and underscores.
`;
    }
    async autocompleteArgs(currentArgs) {
        return {
            suggestions: [],
            description: '<USERNAME>'
        };
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const username = args[1];
        if (!username) {
            outputDiv.textContent = 'adduser: missing username operand.';
            return;
        }
        const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/;
        if (!usernameRegex.test(username)) {
            outputDiv.textContent = `adduser: invalid username '${username}'. Usernames must be 3-32 characters and contain only letters, numbers, and underscores.`;
            return;
        }
        try {
            // Prompt for password
            const password = await this.#prompt('Password: ', {
                isSecret: true,
                allowHistory: false,
                allowAutocomplete: false
            });
            if (password === null) throw new Error('Operation cancelled.');
            outputDiv.innerHTML += 'Password received.<br>';
            // Prompt for password confirmation
            const confirmPassword = await this.#prompt('Confirm password: ', {
                isSecret: true,
                allowHistory: false,
                allowAutocomplete: false
            });
            if (confirmPassword === null) throw new Error('Operation cancelled.');
            outputDiv.innerHTML += 'Confirmation received.<br>';
            if (password !== confirmPassword) {
                outputDiv.innerHTML += '<br>adduser: Passwords do not match. User not created.';
                return;
            }
            outputDiv.innerHTML += 'Creating user...';
            const result = await this.#addUser(username, password);
            outputDiv.innerHTML += `<br>${result.status === 'success' ? `User '${username}' created successfully.` : `adduser: ${result.message}`}`;
        } catch (error) {
            this.log.error('Error during user creation:', error);
            outputDiv.innerHTML += '<br>adduser: Operation cancelled.';
        }
    }
}


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
/**
 * @class Login
 * @description Implements the 'login' command for user authentication.
 */ class $e70c41a38a6398be$export$21a94553ffa41578 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Log in as a user.';
    #prompt;
    #login;
    constructor(services){
        super(services);
        this.#prompt = this.services.prompt;
        this.#login = this.services.login;
    }
    static man() {
        return `NAME\n       login - Log in to the system.\n\nSYNOPSIS\n       login [username]\n\nDESCRIPTION\n       Authenticates the user and starts a session.`;
    }
    async autocompleteArgs(currentArgs) {
        // Only provide a hint for the first argument (the username).
        if (currentArgs.length > 1) return [];
        return {
            suggestions: [],
            description: '<USERNAME>'
        };
    }
    /**
     * Determines if the command is available in the current context.
     * @param {object} context - The current application context.
     * @param {boolean} context.isLoggedIn - Whether a user is currently logged in.
     * @returns {boolean} True if the command is available, false otherwise.
     */ static isAvailable(context) {
        return !context.isLoggedIn;
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const username = args[1];
        if (!username) {
            outputDiv.textContent = 'Usage: login <username>';
            return;
        }
        // Always prompt for the password interactively for security reasons.
        this.log.log('Prompting user for password.');
        const password = await this.#prompt('Password: ', {
            isSecret: true,
            allowHistory: false,
            allowAutocomplete: false
        });
        if (password === null) {
            outputDiv.textContent = 'login: Operation cancelled.';
            return;
        }
        try {
            const loginResult = await this.#login(username, password);
            outputDiv.textContent = loginResult.message;
        } catch (error) {
            this.log.error('Network or parsing error during login:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }
    }
}


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
/**
 * @class Logout
 * @description Implements the 'logout' command to end a user session.
 */ class $f6dad85933050838$export$cad1a703886b4e3a extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Log out of the current session.';
    #logout;
    constructor(services){
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
     */ static isAvailable(context) {
        return context.isLoggedIn;
    }
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        try {
            const result = await this.#logout();
            outputDiv.textContent = result.message;
        } catch (error) {
            this.log.error('Network or parsing error during logout:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }
    }
}


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
/**
 * @class Passwd
 * @description Implements the 'passwd' command for changing a user's password.
 */ class $84830fdf876247b6$export$f0c291ac64662912 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Change user password.';
    #prompt;
    #changePassword;
    constructor(services){
        super(services);
        this.#prompt = this.services.prompt;
        this.#changePassword = this.services.changePassword;
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
     * @param {object} context - The current application context.
     * @param {boolean} context.isLoggedIn - Whether a user is currently logged in.
     * @returns {boolean} True if the command is available, false otherwise.
     */ static isAvailable(context) {
        return true;
    }
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const promptOptions = {
            isSecret: true,
            allowHistory: false,
            allowAutocomplete: false
        };
        try {
            const oldPassword = await this.#prompt('Old password: ', promptOptions);
            if (oldPassword === null) throw new Error('Operation cancelled.');
            outputElement.innerHTML += 'Old password received.<br>';
            const newPassword = await this.#prompt('New password: ', promptOptions);
            if (newPassword === null) throw new Error('Operation cancelled.');
            outputElement.innerHTML += 'New password received.<br>';
            const confirmPassword = await this.#prompt('Confirm new password: ', promptOptions);
            if (confirmPassword === null) throw new Error('Operation cancelled.');
            outputElement.innerHTML += 'Confirmation received.<br>';
            if (newPassword !== confirmPassword) {
                outputElement.innerHTML += '<br>passwd: Passwords do not match. Password not changed.';
                return;
            }
            if (!newPassword) {
                outputElement.innerHTML += '<br>passwd: Password cannot be empty.';
                return;
            }
            outputElement.innerHTML += 'Changing password...';
            const result = await this.#changePassword(oldPassword, newPassword);
            // Append the final result to the existing acknowledgments
            outputElement.innerHTML += `<br>${result.message}`;
        } catch (error) {
            // A timeout on the prompt means the user cancelled (e.g., Ctrl+C)
            this.log.warn('Password change operation cancelled or failed:', error);
            outputElement.innerHTML += 'passwd: Operation cancelled.';
        }
    }
}


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
/**
 * @class Alias
 * @description Implements the 'alias' command to define or display command aliases.
 */ class $e034628669231935$export$17b520249a85fe16 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Define or display aliases.';
    #getAliases;
    #setAliases;
    constructor(services){
        super(services);
        this.#getAliases = this.services.getAliases;
        this.#setAliases = this.services.setAliases;
    }
    static man() {
        return `NAME\n       alias - Define or display command aliases.\n\nSYNOPSIS\n       alias [name[=value] ...]\n\nDESCRIPTION\n       The alias command allows you to create shortcuts for longer commands.\n\n       - With no arguments, 'alias' prints the list of all current aliases.\n       - With 'name=value', it defines an alias. The value can be a string in quotes.\n\nEXAMPLES\n       $ alias\n       (Displays all aliases.)\n\n       $ alias l="ls -l"\n       (Creates an alias 'l' for 'ls -l'.)`;
    }
    async execute(args) {
        this.log.log('Executing with args:', args);
        const output = document.createElement('div');
        output.style.whiteSpace = 'pre-wrap';
        const aliases = await this.#getAliases();
        // If no arguments, display all aliases
        if (args.length <= 1) {
            if (Object.keys(aliases).length === 0) {
                this.log.log('No aliases found to display.');
                outputDiv.textContent = 'No aliases defined.';
            } else {
                let aliasText = '';
                for (const [name, value] of Object.entries(aliases))aliasText += `alias ${name}='${value}'<br>`;
                outputDiv.innerHTML = aliasText;
                this.log.log('Displaying all defined aliases.');
            }
            return;
        }
        // Reconstruct the full argument string from the tokens to parse it.
        const aliasString = args.slice(1).join('');
        const assignmentIndex = aliasString.indexOf('=');
        if (assignmentIndex === -1) {
            outputDiv.textContent = 'alias: usage: alias [name[=value] ...]';
            return;
        }
        const name = aliasString.substring(0, assignmentIndex).trim();
        let value = aliasString.substring(assignmentIndex + 1).trim();
        // If the value was quoted, unwrap the quotes.
        if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (name) {
            aliases[name] = value;
            this.#setAliases(aliases);
            this.log.log(`Created alias: ${name}='${value}'`);
        } else {
            this.log.warn('Invalid alias format:', aliasString);
            outputDiv.textContent = `alias: invalid alias name`;
        }
    }
}


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
/**
 * @class Unalias
 * @description Implements the 'unalias' command to remove command aliases.
 */ class $621cadf9f489dfc6$export$b5b55b76df1a6c5e extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Remove an alias.';
    #getAliases;
    #setAliases;
    constructor(services){
        super(services);
        this.#getAliases = this.services.getAliases;
        this.#setAliases = this.services.setAliases;
    }
    static man() {
        return `NAME\n       unalias - Remove an alias.\n\nSYNOPSIS\n       unalias <alias_name>\n\nDESCRIPTION\n       The unalias command removes the specified alias from the list of defined aliases.\n\nEXAMPLES\n       $ unalias l\n       (Removes the alias 'l'.)`;
    }
    async autocompleteArgs(currentArgs) {
        if (currentArgs.length > 1) return [];
        const aliases = await this.#getAliases();
        const aliasNames = Object.keys(aliases);
        const input = currentArgs[0] || '';
        return aliasNames.filter((name)=>name.startsWith(input));
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const aliasName = args[1];
        if (!aliasName) {
            this.log.warn('No alias name provided.');
            outputDiv.textContent = 'unalias: usage: unalias <alias_name>';
            return;
        }
        const aliases = await this.#getAliases();
        if (aliasName in aliases) {
            this.log.log(`Removing alias: "${aliasName}"`);
            delete aliases[aliasName];
            this.#setAliases(aliases);
            outputDiv.textContent = `Alias '${aliasName}' removed.`;
        } else {
            this.log.warn(`Alias not found: "${aliasName}"`);
            outputDiv.textContent = `unalias: ${aliasName}: not found`;
        }
    }
}


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
 */ /**
 * Parses a "KEY=VALUE" string, trimming whitespace and quotes from the value.
 * @param {string} arg - The string to parse (e.g., 'my_var="some value"').
 * @returns {{name: string, value: string}|null} An object with name and value, or null if the format is invalid.
 */ function $fd5a8ab557e9974d$export$5469367a6e633daf(arg) {
    const match = arg.match(/^([^=]+)=(.*)$/);
    if (!match) return null;
    const name = match[1].trim();
    const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Strip leading/trailing quotes
    return {
        name: name,
        value: value
    };
}


/**
 * @class Export
 * @description Implements the 'export' command to set or display user-modifiable environment variables.
 */ class $f7d01fe940b9a288$export$f883e605db67eacf extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Set or display user environment variables.';
    #setUserspaceVariable;
    #getAllCategorizedVariables;
    constructor(services){
        super(services);
        this.#setUserspaceVariable = this.services.setUserspaceVariable;
        this.#getAllCategorizedVariables = this.services.getAllCategorizedVariables;
    }
    static man() {
        return `NAME\n       export - Set or display user environment variables.\n\nSYNOPSIS\n       export [name[=value] ...]\n\nDESCRIPTION\n       The export command allows you to view and modify user-configurable environment variables.\n       These variables are saved to your user profile.\n\n       - With no arguments, 'export' prints the list of all current user variables.\n       - With 'name=value', it defines a variable. The value can be a string in quotes.\n\nEXAMPLES\n       $ export\n       (Displays all user-configurable variables.)\n\n       $ export PS1="{user}$ "\n       (Changes the command prompt format.)`;
    }
    /**
     * Provides autocomplete suggestions for the export command.
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested variable names.
     */ async autocompleteArgs(currentArgs) {
        // The export command only operates on a single argument (e.g., 'PS1=value').
        // If there's more than one argument part, we should not offer any suggestions.
        if (currentArgs.length > 1) return [];
        const arg = currentArgs[0] || '';
        const allVars = await this.#getAllCategorizedVariables();
        const userSpaceVars = allVars.USERSPACE;
        const userSpaceVarNames = Object.keys(userSpaceVars);
        const parts = arg.split('=');
        const varName = parts[0].toUpperCase();
        // Case 1: Completing the variable name (before the '=')
        if (parts.length === 1) {
            const matchingVars = userSpaceVarNames.filter((name)=>name.startsWith(varName));
            // If there's only one match, suggest the name followed by an equals sign.
            if (matchingVars.length === 1) return [
                `${matchingVars[0]}=`
            ];
            return matchingVars;
        }
        // Case 2: Completing the value (after the '=')
        if (parts.length > 1 && userSpaceVars.hasOwnProperty(varName)) {
            const currentValue = userSpaceVars[varName];
            // Suggest the full assignment string, with the value quoted.
            return [
                `${varName}="${currentValue}"`
            ];
        }
        return [];
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const exportString = args.slice(1).join(' ');
        const allVars = await this.#getAllCategorizedVariables();
        const userSpaceVars = allVars.USERSPACE || {};
        // If no arguments, display all USERSPACE variables
        if (!exportString) {
            let outputText = '';
            for (const [name, value] of Object.entries(userSpaceVars))outputText += `export ${name}="${value}"<br>`;
            outputDiv.innerHTML = outputText.trim() || 'No user variables defined.';
            return;
        }
        // If arguments are provided, define a new variable
        const newVar = (0, $fd5a8ab557e9974d$export$5469367a6e633daf)(exportString);
        if (newVar) {
            const upperVarName = newVar.name.toUpperCase();
            // A variable can be exported if it's not a system/local/temp variable.
            // The most direct check is to see if it exists in any category other than USERSPACE.
            const isReadOnly = allVars.SYSTEM && allVars.SYSTEM.hasOwnProperty(upperVarName) || allVars.LOCAL && allVars.LOCAL.hasOwnProperty(upperVarName) || allVars.TEMP && allVars.TEMP.hasOwnProperty(upperVarName);
            if (!isReadOnly) {
                this.#setUserspaceVariable(upperVarName, newVar.value);
                this.log.log(`Set variable: ${newVar.name}='${newVar.value}'`);
            } else outputDiv.textContent = `export: permission denied: \`${newVar.name}\` is a read-only variable.`;
        } else {
            outputDiv.textContent = `export: invalid format. Use name="value"`;
            this.log.warn('Invalid export format:', exportString);
        }
    }
}


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
/**
 * @class Unset
 * @description Implements the 'unset' command to remove user-defined environment variables.
 */ class $05653863388bb58a$export$5da459000fb5cd5d extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Remove a user environment variable.';
    #deleteUserspaceVariable;
    #getAllCategorizedVariables;
    constructor(services){
        super(services);
        this.#deleteUserspaceVariable = this.services.deleteUserspaceVariable;
        this.#getAllCategorizedVariables = this.services.getAllCategorizedVariables;
    }
    static man() {
        return `NAME\n       unset - Remove a user environment variable.\n\nSYNOPSIS\n       unset <variable_name>\n\nDESCRIPTION\n       The unset command removes the specified variable from the list of user-defined environment variables.\n       It can only remove variables set with the 'export' command.\n\nEXAMPLES\n       $ unset MY_VAR\n       (Removes the user variable 'MY_VAR'.)`;
    }
    async autocompleteArgs(currentArgs) {
        if (currentArgs.length > 1) return [];
        const allVars = await this.#getAllCategorizedVariables();
        const userSpaceVars = allVars.USERSPACE || {};
        const userSpaceVarNames = Object.keys(userSpaceVars);
        const input = (currentArgs[0] || '').toUpperCase();
        return userSpaceVarNames.filter((name)=>name.startsWith(input));
    }
    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const varName = args[1];
        if (!varName) {
            outputDiv.textContent = 'unset: usage: unset <variable_name>';
            return;
        }
        const upperVarName = varName.toUpperCase();
        const allVars = await this.#getAllCategorizedVariables();
        const userSpaceVars = allVars.USERSPACE || {};
        if (Object.keys(userSpaceVars).includes(upperVarName)) await this.#deleteUserspaceVariable(upperVarName);
        else outputDiv.textContent = `unset: ${varName}: not found in userspace`;
    }
}


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
/**
 * @class Theme
 * @description Implements the 'theme' command to change the terminal's color theme.
 */ class $9be1bfc2349b0f11$export$14faa19a0f3bbeb2 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DESCRIPTION = 'Set the terminal color theme.';
    #setTheme;
    #getValidThemes;
    #getSystemVariable;
    constructor(services){
        super(services);
        // The environment service is used for getting/setting THEME variable.
        this.#setTheme = this.services.setTheme;
        this.#getSystemVariable = this.services.getSystemVariable;
        // The theme service is used for getting valid themes.
        this.#getValidThemes = this.services.getValidThemes;
    }
    static man() {
        return `NAME\n       theme - Set the terminal color theme.\n\nSYNOPSIS\n       theme [color]\n\nDESCRIPTION\n       Changes the terminal's color scheme. The selected theme is saved to your user profile.\n\n       Available colors: green, yellow, orange, red\n\nEXAMPLES\n       $ theme\n       (Displays the current theme.)\n\n       $ theme yellow\n       (Sets the theme to yellow.)`;
    }
    async autocompleteArgs(currentArgs) {
        if (currentArgs.length > 1) return [];
        const input = currentArgs[0] || '';
        return (await this.#getValidThemes()).filter((name)=>name.startsWith(input));
    }
    async execute(args, outputElement) {
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        const themeName = args[1];
        const validThemes = await this.#getValidThemes();
        if (!themeName) {
            // Get the current theme variable from the correct category.
            const { value: currentTheme } = await this.#getSystemVariable('THEME');
            outputDiv.innerHTML = `Current theme: ${currentTheme}<br>Available themes: ${validThemes.join(', ')}`;
            return;
        }
        if (validThemes.includes(themeName)) {
            // Set the environment variable. The Terminal component will listen for this change.
            this.#setTheme(themeName);
            outputDiv.textContent = `Theme set to '${themeName}'.`;
            this.log.log(`Theme set to: ${themeName}`);
        } else {
            outputDiv.innerHTML = `Error: Invalid theme '${themeName}'.<br>Available themes: ${validThemes.join(', ')}`;
            this.log.warn(`Invalid theme name provided: ${themeName}`);
        }
    }
}


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
var $329030bb3c43881e$exports = {};
$329030bb3c43881e$exports = $parcel$resolve("ccCIq");


/**
 * @class Version
 * @description Implements the 'version' command, displaying the application version.
 */ class $2f656a0166ae0dde$export$682c179f50ab847d extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    static DATA_FILE = new URL($329030bb3c43881e$exports);
    /**
     * @static
     * @type {string}
     * @description A brief description of the version command.
     */ static DESCRIPTION = 'Show version information.';
    constructor(services){
        super(services);
    }
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputPre = document.createElement('pre');
        if (outputElement) outputElement.appendChild(outputPre);
        try {
            const response = await fetch($2f656a0166ae0dde$export$682c179f50ab847d.DATA_FILE);
            if (!response.ok) throw new Error(`Failed to load version information: ${response.statusText}`);
            const versionText = await response.text();
            outputPre.textContent = versionText;
        } catch (error) {
            this.log.error('Error loading version information:', error);
            outputPre.textContent = 'Error: Could not load version information.';
        }
    }
    static man() {
        return `NAME\n       version - Show version information.\n\nDESCRIPTION\n       The version command displays the application's version and build information.`;
    }
}


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
/**
 * @class Date
 * @description Implements the 'date' command, which displays the current date and time.
 */ class $f696d3155b7f1ccd$export$6341f9a885713487 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    /**
     * @static
     * @type {string}
     * @description A brief description of the date command.
     */ static DESCRIPTION = 'Display the current date and time.';
    constructor(services){
        super(services);
    }
    /**
     * Executes the date command.
     * @param {string[]} args - Command arguments (not used).
     * @param {HTMLElement} outputElement - The element to display output in.
     */ async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);
        outputDiv.textContent = new Date().toString();
    }
    static man() {
        return `NAME\n       date - Display the current date and time.\n\nSYNOPSIS\n       date\n\nDESCRIPTION\n       The date command prints the current system date and time to standard output.`;
    }
}


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
/**
 * @class Cal
 * @description Implements the 'cal' command, which displays a calendar for the current month.
 */ class $8362b667a882ca67$export$86f6195a3540a85 extends (0, $0a4c644366d85fc4$export$da09ae580dcf9f05) {
    /**
     * @static
     * @type {string}
     * @description A brief description of the cal command.
     */ static DESCRIPTION = 'Display a calendar.';
    constructor(services){
        super(services);
    }
    /**
     * Executes the cal command.
     * @param {string[]} args - Command arguments (not used).
     * @param {HTMLElement} outputElement - The element to display output in.
     */ async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputPre = document.createElement('pre');
        if (outputElement) outputElement.appendChild(outputPre);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed
        const monthName = now.toLocaleString('default', {
            month: 'long'
        });
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, ...
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const calendarWidth = 20; // "Su Mo Tu We Th Fr Sa".length
        // 1. Header (Month and Year)
        const title = `${monthName} ${year}`;
        const padding = Math.floor((calendarWidth - title.length) / 2);
        let calendar = ' '.repeat(padding) + title + '\n';
        // 2. Day of week header
        calendar += 'Su Mo Tu We Th Fr Sa\n';
        // 3. Days
        // Add padding for the first day of the month
        calendar += ' '.repeat(firstDayOfMonth * 3);
        for(let day = 1; day <= daysInMonth; day++){
            calendar += String(day).padStart(2, ' ') + ' ';
            // If it's a Saturday and not the last day of the month, add a newline
            if ((day + firstDayOfMonth) % 7 === 0 && day < daysInMonth) calendar += '\n';
        }
        outputPre.textContent = calendar.trimEnd();
    }
    static man() {
        return `NAME\n       cal - Display a calendar.\n\nSYNOPSIS\n       cal\n\nDESCRIPTION\n       The cal command displays a calendar for the current month.`;
    }
}


/**
 * @class CommandBusService
 * @description Manages command registration, resolution, and execution via the event bus.
 *
 * @dispatches `autocomplete-broadcast` - Dispatches suggestions for any interested listeners.
 * @dispatches `variable-get-request` - Dispatches to get the ALIAS variable.
 * @dispatches `variable-set-request` - Dispatches to set the ALIAS variable.
 * @dispatches `fs-is-directory-request` - Dispatches to check if a path is a directory.
 *
 * @listens for `variable-get-response` - Listens for the ALIAS value.
 */ class $ac9f97ad4f74aa0f$export$b148e429f2a852fd extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    #registry = new Map();
    #apiProvider;
    constructor(eventBus){
        super(eventBus);
        this.#apiProvider = new (0, $a669e8ae43fdb238$export$241fc32970302a31)(eventBus);
        this.#registerCommands();
        this.log.log('Initializing...');
    }
    #registerCommands() {
        // Register commands with their specific service dependencies.
        this.register('welcome', (0, $e0c064800146e1d9$export$23191e4434a9e834), []);
        this.register('about', (0, $8006e978d23dfa7a$export$c8424c4d8ba2150), [
            'requestMedia'
        ]);
        this.register('env', (0, $746ab3f555bc367e$export$6c0517834721cef7), [
            'getAllCategorizedVariables'
        ]);
        this.register('help', (0, $58f4ca654afc80a2$export$1be7516c0280bee8), [
            'getCommandList',
            'getCommandMeta'
        ]);
        this.register('man', (0, $89dee8d09878550f$export$dd86fb79665233fb), [
            'getCommandList',
            'getCommandMeta'
        ]);
        this.register('history', (0, $704f97d014e3d2c7$export$84202caead5689ba), [
            'getHistory'
        ]);
        this.register('ls', (0, $f1cb7247a06daf47$export$e4ed7772d4272afd), [
            'getDirectoryContents'
        ]);
        this.register('cd', (0, $db5013326dab5472$export$ba0ebedd619a044f), [
            'changeDirectory',
            'getDirectoryContents'
        ]);
        this.register('cat', (0, $f56f4db7338f947e$export$15fe218ce13d3b19), [
            'getFileContents',
            'getDirectoryContents'
        ]);
        this.register('clear', (0, $a42c2ef9b96a7e14$export$47d037774b685574), [
            'clearScreen'
        ]);
        this.register('view', (0, $7461451f701afbcc$export$27a5bd065ad55220), [
            'getDirectoryContents',
            'getPublicUrl',
            'requestMedia'
        ]);
        this.register('adduser', (0, $014619ac3a5e9bb8$export$a2fae8d9b81b1013), [
            'prompt',
            'addUser'
        ]);
        this.register('login', (0, $e70c41a38a6398be$export$21a94553ffa41578), [
            'prompt',
            'login'
        ]);
        this.register('logout', (0, $f6dad85933050838$export$cad1a703886b4e3a), [
            'logout'
        ]);
        this.register('passwd', (0, $84830fdf876247b6$export$f0c291ac64662912), [
            'prompt',
            'changePassword'
        ]);
        this.register('alias', (0, $e034628669231935$export$17b520249a85fe16), [
            'getAliases',
            'setAliases'
        ]);
        this.register('unalias', (0, $621cadf9f489dfc6$export$b5b55b76df1a6c5e), [
            'getAliases',
            'setAliases'
        ]);
        this.register('export', (0, $f7d01fe940b9a288$export$f883e605db67eacf), [
            'setUserspaceVariable',
            'getAllCategorizedVariables'
        ]);
        this.register('unset', (0, $05653863388bb58a$export$5da459000fb5cd5d), [
            'deleteUserspaceVariable',
            'getAllCategorizedVariables'
        ]);
        this.register('theme', (0, $9be1bfc2349b0f11$export$14faa19a0f3bbeb2), [
            'getValidThemes',
            'setTheme',
            'getSystemVariable'
        ]);
        this.register('version', (0, $2f656a0166ae0dde$export$682c179f50ab847d), []);
        this.register('date', (0, $f696d3155b7f1ccd$export$6341f9a885713487), []);
        this.register('cal', (0, $8362b667a882ca67$export$86f6195a3540a85), []);
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).COMMAND_EXECUTE_BROADCAST]: this.#handleExecute.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_ALIASES_REQUEST]: this.#handleGetAliasesRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).SET_ALIASES_REQUEST]: this.#handleSetAliasesRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_AUTOCOMPLETE_SUGGESTIONS_REQUEST]: this.#handleGetAutocompleteSuggestions.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_COMMAND_LIST_REQUEST]: this.#handleGetCommandListRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_COMMAND_META_REQUEST]: this.#handleGetCommandMetaRequest.bind(this)
        };
    }
    register(name, CommandClass, requiredServices = []) {
        this.#registry.set(name, {
            CommandClass: CommandClass,
            requiredServices: requiredServices
        });
    }
    #handleExecute({ commandString: commandString, outputElement: outputElement }) {
        this.execute(commandString, outputElement);
    }
    getCommand(name) {
        const registration = this.#registry.get(name);
        if (registration) {
            const { CommandClass: CommandClass, requiredServices: requiredServices = [] } = registration;
            // Create a tailored 'services' object for the command, providing only what it needs.
            // This adheres to the principle of least privilege.
            const commandServices = requiredServices.reduce((acc, funcName)=>{
                if (typeof this.#apiProvider[funcName] === 'function') acc[funcName] = this.#apiProvider[funcName].bind(this.#apiProvider);
                else this.log.warn(`Command '${name}' requested unknown function '${funcName}'.`);
                return acc;
            }, {});
            return new CommandClass(commandServices);
        }
        return null;
    }
    getCommandClass(name) {
        const registration = this.#registry.get(name);
        return registration ? registration.CommandClass : undefined;
    }
    getCommandNames() {
        return Array.from(this.#registry.keys());
    }
    async #getAvailableCommandNames() {
        const availableRegistered = await this.getPermittedCommandNames();
        // This part of autocomplete might not have access to aliases without an async call.
        const aliasNames = []; // Simplified for now. A full implementation would need an async lookup.
        return [
            ...new Set([
                ...availableRegistered,
                ...aliasNames
            ])
        ].sort();
    }
    async getPermittedCommandNames() {
        const registeredCommands = this.getCommandNames();
        const context = await this.#getContext();
        const availableCommands = registeredCommands.filter((name)=>{
            const CommandClass = this.getCommandClass(name);
            if (CommandClass && typeof CommandClass.isAvailable === 'function') return CommandClass.isAvailable(context);
            return true;
        });
        return availableCommands.sort();
    }
    async #getContext() {
        return {
            isLoggedIn: await this.#apiProvider.isLoggedIn()
        };
    }
    /**
     * Resolves the effective command name and arguments, handling aliases.
     * @param {string[]} initialTokens - The raw tokens from the input string.
     * @returns {Promise<{commandName: string, args: string[]}>} An object containing the resolved command name and arguments.
     */ async #resolveCommandAndArgs(initialTokens) {
        let currentTokens = [
            ...initialTokens
        ]; // Work with a copy
        let commandName = (currentTokens[0] || '').trim();
        if (!commandName) return {
            commandName: '',
            args: []
        };
        const aliases = await this.#apiProvider.getAliases();
        if (aliases[commandName]) {
            const aliasValue = aliases[commandName];
            const aliasArgs = (0, $8a497e5e96e95e64$export$660b2ee2d4fb4eff)(aliasValue); // Tokenize alias value
            const remainingUserArgs = currentTokens.slice(1);
            currentTokens = [
                ...aliasArgs,
                ...remainingUserArgs
            ];
            commandName = (currentTokens[0] || '').trim(); // Re-evaluate commandName after alias expansion
        }
        return {
            commandName: commandName,
            args: currentTokens
        };
    }
    async execute(cmd, outputContainer) {
        try {
            const trimmedCmd = cmd.trim();
            if (!trimmedCmd) return; // Do nothing for an empty command.
            // Tokenize the command string. The resulting tokens include delimiters.
            const initialTokens = (0, $8a497e5e96e95e64$export$660b2ee2d4fb4eff)(trimmedCmd);
            if (initialTokens.length === 0) return;
            const { commandName: commandName, args: resolvedArgs } = await this.#resolveCommandAndArgs(initialTokens);
            if (!commandName) return;
            const outputElement = outputContainer ? outputContainer.element : null;
            if (this.#registry.has(commandName)) try {
                const commandHandler = this.getCommand(commandName);
                this.log.log(`Executing command: "${resolvedArgs}"`);
                await commandHandler.execute(resolvedArgs, outputElement);
            } catch (e) {
                if (outputElement) outputElement.textContent = `Error executing ${commandName}: ${e.message}`;
                this.log.error(`Error executing ${commandName}:`, e);
            }
            else if (outputElement) outputElement.textContent = `${commandName}: command not found`;
        } finally{
            // Always dispatch the finished event to allow the terminal loop to continue.
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).COMMAND_EXECUTION_FINISHED_BROADCAST);
        }
    }
    // --- Event Handlers for API Requests ---
    async #handleGetAliasesRequest({ respond: respond }) {
        try {
            const { value: value } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_SYSTEM_REQUEST, {
                key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).ALIAS
            });
            respond({
                aliases: JSON.parse(value || '{}')
            });
        } catch (error) {
            this.log.error("Failed to get aliases:", error);
            respond({
                aliases: {}
            });
        }
    }
    #handleSetAliasesRequest({ aliases: aliases }) {
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_SYSTEM_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).ALIAS,
            value: JSON.stringify(aliases)
        });
    }
    async #handleGetCommandListRequest({ respond: respond }) {
        const commands = await this.getPermittedCommandNames();
        respond({
            commands: commands
        });
    }
    #handleGetCommandMetaRequest({ commandName: commandName, metaKey: metaKey, respond: respond }) {
        const CommandClass = this.getCommandClass(commandName);
        if (CommandClass && CommandClass[metaKey] !== undefined) {
            const metaValue = CommandClass[metaKey];
            // If the metadata is a function (like man()), call it to get the value.
            if (typeof metaValue === 'function') respond({
                value: metaValue()
            });
            else respond({
                value: metaValue
            });
        } else // Respond with undefined if the command or meta key doesn't exist.
        respond({
            value: undefined
        });
    }
    async #handleGetAutocompleteSuggestions({ parts: parts, respond: respond }) {
        let suggestions = [];
        let description = '';
        const isCompletingCommandName = parts.length <= 1;
        if (isCompletingCommandName) {
            const commandNames = await this.#getAvailableCommandNames();
            suggestions = commandNames.map((name)=>name + ' ');
        } else {
            const { commandName: resolvedCommandName, args: resolvedArgsForCompletion } = await this.#resolveCommandAndArgs(parts);
            const CommandClass = this.getCommandClass(resolvedCommandName);
            // Check if the instance method exists on the prototype.
            // This is the correct way to check for an instance method before instantiating the command.
            if (CommandClass && typeof CommandClass.prototype.autocompleteArgs === 'function') {
                const commandInstance = this.getCommand(resolvedCommandName);
                const result = await commandInstance.autocompleteArgs(resolvedArgsForCompletion.slice(1)); // Pass args excluding the command name
                if (Array.isArray(result)) suggestions = result;
                else if (typeof result === 'object' && result !== null) {
                    suggestions = result.suggestions || [];
                    description = result.description || '';
                }
            }
        }
        respond({
            suggestions: suggestions,
            description: description
        });
    }
    #handleUpdateDefaultRequest({ key: key, respond: respond }) {
        if (key === (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).ALIAS) {
            const defaultValue = '{}';
            // Just respond with the default. The requester will handle setting it.
            respond({
                value: defaultValue
            });
        }
    }
}


/**
 * Nnoitra Terminal
 * Copyright (C) 2024 Arefi
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
 */ /**
 * Normalizes a path, resolving '..' and '.' segments and removing multiple slashes.
 * @param {string} path - The path to normalize.
 * @returns {string} The normalized, absolute path.
 */ function $2386f4acaa9f4511$export$6af368f973c74c5(path) {
    if (!path) return '/';
    const parts = path.split('/');
    const stack = [];
    for (const part of parts){
        if (part === '..') // If stack is not empty, pop. This handles going up a directory.
        {
            if (stack.length > 0) stack.pop();
        } else if (part !== '.' && part !== '') // Ignore '.' and empty parts (from multiple slashes), push others.
        stack.push(part);
    }
    return '/' + stack.join('/');
}
function $2386f4acaa9f4511$export$b09f2ff0bbcb43c7(path, pwd, home) {
    if (!path) return pwd;
    let effectivePath;
    if (path === '~') effectivePath = home;
    else if (path.startsWith('~/')) effectivePath = `${home}${path.substring(1)}`;
    else if (path.startsWith('/')) effectivePath = path;
    else effectivePath = `${pwd === '/' ? '' : pwd}/${path}`;
    return $2386f4acaa9f4511$export$6af368f973c74c5(effectivePath);
}


const $1f7b71a98b9db741$var$DEFAULT_PWD = '/';
/**
 * @class FilesystemService
 * @description Manages all interactions with the virtual filesystem via the event bus.
 *
 * @listens for `FS_AUTOCOMPLETE_PATH_REQUEST` - Responds with path suggestions.
 * @listens for `FS_GET_DIRECTORY_CONTENTS_REQUEST` - Responds with directory contents.
 * @listens for `FS_GET_FILE_CONTENTS_REQUEST` - Responds with file contents.
 */ class $1f7b71a98b9db741$export$dd775def1f4d3576 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    #apiManager;
    #storageServices = {
        SESSION: [
            (0, $e7af321b64423fde$export$fa3d5b535a2458a1).STORAGE_API_REQUEST,
            'SESSION'
        ],
        LOCAL: [
            (0, $e7af321b64423fde$export$fa3d5b535a2458a1).STORAGE_API_REQUEST,
            'LOCAL'
        ],
        REMOTE: [
            (0, $e7af321b64423fde$export$fa3d5b535a2458a1).STORAGE_API_REQUEST,
            'REMOTE'
        ]
    };
    /**
     * @private
     * @description Defines the root of the virtual filesystem (VFS).
     * The VFS architecture is as follows:
     * 1. There are three node types: 'file', 'directory', and 'mount'.
     * 2. A node (identified by a UUID) does not store its own name. Its name is stored
     *    by its parent directory.
     * 3. The entire filesystem has a single root ('/') which lives in SESSION storage.
     * 4. A 'directory' node's content is a list of [uuid, name] pairs for its children.
     * 5. A 'mount' node acts as a gateway to another filesystem. Its metadata contains
     *    the target storage service ('SESSION', 'LOCAL', 'REMOTE') and the UUID of the
     *    directory it is mounted to on that service.
     * 6. Path resolution starts at the root and traverses the directory tree. When a 'mount'
     *    node is encountered, the VFS seamlessly crosses over to the target storage service
     *    and continues the traversal from the mounted directory's UUID.
     *
     * For example, the root directory in SESSION storage contains a 'mount' node for '/home'.
     * This mount node points to the UUID of the '/home' directory located in REMOTE storage.
     */ #filesystem = {
        '/': {
            DEVICE: this.#storageServices.SESSION,
            UUID: '91e05212-d341-41f2-a4dd-615240ac62fc'
        },
        '/home': {
            DEVICE: this.#storageServices.REMOTE,
            UUID: 'a3771916-158b-47af-a78c-1151538590f0'
        },
        '/home/guest': {
            DEVICE: this.#storageServices.LOCAL,
            UUID: '897ba474-ff01-4312-bc06-4127dd49fc3c'
        },
        '/var/local': {
            DEVICE: this.#storageServices.LOCAL,
            UUID: 'eb8ac8ed-cc20-4286-aded-1b0810c1e99c'
        },
        '/var/remote': {
            DEVICE: this.#storageServices.REMOTE,
            UUID: '3c77ca09-8bb7-4e63-bea8-5c08ec325264'
        },
        '/var/session': {
            DEVICE: this.#storageServices.SESSION,
            UUID: '867486bd-2424-40b7-afb1-7e651fbd0bb9'
        }
    };
    constructor(eventBus, config = {}){
        super(eventBus);
        this.#apiManager = new (0, $fa0ff2eef523a395$export$cd2fa11040f69795)(config.apiUrl);
        this.log.log('Initializing...');
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_READ_FILE_REQUEST]: this.#handleReadFileRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_WRITE_FILE_REQUEST]: this.#handleWriteFile.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_GET_DIRECTORY_CONTENTS_REQUEST]: this.#handleGetDirectoryContents.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_MAKE_DIRECTORY_REQUEST]: this.#handleMakeDirectory.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_DELETE_FILE_REQUEST]: this.#handleDeleteFile.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_REMOVE_DIRECTORY_REQUEST]: this.#handleRemoveDirectory.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_CHANGE_DIRECTORY_REQUEST]: this.#handleChangeDirectory.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_RESOLVE_PATH_REQUEST]: this.#handleResolvePathRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).FS_GET_PUBLIC_URL_REQUEST]: this.#handleGetPublicUrl.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this)
        };
    }
    /**
     * Resolves a virtual path to its storage service and the UUID of the target node.
     * @param {string} path The virtual path.
     * @returns {Promise<{storageName: string, uuid: string}>}
     * @private
     */ async #resolvePathToStorage(path) {
        // 1. Get the clean, absolute path from the user-provided input.
        const resolvedPath = await this.#getResolvedPath(path);
        // 2. Start traversal from the absolute root of the VFS.
        let { storageName: storageName, uuid: currentUuid } = await this.#initializeVFS();
        // 3. If the path is just the root, we're done.
        if (resolvedPath === '/') return {
            storageName: storageName,
            uuid: currentUuid
        };
        // 4. Traverse the path parts one by one.
        const parts = resolvedPath.substring(1).split('/');
        for(let i = 0; i < parts.length; i++){
            const part = parts[i];
            const isLastPart = i === parts.length - 1;
            // The `traverseStep` function will handle moving one level down the directory tree,
            // including crossing mount points.
            const result = await this.#traverseStep(storageName, currentUuid, part);
            if (result.notFound) {
                // If the part was not found and it's the last part of the path,
                // it might be a file or directory we intend to create.
                // Return the parent's info so the calling function can proceed.
                if (isLastPart) return {
                    storageName: storageName,
                    parentUuid: currentUuid,
                    childName: part
                };
                else throw new Error(`Path not found: ${part} in ${path}`);
            }
            // Update context for the next iteration.
            storageName = result.storageName;
            currentUuid = result.uuid;
        }
        // 5. Return the final resolved node information.
        return {
            storageName: storageName,
            uuid: currentUuid
        };
    }
    /**
     * Resolves a user-provided path into a clean, absolute path string.
     * @param {string} path - The user-provided path.
     * @returns {Promise<string>} The absolute path.
     * @private
     */ async #getResolvedPath(path) {
        const [pwd, user] = await Promise.all([
            this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
                key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD
            }),
            this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_LOCAL_REQUEST, {
                key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).USER
            })
        ]);
        const homeDir = `/home/${user.value}`;
        return (0, $2386f4acaa9f4511$export$b09f2ff0bbcb43c7)(path, pwd.value, homeDir);
    }
    /**
     * Ensures the VFS root node exists and returns its initial context.
     * @returns {Promise<{storageName: string, uuid: string}>}
     * @private
     */ async #initializeVFS() {
        const { DEVICE: [_, storageName], UUID: rootUuid } = this.#filesystem['/'];
        let rootNode = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
            key: rootUuid
        });
        if (!rootNode) {
            rootNode = {
                meta: {
                    type: 'directory'
                },
                content: JSON.stringify([])
            };
            await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).SET_NODE, {
                key: rootUuid,
                node: rootNode
            });
        }
        return {
            storageName: storageName,
            uuid: rootUuid
        };
    }
    /**
     * Traverses a single step down the directory tree from a parent node.
     * @param {string} storageName - The storage service of the parent.
     * @param {string} parentUuid - The UUID of the parent directory.
     * @param {string} childName - The name of the child to find.
     * @returns {Promise<{storageName: string, uuid: string}|{notFound: boolean}>}
     * @private
     */ async #traverseStep(storageName, parentUuid, childName) {
        const parentNode = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
            key: parentUuid
        });
        if (!parentNode || parentNode.meta.type !== 'directory') throw new Error(`Path component is not a directory.`);
        const children = JSON.parse(parentNode.content || '[]');
        const childEntry = children.find((entry)=>entry[1] === childName);
        if (!childEntry) return {
            notFound: true
        };
        let childUuid = childEntry[0];
        const childNode = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
            key: childUuid
        });
        // If the child is a mount point, switch context to the target storage and UUID.
        if (childNode.meta.type === 'mount') return {
            storageName: childNode.meta.targetStorage,
            uuid: childNode.meta.targetUuid
        };
        return {
            storageName: storageName,
            uuid: childUuid
        };
    }
    async #writeFile(path, content) {
        const { storageName: storageName, parentUuid: parentUuid, childName: childName, uuid: uuid } = await this.#resolvePathToStorage(path);
        let fileUuid = uuid;
        if (!fileUuid) {
            // We need a valid parent directory to create a file in.
            if (!parentUuid || !childName) throw new Error('Cannot create file in a non-existent directory.');
            // Create the new file node.
            fileUuid = crypto.randomUUID();
            const fileNode = {
                meta: {
                    type: 'file'
                },
                content: content
            };
            await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).SET_NODE, {
                key: fileUuid,
                node: fileNode
            });
            // --- Read-Modify-Write with Lock ---
            // Acquire a lock on the parent directory to safely modify its content list.
            const { lockId: lockId } = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).LOCK_NODE, {
                key: parentUuid
            });
            try {
                // 1. Read: Get the parent directory node.
                const parentNode = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
                    key: parentUuid,
                    lockId: lockId
                });
                const children = JSON.parse(parentNode.content);
                // 2. Modify: Add the new [uuid, name] pair to the list.
                children.push([
                    fileUuid,
                    childName
                ]);
                parentNode.content = JSON.stringify(children);
                // 3. Write: Save the updated parent node.
                await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).SET_NODE, {
                    key: parentUuid,
                    node: parentNode,
                    lockId: lockId
                });
            } finally{
                // Always release the lock, even if an error occurred.
                await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).UNLOCK_NODE, {
                    key: parentUuid,
                    lockId: lockId
                });
            }
        } else {
            const fileNode = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
                key: fileUuid
            });
            // You can't use #writeFile on a directory.
            if (fileNode.meta.type === 'directory') throw new Error('Cannot write to a directory.');
            // Update the content and save the node.
            fileNode.content = content;
            await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).SET_NODE, {
                key: fileUuid,
                node: fileNode
            });
        }
    }
    async #readFile(path) {
        const { storageName: storageName, uuid: uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('File not found.');
        const node = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
            key: uuid
        });
        // Ensure the path points to a file.
        if (!node || node.meta.type !== 'file') throw new Error('Path is not a file.');
        return node.content;
    }
    async #deleteFile(path) {
        const { storageName: storageName, uuid: uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('File not found.');
        // This is a simplified delete. A real one would also remove it from parent's content array.
        await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).DELETE_NODE, {
            key: uuid
        });
    }
    async #makeDirectory(path) {
        const resolvedPath = await this.#getResolvedPath(path);
        if (resolvedPath === '/') return; // Cannot create root
        let { storageName: storageName, uuid: currentUuid } = await this.#initializeVFS();
        const parts = resolvedPath.substring(1).split('/');
        for (const part of parts){
            if (!part) continue;
            const result = await this.#traverseStep(storageName, currentUuid, part);
            if (result.notFound) {
                // Directory doesn't exist, so create it.
                const newDirUuid = crypto.randomUUID();
                const dirNode = {
                    meta: {
                        type: 'directory'
                    },
                    content: JSON.stringify([])
                };
                await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).SET_NODE, {
                    key: newDirUuid,
                    node: dirNode
                });
                // --- Read-Modify-Write with Lock to add it to the parent ---
                const { lockId: lockId } = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).LOCK_NODE, {
                    key: currentUuid
                });
                try {
                    const parentNode = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
                        key: currentUuid,
                        lockId: lockId
                    });
                    const children = JSON.parse(parentNode.content);
                    children.push([
                        newDirUuid,
                        part
                    ]);
                    parentNode.content = JSON.stringify(children);
                    await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).SET_NODE, {
                        key: currentUuid,
                        node: parentNode,
                        lockId: lockId
                    });
                } finally{
                    await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).UNLOCK_NODE, {
                        key: currentUuid,
                        lockId: lockId
                    });
                }
                currentUuid = newDirUuid;
            } else {
                // Directory exists, continue traversal.
                storageName = result.storageName;
                currentUuid = result.uuid;
            }
        }
    }
    async #removeDirectory(path) {
        const { storageName: storageName, uuid: uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('Directory not found.');
        // This is a simplified delete. A real one would be recursive and remove from parent.
        await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).DELETE_NODE, {
            key: uuid
        });
    }
    async #getMetaData(path) {
        const { storageName: storageName, uuid: uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) return {
            path: path,
            isDirectory: false,
            isFile: false
        };
        // Fetch the node and return its metadata.
        const node = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
            key: uuid
        });
        return {
            path: path,
            isDirectory: node.meta.type === 'directory' || node.meta.type === 'mount',
            isFile: node.meta.type === 'file'
        };
    }
    async #listDirectory(path) {
        const { storageName: storageName, uuid: uuid } = await this.#resolvePathToStorage(path);
        if (!uuid) throw new Error('Directory not found.');
        const node = await this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
            key: uuid
        });
        // Ensure the path points to a directory or mount.
        if (node.meta.type !== 'directory' && node.meta.type !== 'mount') throw new Error('Not a directory.');
        // Content is an array of [uuid, name] pairs.
        const childEntries = JSON.parse(node.content || '[]');
        // Fetch all child nodes to get their types.
        const childrenNodes = await Promise.all(childEntries.map((entry)=>this.#makeStorageRequest(storageName, (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE, {
                key: entry[0]
            })));
        // Combine the name from the parent with the type from the child.
        return childrenNodes.map((childNode, index)=>{
            return {
                name: childEntries[index][1],
                ...childNode.meta
            };
        });
    }
    async #handleWriteFile({ path: path, content: content, respond: respond }) {
        try {
            await this.#writeFile(path, content);
            respond({
                success: true
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleDeleteFile({ path: path, respond: respond }) {
        try {
            await this.#deleteFile(path);
            respond({
                success: true
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleMakeDirectory({ path: path, respond: respond }) {
        try {
            await this.#makeDirectory(path);
            respond({
                success: true
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleRemoveDirectory({ path: path, respond: respond }) {
        try {
            await this.#removeDirectory(path);
            respond({
                success: true
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleReadFileRequest({ path: path, respond: respond }) {
        try {
            const contents = await this.#getFileContents(path);
            respond({
                contents: contents
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleGetDirectoryContents({ path: path, respond: respond }) {
        try {
            const contents = await this.#getDirectoryContents(path);
            respond({
                contents: contents
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleChangeDirectory({ path: path, respond: respond }) {
        try {
            // The backend's 'resolve' action now handles path resolution relative to PWD.
            const newPath = await this.#resolveAndValidatePath(path, true);
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_TEMP_REQUEST, {
                key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD,
                value: newPath
            });
            respond({
                success: true
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleResolvePathRequest({ path: path, respond: respond }) {
        try {
            const resolvedPath = await this.#resolveAndValidatePath(path, false);
            respond({
                path: resolvedPath
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleGetPublicUrl({ path: path, respond: respond }) {
        try {
            // Use the dedicated 'get_public_url' API action.
            const { value: pwd } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
                key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD
            });
            const data = await this.#makeApiRequest('get_public_url', {
                path: path,
                pwd: pwd
            });
            respond({
                url: data.url
            });
        } catch (error) {
            respond({
                error: error
            });
        }
    }
    async #handleUpdateDefaultRequest({ key: key, respond: respond }) {
        if (key === (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD) {
            // The default PWD should be the user's home directory.
            const { value: homeDir } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
                key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HOME
            });
            // EnvironmentService will set the variable after receiving this default value.
            respond({
                value: homeDir
            });
        }
    }
    async #getDirectoryContents(path) {
        const { value: pwd } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD
        });
        return this.#makeApiRequest('ls', {
            path: path,
            pwd: pwd
        });
    }
    async #getFileContents(path) {
        const { value: pwd } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD
        });
        const response = await this.#makeApiRequest('cat', {
            path: path,
            pwd: pwd
        });
        return response.content;
    }
    async #makeApiRequest(action, params = {}) {
        try {
            const data = await this.#apiManager.get({
                action: action,
                ...params
            });
            if (data.error) throw new Error(data.error);
            return data;
        } catch (error) {
            this.log.error(`Error during API request for action "${action}" with path "${params.path}":`, error);
            throw error;
        }
    }
    async #resolveAndValidatePath(path, mustBeDir) {
        const { value: pwd } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD
        });
        const data = await this.#makeApiRequest('resolve', {
            path: path,
            pwd: pwd,
            must_be_dir: mustBeDir
        });
        return data.path;
    }
    /**
     * Makes a request to a storage backend.
     * @param {string} storageName - The name of the storage service (e.g., 'SESSION').
     * @param {string} api - The API method to call (from STORAGE_APIS).
     * @param {object} data - The data payload for the API method.
     * @returns {Promise<any>}
     * @private
     */ async #makeStorageRequest(storageName, api, data) {
        const { result: result, error: error } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).STORAGE_API_REQUEST, {
            storageName: storageName,
            api: api,
            data: data
        });
        if (error) throw error;
        return result;
    }
}


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

// Define constants for hardcoded strings
const $a12bc13b39e76674$var$VAR_THEME = 'THEME';
const $a12bc13b39e76674$var$DEFAULT_THEME = 'green';
/**
 * @class ThemeBusService
 * @description Manages the terminal's color theme by reacting to environment variable changes.
 *
 * @listens for `variable-get-response` - For the initial THEME value.
 *
 * @dispatches `variable-get-request` - To get the initial THEME variable on startup.
 * @dispatches `theme-changed-broadcast` - When the theme is successfully applied.
 */ class $a12bc13b39e76674$export$c7501d0b7167aa9c extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    static VALID_THEMES = [
        'green',
        'yellow',
        'orange',
        'red'
    ];
    #view = null;
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the Terminal component.
     */ setView(view) {
        this.#view = view;
        this.log.log('View connected.');
    }
    async start() {
        // After all services are initialized, request the initial theme value.
        const { value: value } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_SYSTEM_REQUEST, {
            key: $a12bc13b39e76674$var$VAR_THEME
        });
        const theme = value || $a12bc13b39e76674$var$DEFAULT_THEME;
        this.applyTheme(theme);
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).SET_THEME_REQUEST]: this.#handleSetThemeRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_VALID_THEMES_REQUEST]: this.#handleGetValidThemesRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).USER_CHANGED_BROADCAST]: this.#handleUserChanged.bind(this)
        };
    }
    #handleSetThemeRequest({ themeName: themeName, respond: respond }) {
        const finalTheme = this.applyTheme(themeName);
        respond({
            theme: finalTheme
        });
    }
    async #handleUserChanged() {
        this.log.log('User changed, re-evaluating theme.');
        // This will trigger the lazy-loading of remote variables if a user logged in,
        // or fall back to defaults if logged out, because the environment state has changed.
        const { value: value } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_SYSTEM_REQUEST, {
            key: $a12bc13b39e76674$var$VAR_THEME
        });
        const theme = value || $a12bc13b39e76674$var$DEFAULT_THEME;
        this.applyTheme(theme, false); // Don't persist, just apply the current state.
    }
    #handleUpdateDefaultRequest({ key: key, respond: respond }) {
        if (key === $a12bc13b39e76674$var$VAR_THEME) {
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_SYSTEM_REQUEST, {
                key: key,
                value: $a12bc13b39e76674$var$DEFAULT_THEME
            });
            respond({
                value: $a12bc13b39e76674$var$DEFAULT_THEME
            });
        }
    }
    #handleGetValidThemesRequest({ respond: respond }) {
        respond({
            themes: this.getValidThemes()
        });
    }
    applyTheme(themeName) {
        const finalTheme = $a12bc13b39e76674$export$c7501d0b7167aa9c.VALID_THEMES.includes(themeName) ? themeName : $a12bc13b39e76674$var$DEFAULT_THEME;
        if (this.#view) {
            const themeColor = `var(--nnoitra-color-${finalTheme})`;
            // Set the CSS variable directly on the host component, not the global document.
            // This ensures each terminal instance can have its own independent theme.
            this.#view.style.setProperty('--nnoitra-color-theme', themeColor);
        }
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).THEME_CHANGED_BROADCAST, {
            themeName: finalTheme
        });
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_SET_SYSTEM_REQUEST, {
            key: $a12bc13b39e76674$var$VAR_THEME,
            value: finalTheme
        });
        this.log.log(`Applied theme: ${finalTheme}`);
        // The theme command itself will handle persisting the variable.
        // This service only applies the theme based on the variable's value.
        return finalTheme;
    }
    getValidThemes() {
        return $a12bc13b39e76674$export$c7501d0b7167aa9c.VALID_THEMES;
    }
}


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

/**
 * @class InputBusService
 * @description Acts as a presenter for the CommandLine component. It handles all user
 * input logic, state management for the prompt, and communication with other services.
 *
 * @listens for `input-request` - Handles all requests for user input, configurable with options.
 * @listens for `history-indexed-response` - Updates the command line view with a history item.
 * @listens for `autocomplete-broadcast` - Updates the command line view with autocomplete suggestions.
 *
 * @dispatches `command-execute-broadcast` - When the user submits a command.
 * @dispatches `input-response-broadcast` - In response to an `input-request`.
 * @dispatches `history-previous-request` - When the user requests the previous history item.
 * @dispatches `history-next-request` - When the user requests the next history item.
 * @dispatches `autocomplete-request` - When the user requests autocomplete.
 */ class $de61280297a28a49$export$1043af0f0a1c6be9 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    #view = null;
    #inputBuffer = '';
    #isSecret = false;
    // State properties for the current input mode
    #allowHistory = false;
    #allowAutocomplete = false;
    #isNavigatingHistory = false;
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the CommandLine component.
     */ setView(view) {
        this.#view = view;
        // Listen for custom events from the command line component.
        this.#view.addEventListener('enter', (e)=>this.#submitInput(e.detail.value));
        this.#view.addEventListener('tab', ()=>this.#requestAutocomplete());
        this.#view.addEventListener('arrow-up', ()=>this.#requestPreviousHistory());
        this.#view.addEventListener('arrow-down', ()=>this.#requestNextHistory());
        this.#view.addEventListener('swipe-right', ()=>this.#requestAutocomplete());
        // Set the initial state to disabled.
        this.#view.setAttribute('disabled', ''); // The view is disabled until an input request is received.
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).INPUT_REQUEST]: this.#handleInputRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_INDEXED_RESPONSE]: this.#handleHistoryResponse.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).AUTOCOMPLETE_BROADCAST]: this.#handleAutocompleteBroadcast.bind(this)
        };
    }
    // --- Internal Event Handlers (called in response to view events) ---
    #submitInput(value) {
        // For any input, finish the read operation, which uses the `respond` function.
        // This handles both normal commands and interactive prompts consistently.
        if (this.respond) {
            this.#finishRead(value);
            this.#isNavigatingHistory = false; // Reset on command submission
            //this.#view.setAttribute('disabled', '');
            this.#view.clear();
        }
    }
    #requestAutocomplete() {
        this.log.log('Tab key pressed - triggering autocomplete if allowed.', this.#allowAutocomplete);
        if (this.#allowAutocomplete) this.#onAutocompleteRequest(this.#view.getValue());
    }
    #requestPreviousHistory() {
        if (this.#allowHistory) {
            if (!this.#isNavigatingHistory) {
                this.#inputBuffer = this.#view.getValue();
                this.#isNavigatingHistory = true;
            }
            this.#view.setAttribute('disabled', '');
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_PREVIOUS_REQUEST);
        }
    }
    #requestNextHistory() {
        this.log.log('ArrowDown key pressed - requesting next history if allowed.');
        if (this.#allowHistory && this.#isNavigatingHistory) {
            this.#view.setAttribute('disabled', '');
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).HISTORY_NEXT_REQUEST);
        }
    }
    // --- Private Logic ---
    #onAutocompleteRequest(value) {
        if (this.#allowAutocomplete) {
            this.#view.setAttribute('disabled', ''); // Disable input during the request.
            const cursorPosition = this.#view.getCursorPosition(); // This method needs to be added to CommandLine.js
            const beforeCursorText = value.substring(0, cursorPosition);
            const afterCursorText = value.substring(cursorPosition);
            this.log.log('Dispatching autocomplete request:', {
                beforeCursorText: beforeCursorText,
                afterCursorText: afterCursorText
            });
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).AUTOCOMPLETE_REQUEST, {
                beforeCursorText: beforeCursorText,
                afterCursorText: afterCursorText
            });
        }
    }
    #startRead(prompt, options = {}) {
        this.#isSecret = options.isSecret || false;
        // By default, a read operation should not allow history or autocomplete
        this.#allowHistory = options.allowHistory || false; // e.g. login prompt
        this.#allowAutocomplete = options.allowAutocomplete || false; // e.g. shell prompt
        this.#inputBuffer = '';
        this.#isNavigatingHistory = false;
        this.#view.clear();
        this.#view.removeAttribute('disabled');
        this.#view.setAttribute('placeholder', prompt);
        if (this.#isSecret) this.#view.setAttribute('secret', '');
        else this.#view.removeAttribute('secret');
        this.#view.focus();
    }
    #finishRead(value) {
        // The `respond` function is attached by the event bus's `request` method.
        this.respond({
            value: value
        });
        this.#view.setAttribute('disabled', ''); // Disable prompt after responding.
    }
    // --- Listener Implementations ---
    #handleInputRequest(payload) {
        const { prompt: prompt, options: options, respond: respond } = payload;
        this.#startRead(prompt, options);
        // Store the respond function to be called later in #finishRead
        this.respond = respond;
    }
    #handleHistoryResponse(payload) {
        if (!this.#view) return;
        this.#view.removeAttribute('disabled');
        if (payload.command !== undefined) {
            if (payload.index > 0) {
                this.#view.setValue(payload.command);
                // Use the new generic method to set the icon text
                this.#view.setAttribute('icon-text', `H:${payload.index}`);
            } else {
                // Index 0 means we've returned to the current, un-submitted command.
                this.#view.setValue(this.#inputBuffer);
                this.#isNavigatingHistory = false;
                this.#inputBuffer = '';
                this.#view.removeAttribute('icon-text');
            }
        }
    }
    #handleAutocompleteBroadcast(payload) {
        if (!this.#view) return;
        try {
            const { newTextBeforeCursor: newTextBeforeCursor, afterCursorText: afterCursorText } = payload;
            if (newTextBeforeCursor !== undefined) {
                const fullText = newTextBeforeCursor + afterCursorText;
                this.#view.setValue(fullText);
                this.#view.setCursorPosition(newTextBeforeCursor.length);
            }
        } finally{
            // Always re-enable the prompt after an autocomplete attempt.
            this.#view.removeAttribute('disabled');
        }
    }
}


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

/**
 * @class HintService
 * @description Acts as a presenter for the HintBox component. It listens for
 * autocomplete and command execution events to control the visibility and
 * content of the hint box.
 *
 * @listens for `autocomplete-broadcast` - Shows the hint box with suggestions.
 * @listens for `command-execute-broadcast` - Hides the hint box.
 */ class $1168caaff3e6a220$export$44f2e5c8a574f6bc extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    #view = null;
    #resizeObserver;
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the HintBox component.
     */ setView(view) {
        this.#view = view;
        // Observe the HintBox view. Whenever its size changes (e.g., when it's
        // shown or hidden), the observer will fire and request a scroll.
        this.#resizeObserver = new ResizeObserver(()=>{
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).UI_SCROLL_TO_BOTTOM_REQUEST);
        });
        this.#resizeObserver.observe(this.#view);
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).AUTOCOMPLETE_BROADCAST]: this.#handleShowHints.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).COMMAND_EXECUTE_BROADCAST]: this.#handleHideHints.bind(this)
        };
    }
    /**
     * Shows or hides the hint box based on the received suggestions.
     * @param {object} payload - The event payload.
     * @param {string[]} payload.suggestions - The list of suggestions.
     * @param {number} payload.prefixLength - The length of the common prefix.
     */ #handleShowHints(payload) {
        if (!this.#view) return;
        const { options: options = [], description: description, prefixLength: prefixLength } = payload;
        // Clear existing hints first
        this.#view.innerHTML = '';
        // Show hints if there are multiple options, or a single option that isn't empty,
        // or if a description is provided.
        if (description) {
            const li = document.createElement('li');
            li.textContent = description;
            this.#view.appendChild(li);
            this.#view.setAttribute('prefix-length', '0');
            this.#view.removeAttribute('hidden');
        } else if (options.length > 1) {
            const fragment = document.createDocumentFragment();
            options.forEach((fullSuggestion, index)=>{
                const li = document.createElement('li');
                li.textContent = fullSuggestion;
                fragment.appendChild(li);
            });
            this.#view.appendChild(fragment);
            this.#view.setAttribute('prefix-length', prefixLength);
            this.#view.removeAttribute('hidden');
        } else this.#view.setAttribute('hidden', '');
    }
    #handleHideHints() {
        if (this.#view) {
            this.#view.setAttribute('hidden', ''); // Hide the box
            this.#view.innerHTML = ''; // Clear its content
        }
    }
}


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
 */ /**
 * Draws a rounded square icon with a stylized "C" symbol and returns it as a data URL.
 * @param {object} options - The drawing options.
 * @param {number} options.size - The dimension of the icon.
 * @param {string} options.bgColor - The background color.
 * @param {string} options.symbolColor - The color of the symbol.
 * @param {number} options.borderWidth - The width of the border.
 * @returns {string} The data URL of the generated icon.
 */ function $b01ab09081bca0d7$export$be6e9b36f109dcde(options) {
    const { size: size, bgColor: bgColor, symbolColor: symbolColor } = options;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const radius = Math.max(2, size * 0.15);
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();
    const outerCircleRadius = size * 0.3;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, outerCircleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = symbolColor;
    ctx.fill(); // Draw the outer circle
    const innerCircleRadius = size * 0.22;
    ctx.beginPath();
    ctx.arc(size * 0.47, size * 0.39, innerCircleRadius, 0, 2 * Math.PI);
    // Use 'destination-out' to erase the overlapping part of the outer circle
    if (bgColor == 'transparent') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill(); // "Erase" the inner circle area from the outer circle
        ctx.globalCompositeOperation = 'source-over'; // Reset to default compositing mode
    } else {
        ctx.fillStyle = bgColor;
        ctx.fill(); // Draw the inner circle
    }
    return c.toDataURL('image/png');
}
function $b01ab09081bca0d7$export$3ca4ef467a209cfc(options) {
    const { size: size, bgColor: bgColor, symbolColor: symbolColor } = options;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    // Draw the background rounded rectangle
    const radius = Math.max(2, size * 0.15);
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();
    // Draw the hourglass shape
    const padding = size * 0.2;
    const top = padding;
    const bottom = size - padding;
    const left = padding;
    const right = size - padding;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(right, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.closePath();
    ctx.fillStyle = symbolColor;
    ctx.fill();
    return c.toDataURL('image/png');
}
function $b01ab09081bca0d7$export$44415b01e7e9bfff(options) {
    const { size: size, bgColor: bgColor, symbolColor: symbolColor } = options;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    // Draw the background rounded rectangle
    const radius = Math.max(2, size * 0.15);
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();
    // --- Draw the key symbol ---
    ctx.fillStyle = symbolColor;
    ctx.strokeStyle = symbolColor;
    const lineWidth = Math.max(1, size * 0.15);
    ctx.lineWidth = lineWidth;
    // Key head (circle)
    const headRadius = size * 0.15;
    ctx.beginPath();
    ctx.arc(size * 0.35, size * 0.35, headRadius, 0, 2 * Math.PI);
    ctx.stroke();
    // Key body and tooth
    ctx.beginPath();
    ctx.moveTo(size * 0.45, size * 0.45); // Start of body
    ctx.lineTo(size * 0.7, size * 0.7); // End of body
    ctx.lineTo(size * 0.6, size * 0.8); // Tooth end
    ctx.stroke();
    return c.toDataURL('image/png');
}


/**
 * @class FaviconService
 * @description Manages the website's favicon. It dynamically generates and updates the
 * favicon in the document head when the application's theme changes.
 *
 * @listens for `theme-changed-broadcast` - To trigger a favicon re-render.
 */ class $c6188742e46a2026$export$4fa158ef21c49fcc extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    static #SIZES = [
        16,
        32,
        64,
        128,
        180
    ];
    #view = null;
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    /**
     * Connects this service to its view component.
     * @param {object} view - The instance of the Terminal component.
     */ setView(view) {
        this.#view = view;
        this.log.log('View connected.');
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).THEME_CHANGED_BROADCAST]: this.#renderFavicon.bind(this)
        };
    }
    /**
     * Renders and sets the favicon by reading current CSS custom properties.
     * @private
     */ #renderFavicon() {
        if (!this.#view) {
            this.log.warn('Cannot render favicon, view is not connected.');
            return;
        }
        const styles = getComputedStyle(this.#view);
        const drawOptions = {
            bgColor: styles.getPropertyValue('--nnoitra-color-theme').trim() || 'green',
            symbolColor: styles.getPropertyValue('--nnoitra-color-text-highlight').trim() || '#000'
        };
        // Remove any existing favicon links
        document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']").forEach((el)=>el.remove());
        $c6188742e46a2026$export$4fa158ef21c49fcc.#SIZES.forEach((size)=>{
            const url = (0, $b01ab09081bca0d7$export$be6e9b36f109dcde)({
                ...drawOptions,
                size: size
            });
            this.log.log(url);
            const link = document.createElement('link');
            link.rel = size === 180 ? 'apple-touch-icon' : 'icon';
            link.type = 'image/png';
            link.sizes = `${size}x${size}`;
            link.href = url;
            document.head.appendChild(link);
        });
    }
}


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
 */ /**
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
/**
 * @class NnoitraBaseComponent
 * @extends HTMLElement
 * @description Provides a foundational class for all Nnoitra custom components.
 * It automates the setup of a closed Shadow DOM, applies shared styles,
 * and provides a mechanism for mapping elements with `part` attributes to `refs` for easy access.
 *
 * To use this base component:
 * 1. Extend `NnoitraBaseComponent` instead of `HTMLElement`.
 * 2. Call `super(htmlTemplate, componentMap)` in the constructor of the derived class.
 */ class $b614a4e6de2a3e5c$export$55ae5207ce896a6b extends HTMLElement {
    /** @private {ShadowRoot} #shadow - The closed Shadow DOM root for the component. */ #shadow;
    /** @protected {Object.<string, Element>} #internalRefs - A map of elements within the Shadow DOM, keyed by their `part` attribute. */ #internalRefs = {};
    #log;
    get log() {
        return this.#log;
    }
    /**
   * Creates an instance of NnoitraBaseComponent.
   * @param {string} htmlTemplate - The HTML string that defines the structure of the component's Shadow DOM.
   */ constructor(htmlTemplate){
        super();
        this.#log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)(this.constructor.name);
        // --- 1. Define Shared Styles ---
        // These styles provide a consistent base aesthetic for all components extending NnoitraBaseComponent.
        const sharedStyles = new CSSStyleSheet();
        sharedStyles.replaceSync(`
      /* Styles for encapsulation and structural fundamentals remain here.
       * The 'var()' function will look up the Custom Property
       * (which pierces the Shadow DOM) from the :root or host element.
       */

      /* Good practice to add this for consistent box model */
      * {
        box-sizing: border-box;
      }

      /* Apply colors and font-family to the host to establish inheritance
       * These custom properties should be defined at a higher level (e.g., :root or body).
       */
      :host {
        font-family: var(--nnoitra-font-family);
        color: var(--nnoitra-color-theme);
        font-size: var(--nnoitra-font-size);
      }
      `);
        // --- 2. Attach Shadow DOM and Apply Styles ---
        // Attach a closed Shadow DOM to prevent external access and style leakage.
        this.#shadow = this.attachShadow({
            mode: 'closed'
        });
        // Apply the shared styles to the Shadow DOM.
        this.#shadow.adoptedStyleSheets = [
            sharedStyles
        ];
        // --- 3. Process Template and Append ---
        // If an HTML template is provided, create a document fragment and append it to the Shadow DOM.
        if (htmlTemplate) {
            const fragment = this.#createFragment(htmlTemplate);
            this.#shadow.appendChild(fragment);
        }
        // --- 4. Automatic Reference Mapping ---
        // Automatically map elements with 'part' attributes to the #refs object.
        this.#setupRefs();
    }
    /**
   * Finds all elements in the shadow root that have a 'part' attribute
   * and maps them to the `#internalRefs` object using the 'part' value as the key.
   * This provides a convenient way to access internal elements of the component.
   * @private
   */ #setupRefs() {
        // Query for all elements that have a 'part' attribute within the Shadow DOM.
        const elementsWithPart = this.#shadow.querySelectorAll('[part]');
        elementsWithPart.forEach((el)=>{
            const partName = el.getAttribute('part');
            // Use the part name as the key for the refs object.
            this.log.log(`Mapping ref: "${partName}" to element`, el);
            this.#internalRefs[partName] = el;
        });
    }
    /**
   * Provides protected read-only access to the mapped element references for use by child classes.
   * This should not be accessed from outside the component's class hierarchy.
   * @protected
   * @returns {Object.<string, Element>} An object containing references to internal elements
   *   keyed by their `part` attribute.
   */ get refs() {
        return this.#internalRefs;
    }
    /**
   * Provides read-only access to the component's ShadowRoot.
   * @returns {ShadowRoot} The ShadowRoot instance of the component.
   */ get shadowRoot() {
        return this.#shadow;
    }
    #createFragment(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString;
        return template.content;
    }
}


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

/**
 * @constant {string} TEMPLATE - HTML template for the Icon component's shadow DOM.
 */ const $e00efd92cee71997$var$TEMPLATE = `<span part="symbol-container"></span>`;
/**
 * @constant {string} CSS - CSS styles for the Icon component's shadow DOM.
 */ const $e00efd92cee71997$var$CSS = `
:host {
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  padding: 0;
}

[part=symbol] {
  font-family: var(--nnoitra-font-family);
  font-size: inherit;
  color: var(--nnoitra-color-text-highlight); /* VAR */
  background-color: var(--nnoitra-color-highlight); /* VAR */
  display: inline-flex;
  justify-content: center; /* Center horizontally */
  align-items: center;     /* Center vertically */
  border-radius: 3px;
  margin: 0;
  min-width: 1.5em;
  height: 100%;
  width: 100%;
  padding: 0;
  padding-left: 0.2em;
  padding-right: 0.2em;
}

[part=symbol-container] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 3px;
  padding: 0;
  height: 100%;
  width: 100%;  
}
`;
// Define component-specific styles
const $e00efd92cee71997$var$iconSpecificStyles = new CSSStyleSheet();
$e00efd92cee71997$var$iconSpecificStyles.replaceSync($e00efd92cee71997$var$CSS);
/**
 * @class Icon
 * @extends BaseComponent
 * @description A custom element that displays various symbolic icons within the terminal,
 * indicating different states like ready, busy, or history index.
 */ class $e00efd92cee71997$export$7a974ebd36283afb extends (0, $b614a4e6de2a3e5c$export$55ae5207ce896a6b) {
    /**
   * @private
   * @type {Object.<string, string>}
   * @description A map of icon names to their corresponding string representations.
   */ #icons = {
        ready: '>',
        busy: "\u29D7",
        key: "\u26B7" // The key symbol for password prompts
    };
    /** @private @const {number[]} #ICON_SIZES - Sizes for generating image sets. */ static #ICON_SIZES = [
        16,
        32,
        48,
        64
    ];
    /**
   * Creates an instance of Icon.
   * Initializes the shadow DOM and applies component-specific styles.
   */ constructor(){
        super($e00efd92cee71997$var$TEMPLATE);
        this.shadowRoot.adoptedStyleSheets = [
            ...this.shadowRoot.adoptedStyleSheets,
            $e00efd92cee71997$var$iconSpecificStyles
        ];
        // Set a default state if no type is provided on creation.
        if (!this.hasAttribute('type')) this.setAttribute('type', 'ready');
    }
    static get observedAttributes() {
        return [
            'type',
            'value'
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.#render();
    }
    #render() {
        const type = this.getAttribute('type') || 'ready';
        const value = this.getAttribute('value');
        const container = this.refs['symbol-container'];
        container.innerHTML = ''; // Clear previous content
        switch(type){
            case 'busy':
                this.#setIcon(container, (0, $b01ab09081bca0d7$export$3ca4ef467a209cfc));
                break;
            case 'key':
                this.#setIcon(container, (0, $b01ab09081bca0d7$export$44415b01e7e9bfff));
                break;
            case 'indexed':
                const indexedSymbol = document.createElement('span');
                indexedSymbol.part = 'symbol';
                indexedSymbol.textContent = `${value || ''}:>`;
                container.appendChild(indexedSymbol);
                break;
            case 'text':
                const customTextSymbol = document.createElement('span');
                customTextSymbol.part = 'symbol';
                customTextSymbol.textContent = value || '';
                container.appendChild(customTextSymbol);
                break;
            case 'ready':
                this.#setIcon(container, (0, $b01ab09081bca0d7$export$be6e9b36f109dcde));
                break;
            default:
                break;
        }
    }
    #setIcon(container, drawFunction) {
        const styles = getComputedStyle(this);
        const drawOptions = {
            bgColor: 'transparent',
            symbolColor: styles.getPropertyValue('--nnoitra-color-text-highlight').trim()
        };
        const img = document.createElement('img');
        img.part = 'symbol'; // Revert to using the standard symbol part
        img.style.padding = '0'; // Remove padding for the image to fill its container
        img.style.borderRadius = '3px'; // Apply the border-radius directly
        img.src = (0, $b01ab09081bca0d7$export$be6e9b36f109dcde)({
            ...drawOptions,
            size: 32
        }); // Default src
        img.srcset = $e00efd92cee71997$export$7a974ebd36283afb.#ICON_SIZES.map((size)=>`${drawFunction({
                ...drawOptions,
                size: size
            })} ${size}w`).join(', ');
        container.appendChild(img);
    }
}
// Define the custom element 'nnoitra-icon'
customElements.define('nnoitra-icon', $e00efd92cee71997$export$7a974ebd36283afb);


/**
 * @constant {string} TEMPLATE - HTML template for the TerminalItem component's shadow DOM.
 */ const $215d290515523f1a$var$TEMPLATE = `
  <div part='header'></div>
  <div part='command-container'>
  <nnoitra-icon part='icon'></nnoitra-icon>
  <span part='command'></span>
  </div>
  <div part='output'><slot></slot></div>
  `;
/**
 * @constant {string} CSS - CSS styles for the TerminalItem component's shadow DOM.
 */ const $215d290515523f1a$var$CSS = `
:host {
  --line-height: 2em;
  --line-margin: 3px;
  display: block;
  margin: 0;
  margin-top: var(--line-margin);
  padding: 0;
}

[part=header],
[part=icon],
[part=command-container],
[part=output] {
  display: none;
}

:host(.header-visible) [part=header] {
  display: block;
}

:host(.active) [part=output] {
  display: block;
  margin-top: var(--line-margin);
}

:host(.active) [part=command-container] {
  display: flex; /* Ensure it's a flex container when active */
}

:host(.active) [part=icon] {
  display: block; /* Make the icon visible when its container is active */
}

[part=icon] {
  margin: 0;
  padding: 0;
  /* Other styling for the icon is handled by the nnoitra-icon component itself */
}

[part=command-container] {
  align-items: center;
  height: var(--line-height);
  padding: 0; /* Match header's padding */
  border-radius: 3px;
  margin: 0;
  margin-top: var(--line-margin);
}

[part=command] {
  word-break: break-all;
  white-space: pre-wrap;
  align-items: center;
  flex-grow: 1; /* Take up remaining space */
  color: var(--nnoitra-color-text); /* VAR */
  margin: 0;
  padding: 0;
  margin-left: 5px; /* Space between icon and command */

}
[part=header] {
  flex-grow: 1; /* Take up remaining space */
  min-height: var(--line-height);
  line-height: var(--line-height);
  align-items: center;     /* Center vertically */
  color: var(--nnoitra-color-text-highlight); /* VAR */
  background-color: var(--nnoitra-color-highlight); /* VAR */
  padding: 0px 5px;
  border-radius: 3px;
  margin: 0px;
  margin-top: var(--line-margin);
}

[part=header]::before {
  content: '\\200b'; /* Zero-width space */
  display: inline-block; /* Ensures it contributes to the line box */
}
[part=output] {
  color: var(--nnoitra-color-output);
  margin: 0;
}

[part=output] pre {
  white-space: pre-wrap; /* Preserve whitespace but wrap long lines */
  word-wrap: break-word; /* Ensure long words without spaces also break */
  margin: 0; /* Reset default margins on pre for consistency */
}
`;
// Define component-specific styles
const $215d290515523f1a$var$terminalItemSpecificStyles = new CSSStyleSheet();
$215d290515523f1a$var$terminalItemSpecificStyles.replaceSync($215d290515523f1a$var$CSS);
/**
 * @class TerminalItem
 * @extends BaseComponent
 * @description Represents a single entry in the terminal output, displaying a command and its corresponding output.
 * Each item includes a timestamp, user/host/path information, an indexed icon, and the command text.
 */ class $215d290515523f1a$export$260ee8fc65bf5db8 extends (0, $b614a4e6de2a3e5c$export$55ae5207ce896a6b) {
    /**
   * Creates an instance of TerminalItem.
   * Initializes the shadow DOM and applies component-specific styles.
   */ constructor(){
        // Pass the template and map to the base constructor, including the Icon component.
        super($215d290515523f1a$var$TEMPLATE);
        // Apply component-specific styles to the shadow DOM.
        this.shadowRoot.adoptedStyleSheets = [
            ...this.shadowRoot.adoptedStyleSheets,
            $215d290515523f1a$var$terminalItemSpecificStyles
        ];
    }
    static get observedAttributes() {
        return [
            'item-id',
            'header-text',
            'command'
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch(name){
            case 'item-id':
                this.id = `term-item-${newValue}`;
                // If the command is already set, update the icon's value.
                if (this.hasAttribute('command')) this.refs.icon.setAttribute('value', newValue);
                break;
            case 'header-text':
                this.refs.header.textContent = newValue;
                this.classList.add('header-visible');
                break;
            case 'command':
                this.refs.command.textContent = newValue;
                const itemId = this.getAttribute('item-id');
                if (itemId) {
                    this.refs.icon.setAttribute('type', 'indexed');
                    this.refs.icon.setAttribute('value', itemId);
                }
                this.classList.add('active');
                break;
        }
    }
}
// Define the custom element 'nnoitra-term-item'
customElements.define('nnoitra-term-item', $215d290515523f1a$export$260ee8fc65bf5db8);




const $aa54ae2db82f2dc3$var$DEFAULT_PS1 = '[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}';
const $aa54ae2db82f2dc3$var$DEFAULT_HOST = window.location.hostname;
const $aa54ae2db82f2dc3$var$DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';

/**
 * @class TerminalService
 * @description Acts as a presenter for the terminal's output area. It handles
 * creating and populating TerminalItem components in response to command execution.
 * It also orchestrates the main command execution loop.
 *
 * @listens for `input-response` - Receives user input and triggers command execution.
 * @listens for `command-execution-finished-broadcast` - Restarts the input loop.
 * @listens for `clear-screen-request` - Clears the terminal output.
 */ class $aa54ae2db82f2dc3$export$fdfecd291132ec23 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    static MOTD_FILE = new URL($fed81596da0f4423$exports);
    #view = null;
    #nextId = 1;
    #currentItem = null;
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the Terminal component.
     */ setView(view) {
        this.#view = view;
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).CLEAR_SCREEN_REQUEST]: this.#handleClear.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).UI_SCROLL_TO_BOTTOM_REQUEST]: this.#handleScrollToBottom.bind(this),
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).COMMAND_EXECUTION_FINISHED_BROADCAST]: this.#runCommandLoop.bind(this)
        };
    }
    /**
     * Starts the main terminal loop by requesting the first command.
     */ async start() {
        // Load the Message of the Day into the welcome area.
        if (this.#view && this.#view.welcomeOutputView) try {
            const motdText = await (0, $268f5c7225abb997$export$7d79caac809a3f17)($aa54ae2db82f2dc3$export$fdfecd291132ec23.MOTD_FILE);
            console.log(motdText);
            // Use white-space to preserve formatting without needing a <pre> tag.
            this.#view.welcomeOutputView.style.whiteSpace = 'pre-wrap';
            this.#view.welcomeOutputView.textContent = motdText;
        } catch (error) {
            this.log.error('Failed to load motd.dat:', error);
        }
        // Start the main command input loop.
        this.#runCommandLoop();
    }
    #handleUpdateDefaultRequest({ key: key, respond: respond }) {
        switch(key){
            case (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PS1:
                respond({
                    value: $aa54ae2db82f2dc3$var$DEFAULT_PS1
                });
                break;
            case (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HOST:
                respond({
                    value: $aa54ae2db82f2dc3$var$DEFAULT_HOST
                });
                break;
            case (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).UUID:
                const uuid = this.#view?.getAttribute('uuid') || $aa54ae2db82f2dc3$var$DEFAULT_UUID;
                respond({
                    value: uuid
                });
                break;
        }
    }
    #formatHeader(vars) {
        // Defaults are now set in the environment, so we can expect the values to be present.
        const format = vars[(0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PS1];
        const timestamp = new Date();
        const replacements = {
            user: vars[(0, $f3db42d7289ab17e$export$d71b24b7fe068ed).USER],
            host: vars[(0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HOST],
            path: vars[(0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD],
            year: timestamp.getFullYear(),
            month: String(timestamp.getMonth() + 1).padStart(2, '0'),
            day: String(timestamp.getDate()).padStart(2, '0'),
            hour: String(timestamp.getHours()).padStart(2, '0'),
            minute: String(timestamp.getMinutes()).padStart(2, '0'),
            second: String(timestamp.getSeconds()).padStart(2, '0')
        };
        return format.replace(/\{(\w+)\}/g, (match, key)=>replacements[key] ?? match);
    }
    #createAndDisplayHeader(headerText) {
        const id = this.#nextId++;
        const item = new (0, $215d290515523f1a$export$260ee8fc65bf5db8)();
        item.setAttribute('item-id', id);
        item.setAttribute('header-text', headerText);
        this.#view.appendToOutput(item);
        this.#currentItem = item; // Store as the pending item.
    }
    async #runCommandLoop() {
        try {
            // 1. Get all required environment variables for the prompt from their specific categories.
            const [ps1, user, host, pwd] = await Promise.all([
                this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_USERSPACE_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PS1
                }),
                this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_LOCAL_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).USER
                }),
                this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).HOST
                }),
                this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
                    key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).PWD
                })
            ]);
            // 2. Format and display the header.
            const promptVars = {
                PS1: ps1.value,
                USER: user.value,
                HOST: host.value,
                PWD: pwd.value
            };
            const headerText = this.#formatHeader(promptVars);
            this.#createAndDisplayHeader(headerText);
            // 2. Request user input and wait for the response.
            const { value: commandString } = await this.#requestInput();
            // 3. Populate the command item and dispatch for execution.
            if (this.#currentItem) {
                this.#currentItem.setAttribute('command', commandString);
                const outputContainer = {
                    element: this.#currentItem
                };
                this.log.log(`Executing command: "${commandString}"`);
                this.#view.scrollToBottom();
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).COMMAND_EXECUTE_BROADCAST, {
                    commandString: commandString,
                    outputElement: outputContainer
                });
            }
        } catch (error) {
            this.log.error("Error in command loop:", error);
            // If something fails, dispatch the finished event to try again.
            this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).COMMAND_EXECUTION_FINISHED_BROADCAST);
        }
    }
    #handleClear() {
        if (!this.#view) return;
        this.#view.clearOutput();
        this.#nextId = 1;
    }
    #handleScrollToBottom() {
        if (this.#view) this.#view.scrollToBottom();
    }
    #requestInput() {
        const prompt = '';
        // Standard options for a command prompt.
        const options = {
            allowHistory: true,
            allowAutocomplete: true,
            isSecret: false
        };
        // Request user input and return the promise.
        return this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).INPUT_REQUEST, {
            prompt: prompt,
            options: options
        }, 0);
    }
}


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
 */ /**
 * Finds the longest common starting substring in an array of strings.
 * @param {string[]} strings - An array of strings.
 * @returns {string} The longest common prefix.
 */ function $6e8da35c5fc7fc78$export$d1a9ee614178bec3(strings) {
    if (!strings || strings.length === 0) return '';
    let prefix = strings[0];
    for(let i = 1; i < strings.length; i++)while(strings[i].indexOf(prefix) !== 0){
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
    }
    return prefix;
}




class $6949df4f1b16bf43$export$1f14987e9cb31ec2 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).AUTOCOMPLETE_REQUEST]: this.#handleAutocompleteRequest.bind(this)
        };
    }
    async #handleAutocompleteRequest({ beforeCursorText: beforeCursorText, afterCursorText: afterCursorText }) {
        this.log.log('Autocomplete request received:', {
            beforeCursorText: beforeCursorText,
            afterCursorText: afterCursorText
        });
        const parts = (0, $8a497e5e96e95e64$export$660b2ee2d4fb4eff)(beforeCursorText);
        // The token to complete is the last one. The rest are the preceding arguments.
        const incompleteToken = parts.pop();
        parts.push('');
        let finalSuggestions = [];
        let completedToken = '';
        let description = '';
        let prefixLength = 0;
        try {
            // 1. Ask the CommandService for the final list of suggestions.
            // The CommandService will delegate to the specific command if necessary.
            const response = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).GET_AUTOCOMPLETE_SUGGESTIONS_REQUEST, {
                parts: parts
            });
            const { suggestions: potentialOptions } = response;
            description = response.description;
            if (potentialOptions && potentialOptions.length > 0) {
                // 2. Find the common prefix of the options.
                const filteredOptions = potentialOptions.filter((p)=>p.startsWith(incompleteToken));
                const commonPrefix = (0, $6e8da35c5fc7fc78$export$d1a9ee614178bec3)(filteredOptions);
                // 3. The newly completed token is the common prefix.
                completedToken = commonPrefix;
                // 4. Determine the final suggestions and if a suffix should be added.
                if (potentialOptions.length === 1 && potentialOptions[0] === completedToken) finalSuggestions = []; // No more options to show.
                else {
                    finalSuggestions = filteredOptions;
                    prefixLength = incompleteToken.length;
                }
            } else if (description) {
                // If there are no suggestions, but there is a description, pass it along.
                // This is for hinting arguments like usernames.
                completedToken = incompleteToken; // Keep what the user typed.
                finalSuggestions = []; // No actual suggestions to complete.
            }
        } catch (error) {
            this.log.error('Error during autocomplete request:', error);
        }
        // 5. Construct the new command line parts and broadcast.
        // Reconstruct the string before the cursor using the original tokenized parts.
        // The most robust way to create the new text is to append the "newly completed"
        // part of the token to the original text.
        const completionSuffix = completedToken.substring(incompleteToken.length);
        prefixLength += completionSuffix.length;
        const newTextBeforeCursor = beforeCursorText + completionSuffix;
        const payload = {
            newTextBeforeCursor: newTextBeforeCursor,
            options: finalSuggestions,
            afterCursorText: afterCursorText,
            description: description,
            prefixLength: prefixLength
        };
        this.log.warn(payload);
        this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).AUTOCOMPLETE_BROADCAST, payload);
    }
}


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

const $a8ff039d94e4dd6a$var$log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)('Media');
/**
 * @constant {string} CSS - CSS styles for the Media component's shadow DOM.
 */ const $a8ff039d94e4dd6a$var$CSS = `
  :host {
    display: block; /* Ensures the host element takes up space */
  }
  .media {
    /* Let the browser calculate width and height to preserve aspect ratio */
    width: auto;
    height: auto;
    /* On larger screens, cap the width at a reasonable size (e.g., 80rem) */
    /* Use min() to be responsive but also cap the width on large screens. */
    max-width: min(100%, 80rem);
    max-height: 80vh;
    margin: 10px 0;
    display: block; /* Helps with layout and margin */
  }
`;
const $a8ff039d94e4dd6a$var$mediaSpecificStyles = new CSSStyleSheet();
$a8ff039d94e4dd6a$var$mediaSpecificStyles.replaceSync($a8ff039d94e4dd6a$var$CSS);
/**
 * @class NnoitraMedia
 * @extends BaseComponent
 * @description A custom element for displaying images or videos. It handles the loading
 * of media and dispatches a 'media-loaded' event upon completion to solve scroll timing issues.
 */ class $a8ff039d94e4dd6a$export$7fc53215244aec38 extends (0, $b614a4e6de2a3e5c$export$55ae5207ce896a6b) {
    #mediaElement;
    constructor(){
        // No initial template needed, it's created dynamically.
        super();
        this.shadowRoot.adoptedStyleSheets = [
            ...this.shadowRoot.adoptedStyleSheets,
            $a8ff039d94e4dd6a$var$mediaSpecificStyles
        ];
    }
    static get observedAttributes() {
        return [
            'src'
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && oldValue !== newValue) this.src = newValue;
    }
    set src(source) {
        if (!source) return;
        // Clear previous media if any
        if (this.#mediaElement) this.#mediaElement.remove();
        const supportedImage = /\.(png|jpg|jpeg|gif|webp)$/i;
        const supportedVideo = /\.(mp4|webm)$/i;
        if (supportedImage.test(source)) this.#mediaElement = document.createElement('img');
        else if (supportedVideo.test(source)) {
            this.#mediaElement = document.createElement('video');
            this.#mediaElement.controls = true;
        } else {
            $a8ff039d94e4dd6a$var$log.error(`Unsupported file type for src: ${source}`);
            return;
        }
        this.#mediaElement.classList.add('media');
        this.#mediaElement.src = source;
        this.shadowRoot.appendChild(this.#mediaElement);
    }
    get src() {
        return this.getAttribute('src');
    }
}
// Define the custom element 'nnoitra-media'
customElements.define('nnoitra-media', $a8ff039d94e4dd6a$export$7fc53215244aec38);



class $9d2e60a2443f3a3e$export$28bb6dc04d8f7127 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    constructor(eventBus){
        super(eventBus);
        this.log.log('Initializing...');
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).MEDIA_REQUEST]: this.#handleMediaRequest.bind(this)
        };
    }
    #handleMediaRequest({ src: src, respond: respond }) {
        const mediaElement = new (0, $a8ff039d94e4dd6a$export$7fc53215244aec38)();
        mediaElement.src = src;
        // Observe the media element. When it loads and its size changes,
        // automatically request a scroll to keep the prompt in view.
        const observer = new ResizeObserver((entries)=>{
            const entry = entries[0];
            // The first resize event might be when the element is added with 0 height.
            // We only act when we see a meaningful height, which indicates the media has loaded.
            if (entry.contentRect.height > 1) {
                this.dispatch((0, $e7af321b64423fde$export$fa3d5b535a2458a1).UI_SCROLL_TO_BOTTOM_REQUEST);
                // Now that the media has its final size, we can stop observing.
                observer.disconnect();
            }
        });
        observer.observe(mediaElement);
        respond({
            mediaElement: mediaElement
        });
    }
}


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
 */ /**
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
 */ /**
 * @class Mutex
 * @description Provides a simple async mutex implementation for resource locking based on keys.
 */ class $fe33bc0387071332$export$ca12f2943758ef55 {
    #operationQueues = new Map();
    /**
     * Acquires a lock for a given key.
     * @param {string} key The key for the resource to lock.
     * @param {string} [explicitLockId] - An existing lock ID to re-acquire. If provided, it will
     * either grant access if the ID is correct or throw an error if it's invalid. If omitted,
     * it will queue to acquire a new lock.
     * @returns {Promise<string>} A promise that resolves with the lock ID.
     */ async acquire(key, explicitLockId) {
        const queue = this.#operationQueues.get(key);
        if (explicitLockId) {
            if (queue?.lockId && queue.lockId === explicitLockId) // The correct lock is already held, grant access without waiting.
            return explicitLockId;
            else // An incorrect or expired lock ID was provided.
            throw new Error(`Invalid lock ID '${explicitLockId}' for operation on '${key}'. Current lock is '${queue?.lockId}'.`);
        } else {
            // No explicit lockId, so queue for a new lock.
            let newGateResolver;
            const newGatePromise = new Promise((resolve)=>{
                newGateResolver = resolve;
            });
            const lastGatePromise = queue?.promise || Promise.resolve();
            if (!queue) this.#operationQueues.set(key, {
                promise: newGatePromise
            });
            else queue.promise = newGatePromise;
            await lastGatePromise;
            const lockId = crypto.randomUUID();
            const currentQueue = this.#operationQueues.get(key);
            currentQueue.resolve = newGateResolver;
            currentQueue.lockId = lockId;
            return lockId;
        }
    }
    /**
     * Releases a lock for a given key if the lockId is valid.
     * @param {string} key The key for the resource to unlock.
     * @param {string} lockId The ID of the lock to release.
     */ release(key, lockId) {
        const queueEntry = this.#operationQueues.get(key);
        if (queueEntry && queueEntry.lockId === lockId) queueEntry.resolve();
        else throw new Error(`Attempted to unlock '${key}' with an invalid or expired lockId.`);
    }
}


/**
 * @class BaseStorageService
 * @description Provides a foundational class for all storage backend services (e.g., Local, Remote, Session).
 * It defines a common interface for filesystem operations and handles routing of storage API requests.
 */ class $cdeb0865826d5baf$export$282961b3a2302fe3 extends (0, $6684178f93132198$export$3b34f4e23c444fa8) {
    /**
     * The unique name of this storage service (e.g., 'LOCAL', 'REMOTE').
     * Child classes MUST override this static property.
     * @type {string}
     */ static STORAGE_NAME = 'BASE';
    #mutex = new (0, $fe33bc0387071332$export$ca12f2943758ef55)();
    constructor(eventBus){
        super(eventBus);
        this.log.log(`Initializing ${this.constructor.STORAGE_NAME} storage service...`);
    }
    get eventHandlers() {
        return {
            [(0, $e7af321b64423fde$export$fa3d5b535a2458a1).STORAGE_API_REQUEST]: this.#handleStorageApiRequest.bind(this)
        };
    }
    /**
     * Handles incoming storage API requests and routes them to the appropriate method
     * if the request is intended for this specific storage service.
     * @param {object} payload - The event payload.
     * @param {string} payload.storageName - The name of the target storage service.
     * @param {string} payload.api - The name of the method to call.
     * @param {object} payload.data - The data for the method.
     * @param {Function} payload.respond - The function to call with the result.
     * @private
     */ async #handleStorageApiRequest({ storageName: storageName, api: api, data: data, respond: respond }) {
        if (storageName !== this.constructor.STORAGE_NAME) return;
        const { key: key, lockId: explicitLockId } = data;
        if (!key) throw new Error(`A 'key' must be provided for any storage operation. API: ${api}`);
        let result;
        let lockId;
        try {
            lockId = await this.#mutex.acquire(key, explicitLockId);
            if (api === (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).GET_NODE) result = await this.getNode(data);
            else if (api === (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).SET_NODE) result = await this.setNode(data);
            else if (api === (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).DELETE_NODE) result = await this.deleteNode(data);
            else if (api === (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).LIST_KEYS_WITH_PREFIX) result = await this.listKeysWithPrefix(data);
            else if (api === (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).LOCK_NODE) result = {
                lockId: lockId
            };
        } finally{
            // Release the lock if it was an explicit unlock, OR if it was an implicit lock for a single operation.
            if (api === (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).UNLOCK_NODE || lockId && !explicitLockId && api !== (0, $fa4d2f5b4bb4a3ef$export$95d56908f64857f4).LOCK_NODE) this.#mutex.release(key, lockId);
        }
        respond({
            result: result
        });
    }
    // --- Abstract methods to be implemented by child classes ---
    async getNode({ key: key }) {
        throw new Error(`${this.constructor.name} must implement the 'getNode' method.`);
    }
    async setNode({ key: key, node: node }) {
        throw new Error(`${this.constructor.name} must implement the 'setNode' method.`);
    }
    async deleteNode({ key: key }) {
        throw new Error(`${this.constructor.name} must implement the 'deleteNode' method.`);
    }
    async listKeysWithPrefix({ key: key }) {
        throw new Error(`${this.constructor.name} must implement the 'listKeysWithPrefix' method.`);
    }
}




/**
 * @class LocalStorageService
 * @description Implements a storage backend using the browser's localStorage.
 */ class $2336f685277e82f7$export$fda5b86bc4921cb9 extends (0, $cdeb0865826d5baf$export$282961b3a2302fe3) {
    static STORAGE_NAME = 'LOCAL';
    #storageKeyPrefix = 'NNOITRA_LOCAL';
    constructor(eventBus){
        super(eventBus);
    }
    /**
     * Retrieves a node by its key (path).
     * @param {object} data
     * @param {string} data.key - The key (path) of the node.
     * @returns {Promise<object|undefined>} The node object or undefined if not found.
     */ async getNode({ key: key }) {
        const physicalKey = await this.#getPhysicalKey(key);
        const storedValue = localStorage.getItem(physicalKey);
        if (storedValue === null) return undefined;
        try {
            return JSON.parse(storedValue);
        } catch (e) {
            this.log.error(`Failed to parse localStorage key ${physicalKey}:`, e);
            return undefined;
        }
    }
    /**
     * Sets a node for a given key (path).
     * @param {object} data
     * @param {string} data.key - The key (path) of the node.
     * @param {object} data.node - The node object to store.
     */ async setNode({ key: key, node: node }) {
        const physicalKey = await this.#getPhysicalKey(key);
        try {
            localStorage.setItem(physicalKey, JSON.stringify(node));
        } catch (e) {
            this.log.error(`Failed to write to localStorage for key ${physicalKey}:`, e);
            throw e;
        }
    }
    /**
     * Deletes a node by its key (path).
     * @param {object} data
     * @param {string} data.key - The key (path) of the node to delete.
     */ async deleteNode({ key: key }) {
        const physicalKey = await this.#getPhysicalKey(key);
        localStorage.removeItem(physicalKey);
    }
    /**
     * Returns a list of all keys that start with a given prefix.
     * @param {object} data
     * @param {string} data.key - The prefix to search for.
     * @returns {Promise<string[]>} A list of matching keys.
     */ async listKeysWithPrefix({ key: key }) {
        const physicalPrefix = await this.#getPhysicalKey(key);
        const matchingKeys = [];
        for(let i = 0; i < localStorage.length; i++){
            const k = localStorage.key(i);
            if (k.startsWith(physicalPrefix)) // Return the logical key, not the physical one
            matchingKeys.push(k.substring(physicalPrefix.length - key.length));
        }
        return matchingKeys;
    }
    /**
     * Constructs the actual key used in localStorage by prepending the UUID.
     * @param {string} logicalKey - The key provided by the consuming service.
     * @returns {Promise<string>} The physical key for localStorage.
     */ async #getPhysicalKey(logicalKey) {
        const { value: uuid } = await this.request((0, $e7af321b64423fde$export$fa3d5b535a2458a1).VAR_GET_TEMP_REQUEST, {
            key: (0, $f3db42d7289ab17e$export$d71b24b7fe068ed).UUID
        });
        return `${this.#storageKeyPrefix}_${uuid}_${logicalKey}`;
    }
}


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
/**
 * @class SessionStorageService
 * @description Implements an in-memory, temporary storage backend.
 * All data is lost when the page is reloaded.
 */ class $0cf3fa3ec2f0977a$export$b06b6fb6b8d957f7 extends (0, $cdeb0865826d5baf$export$282961b3a2302fe3) {
    static STORAGE_NAME = 'SESSION';
    // A simple in-memory map to act as the filesystem.
    // Keys are full paths, values are file contents (string).
    // Directories are implicitly defined by the paths of the files.
    #data = new Map();
    // A set to explicitly track directory paths, allowing for empty directories.
    #directories = new Set();
    constructor(eventBus){
        super(eventBus);
        // You could pre-populate with some default files/directories here if needed.
        // e.g., this.#data.set('/tmp/example.txt', 'This is a temporary file.');
        // The root directory always exists.
        this.#directories.add('/');
    }
    /**
     * Lists the contents of a given path.
     * @param {object} data
     * @param {string} data.path - The path of the directory to list.
     * @returns {Promise<{files: Array, directories: Array}>}
     */ async listPath({ path: path }) {
        const normalizedPath = path === '/' ? '' : path;
        const pathPrefix = normalizedPath ? normalizedPath + '/' : '/';
        const files = [];
        const directories = new Set();
        // Find all files in the current path
        for (const entryPath of this.#data.keys())if (entryPath.startsWith(pathPrefix)) {
            const relativePath = entryPath.substring(pathPrefix.length);
            if (!relativePath.includes('/')) files.push({
                name: relativePath,
                size: this.#data.get(entryPath).length
            });
        }
        // Find all explicit subdirectories in the current path
        for (const dirPath of this.#directories)if (dirPath.startsWith(pathPrefix) && dirPath !== path) {
            const relativePath = dirPath.substring(pathPrefix.length);
            const firstPart = relativePath.split('/')[0];
            if (firstPart) directories.add(firstPart);
        }
        return {
            files: files,
            directories: Array.from(directories).map((name)=>({
                    name: name
                }))
        };
    }
    /**
     * Reads the content of a file.
     * @param {object} data
     * @param {string} data.path - The path of the file to read.
     * @returns {Promise<string>} The file content.
     */ async readFile({ path: path }) {
        if (!this.#data.has(path)) throw new Error('File not found.');
        return this.#data.get(path);
    }
    /**
     * Writes content to a file, overwriting if it exists.
     * @param {object} data
     * @param {string} data.path - The path of the file to write.
     * @param {string} data.content - The content to write.
     */ async writeFile({ path: path, content: content }) {
        // Ensure parent directory exists
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        this.#ensureDirectoryExists(parentPath);
        this.#data.set(path, content);
    }
    /**
     * Deletes a file.
     * @param {object} data
     * @param {string} data.path - The path of the file to delete.
     */ async deleteFile({ path: path }) {
        if (!this.#data.has(path)) throw new Error('File not found.');
        this.#data.delete(path);
    }
    /**
     * Creates a directory. In this in-memory model, directories are implicit,
     * so this method doesn't need to do anything but succeed.
     */ async makeDirectory({ path: path }) {
        this.#ensureDirectoryExists(path);
    }
    /**
     * Removes a directory. This will remove all files and subdirectories within it.
     * @param {object} data
     * @param {string} data.path - The path of the directory to remove.
     */ async removeDirectory({ path: path }) {
        const prefix = path === '/' ? '/' : path + '/';
        // Remove all files within the directory
        for (const key of this.#data.keys())if (key.startsWith(prefix)) this.#data.delete(key);
        // Remove the directory and all subdirectories
        for (const dir of this.#directories)if (dir.startsWith(path)) this.#directories.delete(dir);
    }
    async getMetaData({ path: path }) {
        // This simple in-memory storage doesn't have complex metadata.
        // We can return basic information.
        const isFile = this.#data.has(path);
        return {
            path: path,
            isFile: isFile,
            isDirectory: this.#directories.has(path),
            publicUrl: null // Session storage is not publicly accessible
        };
    }
    /**
     * Ensures a directory path and all its parents are explicitly created.
     * @param {string} path - The full path of the directory to create.
     * @private
     */ #ensureDirectoryExists(path) {
        const parts = path.split('/').filter((p)=>p);
        let currentPath = '';
        for (const part of parts){
            currentPath += '/' + part;
            this.#directories.add(currentPath);
        }
    }
}


class $a0b5a846c0e262ae$export$f001b1e94070bef0 {
    constructor(config = {}){
        const bus = new (0, $9919a9f5491eef72$export$5087227eb54526)();
        this.services = {
            bus: bus,
            environment: (0, $1b934ed4cb64b454$export$e4a82699f51b6a33).create(bus),
            accounting: (0, $34004656f0914987$export$f63b2c629ff23c50).create(bus, {
                apiUrl: config.accountingApi
            }),
            history: (0, $aa7bd8a129968d33$export$682fe5af4326291).create(bus),
            command: (0, $ac9f97ad4f74aa0f$export$b148e429f2a852fd).create(bus),
            theme: (0, $a12bc13b39e76674$export$c7501d0b7167aa9c).create(bus),
            input: (0, $de61280297a28a49$export$1043af0f0a1c6be9).create(bus),
            hint: (0, $1168caaff3e6a220$export$44f2e5c8a574f6bc).create(bus),
            favicon: (0, $c6188742e46a2026$export$4fa158ef21c49fcc).create(bus),
            terminal: (0, $aa54ae2db82f2dc3$export$fdfecd291132ec23).create(bus),
            filesystem: (0, $1f7b71a98b9db741$export$dd775def1f4d3576).create(bus, {
                apiUrl: config.filesystemApi
            }),
            autocomplete: (0, $6949df4f1b16bf43$export$1f14987e9cb31ec2).create(bus),
            media: (0, $9d2e60a2443f3a3e$export$28bb6dc04d8f7127).create(bus),
            localStorage: (0, $2336f685277e82f7$export$fda5b86bc4921cb9).create(bus),
            sessionStorage: (0, $0cf3fa3ec2f0977a$export$b06b6fb6b8d957f7).create(bus)
        };
    }
}



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

/**
 * @constant {string} TEMPLATE - HTML template for the TerminalPrompt component's shadow DOM.
 */ const $6f8547af8f66a9b0$var$TEMPLATE = `
  <div part="footer">
  <nnoitra-icon part="icon"></nnoitra-icon>
  <input type="text" autocomplete="off" spellcheck="false" autocapitalize="off" part="prompt">
  </div>
  `;
/**
 * @constant {string} CSS - CSS styles for the TerminalPrompt component's shadow DOM.
 */ const $6f8547af8f66a9b0$var$CSS = `
[part=footer] {
  margin: 0;
  padding: 3px;
  display: flex;
  align-items: stretch; /* Change to stretch */
  border-top: 1px solid var(--nnoitra-color-highlight); /* VAR */
  background-color: var(--nnoitra-color-background); /* VAR */
  box-sizing: border-box;
  z-index: 100;
  font-size: var(--nnoitra-font-size);
  height: 2.2em;
}
[part=prompt] {
  background: none;
  border: none;
  outline: none;
  padding: 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin: 0;
  flex-grow: 1;
  color: var(--nnoitra-color-theme); /* VAR */
  min-width: 0; /* Prevents overflow in flex container */
  flex-grow: 1;
  font-family: var(--nnoitra-font-family);
  font-size: var(--nnoitra-font-size);
  width: 100%;
}
[part=prompt]::placeholder {
  color: var(--nnoitra-color-placeholder);
  font-family: var(--nnoitra-font-family);
  font-size: var(--nnoitra-font-size);
  opacity: 1; /* Firefox has a lower default opacity for placeholders */
  width: 100%;
}

[part=icon] {
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  padding: 0;
}
`;
// Define component-specific styles
const $6f8547af8f66a9b0$var$terminalPromptSpecificStyles = new CSSStyleSheet();
$6f8547af8f66a9b0$var$terminalPromptSpecificStyles.replaceSync($6f8547af8f66a9b0$var$CSS);
/**
 * @class TerminalPrompt
 * @extends BaseComponent
 * @description A fully encapsulated, declarative Web Component for terminal input.
 *
 * @features
 * - **Declarative API**: Controlled via HTML attributes like `disabled`, `secret`, `placeholder`, and `icon-text`.
 * - **Secret Mode**: Automatically masks input for passwords when the `secret` attribute is present.
 * - **Custom Events**: Dispatches clear, high-level events for user interactions (`enter`, `tab`, `arrow-up`, `arrow-down`, `swipe-right`).
 * - **Rich Public API**: Provides methods like `getValue()`, `setValue()`, `getCursorPosition()`, `setCursorPosition()`, and `clear()` for programmatic control.
 * - **Stateful Icon**: Manages an internal icon that automatically updates based on the component's state (e.g., ready, busy, secret).
 * - **Touch Support**: Implements a swipe-right gesture to trigger autocomplete on touch devices.
 *
 * @fires enter - When the user presses the Enter key. Detail: `{ value: string }`
 * @fires tab - When the user presses the Tab key.
 * @fires arrow-up - When the user presses the ArrowUp key.
 * @fires arrow-down - When the user presses the ArrowDown key.
 * @fires swipe-right - When the user performs a right swipe gesture on the component.
 */ class $6f8547af8f66a9b0$export$9263fabaee423253 extends (0, $b614a4e6de2a3e5c$export$55ae5207ce896a6b) {
    /** @private {boolean} #isSecret - Flag indicating if the read mode is for secret (password) input. */ #isSecret = false;
    /** @private {string} #secretValue - Stores the actual value when in secret input mode. */ #secretValue = '';
    /** @private {boolean} #isEnabled - Flag to control if the input should accept changes. */ #isEnabled = true;
    // Properties for swipe gesture detection
    #touchStartX = 0;
    #touchStartY = 0;
    /**
   * Creates an instance of TerminalPrompt.
   * Initializes the shadow DOM and applies component-specific styles.
   */ constructor(){
        // Pass the template and map to the base constructor, including the Icon component.
        super($6f8547af8f66a9b0$var$TEMPLATE);
        // Apply component-specific styles to the shadow DOM.
        this.shadowRoot.adoptedStyleSheets = [
            ...this.shadowRoot.adoptedStyleSheets,
            $6f8547af8f66a9b0$var$terminalPromptSpecificStyles
        ];
        // Add touch event listeners for swipe-to-autocomplete gesture.
        this.refs.footer.addEventListener('touchstart', this.#handleTouchStart.bind(this), {
            passive: true
        });
        this.refs.footer.addEventListener('touchend', this.#handleTouchEnd.bind(this), {
            passive: true
        });
        // Listen for input to handle manual password masking.
        this.refs.prompt.addEventListener('input', this.#onInput.bind(this));
        // Centralize keydown handling
        this.refs.prompt.addEventListener('keydown', this.#onKeyDown.bind(this));
    }
    static get observedAttributes() {
        return [
            'disabled',
            'secret',
            'placeholder',
            'icon-text'
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case 'disabled':
                this.#isEnabled = !this.hasAttribute('disabled');
                if (this.#isEnabled && !this.#isSecret) this.#setReadyIcon();
                else if (!this.#isEnabled) this.#setBusyIcon();
                break;
            case 'secret':
                this.#isSecret = this.hasAttribute('secret');
                this.#isSecret ? this.#setKeyIcon() : this.#setReadyIcon();
                break;
            case 'placeholder':
                this.refs.prompt.placeholder = newValue || '';
                break;
            case 'icon-text':
                if (newValue !== null) {
                    // If the attribute is being set, tell the icon to display custom text.
                    if (this.refs.icon) this.refs.icon.setAttribute('type', 'text');
                    if (this.refs.icon) this.refs.icon.setAttribute('value', newValue);
                } else // If the attribute is being removed, revert to the default state icon.
                this.#isSecret ? this.#setKeyIcon() : this.#setReadyIcon();
                break;
        }
    }
    /**
   * Handles the input event to manually mask characters for secret (password) input.
   * This implementation correctly handles insertions, deletions, and replacements
   * at any position within the input field.
   * @private
   * @param {InputEvent} event - The input event.
   */ #onInput(event) {
        if (!this.#isSecret) return;
        const input = this.refs.prompt;
        const oldRealValue = this.#secretValue;
        const newDisplayValue = input.value;
        const newCursorPos = input.selectionStart;
        // The number of characters deleted or replaced.
        const deletedCount = oldRealValue.length - (newDisplayValue.length - (event.data ? event.data.length : 0));
        // The position where the change started.
        const changeStartPos = newCursorPos - (event.data ? event.data.length : 0);
        // Slice the old real value to get the parts before and after the change.
        const before = oldRealValue.slice(0, changeStartPos);
        const after = oldRealValue.slice(changeStartPos + deletedCount);
        // Construct the new real value. event.data is null for deletions.
        const newRealValue = before + (event.data || '') + after;
        this.#secretValue = newRealValue;
        // Update the display to be all masked characters.
        // We do this inside a requestAnimationFrame to avoid potential race
        // conditions with the browser's rendering of the input value,
        // especially on mobile browsers or with IMEs.
        requestAnimationFrame(()=>{
            input.value = "\u25CF".repeat(this.#secretValue.length);
            // Restore the cursor position.
            input.setSelectionRange(newCursorPos, newCursorPos);
        });
    }
    /**
   * Handles keyboard events and dispatches them for the presenter to handle.
   * @private
   * @param {KeyboardEvent} event - The keyboard event.
   */ #onKeyDown(event) {
        // If the input is not enabled, prevent all key actions and stop further processing.
        // This ensures no input is registered and no default browser behavior occurs.
        if (!this.#isEnabled) {
            event.preventDefault();
            event.stopPropagation(); // Stop event from bubbling up to parent elements
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            this.#dispatch('enter', {
                value: this.getValue()
            });
        } else if (event.key === 'Tab') {
            event.preventDefault();
            this.#dispatch('tab');
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.#dispatch('arrow-up');
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.#dispatch('arrow-down');
        }
    }
    /**
   * Records the starting position of a touch event for swipe detection.
   * @param {TouchEvent} event - The touch event.
   */ #handleTouchStart(event) {
        const touch = event.touches[0];
        if (!touch) return;
        this.#touchStartX = touch.clientX;
        this.#touchStartY = touch.clientY;
    }
    /**
   * Calculates the gesture at the end of a touch and triggers the swipe right callback.
   * @param {TouchEvent} event - The touch event.
   */ #handleTouchEnd(event) {
        const touch = event.changedTouches[0];
        if (this.#touchStartX === 0 || !touch) return;
        const deltaX = touch.clientX - this.#touchStartX;
        const deltaY = touch.clientY - this.#touchStartY;
        // Check for a right swipe: significant horizontal movement, minimal vertical movement.
        if (deltaX > 50 && Math.abs(deltaY) < 50) this.#dispatch('swipe-right');
    }
    /**
   * Helper to dispatch custom events.
   * @private
   * @param {string} name - The event name.
   * @param {*} detail - The event payload.
   */ #dispatch(name, detail = {}) {
        this.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            composed: true,
            detail: detail
        }));
    }
    /**
   * Sets focus on the command prompt input field.
   */ focus() {
        this.refs.prompt.focus();
    }
    /**
   * Retrieves the real value from the input, whether in normal or secret mode.
   * @returns {string} The current, unmasked value of the input.
   */ getValue() {
        if (this.#isSecret) return this.#secretValue;
        return this.refs.prompt.value;
    }
    /**
   * Sets the value of the command prompt input field.
   * In secret mode, this sets the internal real value and updates the display with masked characters.
   * @param {string} value - The string to set as the input's value.
   */ setValue(value) {
        if (this.#isSecret) {
            this.#secretValue = value;
            this.refs.prompt.value = "\u25CF".repeat(value.length);
        } else this.refs.prompt.value = value;
    }
    /**
   * Gets the current cursor position within the input field.
   * @returns {number} The cursor position index.
   */ getCursorPosition() {
        return this.refs.prompt.selectionStart;
    }
    /**
   * Sets the cursor position within the input field.
   * @param {number} position - The position to set the cursor at.
   */ setCursorPosition(position) {
        this.refs.prompt.setSelectionRange(position, position);
    }
    /**
   * Clears the command prompt input field.
   */ clear() {
        this.refs.prompt.value = '';
        this.#secretValue = '';
    }
    // --- Private Icon Methods ---
    #setReadyIcon() {
        if (this.refs.icon) this.refs.icon.setAttribute('type', 'ready');
    }
    #setBusyIcon() {
        if (this.refs.icon) this.refs.icon.setAttribute('type', 'busy');
    }
    #setKeyIcon() {
        if (this.refs.icon) this.refs.icon.setAttribute('type', 'key');
    }
}
// Define the custom element 'nnoitra-cmd'
customElements.define('nnoitra-cmd', $6f8547af8f66a9b0$export$9263fabaee423253);


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
 */ 

const $a29ba4af123ce619$var$log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)('HintBox');
/**
 * @constant {string} TEMPLATE - HTML template for the HintBox component's shadow DOM.
 */ const $a29ba4af123ce619$var$TEMPLATE = `
  <ul part="box"></ul>
  <slot hidden></slot>
`;
/**
 * @constant {string} CSS - CSS styles for the HintBox component's shadow DOM.
 */ const $a29ba4af123ce619$var$CSS = `
:host([hidden]) {
  display: none;
}

[part=box] {
  color: var(--nnoitra-color-theme); /* VAR */
  background-color: var(--nnoitra-color-background); /* VAR */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  width: 100%;
  margin: 0;
  border-left: 3px solid var(--nnoitra-color-highlight);
  padding: 5px 0 0 10px;
}

[part=box] li {
  flex-shrink: 1;
  margin-right: 1em;
  margin-bottom: 0.5em;
  min-width: 0;
  white-space: normal;
  overflow-wrap: break-word;
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

[part=box] li.visible {
  opacity: 1;
  transform: translateY(0);
}

.prefix {
  color: var(--nnoitra-color-muted);
}

.suffix {
  font-weight: bold;
}
`;
// Define component-specific styles
const $a29ba4af123ce619$var$hintBoxSpecificStyles = new CSSStyleSheet();
$a29ba4af123ce619$var$hintBoxSpecificStyles.replaceSync($a29ba4af123ce619$var$CSS);
/**
 * @class HintBox
 * @extends BaseComponent
 * @description A custom element that displays a box of hints or suggestions, typically used for autocomplete.
 * It handles the dynamic rendering of suggestions with a subtle animation.
 */ class $a29ba4af123ce619$export$2d8d60d3e638ecc8 extends (0, $b614a4e6de2a3e5c$export$55ae5207ce896a6b) {
    /**
   * Creates an instance of HintBox.
   * Initializes the shadow DOM, applies component-specific styles, and hides the box by default.
   */ constructor(){
        super($a29ba4af123ce619$var$TEMPLATE);
        this.shadowRoot.adoptedStyleSheets = [
            ...this.shadowRoot.adoptedStyleSheets,
            $a29ba4af123ce619$var$hintBoxSpecificStyles
        ];
        // Find the hidden slot and listen for changes to its assigned nodes.
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', ()=>this.#render());
    }
    static get observedAttributes() {
        return [
            'hidden',
            'prefix-length'
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // Re-render whenever a relevant attribute changes.
        this.#render();
    }
    #render() {
        const box = this.refs.box;
        box.innerHTML = ''; // Clear previous content.
        // If the component is hidden, do nothing further.
        if (this.hasAttribute('hidden')) return;
        const prefixLength = parseInt(this.getAttribute('prefix-length') || '0', 10);
        const hintItems = this.querySelectorAll('li');
        if (hintItems.length === 0) return;
        const fragment = document.createDocumentFragment();
        hintItems.forEach((item, index)=>{
            const text = item.textContent || '';
            const li = document.createElement('li');
            const prefixSpan = document.createElement('span');
            const suffixSpan = document.createElement('span');
            prefixSpan.className = 'prefix';
            prefixSpan.textContent = text.substring(0, prefixLength);
            suffixSpan.className = 'suffix';
            suffixSpan.textContent = text.substring(prefixLength);
            li.appendChild(prefixSpan);
            li.appendChild(suffixSpan);
            fragment.appendChild(li);
            setTimeout(()=>li.classList.add('visible'), index * 50);
        });
        box.appendChild(fragment);
    }
}
// Define the custom element 'nnoitra-hint-box'
customElements.define('nnoitra-hint-box', $a29ba4af123ce619$export$2d8d60d3e638ecc8);



const $0f149b973a96475a$var$log = (0, $ffd8896b0637a9c5$export$fe2e61603b61130d)('Terminal');
var $3a5a6db7f4f09b3e$exports = {};
$3a5a6db7f4f09b3e$exports = $parcel$resolve("euAS4");


const $0f149b973a96475a$var$FONT_REGULAR_PATH = new URL($3a5a6db7f4f09b3e$exports);
var $f3737d1a926a4b14$exports = {};
$f3737d1a926a4b14$exports = $parcel$resolve("4acmQ");


const $0f149b973a96475a$var$FONT_BOLD_PATH = new URL($f3737d1a926a4b14$exports);
var $af4b6bd7265a5e1c$exports = {};
$af4b6bd7265a5e1c$exports = $parcel$resolve("jRB9m");


const $0f149b973a96475a$var$FONT_REGULAR_ITALIC_PATH = new URL($af4b6bd7265a5e1c$exports);
var $0749f4621615fff5$exports = {};
$0749f4621615fff5$exports = $parcel$resolve("6rugH");


const $0f149b973a96475a$var$FONT_BOLD_ITALIC_PATH = new URL($0749f4621615fff5$exports);
/**
 * @constant {string} TEMPLATE - HTML template for the Terminal component's shadow DOM.
 */ const $0f149b973a96475a$var$TEMPLATE = `
  <div part="terminal">
  <div part="welcome-output"></div>
  <div part="output"></div>
  <nnoitra-hint-box part="hint" hidden></nnoitra-hint-box>
  </div>
  <nnoitra-cmd part="prompt"></nnoitra-cmd>
  `;
/**
 * @constant {string} CSS - CSS styles for the Terminal component's shadow DOM.
 */ const $0f149b973a96475a$var$HOST_STYLES = `
:host {
  /* Default Theme & Font Variables */
  --nnoitra-color-green: #5CB338;
  --nnoitra-color-yellow: #ECE852;
  --nnoitra-color-orange: #FFC145;
  --nnoitra-color-red: #FB4141;
  --nnoitra-color-black: #000000;
  --nnoitra-color-white: #FFFFFF;
  --nnoitra-color-theme: var(--nnoitra-color-green);
  --nnoitra-color-muted: color-mix(in srgb, var(--nnoitra-color-theme), black 40%);
  --nnoitra-color-placeholder: var(--nnoitra-color-muted);
  --nnoitra-color-output: var(--nnoitra-color-white);
  --nnoitra-color-highlight: var(--nnoitra-color-theme);
  --nnoitra-color-text-highlight: var(--nnoitra-color-black);
  --nnoitra-font-family: 'Ubuntu Mono', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace;
  --nnoitra-font-size: clamp(0.9rem, 3vw, 1.2rem);


  /* Default Layout & Appearance */
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--nnoitra-color-black);
  color: var(--nnoitra-color-theme);
  font-size: var(--nnoitra-font-size);
  font-family: var(--nnoitra-font-family);
}

/* Styles for links injected by commands like 'about' */
a {
    color: var(--nnoitra-color-theme);
    text-decoration: none; /* Remove underline for a cleaner look */
}

/* Styles for 'about' command content */
.about-title {
    font-weight: bold;
}
`;
const $0f149b973a96475a$var$COMPONENT_STYLES = `
[part=terminal] {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  height: 100%;
  width: 100%;
}
[part=prompt] {
  flex-shrink: 0;
}

[part=terminal] [part=hint] {
  padding: 0;
  margin: 0;
  margin-top: 6px;
}

`;
const $0f149b973a96475a$var$CSS = $0f149b973a96475a$var$HOST_STYLES + $0f149b973a96475a$var$COMPONENT_STYLES;
// Define component-specific styles (now much smaller)
const $0f149b973a96475a$var$terminalSpecificStyles = new CSSStyleSheet();
$0f149b973a96475a$var$terminalSpecificStyles.replaceSync($0f149b973a96475a$var$CSS);
/**
 * @class Terminal
 * @extends BaseComponent
 * @description Represents the main terminal component, handling user input, command execution, and output display.
 * It integrates various services like history, command execution, environment, and autocomplete.
 */ class $0f149b973a96475a$export$8dd80f06eb58bfe1 extends (0, $b614a4e6de2a3e5c$export$55ae5207ce896a6b) {
    /** @private {ResizeObserver} #resizeObserver - Observes changes to the terminal's size to adjust scrolling. */ #resizeObserver;
    /** @private {MutationObserver} #mutationObserver - Observes changes in the terminal output to automatically scroll. */ #mutationObserver;
    /** @private {object} #services - A dedicated set of services for this terminal instance. */ #services;
    /**
   * Creates an instance of Terminal.
   * Initializes the shadow DOM, applies styles, sets up services, and attaches event listeners.
   */ constructor(){
        // Pass the template and map to the base constructor
        super($0f149b973a96475a$var$TEMPLATE);
        this.#loadFont($0f149b973a96475a$var$FONT_REGULAR_PATH, {
            weight: 'normal'
        });
        this.#loadFont($0f149b973a96475a$var$FONT_BOLD_PATH, {
            weight: 'bold'
        });
        this.#loadFont($0f149b973a96475a$var$FONT_REGULAR_ITALIC_PATH, {
            weight: 'normal',
            style: 'italic'
        });
        this.#loadFont($0f149b973a96475a$var$FONT_BOLD_ITALIC_PATH, {
            weight: 'bold',
            style: 'italic'
        });
        // Apply component-specific styles
        this.shadowRoot.adoptedStyleSheets = [
            ...this.shadowRoot.adoptedStyleSheets,
            $0f149b973a96475a$var$terminalSpecificStyles
        ];
    }
    /**
   * Observe the 'autofocus' attribute for changes.
   */ static get observedAttributes() {
        return [
            'autofocus',
            'filesystem-api',
            'accounting-api'
        ];
    }
    // --- Public Getters for Views ---
    get promptView() {
        return this.refs.prompt;
    }
    get hintView() {
        return this.refs.hint;
    }
    get welcomeOutputView() {
        return this.refs['welcome-output'];
    }
    /**
   * Bootstraps the terminal by creating services, connecting views, and attaching listeners.
   * @private
   */ #bootstrap() {
        // Read API configuration from component attributes
        const config = {
            filesystemApi: this.getAttribute('filesystem-api'),
            accountingApi: this.getAttribute('accounting-api')
        };
        // 1. Create a new, independent set of services for this terminal instance.
        const container = new (0, $a0b5a846c0e262ae$export$f001b1e94070bef0)(config);
        this.#services = container.services;
        // 2. Connect this component's views to its dedicated services.
        // This makes each terminal a completely sandboxed application.
        this.#services.input.setView(this.promptView);
        this.#services.hint.setView(this.hintView);
        this.#services.terminal.setView(this);
        this.#services.theme.setView(this);
        this.#services.favicon.setView(this);
        // 3. Attach UI event listeners.
        this.#attachEventListeners();
        $0f149b973a96475a$var$log.log('Terminal bootstrapped successfully.');
    }
    #loadFont(fontPath, options = {}) {
        const { weight: weight = 'normal', style: style = 'normal' } = options;
        const fontUrl = fontPath;
        const font = new FontFace('Ubuntu Mono', `url(${fontUrl.href})`, {
            weight: weight,
            style: style,
            display: 'swap' // Ensure font-display: swap is applied
        });
        font.load().then(()=>{
            document.fonts.add(font);
            this.log.log(`Font loaded: Ubuntu Mono ${weight} ${style}`);
        }).catch((error)=>{
            this.log.error(`Failed to load font: Ubuntu Mono ${weight} ${style}`, error);
        });
    }
    /**
   * Attaches all necessary event listeners for the terminal component.
   * @private
   */ #attachEventListeners() {
        // Make the terminal component itself focusable by adding it to the tab order.
        // A value of 0 is standard for including an element in the natural tab sequence.
        this.tabIndex = 0;
        // When the terminal component receives focus (e.g., via tabbing),
        // delegate that focus to the internal command prompt.
        this.addEventListener('focus', this.setFocus);
        // If the user clicks anywhere in the main terminal area that isn't other
        // content, focus the prompt. This makes the whole component feel interactive.
        this.refs.terminal.addEventListener('click', this.#handleClick.bind(this));
    }
    /**
   * Lifecycle callback when the element is added to the DOM.
   * Sets up the ResizeObserver and initial focus.
   */ connectedCallback() {
        // Bootstrap services now that the component is in the DOM and attributes are available.
        this.#bootstrap();
        // Initialize ResizeObserver to scroll to bottom when terminal size changes
        this.#resizeObserver = new ResizeObserver(()=>{
            this.scrollToBottom();
        });
        this.#resizeObserver.observe(this.refs.terminal);
        // Observe mutations in the terminal output to automatically scroll to the bottom
        this.#mutationObserver = new MutationObserver(()=>this.scrollToBottom());
        this.#mutationObserver.observe(this.refs.terminal, {
            childList: true,
            subtree: true
        });
        // Start all services now that the component is in the DOM and views are connected.
        // This ensures services like TerminalService can access their views during startup.
        Object.values(this.#services).forEach((service)=>{
            if (service && typeof service.start === 'function') service.start();
        });
    }
    /**
   * Lifecycle callback when the element is removed from the DOM.
   * Cleans up event listeners and observers to prevent memory leaks.
   */ disconnectedCallback() {
        if (this.#resizeObserver) this.#resizeObserver.disconnect();
        if (this.#mutationObserver) this.#mutationObserver.disconnect();
    }
    /**
   * Handles changes to observed attributes.
   * @param {string} name - The name of the attribute that changed.
   */ attributeChangedCallback(name) {
        // This handles the case where the autofocus attribute is added dynamically
        // after the component is already in the DOM.
        if (name === 'autofocus' && this.hasAttribute('autofocus')) this.setFocus();
    }
    /**
   * Handles click events on the terminal area to focus the prompt.
   * This ensures that clicking the "background" of the terminal focuses the input.
   * @param {MouseEvent} event - The click event.
   * @private
   */ #handleClick(event) {
        // If the click target is the terminal container itself (and not text or other elements inside),
        // then we should focus the prompt.
        if (event.target === this.refs.terminal) this.setFocus();
    }
    /**
   * Appends a child element (like a TerminalItem) to the main output area.
   * @param {HTMLElement} child - The element to append.
   */ appendToOutput(child) {
        this.refs.output.appendChild(child);
    }
    /**
   * Clears all output from the terminal.
   */ clearOutput() {
        if (this.refs.output) this.refs.output.innerHTML = '';
    }
    /**
   * Sets focus to the command prompt input field.
   */ setFocus() {
        this.promptView.focus();
    }
    /**
   * Scrolls the terminal output to the bottom.
   * Uses requestAnimationFrame for smoother scrolling.
   */ scrollToBottom() {
        requestAnimationFrame(()=>{
            this.refs.terminal.scrollTop = this.refs.terminal.scrollHeight;
        });
    }
}
// Define the custom element 'nnoitra-terminal'
customElements.define('nnoitra-terminal', $0f149b973a96475a$export$8dd80f06eb58bfe1);



})();
