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
const log = createLogger('help');
/**
 * @class Help
 * @description Implements the 'help' command, which lists all available commands and their descriptions.
 */
class Help {
    /**
     * @static
     * @type {string}
     * @description A brief description of the help command.
     */
    static DESCRIPTION = 'Lists available commands.';

    /** @private {CommandService} #commandService - Reference to the CommandService. */
    #commandService;

    /**
     * Creates an instance of Help.
     * @param {CommandService} commandService - The CommandService instance to interact with.
     */
    constructor(services) {
        this.#commandService = services.command;
    }

    /**
     * Provides a detailed manual page for the help command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       help - Display information about available commands.\n\nSYNOPSIS\n       help\n\nDESCRIPTION\n       The help command lists all commands available in the terminal, along with a brief description for each.\n       It is useful for discovering what commands can be used.\n\nUSAGE\n       help\n\n       This command takes no arguments.\n\nEXAMPLES\n       $ help\n       (Displays a list of all commands and their descriptions.)`;
    }

    /**
     * Provides autocomplete suggestions for the arguments of the help command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested arguments.
     */
    static autocompleteArgs(currentArgs, services) {
        return []; // Help command takes no arguments.
    }

    /**
     * Executes the help command.
     * Retrieves all registered commands and their descriptions from the CommandService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the list of commands.
     */
    async execute(args) {
        log.log('Executing...');
        const outputDiv = document.createElement('div');
        const commands = this.#commandService.getHelpCommandNames();

        if (commands.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No commands available.';
            outputDiv.appendChild(p);
            return outputDiv;
        }

        const pre = document.createElement('pre');
        let helpText = '';

        commands.forEach(cmdName => {
            const CommandClass = this.#commandService.getCommandClass(cmdName); // Assuming CommandService has this method
            const description = CommandClass ? CommandClass.DESCRIPTION || 'No description available.' : 'No description available.';
            helpText += `${cmdName.padEnd(15)} : ${description}\n`;
        });

        pre.innerText = helpText.trim();
        outputDiv.appendChild(pre);
        return outputDiv;
    }
}

export { Help };
