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
 * @class Mkdir
 * @description Implements the 'mkdir' command to create directories.
 */
class Mkdir extends BaseCommand {
    static DESCRIPTION = 'Create one or more directories.';

    #makeDirectory;
    #getDirectoryContents;

    constructor(services) {
        super(services);
        this.#makeDirectory = this.services.makeDirectory;
        this.#getDirectoryContents = this.services.getDirectoryContents;
    }

    static man() {
        return `NAME\n       mkdir - Create directories.\n\nSYNOPSIS\n       mkdir [directory]...\n\nDESCRIPTION\n       The mkdir command creates the specified directories. If parent directories do not exist, they will be created as well (similar to mkdir -p).`;
    }

    async autocompleteArgs(currentArgs) {
        const pathArg = currentArgs.join('');
        const lastSlashIndex = pathArg.lastIndexOf('/');
        const dirToList = lastSlashIndex === -1 ? '.' : pathArg.substring(0, lastSlashIndex + 1) || '/';

        try {
            const contents = await this.#getDirectoryContents(dirToList);
            return (contents.directories || []).map(dir => dir.name + '/').sort();
        } catch (error) {
            this.log.warn(`Autocomplete for mkdir failed for path "${pathArg}":`, error);
            return [];
        }
    }

    async execute(args, outputElement) {
        const pathArg = args.slice(1).join('').trim();
        if (!pathArg) {
            outputElement.textContent = 'mkdir: missing operand';
            return;
        }
        try {
            await this.#makeDirectory(pathArg);
        } catch (error) {
            outputElement.textContent = `mkdir: cannot create directory '${pathArg}': ${error.message}`;
        }
    }
}

export { Mkdir };
