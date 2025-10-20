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
import { OptionContext } from '../Utils/OptionContext.js';
const log = createLogger('cat');

export class Cat {
    static DESCRIPTION = 'Print the content of a FILE';

    #getFileContents;
    #autocompletePath;

    constructor(services) {
        this.#getFileContents = services.getFileContents;
        this.#autocompletePath = services.autocompletePath;
    }

    static man() {
        return `NAME\n       cat - Concatenate and print files.\n\nSYNOPSIS\n       cat [FILE]...\n\nDESCRIPTION\n       The cat command reads files sequentially, writing them to the standard output.`;
    }

    async autocompleteArgs(currentArgs) {
        if (currentArgs.length > 1) {
            return OptionContext.none();
        }
        return OptionContext.path({ includeFiles: true });
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const output = document.createElement('pre');
        const filePathArg = args[1];

        if (!filePathArg) {
            log.warn('Missing file operand.');
            output.textContent = 'cat: missing file operand';
            return output;
        }

        try {
            // Delegate file fetching and path resolution to the injected function.
            const content = await this.#getFileContents(filePathArg);
            output.textContent = content;
        } catch (error) {
            log.error(`Failed to get file content for "${filePathArg}":`, error);
            output.textContent = `cat: ${filePathArg}: ${error.message}`;
        }

        return output;
    }
}
