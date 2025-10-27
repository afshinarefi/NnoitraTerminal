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
import { createLogger } from '../Managers/LogManager.js';
const log = createLogger('cat');

export class Cat {
    static DESCRIPTION = 'Print the content of a FILE';

    #getFileContents;
    #getDirectoryContents;

    constructor(services) {
        this.#getFileContents = services.getFileContents;
        this.#getDirectoryContents = services.getDirectoryContents;
    }

    static man() {
        return `NAME\n       cat - Concatenate and print files.\n\nSYNOPSIS\n       cat [FILE]...\n\nDESCRIPTION\n       The cat command reads files sequentially, writing them to the standard output.`;
    }

    async autocompleteArgs(currentArgs) { // Made async for consistency
        // Reconstruct the path from all argument tokens.
        const pathArg = currentArgs.join('');

        try {
            // Get all contents of the target directory. If path is empty, use current dir.
            const contents = await this.#getDirectoryContents(pathArg || '.');
            const supportedFormats = /\.txt$/i;

            // Suggest all directories for navigation.
            const directories = (contents.directories || []).map(dir => dir.name + '/');
            // Suggest only files with supported .txt format.
            const files = (contents.files || [])
                .filter(file => supportedFormats.test(file.name))
                .map(file => file.name);

            return [...directories, ...files].sort();
        } catch (error) {
            log.warn(`Autocomplete failed for path "${pathArg}":`, error);
            return []; // On error, return no suggestions.
        }
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const output = document.createElement('pre');
        const filePathArg = args.slice(1).join('').trim();

        if (!filePathArg) {
            log.warn('Missing file operand.');
            output.textContent = 'cat: missing file operand';
            return output;
        }

        try {
            const content = await this.#getFileContents(filePathArg);
            output.textContent = content;
        } catch (error) {
            log.error(`Failed to get file content for "${filePathArg}":`, error);
            output.textContent = `cat: ${filePathArg}: ${error.message}`;
        }

        return output;
    }
}
