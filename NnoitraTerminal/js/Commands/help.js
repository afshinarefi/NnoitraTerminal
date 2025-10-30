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
 * @class Help
 * @description Implements the 'help' command, which lists all available commands and their descriptions.
 */
class Help extends BaseCommand {
    /**
     * @static
     * @type {string}
     * @description A brief description of the help command.
     */
    static DESCRIPTION = 'Lists available commands.';

    #getCommandList;
    #getCommandMeta;

    /**
     * Creates an instance of Help.
     * @param {CommandService} commandService - The CommandService instance to interact with.
     */
    constructor(services) {
        super(services);
        this.#getCommandList = this.services.getCommandList;
        this.#getCommandMeta = this.services.getCommandMeta;
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
     * Executes the help command.
     * Retrieves all registered commands and their descriptions from the CommandService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the list of commands.
     */
    async execute(args) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        // Use the injected service function to get the list of commands.
        const commands = await this.#getCommandList();

        if (commands.length === 0) {
            outputDiv.textContent = 'No commands available.';
            return outputDiv;
        }

        // Find the length of the longest command name for alignment.
        const maxLength = Math.max(...commands.map(cmd => cmd.length));
        const padding = maxLength + 4;

        // Use CSS to preserve whitespace, avoiding the need for a <pre> tag.
        outputDiv.style.whiteSpace = 'pre-wrap';
        let helpText = '';

        // Asynchronously fetch the description for each command.
        for (const cmdName of commands) {
            const description = await this.#getCommandMeta(cmdName, 'DESCRIPTION') || 'No description available.';
            helpText += `${cmdName.padEnd(padding)} : ${description}\n`;
        }

        outputDiv.textContent = helpText.trim();
        return outputDiv;
    }
}

export { Help };
