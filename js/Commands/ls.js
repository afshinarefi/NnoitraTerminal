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
import { createDirectoryList } from '../Utils/TableUtil.js';
import { createLogger } from '../Managers/LogManager.js';

const log = createLogger('ls');
/**
 * @class Ls
 * @description Implements the 'ls' command, which lists the contents of a directory using FilesystemService.
 */
class Ls {
    #getDirectoryContents;
    #autocompletePath;

    /**
     * Creates an instance of Ls.
     * @param {object} funcs - A collection of functions passed by the command service.
     * @param {Function} funcs.getDirectoryContents - A function to retrieve directory contents.
     * @param {Function} funcs.autocompletePath - A function for path autocompletion.
     */
    constructor(funcs) {
        this.#getDirectoryContents = funcs.getDirectoryContents;
        this.#autocompletePath = funcs.autocompletePath;
    }

    static man() {
        return `NAME\n       ls - List directory contents.\n\nSYNOPSIS\n       ls [directory]\n\nDESCRIPTION\n       The ls command lists files and directories in the specified location.\n       If no location is given, it lists the current directory.`;
    }

    async autocompleteArgs(currentArgs) {
        // Only provide suggestions for the first argument.
        if (currentArgs.length > 1) {
            return [];
        }
        const input = currentArgs[0] || '';
        return await this.#autocompletePath(input, true);
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        const pathArg = args[1] || '.';
        
        try {
            const contents = await this.#getDirectoryContents(pathArg);
            
            if (typeof contents === 'string') { // It's a file
                const pre = document.createElement('pre');
                pre.innerText = contents;
                outputDiv.appendChild(pre);
                return outputDiv;
            }

            // Delegate all formatting and list creation to the utility.
            const ul = createDirectoryList(contents);
            outputDiv.appendChild(ul);

        } catch (error) {
            log.warn(`Cannot access path: "${pathArg}"`, error);
            outputDiv.textContent = `ls: cannot access '${pathArg}': ${error.message}`;
        }

        return outputDiv;
    }
}

export { Ls };
