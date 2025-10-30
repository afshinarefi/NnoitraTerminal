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
import { BaseCommand } from '../Core/BaseCommand.js';
/**
 * @class Man
 * @description Implements the 'man' command, which displays the manual page for a given command.
 */
class Man extends BaseCommand {
    /**
     * @static
     * @type {string}
     * @description A brief description of the man command.
     */
    static DESCRIPTION = 'Shows the manual page for a command.';

    /** @private {CommandService} #commandService - Reference to the CommandService. */
    #getCommandList;
    #getCommandMeta;

    constructor(services) {
        super(services);
        this.#getCommandList = this.services.getCommandList;
        this.#getCommandMeta = this.services.getCommandMeta;
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
    async autocompleteArgs(currentArgs) { // Made async for consistency
        if (currentArgs.length > 1) {
            return [];
        }

        const commandList = await this.#getCommandList();
        const input = currentArgs[0] || '';

        // If input is already a valid command name, do not suggest anything further.
        if (commandList.includes(input)) {
            return [];
        }
        if (input) {
            return commandList.filter(cmd => cmd.startsWith(input));
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
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (args.length <= 1) {
            outputDiv.textContent = 'Usage: man <command>\nPlease specify a command name.';
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
        const commandList = await this.#getCommandList();
        this.log.log('Searching for command:', lowerCmdName);
        let exactMatch = commandList.find(cmd => cmd.toLowerCase() === lowerCmdName);
        let manContent = exactMatch ? await this.#getCommandMeta(exactMatch, 'man') : undefined;
        this.log.log('Exact match found:', exactMatch);
        if (!manContent) {
            // Try unique partial match (case-insensitive)
            const matches = commandList.filter(cmd => cmd.toLowerCase().startsWith(lowerCmdName));
            this.log.log('Partial matches found:', matches);
            if (matches.length === 1) {
                manContent = await this.#getCommandMeta(matches[0], 'man');
                this.log.log('Unique partial match found:', matches[0]);
            } else if (matches.length > 1) {
                outputDiv.textContent = `man: ambiguous command '${cmdName}'; possibilities: ${matches.join(' ')}`;
                this.log.warn('Ambiguous command:', { input: cmdName, matches });
                return outputDiv;
            } else {
                outputDiv.textContent = `No manual entry for '${cmdName}'.`;
                return outputDiv;
            }
        }
        if (manContent) {
            this.log.log('Displaying man page.');
            outputDiv.style.whiteSpace = 'pre-wrap';
            outputDiv.textContent = manContent;
            return outputDiv;
        } else { // This else block is redundant if manContent is already checked above.
            this.log.warn(`No man page function found for command: "${cmdName}"`);
            outputDiv.textContent = `No manual entry for '${cmdName}'.`;
            return outputDiv;
        }
    }
}

export { Man };
