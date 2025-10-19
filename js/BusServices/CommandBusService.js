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

// Import all command classes
import { Welcome } from '../cmd/welcome.js';
import { About } from '../cmd/about.js';
import { Env } from '../cmd/env.js';
import { Help } from '../cmd/help.js';
import { Man } from '../cmd/man.js';
import { History } from '../cmd/history.js';
import { Ls } from '../cmd/ls.js';
import { Cd } from '../cmd/cd.js';
import { Cat } from '../cmd/cat.js';
import { Clear } from '../cmd/clear.js';
import { View } from '../cmd/view.js';
import { AddUser } from '../cmd/adduser.js';
import { Login } from '../cmd/login.js';
import { Logout } from '../cmd/logout.js';
import { Passwd } from '../cmd/passwd.js';
import { Alias } from '../cmd/alias.js';
import { Unalias } from '../cmd/unalias.js';
import { Export } from '../cmd/export.js';
import { Theme } from '../cmd/theme.js';
import { Version } from '../cmd/version.js';

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
class CommandBusService {
    #eventBus;
    #eventNames;
    #registry = new Map();
    #services; // This will hold other bus-based services
    #aliases = {};

    static EVENTS = {
        PROVIDE_EXECUTE: 'provideExecute',
        PROVIDE_AUTOCOMPLETE: 'provideAutocomplete',
        USE_AUTOCOMPLETE_BROADCAST: 'useAutocompleteBroadcast',
        USE_VAR_GET: 'useVarGet',
        USE_VAR_SET: 'useVarSet',
        LISTEN_VAR_GET_RESPONSE: 'listenVarGetResponse',
        USE_FS_IS_DIR_REQUEST: 'useFsIsDirRequest',
        LISTEN_FS_IS_DIR_RESPONSE: 'listenFsIsDirResponse',
        USE_CLEAR_SCREEN_REQUEST: 'useClearScreenRequest',
    };

    constructor(eventBus, eventNameConfig, services) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
        this.#services = services; // Keep a reference to all services

        this.#registerCommands();
        this.#registerListeners();
        log.log('Initializing...');

        // Request initial alias state
        this.#eventBus.dispatch(this.#eventNames[CommandBusService.EVENTS.USE_VAR_GET], { key: VAR_ALIAS });
    }

    #registerCommands() {
        // Register commands with their specific service dependencies.
        this.register('welcome', Welcome, []);
        this.register('about', About, []);
        this.register('env', Env, ['environment']);
        this.register('help', Help, ['getHelpCommandNames', 'getCommandClass']);
        this.register('man', Man, ['getAvailableCommandNames', 'getCommandClass']);
        this.register('history', History, ['history']); // Placeholder for old service
        this.register('ls', Ls, ['filesystem']); // Placeholder
        this.register('cd', Cd, ['isDirectory', 'changeDirectory']);
        this.register('cat', Cat, ['filesystem']); // Placeholder
        this.register('clear', Clear, ['clearScreen']);
        this.register('view', View, ['filesystem']); // Placeholder
        this.register('adduser', AddUser, ['login']); // Placeholder
        this.register('login', Login, ['login']);
        this.register('logout', Logout, ['login']); // Placeholder
        this.register('passwd', Passwd, ['login']); // Placeholder
        this.register('alias', Alias, ['getAliases', 'setAliases']);
        this.register('unalias', Unalias, ['getAliases', 'setAliases']);
        this.register('export', Export, ['environment']);
        this.register('theme', Theme, ['environment', 'theme']); // Placeholders
        this.register('version', Version, []);
    }

    #registerListeners() {
        this.#eventBus.listen(this.#eventNames[CommandBusService.EVENTS.PROVIDE_EXECUTE], (payload) => this.execute(payload.commandString, payload.outputElement));
        this.#eventBus.listen(this.#eventNames[CommandBusService.EVENTS.PROVIDE_AUTOCOMPLETE], (payload) => this.autocomplete(payload.parts));

        this.#eventBus.listen(this.#eventNames[CommandBusService.EVENTS.LISTEN_VAR_GET_RESPONSE], (payload) => {
            if (payload.key === VAR_ALIAS && payload.value) {
                try {
                    this.#aliases = JSON.parse(payload.value);
                } catch (e) {
                    log.error("Error parsing ALIAS variable:", e);
                    this.#aliases = {};
                }
            }
        });

        // This service acts as a middleman for commands, so it needs to handle
        // the responses from other services. This listener is a placeholder for that logic.
        this.#eventBus.listen(this.#eventNames[CommandBusService.EVENTS.LISTEN_FS_IS_DIR_RESPONSE], (payload) => {
            // In a full implementation, we would use the correlationId to resolve a promise
            // that was created when the request was dispatched.
            log.log('Received fs-is-directory-response:', payload);
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
                login: this.login.bind(this),
                getHelpCommandNames: this.getHelpCommandNames.bind(this),
                getAvailableCommandNames: this.getAvailableCommandNames.bind(this),
                getCommandClass: this.getCommandClass.bind(this),
                // Direct service access for legacy commands during transition
                environment: this.#services.environment,
                filesystem: this.#services.filesystem,
                history: this.#services.history,
                theme: this.#services.theme,
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
                return CommandClass.isAvailable(this.#services);
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
                const result = CommandClass.autocompleteArgs(argsForCompletion, this.#services);
                suggestions = (result instanceof Promise) ? await result : result;
            }
        }

        this.#eventBus.dispatch(this.#eventNames[CommandBusService.EVENTS.USE_AUTOCOMPLETE_BROADCAST], { suggestions });
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
        this.#eventBus.dispatch(this.#eventNames[CommandBusService.EVENTS.USE_VAR_SET], {
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

            this.#eventBus.listen(this.#eventNames[CommandBusService.EVENTS.LISTEN_FS_IS_DIR_RESPONSE], responseListener);

            this.#eventBus.dispatch(this.#eventNames[CommandBusService.EVENTS.USE_FS_IS_DIR_REQUEST], {
                path,
                correlationId
            });
        });
    }

    changeDirectory(path) {
        this.#eventBus.dispatch(this.#eventNames[CommandBusService.EVENTS.USE_VAR_SET], {
            key: 'PWD',
            value: path,
            category: VAR_CATEGORIES.TEMP
        });
    }

    async login(username, password) {
        return this.#services.login.login(username, password);
    }

    clearScreen() {
        this.#eventBus.dispatch(this.#eventNames[CommandBusService.EVENTS.USE_CLEAR_SCREEN_REQUEST]);
    }
}

export { CommandBusService };