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
 * @class Env
 * @description Implements the 'env' command, which lists all current environment variables.
 */
class Env extends BaseCommand {
    /**
     * @static
     * @type {string}
     * @description A brief description of the env command.
     */
    static DESCRIPTION = 'List current environment variables.';

    /** @private {Function} #getAllCategorizedVariables - Function to get all categorized variables. */
    #getAllCategorizedVariables;

    /**
     * Creates an instance of Env.
     * @param {object} services - The object containing all services.
     */
    constructor(services) {
        super(services);
        this.#getAllCategorizedVariables = this.services.getAllCategorizedVariables;
    }

    /**
     * Executes the env command.
     * Retrieves all environment variables from the EnvironmentService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLPreElement>} A promise that resolves with a `<pre>` HTML element containing the environment variables.
     */
    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);

        const categorizedVars = await this.#getAllCategorizedVariables();
        let output = '';

        const formatCategory = (title, vars) => {
            if (Object.keys(vars).length === 0) return '';

            let categoryOutput = `<br># ${title} Variables<br>`;
            for (const [key, value] of Object.entries(vars)) {
                // Check if the value contains spaces or is a JSON-like string, and quote it if so.
                // Also ensure the value is a string before calling string methods on it.
                if (typeof value === 'string' && (/\s/.test(value) || (value.startsWith('{') && value.endsWith('}')))) {
                    categoryOutput += `${key}="${value}"<br>`;
                } else if (value !== undefined && value !== null) {
                    categoryOutput += `${key}=${value}<br>`;
                } else {
                    categoryOutput += `${key}=${value}<br>`;
                }
            }
            return categoryOutput;
        };

        // Using "Session" as a more user-friendly name for "Temporary"
        output += formatCategory('Session (In-Memory)', categorizedVars.TEMP || {});
        output += formatCategory('Local (Browser Storage)', categorizedVars.LOCAL);
        output += formatCategory('Remote (User Account)', categorizedVars.SYSTEM);
        output += formatCategory('User (Configurable)', categorizedVars.USERSPACE);

        outputDiv.innerHTML = output.trim();
    }

    /**
     * Provides a detailed manual page for the env command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       env - Display environment variables.\n\nSYNOPSIS\n       env [OPTION]...\n\nDESCRIPTION\n       The env command prints the current environment variables to standard output.\n       Each variable is displayed on a new line in the format KEY=VALUE.\n\nOPTIONS\n       Currently, this command does not support any options.\n\nEXAMPLES\n       $ env\n       (Displays all current environment variables.)`;
    }

}

export { Env };
