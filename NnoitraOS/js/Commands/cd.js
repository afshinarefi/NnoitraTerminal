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
 * @class Cd
 * @description Implements the 'cd' command, which changes the current working directory using FilesystemService.
 */
class Cd extends BaseCommand {
    static DESCRIPTION = 'Change the current working directory.';

    #changeDirectory;
    #getDirectoryContents;

    constructor(services) {
        super(services);
        this.#changeDirectory = this.services.changeDirectory;
        this.#getDirectoryContents = this.services.getDirectoryContents;
    }

    static man() {
        return `NAME\n       cd - Change the current directory.\n\nSYNOPSIS\n       cd [directory]\n\nDESCRIPTION\n       The cd command changes the current working directory to the specified location.\n       If no location is given, it changes to the root directory.`;
    }

    async autocompleteArgs(currentArgs) {
        const pathArg = currentArgs.join('');

        const lastSlashIndex = pathArg.lastIndexOf('/');
        const dirToList = lastSlashIndex === -1 ? '.' : pathArg.substring(0, lastSlashIndex + 1) || '/';

        try {
            // Get all contents of the target directory.
            const contents = await this.#getDirectoryContents(dirToList);
            const suggestions = [];

            // For 'cd', we only suggest directories. AutocompleteService will handle filtering.
            return (contents.directories || []).map(dir => dir.name + '/').sort();
        } catch (error) {
            this.log.warn(`Autocomplete failed for path "${pathArg}":`, error);
            return []; // On error, return no suggestions.
        }
    }

    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);

        const pathArg = args.slice(1).join('').trim() || '/';

        try {
            await this.#changeDirectory(pathArg);
        } catch (error) {
            outputDiv.textContent = `cd: ${pathArg}: ${error.message}`;
        }
    }
}

export { Cd };
