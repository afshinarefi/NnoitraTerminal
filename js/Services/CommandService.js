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
import { Version } from '../cmd/version.js';
import { FilesystemService } from './FilesystemService.js';
import { createLogger } from './LogService.js';

const log = createLogger('CommandService');

/**
 * @class CommandService
 * @description Manages the registration, retrieval, and execution of terminal commands.
 * It acts as a central registry for all available commands in the terminal application.
 */
class CommandService {
    /** @private {Map<string, Function>} #registry - A map storing command names as keys and their corresponding CommandClass constructors as values. */
    #registry = new Map();
    /** @private {EnvironmentService} #environmentService - Reference to the EnvironmentService for passing to commands. */
    #environmentService;
    /** @private {HistoryService} #historyService - Reference to the HistoryService for passing to commands. */
    #historyService;
    /** @private {FilesystemService} #filesystemService - Reference to the FilesystemService for passing to commands. */
    #filesystemService;
    /** @private {Object} #services - A container for all services. */
    #services;

    /**
     * Creates an instance of CommandService.
     * Registers initial commands like 'welcome' and 'env'.
     * @param {Object} services - An object containing all services (environmentService, historyService, etc.).
     */
    constructor(services) {
      this.#services = services;

      // Register default commands here.
      this.register('welcome', Welcome);
      this.register('about', About);
      this.register('env', Env);
      this.register('help', Help);
      this.register('man', Man);
      this.register('history', History);
      this.register('ls', Ls);
      this.register('cd', Cd);
      this.register('cat', Cat);
      this.register('clear', Clear);
      this.register('view', View);
      this.register('adduser', AddUser);
      this.register('login', Login);
      this.register('logout', Logout);
      this.register('passwd', Passwd);
      this.register('alias', Alias);
      this.register('unalias', Unalias);
      this.register('version', Version);
    }

    /**
     * Registers a new command with the service.
     * @param {string} name - The name of the command (e.g., 'ls', 'cd').
     * @param {Function} CommandClass - The constructor function of the command class.
     */
    register(name, CommandClass) {
        this.#registry.set(name, CommandClass);
    }
    
