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
import { ServiceApiManager } from '../Managers/ServiceApiManager.js';

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
 * @dispatches `autocomplete-broadcast` - Dispatches suggestions for any interested listeners.
 * @dispatches `variable-get-request` - Dispatches to get the ALIAS variable.
 * @dispatches `variable-set-request` - Dispatches to set the ALIAS variable.
 * @dispatches `fs-is-directory-request` - Dispatches to check if a path is a directory.
 *
 * @listens for `variable-get-response` - Listens for the ALIAS value.
 */
class CommandService {
    #eventBus;
    #registry = new Map();
    #apiProvider;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#apiProvider = new ServiceApiManager(eventBus);

        this.#registerCommands();
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerCommands() {
        // Register commands with their specific service dependencies.
        this.register('welcome', Welcome, []);
        this.register('about', About, []);
        this.register('env', Env, ['getVariable']); // To be refactored
        this.register('help', Help, ['getCommandList', 'getCommandMeta']);
        this.register('man', Man, ['getCommandList', 'getCommandMeta']);
        this.register('history', History, ['getHistory']);
        this.register('ls', Ls, ['getDirectoryContents', 'autocompletePath']);
        this.register('cd', Cd, ['isDirectory', 'changeDirectory']);
        this.register('cat', Cat, ['getFileContents', 'autocompletePath']);
        this.register('clear', Clear, ['clearScreen']);
        this.register('view', View, ['getFileContents', 'autocompletePath']);
        this.register('adduser', AddUser, ['prompt', 'login']);
        this.register('login', Login, ['prompt', 'login']);
        this.register('logout', Logout, ['logout']);
        this.register('passwd', Passwd, ['prompt', 'changePassword']);
        this.register('alias', Alias, ['getAliases', 'setAliases']);
        this.register('unalias', Unalias, ['getAliases', 'setAliases']);
        this.register('export', Export, ['setUserspaceVariable']);
        this.register('theme', Theme, ['getValidThemes', 'setUserspaceVariable']);
        this.register('version', Version, []);
    }

    async start() {
        // No startup logic needed for aliases anymore.
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.COMMAND_EXECUTE_BROADCAST, (payload) => this.execute(payload.commandString, payload.outputElement));
        this.#eventBus.listen(EVENTS.AUTOCOMPLETE_REQUEST, (payload) => this.autocomplete(payload.parts));

        this.#eventBus.listen(EVENTS.GET_ALIASES_REQUEST, this.#handleGetAliasesRequest.bind(this));
        this.#eventBus.listen(EVENTS.SET_ALIASES_REQUEST, this.#handleSetAliasesRequest.bind(this));

        this.#eventBus.listen(EVENTS.GET_COMMAND_LIST_REQUEST, this.#handleGetCommandListRequest.bind(this));
        this.#eventBus.listen(EVENTS.GET_COMMAND_META_REQUEST, this.#handleGetCommandMetaRequest.bind(this));
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
            const allProvidedFunctions = {
                // Functions that are part of CommandService's core responsibility (now deprecated for direct use by commands)
                getPermittedCommandNames: this.getPermittedCommandNames.bind(this),
                getAvailableCommandNames: this.getAvailableCommandNames.bind(this),
                getCommandClass: this.getCommandClass.bind(this),

                // Functions provided by the API gateway
                ...Object.fromEntries(
                    Object.getOwnPropertyNames(ServiceApiManager.prototype) // Get all method names from the provider
                        .filter(name => name !== 'constructor') // Get all methods
                        .map(name => [name, this.#apiProvider[name].bind(this.#apiProvider)])
                )
            };

            const commandServices = {};
            for (const funcName of requiredServices) {
                if (allProvidedFunctions[funcName]) {
                    commandServices[funcName] = allProvidedFunctions[funcName];
                } else {
                    log.warn(`Command '${name}' requested unknown function '${funcName}'.`);
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

    async getAvailableCommandNames() {
        const availableRegistered = await this.getPermittedCommandNames();
        // This part of autocomplete might not have access to aliases without an async call.
        const aliasNames = []; // Simplified for now. A full implementation would need an async lookup.
        return [...new Set([...availableRegistered, ...aliasNames])].sort();
    }

    async getPermittedCommandNames() {
        const registeredCommands = this.getCommandNames();
        const context = await this.#getContext();
        const availableCommands = registeredCommands.filter(name => {
            const CommandClass = this.getCommandClass(name);
            if (CommandClass && typeof CommandClass.isAvailable === 'function') {
                return CommandClass.isAvailable(context);
            }
            return true;
        });
        return availableCommands.sort();
    }

    async #getContext() {
        return {
            isLoggedIn: await this.#apiProvider.isLoggedIn(),
            // Future context properties can be added here
        };
    }

    async autocomplete(parts) {
        log.log('Autocomplete received parts:', parts);
        let suggestions = [];

        const isCompletingCommandName = parts.length <= 1;

        if (isCompletingCommandName) {
            const input = parts[0] || '';
            suggestions = (await this.getAvailableCommandNames()).filter(name => name.startsWith(input));
        } else {
            let commandName = parts[0];
            let argsForCompletion = parts.slice(1);

            const aliases = await this.#apiProvider.getAliases();
            if (aliases[commandName]) {
                const aliasValue = aliases[commandName];
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
            const aliases = await this.#apiProvider.getAliases();
            if (aliases[commandName]) {
                const aliasValue = aliases[commandName];
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

    // --- Event Handlers for API Requests ---

    async #handleGetAliasesRequest({ respond }) {
        try {
            const aliasValue = await this.#apiProvider.getVariable(VAR_ALIAS) || '{}';
            respond({ aliases: JSON.parse(aliasValue) });
        } catch (error) {
            log.error("Failed to get aliases:", error);
            respond({ aliases: {} });
        }
    }

    #handleSetAliasesRequest({ aliases }) {
        this.#apiProvider.setRemoteVariable(VAR_ALIAS, JSON.stringify(aliases));
    }

    async #handleGetCommandListRequest({ respond }) {
        const commands = await this.getPermittedCommandNames();
        respond({ commands });
    }

    #handleGetCommandMetaRequest({ commandName, metaKey, respond }) {
        const CommandClass = this.getCommandClass(commandName);
        if (!CommandClass) {
            respond({ value: undefined });
            return;
        }

        let value;
        switch (metaKey) {
            case 'description':
                value = CommandClass.DESCRIPTION;
                break;
            case 'man':
                value = CommandClass.man ? CommandClass.man() : 'No manual entry for this command.';
                break;
            default:
                value = undefined;
        }
        respond({ value });
    }
}

export { CommandService };