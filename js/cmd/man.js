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
/**
 * @class Man
 * @description Implements the 'man' command, which displays the manual page for a given command.
 */
class Man {
    /**
     * @static
     * @type {string}
     * @description A brief description of the man command.
     */
    static DESCRIPTION = 'Shows the manual page for a command.';

    /** @private {CommandService} #commandService - Reference to the CommandService. */
    #commandService;

    /**
     * Creates an instance of Man.
     * @param {CommandService} commandService - The CommandService instance to interact with.
     */
    constructor(services) {
        this.#commandService = services.command;
    }

    /**
     * Provides a detailed manual page for the man command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       man - Display the manual page for a command.\n\nSYNOPSIS\n       man <command>\n\nDESCRIPTION\n       The man command displays the manual page for the specified command.\n       If no command is specified, it will prompt for a command name.\n\nUSAGE\n       man <command>\n\nEXAMPLES\n       $ man help\n       (Displays the manual page for the 'help' command.)`;
    }

    /**
     * Provides autocomplete suggestions for the arguments of the man command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested arguments.
     */
    static autocompleteArgs(currentArgs, services, fullParts) {
        const commandService = services.command;
        console.log('DEBUG: autocompleteArgs currentArgs', currentArgs, 'fullParts', fullParts);
        // If fullParts is available, use it to check argument count
        if (fullParts && fullParts.length > 2) {
            return [];
        }
        // If starting the first argument, suggest all command names
        if (currentArgs.length === 0) {
            return commandService.getHelpCommandNames();
        }
        // If typing the first argument, suggest matching command names
        if (currentArgs.length === 1) {
            const input = currentArgs[0] || '';
            // If input is already a valid command name, do not suggest anything
            if (commandService.getHelpCommandNames().includes(input)) {
                return [];
            }
            return commandService.getHelpCommandNames().filter(cmd => cmd.startsWith(input));
        }
        // If typing the second or later argument, do not suggest anything
        return [];
    }

    /**
     * Executes the man command.
     * Displays the manual page for the specified command.
     * @param {string[]} args - An array of arguments passed to the command.
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the manual page.
     */
    async execute(args) {
        const outputDiv = document.createElement('div');
        if (!args || args.length === 0 || !args[0]) {
            const p = document.createElement('p');
            p.textContent = 'Usage: man <command>\nPlease specify a command name.';
            outputDiv.appendChild(p);
            return outputDiv;
        }
        const cmdName = args[1];
        if (!cmdName) {
            const p = document.createElement('p');
            p.textContent = 'Usage: man <command>\nPlease specify a command name.';
            outputDiv.appendChild(p);
            return outputDiv;
        }
        const lowerCmdName = cmdName.toLowerCase();
        // Debug: print all command names and lookup result
        console.log('DEBUG: getAvailableCommandNames()', this.#commandService.getAvailableCommandNames());
        let exactMatch = this.#commandService.getAvailableCommandNames().find(cmd => cmd.toLowerCase() === lowerCmdName);
        let CommandClass = exactMatch ? this.#commandService.getCommandClass(exactMatch) : undefined;
        console.log('DEBUG: exactMatch', exactMatch, 'CommandClass', CommandClass);
        if (!CommandClass) {
            // Try unique partial match (case-insensitive)
            const matches = this.#commandService.getAvailableCommandNames().filter(cmd => cmd.toLowerCase().startsWith(lowerCmdName));
            console.log('DEBUG: partial matches', matches);
            if (matches.length === 1) {
                CommandClass = this.#commandService.getCommandClass(matches[0]);
                console.log('DEBUG: unique partial CommandClass', CommandClass);
            } else if (matches.length > 1) {
                const p = document.createElement('p');
                p.textContent = `Ambiguous command: '${cmdName}'. Possible matches: ${matches.join(', ')}`;
                outputDiv.appendChild(p);
                return outputDiv;
            } else {
                const p = document.createElement('p');
                p.textContent = `No manual entry for '${cmdName}'.`;
                outputDiv.appendChild(p);
                return outputDiv;
            }
        }
        if (CommandClass && typeof CommandClass.man === 'function') {
            const pre = document.createElement('pre');
            pre.innerText = CommandClass.man();
            outputDiv.appendChild(pre);
            return outputDiv;
        } else {
            const p = document.createElement('p');
            p.textContent = `No manual entry for '${cmdName}'.`;
            outputDiv.appendChild(p);
            return outputDiv;
        }
    }
}

export { Man };
