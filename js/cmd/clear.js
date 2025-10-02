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
import { createLogger } from '../Services/LogService.js';
/**
 * @class Clear
 * @description Implements the 'clear' command, which clears the terminal output.
 */
const log = createLogger('clear');
class Clear {
    static DESCRIPTION = 'Clear the terminal output.';
    static dependencies = [];

    constructor() {
        // No dependencies needed
    }

    /**
     * Executes the clear command by dispatching a terminal-clear event
     * @param {string[]} args - Command arguments (not used)
     * @returns {HTMLElement} The output div
     */
    execute(args) {
        log.log('Dispatching terminal-clear event.');
        const outputDiv = document.createElement('div');
        // Dispatch a custom event that the Terminal component will listen for
        const clearEvent = new CustomEvent('terminal-clear');
        document.dispatchEvent(clearEvent);
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

    /**
     * Returns array of possible argument completions
     * @returns {string[]} Empty array since clear takes no arguments
     */
    static autocompleteArgs() {
        return [];
    }
}

export { Clear };
