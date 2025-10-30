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
 * @class History
 * @description Implements the 'history' command, which displays the command history.
 */
class History extends BaseCommand {
    /**
     * @static
     * @type {string}
     * @description A brief description of the history command.
     */
    static DESCRIPTION = 'Shows the command history.';

    #getHistory;

    /**
     * Creates an instance of History.
     */
    constructor(services) {
        super(services);
        this.#getHistory = this.services.getHistory;
    }

    /**
     * Provides a detailed manual page for the history command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       history - Display the command history.\n\nSYNOPSIS\n       history\n\nDESCRIPTION\n       The history command displays a list of previously entered commands.\n\nUSAGE\n       history\n\nEXAMPLES\n       $ history\n       (Displays the list of commands entered in this session.)`;
    }

    /**
     * Executes the history command.
     * Displays the command history.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the history.
     */
    async execute(args) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        const historyData = await this.#getHistory();

        if (!historyData || historyData.length === 0) {
            outputDiv.textContent = 'No history available.';
            return outputDiv;
        }

        // Calculate the padding needed for the line numbers based on the total number of history items.
        const padding = String(historyData.length).length;

        // Use CSS to preserve whitespace, avoiding the need for a <pre> tag.
        outputDiv.style.whiteSpace = 'pre-wrap';
        // Display in chronological order (oldest to newest), but number from newest to oldest.
        const historyText = historyData.map((item, index) => ` ${String(historyData.length - index).padStart(padding)}:  ${item}`).join('\n');
        outputDiv.textContent = historyText;

        return outputDiv;
    }
}

export { History };
