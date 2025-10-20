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
        this.register('view', View, ['getFileContents', 'autocompletePath']);
        this.register('adduser', AddUser, ['prompt', 'login']);
        this.register('login', Login, ['prompt', 'login']);
        this.register('logout', Logout, ['logout']);
        this.register('passwd', Passwd, ['login']);
        this.register('alias', Alias, ['getAliases', 'setAliases']);
        this.register('unalias', Unalias, ['getAliases', 'setAliases']);
        this.register('export', Export, ['environment']);
        this.register('theme', Theme, ['environment', 'theme']); // Placeholders
        this.register('version', Version, []);
    }

    async start() {
        // Request initial alias state now that all services are listening.
        try {
            const { values } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { key: VAR_ALIAS });
            if (values.hasOwnProperty(VAR_ALIAS)) {
                const aliasValue = values[VAR_ALIAS];
                this.#aliases = aliasValue ? JSON.parse(aliasValue) : {};
            }
        } catch (error) {
            log.error("Failed to get initial ALIAS state:", error);
            this.#aliases = {};
        }
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.COMMAND_EXECUTE_BROADCAST, (payload) => this.execute(payload.commandString, payload.outputElement));
        this.#eventBus.listen(EVENTS.AUTOCOMPLETE_REQUEST, (payload) => this.autocomplete(payload.parts));

        // Listen for user state changes to control command availability (e.g., logout)
        this.#eventBus.listen(EVENTS.USER_CHANGED_BROADCAST, (payload) => {
            this.#isLoggedIn = payload.isLoggedIn;
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
                prompt: this.prompt.bind(this),
                login: this.login.bind(this),
                logout: this.logout.bind(this),
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

    async execute(cmd, outputContainer) {
        try {
            const trimmedCmd = cmd.trim();
            if (!trimmedCmd) {
                return; // Do nothing for an empty command.
            }

            let args = trimmedCmd.split(/\s+/);
            let commandName = args[0];

            // Resolve alias if it exists
            if (this.#aliases[commandName]) {
                const aliasValue = this.#aliases[commandName];
                const aliasArgs = aliasValue.split(/\s+/);
                const remainingUserArgs = args.slice(1);
                const newCmd = [...aliasArgs, ...remainingUserArgs].join(' ');
                args = newCmd.split(/\s+/);
                commandName = args[0];
            }

            const outputElement = outputContainer ? outputContainer.element : null;

            if (this.#registry.has(commandName)) {
                try {
                    const commandHandler = this.getCommand(commandName);
                    const resultElement = await commandHandler.execute(args);
                    if (outputElement) outputElement.appendChild(resultElement);
                } catch (e) {
                    if (outputElement) outputElement.textContent = `Error executing ${commandName}: ${e.message}`;
                    log.error(`Error executing ${commandName}:`, e);
                }
            } else {
                if (outputElement) outputElement.textContent = `${commandName}: command not found`;
            }
        } finally {
            // Always dispatch the finished event to allow the terminal loop to continue.
            this.#eventBus.dispatch(EVENTS.COMMAND_EXECUTION_FINISHED_BROADCAST);
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

    async prompt(promptText, options = {}) {
        const response = await this.#eventBus.request(EVENTS.INPUT_REQUEST, { prompt: promptText, options });
        return response.value;
    }

    async login(username, password) {
        const response = await this.#eventBus.request(EVENTS.LOGIN_REQUEST, { username, password });
        return response;
    }

    async logout() {
        const response = await this.#eventBus.request(EVENTS.LOGOUT_REQUEST, {});
        return response;
    }

    async isDirectory(path) {
        const response = await this.#eventBus.request(EVENTS.FS_IS_DIR_REQUEST, { path });
        return response.isDirectory;
    }

    async getHistory() {
        const response = await this.#eventBus.request(EVENTS.HISTORY_LOAD_REQUEST, {});
        return response.history;
    }

    async getDirectoryContents(path) {
        const response = await this.#eventBus.request(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path });
        if (response.error) {
            throw new Error(response.error.message || 'Failed to get directory contents.');
        }
        return response.contents;
    }

    async getFileContents(path) {
        const response = await this.#eventBus.request(EVENTS.FS_GET_FILE_CONTENTS_REQUEST, { path });
        if (response.error) {
            throw new Error(response.error.message || 'Failed to get file contents.');
        }
        return response.contents;
    }

    async autocompletePath(path, includeFiles) {
        const response = await this.#eventBus.request(EVENTS.FS_AUTOCOMPLETE_PATH_REQUEST, { path, includeFiles });
        return response.suggestions;
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