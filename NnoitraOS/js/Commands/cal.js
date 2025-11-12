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
 * @class Cal
 * @description Implements the 'cal' command, which displays a calendar for the current month.
 */
class Cal extends BaseCommand {
    /**
     * @static
     * @type {string}
     * @description A brief description of the cal command.
     */
    static DESCRIPTION = 'Display a calendar.';

    constructor(services) {
        super(services);
    }

    /**
     * Executes the cal command.
     * @param {string[]} args - Command arguments (not used).
     * @param {HTMLElement} outputElement - The element to display output in.
     */
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputPre = document.createElement('pre');
        if (outputElement) outputElement.appendChild(outputPre);

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed

        const monthName = now.toLocaleString('default', { month: 'long' });
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, ...
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const calendarWidth = 20; // "Su Mo Tu We Th Fr Sa".length

        // 1. Header (Month and Year)
        const title = `${monthName} ${year}`;
        const padding = Math.floor((calendarWidth - title.length) / 2);
        let calendar = ' '.repeat(padding) + title + '\n';

        // 2. Day of week header
        calendar += 'Su Mo Tu We Th Fr Sa\n';

        // 3. Days
        // Add padding for the first day of the month
        calendar += ' '.repeat(firstDayOfMonth * 3);

        for (let day = 1; day <= daysInMonth; day++) {
            calendar += String(day).padStart(2, ' ') + ' ';
            // If it's a Saturday and not the last day of the month, add a newline
            if ((day + firstDayOfMonth) % 7 === 0 && day < daysInMonth) {
                calendar += '\n';
            }
        }

        outputPre.textContent = calendar.trimEnd();
    }

    static man() {
        return `NAME\n       cal - Display a calendar.\n\nSYNOPSIS\n       cal\n\nDESCRIPTION\n       The cal command displays a calendar for the current month.`;
    }
}

export { Cal };
