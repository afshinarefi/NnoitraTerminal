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
import { EVENTS } from '../Core/Events.js';
import { ENV_VARS } from '../Core/Variables.js';
import { ServiceApiManager } from '../Managers/ServiceApiManager.js';
import { tokenize } from '../Utils/Tokenizer.js';
import { BaseService } from '../Core/BaseService.js';

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
class CommandService extends BaseService{
    #registry = new Map();
    #apiProvider;

    constructor(eventBus) {
        super(eventBus);
        this.#apiProvider = new ServiceApiManager(eventBus);

        this.#registerCommands();
        this.log.log('Initializing...');
    }

    #registerCommands() {
        // Register commands with their specific service dependencies.
        this.register('welcome', Welcome, []);
        this.register('about', About, ['requestMedia']); 
        this.register('env', Env, ['getAllCategorizedVariables']);
        this.register('help', Help, ['getCommandList', 'getCommandMeta']);
        this.register('man', Man, ['getCommandList', 'getCommandMeta']);
        this.register('history', History, ['getHistory']);
        this.register('ls', Ls, ['getDirectoryContents']);
        this.register('cd', Cd, ['changeDirectory', 'getDirectoryContents']);
        this.register('cat', Cat, ['getFileContents', 'getDirectoryContents']);
        this.register('clear', Clear, ['clearScreen']);
        this.register('view', View, ['getDirectoryContents', 'getPublicUrl', 'requestMedia']);
        this.register('adduser', AddUser, ['prompt', 'addUser']);
        this.register('login', Login, ['prompt', 'login']);
        this.register('logout', Logout, ['logout']);
        this.register('passwd', Passwd, ['prompt', 'changePassword']);
        this.register('alias', Alias, ['getAliases', 'setAliases']);
        this.register('unalias', Unalias, ['getAliases', 'setAliases']);
        this.register('export', Export, ['exportVariable', 'getAllCategorizedVariables']);
        this.register('theme', Theme, ['getValidThemes', 'setTheme', 'getRemoteVariable']);
        this.register('version', Version, []);
    }

    get eventHandlers() {
        return {
            [EVENTS.COMMAND_EXECUTE_BROADCAST]: this.#handleExecute.bind(this),
            [EVENTS.GET_ALIASES_REQUEST]: this.#handleGetAliasesRequest.bind(this),
            [EVENTS.SET_ALIASES_REQUEST]: this.#handleSetAliasesRequest.bind(this),
            [EVENTS.GET_AUTOCOMPLETE_SUGGESTIONS_REQUEST]: this.#handleGetAutocompleteSuggestions.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.GET_COMMAND_LIST_REQUEST]: this.#handleGetCommandListRequest.bind(this),
            [EVENTS.GET_COMMAND_META_REQUEST]: this.#handleGetCommandMetaRequest.bind(this)
        };
    }

    register(name, CommandClass, requiredServices = []) {
        this.#registry.set(name, { CommandClass, requiredServices });
    }

    #handleExecute({ commandString, outputElement }) {
        this.execute(commandString, outputElement);
    }

    getCommand(name) {
        const registration = this.#registry.get(name);
        if (registration) {
            const { CommandClass, requiredServices = [] } = registration;

            // Create a tailored 'services' object for the command, providing only what it needs.
            // This adheres to the principle of least privilege.
            const commandServices = requiredServices.reduce((acc, funcName) => {
                if (typeof this.#apiProvider[funcName] === 'function') {
                    acc[funcName] = this.#apiProvider[funcName].bind(this.#apiProvider);
                } else {
                    this.log.warn(`Command '${name}' requested unknown function '${funcName}'.`);
                }
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

    /**
     * Resolves the effective command name and arguments, handling aliases.
     * @param {string[]} initialTokens - The raw tokens from the input string.
     * @returns {Promise<{commandName: string, args: string[]}>} An object containing the resolved command name and arguments.
     */
    async #resolveCommandAndArgs(initialTokens) {
        let currentTokens = [...initialTokens]; // Work with a copy
        let commandName = (currentTokens[0] || '').trim();

        if (!commandName) {
            return { commandName: '', args: [] };
        }

        const aliases = await this.#apiProvider.getAliases();
        if (aliases[commandName]) {
            const aliasValue = aliases[commandName];
            const aliasArgs = tokenize(aliasValue); // Tokenize alias value
            const remainingUserArgs = currentTokens.slice(1);
            
            currentTokens = [...aliasArgs, ...remainingUserArgs];
            commandName = (currentTokens[0] || '').trim(); // Re-evaluate commandName after alias expansion
        }

        return { commandName, args: currentTokens };
    }

    async execute(cmd, outputContainer) {
        try {
            const trimmedCmd = cmd.trim();
            if (!trimmedCmd) {
                return; // Do nothing for an empty command.
            }

            // Tokenize the command string. The resulting tokens include delimiters.
            const initialTokens = tokenize(trimmedCmd);
            if (initialTokens.length === 0) return;

            const { commandName, args: resolvedArgs } = await this.#resolveCommandAndArgs(initialTokens);
            if (!commandName) { // Command is only whitespace after alias resolution
                return;
            }

            const outputElement = outputContainer ? outputContainer.element : null;
            
            if (this.#registry.has(commandName)) {
                try {
                    const commandHandler = this.getCommand(commandName);
                    this.log.log(`Executing command: "${resolvedArgs}"`);
                    const resultElement = await commandHandler.execute(resolvedArgs);
                    if (outputElement) outputElement.appendChild(resultElement);
                } catch (e) {
                    if (outputElement) outputElement.textContent = `Error executing ${commandName}: ${e.message}`;
                    this.log.error(`Error executing ${commandName}:`, e);
                }
            } else {
                if (outputElement) outputElement.textContent = `${commandName}: command not found`;
            }
        } finally {
            // Always dispatch the finished event to allow the terminal loop to continue.
            this.dispatch(EVENTS.COMMAND_EXECUTION_FINISHED_BROADCAST);
        }
    }

    // --- Event Handlers for API Requests ---

    async #handleGetAliasesRequest({ respond }) {
        try {
            const { value } = await this.request(EVENTS.VAR_GET_REMOTE_REQUEST, { key: ENV_VARS.ALIAS });
            respond({ aliases: JSON.parse(value || '{}') });
        } catch (error) {
            this.log.error("Failed to get aliases:", error);
            respond({ aliases: {} });
        }
    }

    #handleSetAliasesRequest({ aliases }) {
        this.dispatch(EVENTS.VAR_SET_REMOTE_REQUEST, { key: ENV_VARS.ALIAS, value: JSON.stringify(aliases) });
    }

    async #handleGetCommandListRequest({ respond }) {
        const commands = await this.getPermittedCommandNames();
        respond({ commands });
    }

    #handleGetCommandMetaRequest({ commandName, metaKey, respond }) {
        const CommandClass = this.getCommandClass(commandName);
        if (CommandClass && CommandClass[metaKey] !== undefined) {
            const metaValue = CommandClass[metaKey];
            // If the metadata is a function (like man()), call it to get the value.
            if (typeof metaValue === 'function') {
                respond({ value: metaValue() });
            } else {
                respond({ value: metaValue });
            }
        } else {
            // Respond with undefined if the command or meta key doesn't exist.
            respond({ value: undefined });
        }
    }

    async #handleGetAutocompleteSuggestions({ parts, respond }) {
        let suggestions = [];
        let description = '';
        const isCompletingCommandName = parts.length <= 1;

        if (isCompletingCommandName) {
            const commandNames = await this.#getAvailableCommandNames();
            suggestions = commandNames.map(name => name + ' ');
        } else {
            const { commandName: resolvedCommandName, args: resolvedArgsForCompletion } = await this.#resolveCommandAndArgs(parts);
            const CommandClass = this.getCommandClass(resolvedCommandName);
            // Check if the instance method exists on the prototype.
            // This is the correct way to check for an instance method before instantiating the command.
            
            if (CommandClass && typeof CommandClass.prototype.autocompleteArgs === 'function') { // Check against resolvedCommandName
                const commandInstance = this.getCommand(resolvedCommandName);
                const result = await commandInstance.autocompleteArgs(resolvedArgsForCompletion.slice(1)); // Pass args excluding the command name
                if (Array.isArray(result)) {
                    suggestions = result;
                } else if (typeof result === 'object' && result !== null) {
                    suggestions = result.suggestions || [];
                    description = result.description || '';
                }
            }
        }
        respond({ suggestions, description });
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        if (key === ENV_VARS.ALIAS) {
            const defaultValue = '{}';
            // Just respond with the default. The requester will handle setting it.
            respond({ value: defaultValue });
        }
    }
}

export { CommandService };