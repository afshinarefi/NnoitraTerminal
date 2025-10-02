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
 * @class Env
 * @description Implements the 'env' command, which lists all current environment variables.
 */
class Env {
    /**
     * @static
     * @type {string}
     * @description A brief description of the env command.
     */
    static DESCRIPTION = 'List current environment variables.';

    /** @private {EnvironmentService} #environmentService - Reference to the EnvironmentService. */
    #environmentService;

    /**
     * Creates an instance of Env.
     * @param {object} services - The object containing all services.
     */
    constructor(services) {
        this.#environmentService = services.environment;
    }

    /**
     * Executes the env command.
     * Retrieves all environment variables from the EnvironmentService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLPreElement>} A promise that resolves with a `<pre>` HTML element containing the environment variables.
     */
    async execute(args) {
        const pre = document.createElement('pre');
        const allVariables = this.#environmentService.getAllVariables();
        let output = '';

        for (const [key, value] of Object.entries(allVariables)) {
            output += `${key}=${JSON.stringify(value)}\n`;
        }
        pre.innerText = output.trim();
        return pre;
    }

    /**
     * Provides a detailed manual page for the env command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       env - Display environment variables.\n\nSYNOPSIS\n       env [OPTION]...\n\nDESCRIPTION\n       The env command prints the current environment variables to standard output.\n       Each variable is displayed on a new line in the format KEY=VALUE.\n\nOPTIONS\n       Currently, this command does not support any options.\n\nEXAMPLES\n       $ env\n       (Displays all current environment variables.)`;
    }

    /**
     * Provides autocomplete suggestions for the arguments of the env command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested arguments.
     */
    static autocompleteArgs(currentArgs, services) {
        // For 'env', we might suggest environment variable names if the user is trying to set one,
        // or options like '-i' for ignoring environment (if implemented).
        // For now, let's return an empty array as it doesn't take arguments in its current form.
        return [];
    }
}

export { Env };
