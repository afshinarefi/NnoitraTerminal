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
import { EVENTS } from './Events.js';
import { VAR_CATEGORIES } from './Constants.js';

// Import all command classes
import { Welcome } from '../Commands/welcome.js';
import { About } from '../Commands/about.js';
import { Env } from '../Commands/env.js';
import { Help } from '../Commands/help.js';
import { Man } from '../Commands/man.js';
import { History } from '../Commands/history.js';
import { Ls } from '../Commands/ls.js';
import { Cd } from '../Commands/cd.js';
import { Cat } from '../Commands/cat.js';
import { Clear } from '../Commands/clear.js';
import { View } from '../Commands/view.js';
import { AddUser } from '../Commands/adduser.js';
import { Login } from '../Commands/login.js';
import { Logout } from '../Commands/logout.js';
import { Passwd } from '../Commands/passwd.js';
import { Alias } from '../Commands/alias.js';
import { Unalias } from '../Commands/unalias.js';
import { Export } from '../Commands/export.js';
import { Theme } from '../Commands/theme.js';
import { Version } from '../Commands/version.js';

const log = createLogger('CommandBusService');

// Constants
const VAR_ALIAS = 'ALIAS';

/**
 * @class CommandBusService
 * @description Manages command registration, resolution, and execution via the event bus.
 *
 * @provides `command-execute-request` - Listens for requests to execute a command string.
 * @provides `autocomplete-request` - Listens for requests to get autocomplete suggestions.
 *
 * @dispatches `autocomplete-broadcast` - Dispatches suggestions for any interested listeners.
 * @dispatches `variable-get-request` - Dispatches to get the ALIAS variable.
 * @dispatches `variable-set-request` - Dispatches to set the ALIAS variable.
 * @dispatches `fs-is-directory-request` - Dispatches to check if a path is a directory.
 *
 * @listens for `variable-get-response` - Listens for the ALIAS value.
 * @listens for `fs-is-directory-response` - Listens for the response to the directory check.
 */
class CommandService {
    #eventBus;
    #registry = new Map();
    #aliases = {};
    #isLoggedIn = false;