    /**
     * Retrieves an instance of a registered command.
     * @param {string} name - The name of the command to retrieve.
     * @returns {Object|null} A new instance of the command class if found, otherwise null.
     */
    getCommand(name) {
        const CommandClass = this.#registry.get(name);
        if (CommandClass) {
            return new CommandClass(this.#services);
        }
        return null;
    }

    /**
     * Retrieves the class constructor of a registered command.
     * @param {string} name - The name of the command to retrieve.
     * @returns {Function|undefined} The command class constructor if found, otherwise `undefined`.
     */
    getCommandClass(name) {
        return this.#registry.get(name);
    }

    /**
     * Returns a sorted list of all registered command names.
     * @returns {string[]} An array of command names.
     */
    getCommandNames() {
        return Array.from(this.#registry.keys());
    }

    /**
     * Returns a sorted list of currently available command names based on context (e.g., login status).
     * @returns {string[]} An array of available command names.
     */
    getAvailableCommandNames() {
        const availableRegistered = this.getHelpCommandNames();
        const aliases = this.#services.environment.getAliases();
        const aliasNames = Object.keys(aliases);

        // Combine registered commands and aliases, ensuring no duplicates, and sort them.
        return [...new Set([...availableRegistered, ...aliasNames])].sort();
    }

    /**
     * Returns a sorted list of command names suitable for the 'help' command.
     * This excludes aliases.
     * @returns {string[]} An array of command names for the help listing.
     */
    getHelpCommandNames() {
        const registeredCommands = this.getCommandNames();
        const availableCommands = registeredCommands.filter(name => {
            const CommandClass = this.getCommandClass(name);
            if (CommandClass && typeof CommandClass.isAvailable === 'function') {
                return CommandClass.isAvailable(this.#services);
            }
            return true; // If isAvailable is not defined, assume the command is always available.
        });
        return availableCommands.sort();
    }

        /**
         * Provides autocomplete suggestions based on the current command input parts.
         * @param {string[]} parts - An array of command parts (e.g., `[]` for initial command, `['welcome']` for arguments).
         * @returns {Promise<string[]>} Promise resolving to an array of possible completions.
         */
        async autocomplete(parts) {
            log.log('Autocomplete received parts:', parts);

            const isCompletingCommandName = parts.length === 1 && parts[0] !== '';

            // If completing the first word (command name)
            if (isCompletingCommandName) {
                log.log('Completing command name.');
                return this.getAvailableCommandNames();
            }

            // If input is empty, also complete command name
            if (!parts || parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
                return this.getAvailableCommandNames();
            }
    
            let commandName = parts[0];
            let argsForCompletion = parts.slice(1);
            log.log(`Initial command: "${commandName}", args:`, argsForCompletion);
    
            // Check for alias and substitute if found
            const aliases = this.#services.environment.getAliases();
            if (aliases[commandName]) {
                log.log(`Found alias for "${commandName}"`);
                const aliasValue = aliases[commandName];
                const aliasParts = aliasValue.split(/\s+/).filter(p => p); // Split and remove empty strings
                
                commandName = aliasParts[0];
                const aliasArgs = aliasParts.slice(1);
                
                // Prepend the alias's own arguments to the arguments typed by the user
                argsForCompletion = [...aliasArgs, ...argsForCompletion];
                log.log(`Expanded to command: "${commandName}", combined args:`, argsForCompletion);
            }
    
            const CommandClass = this.getCommandClass(commandName);
    
            if (CommandClass && typeof CommandClass.autocompleteArgs === 'function') {
                log.log(`Found CommandClass for "${commandName}" with autocompleteArgs.`);
                // If the original input ended with a space, it means we are completing a new, empty argument.
                // Otherwise, we are completing the last partial argument.
                const completionArgs = argsForCompletion;
                log.log('Calling autocompleteArgs with:', completionArgs);
                const result = CommandClass.autocompleteArgs(completionArgs, this.#services);
                // Handle both sync and async results from autocompleteArgs
                const finalResult = (result instanceof Promise) ? await result : result;
                log.log('Received suggestions from command:', finalResult);
                return finalResult;
            }
    
            return [];
        }

    /**
     * Executes a given command and appends its output to the provided output element.
     * @param {string} cmd - The full command string to execute.
     * @param {HTMLElement} output - The DOM element where the command's output should be appended.
     * @returns {Promise<void>} A promise that resolves when the command execution is complete.
     */
    async execute(cmd, output) {

      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) {
          output.innerText = ""; // Clear output for empty command.
          return;
      }

      let args = trimmedCmd.split(/\s+/);
      let commandName = args[0];

      // Check for alias and substitute if found
      const aliases = this.#services.environment.getAliases();
      if (aliases[commandName]) {
          const aliasValue = aliases[commandName];
          const aliasArgs = aliasValue.split(/\s+/);
          const remainingUserArgs = args.slice(1);
          // Reconstruct the command string and re-parse
          const newCmd = [...aliasArgs, ...remainingUserArgs].join(' ');
          args = newCmd.split(/\s+/);
          commandName = args[0];
      }

      // Check if the command is registered.
      if (this.#registry.has(commandName)) {
          try {
              const commandHandler = this.getCommand(commandName);
              // Execute the command handler and append its result to the output.
              const resultElement = await commandHandler.execute(args);
              output.appendChild(resultElement);
          } catch (e) {
              // Handle errors during command execution.
              output.textContent = `Error executing ${commandName}: ${e.message}`;
          }
      } else {
          // If it's not a registered command (it might have been an alias that resolved to a non-existent command)
          output.textContent = commandName + ": command not found";
      }
  }
}

export { CommandService };
