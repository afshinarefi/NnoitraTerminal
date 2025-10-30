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
import { BaseCommand } from '../Core/BaseCommand.js';
/**
 * @class Clear
 * @description Implements the 'clear' command, which clears the terminal output.
 */
class Clear extends BaseCommand {
    static DESCRIPTION = 'Clear the terminal output.';
    #clearScreen;

    constructor(services) {
        super(services);
        this.#clearScreen = this.services.clearScreen;
    }

    /**
     * Executes the clear command by dispatching a terminal-clear event
     * @param {string[]} args - Command arguments (not used)
     * @returns {HTMLElement} An empty div, as this command produces no visible output.
     */
    execute(args) {
        this.log.log('Executing clear command.');
        this.#clearScreen();
        const outputDiv = document.createElement('div');
        // The command itself produces no output, so we return an empty element.
        return outputDiv;
    }

    /**
     * Returns manual page content for the clear command
     * @returns {string} The manual page content
     */
    static man() {
        return `NAME
       clear - Clear the terminal output.

SYNOPSIS
       clear

DESCRIPTION
       The clear command erases all output in the terminal window.`;
    }
}

export { Clear };