    constructor(eventBus) {
        this.#eventBus = eventBus;

        this.#registerCommands();
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerCommands() {
        // Register commands with their specific service dependencies.
        this.register('welcome', Welcome, []);
        this.register('about', About, []);
        this.register('env', Env, ['getAllVariablesCategorized']);
        this.register('help', Help, ['getHelpCommandNames', 'getCommandClass']);
        this.register('man', Man, ['getAvailableCommandNames', 'getCommandClass']);
        this.register('history', History, ['getHistory']);
        this.register('ls', Ls, ['getDirectoryContents', 'autocompletePath']);
        this.register('cd', Cd, ['isDirectory', 'changeDirectory']);
        this.register('cat', Cat, ['getFileContents', 'autocompletePath']);
        this.register('clear', Clear, ['clearScreen']);
        this.register('view', View, ['getFileContents']);
        this.register('adduser', AddUser, ['login']);
        this.register('login', Login, ['login']);
        this.register('logout', Logout, ['logout']);
        this.register('passwd', Passwd, ['login']);
        this.register('alias', Alias, ['getAliases', 'setAliases']);
        this.register('unalias', Unalias, ['getAliases', 'setAliases']);
        this.register('export', Export, ['environment']);
        this.register('theme', Theme, ['environment', 'theme']); // Placeholders
        this.register('version', Version, []);
    }

    start() {
        // Request initial alias state now that all services are listening.
        this.#eventBus.dispatch(EVENTS.VAR_GET_REQUEST, { key: VAR_ALIAS });
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.COMMAND_EXECUTE_BROADCAST, (payload) => this.execute(payload.commandString, payload.outputElement));
        this.#eventBus.listen(EVENTS.AUTOCOMPLETE_REQUEST, (payload) => this.autocomplete(payload.parts));

        // Listen for user state changes to control command availability (e.g., logout)
        this.#eventBus.listen(EVENTS.USER_CHANGED_BROADCAST, (payload) => {
            this.#isLoggedIn = payload.isLoggedIn;
        });

        this.#eventBus.listen(EVENTS.VAR_GET_RESPONSE, ({ values }) => {
            if (values.hasOwnProperty(VAR_ALIAS)) {
                const aliasValue = values[VAR_ALIAS];
                try {
                    this.#aliases = aliasValue ? JSON.parse(aliasValue) : {};
                } catch (e) {
                    log.error("Error parsing ALIAS variable:", e);
                    this.#aliases = {};
                }
            }
        });

        // This service acts as a middleman for commands, so it needs to handle
        // the responses from other services. This listener is a placeholder for that logic.
        this.#eventBus.listen(EVENTS.FS_IS_DIR_RESPONSE, (payload) => {
            // In a full implementation, we would use the correlationId to resolve a promise
            // that was created when the request was dispatched.
            log.log('Received fs-is-directory-response:', payload);
        });

        this.#eventBus.listen(EVENTS.FS_GET_DIRECTORY_CONTENTS_RESPONSE, (payload) => {
            // Handled via promise in the gateway method.
        });

        this.#eventBus.listen(EVENTS.FS_GET_FILE_CONTENTS_RESPONSE, (payload) => {
            // Handled via promise in the gateway method.
        });
    }

    register(name, CommandClass, requiredServices = []) {
        this.#registry.set(name, { CommandClass, requiredServices });
    }

    getCommand(name) {
        const registration = this.#registry.get(name);
        if (registration) {
            const { CommandClass, requiredServices } = registration;

            // Create a tailored 'services' object for each command, providing only what it needs.
            // This acts as a gateway and adheres to the principle of least privilege.
            const allProvidedServices = {
                getAliases: this.getAliases.bind(this),
                setAliases: this.setAliases.bind(this),
                isDirectory: this.isDirectory.bind(this),
                changeDirectory: this.changeDirectory.bind(this),
                clearScreen: this.clearScreen.bind(this),
                // Gateways are now event-based, so direct service calls are removed.
                // The commands themselves will trigger the necessary input requests.
                // For data retrieval, we provide async functions that use the event bus.
                getHistory: this.getHistory.bind(this),
                // --- Filesystem Service Gateway ---
                getDirectoryContents: this.getDirectoryContents.bind(this),
                getFileContents: this.getFileContents.bind(this),
                autocompletePath: this.autocompletePath.bind(this),
                // --- Command Service Introspection ---
                getHelpCommandNames: this.getHelpCommandNames.bind(this),
                getAvailableCommandNames: this.getAvailableCommandNames.bind(this),
                getCommandClass: this.getCommandClass.bind(this),
            };

            const commandServices = {};
            for (const serviceName of requiredServices) {
                if (allProvidedServices[serviceName]) {
                    commandServices[serviceName] = allProvidedServices[serviceName];
                } else {
                    log.warn(`Command '${name}' requested unknown service '${serviceName}'.`);
                }
            }

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

    getAvailableCommandNames() {
        const availableRegistered = this.getHelpCommandNames();
        const aliasNames = Object.keys(this.#aliases);
        return [...new Set([...availableRegistered, ...aliasNames])].sort();
    }

    getHelpCommandNames() {
        const registeredCommands = this.getCommandNames();
        const availableCommands = registeredCommands.filter(name => {
            const CommandClass = this.getCommandClass(name);
            if (CommandClass && typeof CommandClass.isAvailable === 'function') {
                return CommandClass.isAvailable({ isLoggedIn: this.#isLoggedIn });
            }
            return true;
        });
        return availableCommands.sort();
    }

    async autocomplete(parts) {
        log.log('Autocomplete received parts:', parts);
        let suggestions = [];

        const isCompletingCommandName = parts.length <= 1;

        if (isCompletingCommandName) {
            const input = parts[0] || '';
            suggestions = this.getAvailableCommandNames().filter(name => name.startsWith(input));
        } else {
            let commandName = parts[0];
            let argsForCompletion = parts.slice(1);

            if (this.#aliases[commandName]) {
                const aliasValue = this.#aliases[commandName];
                const aliasParts = aliasValue.split(/\s+/).filter(p => p);
                commandName = aliasParts[0];
                argsForCompletion = [...aliasParts.slice(1), ...argsForCompletion];
            }

            const CommandClass = this.getCommandClass(commandName);
            if (CommandClass && typeof CommandClass.autocompleteArgs === 'function') {
                const commandInstance = this.getCommand(commandName);
                const result = commandInstance.autocompleteArgs(argsForCompletion);
                suggestions = (result instanceof Promise) ? await result : result;
            }
        }

        this.#eventBus.dispatch(EVENTS.AUTOCOMPLETE_BROADCAST, { suggestions });
    }

    async execute(cmd, output) {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) {
            if (output) output.innerText = "";
            return;
        }

        let args = trimmedCmd.split(/\s+/);
        let commandName = args[0];

        if (this.#aliases[commandName]) {
            const aliasValue = this.#aliases[commandName];
            const aliasArgs = aliasValue.split(/\s+/);
            const remainingUserArgs = args.slice(1);
            const newCmd = [...aliasArgs, ...remainingUserArgs].join(' ');
            args = newCmd.split(/\s+/);
            commandName = args[0];
        }

        if (this.#registry.has(commandName)) {
            try {
                const commandHandler = this.getCommand(commandName);
                const resultElement = await commandHandler.execute(args);
                if (output) output.appendChild(resultElement);
            } catch (e) {
                if (output) output.textContent = `Error executing ${commandName}: ${e.message}`;
                log.error(`Error executing ${commandName}:`, e);
            }
        } else {
            if (output) output.textContent = `${commandName}: command not found`;
        }
    }

    getAliases() {
        return this.#aliases;
    }

    setAliases(aliases) {
        this.#aliases = aliases;
        this.#eventBus.dispatch(EVENTS.VAR_SET_REQUEST, {
            key: VAR_ALIAS,
            value: JSON.stringify(aliases),
            category: VAR_CATEGORIES.REMOTE
        });
    }

    // --- Service Gateway Methods for Commands ---

    async isDirectory(path) {
        // This method encapsulates the async event bus logic for the command.
        // The command can simply `await this.isDirectory(path)` and get a boolean.
        return new Promise(resolve => {
            const correlationId = `is-dir-${Date.now()}-${Math.random()}`;

            const responseListener = (payload) => {
                if (payload.correlationId === correlationId) {
                    // The event bus needs a way to remove listeners to prevent memory leaks.
                    // For now, we assume this logic exists.
                    // this.#eventBus.removeListener('fs-is-directory-response', responseListener);
                    resolve(payload.isDirectory);
                }
            };

            this.#eventBus.listen(EVENTS.FS_IS_DIR_RESPONSE, responseListener);

            this.#eventBus.dispatch(EVENTS.FS_IS_DIR_REQUEST, {
                path,
                correlationId
            });
        });
    }

    async getHistory() {
        return new Promise((resolve) => {
            const correlationId = `get-hist-${Date.now()}-${Math.random()}`;

            const responseListener = (payload) => {
                if (payload.correlationId === correlationId) {
                    resolve(payload.history);
                }
            };

            // This assumes a one-time listener or a mechanism to remove it.
            this.#eventBus.listen(EVENTS.HISTORY_LOAD_RESPONSE, responseListener);

            this.#eventBus.dispatch(EVENTS.HISTORY_LOAD_REQUEST, {
                correlationId
            });
        });
    }

    async getDirectoryContents(path) {
        return new Promise((resolve, reject) => {
            const correlationId = `get-dir-${Date.now()}-${Math.random()}`;

            const responseListener = (payload) => {
                if (payload.correlationId === correlationId) {
                    if (payload.error) {
                        reject(payload.error);
                    } else {
                        resolve(payload.contents);
                    }
                }
            };

            this.#eventBus.listen(EVENTS.FS_GET_DIRECTORY_CONTENTS_RESPONSE, responseListener);

            this.#eventBus.dispatch(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, {
                path,
                correlationId
            });
        });
    }

    async getFileContents(path) {
        return new Promise((resolve, reject) => {
            const correlationId = `get-file-${Date.now()}-${Math.random()}`;

            const responseListener = (payload) => {
                if (payload.correlationId === correlationId) {
                    if (payload.error) {
                        reject(payload.error);
                    } else {
                        resolve(payload.contents);
                    }
                }
            };

            this.#eventBus.listen(EVENTS.FS_GET_FILE_CONTENTS_RESPONSE, responseListener);

            this.#eventBus.dispatch(EVENTS.FS_GET_FILE_CONTENTS_REQUEST, {
                path,
                correlationId
            });
        });
    }

    async autocompletePath(path, includeFiles) {
        // This method encapsulates the async event bus logic for the command.
        // The command can simply `await this.autocompletePath(path)` and get an array.
        return new Promise(resolve => {
            // This is a simplified implementation. A robust one would use correlation IDs.
            this.#eventBus.listen(EVENTS.FS_AUTOCOMPLETE_PATH_RESPONSE, (payload) => resolve(payload.suggestions));
            this.#eventBus.dispatch(EVENTS.FS_AUTOCOMPLETE_PATH_REQUEST, { path, includeFiles });
        });
    }

    changeDirectory(path) {
        this.#eventBus.dispatch(EVENTS.VAR_SET_REQUEST, {
            key: 'PWD',
            value: path,
            category: VAR_CATEGORIES.TEMP
        });
    }

    clearScreen() {
        this.#eventBus.dispatch(EVENTS.CLEAR_SCREEN_REQUEST);
    }
}

export { CommandService };