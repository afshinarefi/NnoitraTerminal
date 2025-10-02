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
const log = createLogger('cat');

export class Cat {
    static DESCRIPTION = 'Print the content of a FILE';

    #filesystemService;

    constructor(services) {
        this.#filesystemService = services.filesystem;
    }

    static man() {
        return `NAME\n       cat - Concatenate and print files.\n\nSYNOPSIS\n       cat [FILE]...\n\nDESCRIPTION\n       The cat command reads files sequentially, writing them to the standard output.`;
    }

    static async autocompleteArgs(currentArgs, services) {
        if (currentArgs.length > 1) {
            return [];
        }
        const input = currentArgs[0] || '';
        const allPaths = await services.filesystem.autocompletePath(input, true);
        // Filter to only suggest .txt files or directories (to allow navigation)
        return allPaths.filter(p => p.endsWith('/') || p.toLowerCase().endsWith('.txt'));
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const output = document.createElement('pre');
        const filePathArg = args[1];

        if (!filePathArg) {
            output.textContent = 'cat: missing file operand';
            return output;
        }

        let path = filePathArg;
        if (!path.startsWith('/')) {
            path = this.#filesystemService.getCurrentPath().replace(/\/$/, '') + '/' + path;
        }
        path = this.#filesystemService.normalizePath(path);
        log.log(`Attempting to read file: "${path}"`);

        if (!this.#filesystemService.isFile(path)) {
            log.warn(`Path is not a file or does not exist: "${path}"`);
            output.textContent = `cat: ${filePathArg}: No such file or it is a directory`;
            return output;
        }

        if (!path.toLowerCase().endsWith('.txt')) {
            log.warn(`File is not a .txt file: "${path}"`);
            output.textContent = `cat: ${filePathArg}: Cannot display binary file or unsupported file type. Only .txt files are supported.`;
            return output;
        }

        try {
            const response = await fetch(`/fs${path}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            output.textContent = content;
        } catch (error) {
            log.error(`Failed to fetch file content for "${path}":`, error);
            output.textContent = `cat: ${filePathArg}: Cannot read file`;
        }

        return output;
    }
}
