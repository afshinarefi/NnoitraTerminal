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
 * @class Date
 * @description Implements the 'date' command, which displays the current date and time.
 */
class DateCmd extends BaseCommand {
    /**
     * @static
     * @type {string}
     * @description A brief description of the date command.
     */
    static DESCRIPTION = 'Display the current date and time.';

    constructor(services) {
        super(services);
    }

    /**
     * Executes the date command.
     * @param {string[]} args - Command arguments (not used).
     * @param {HTMLElement} outputElement - The element to display output in.
     */
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);

        outputDiv.textContent = new Date().toString();
    }

    static man() {
        return `NAME\n       date - Display the current date and time.\n\nSYNOPSIS\n       date\n\nDESCRIPTION\n       The date command prints the current system date and time to standard output.`;
    }
}

export { DateCmd as Date };
