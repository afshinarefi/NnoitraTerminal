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
const log = createLogger('cd');
/**
 * @class Cd
 * @description Implements the 'cd' command, which changes the current working directory using FilesystemService.
 */
class Cd {
    static DESCRIPTION = 'Change the current directory.';

    #filesystemService;
    #environmentService;

    constructor(services) {
        this.#filesystemService = services.filesystem;
        this.#environmentService = services.environment;
    }

    static man() {
        return `NAME\n       cd - Change the current directory.\n\nSYNOPSIS\n       cd [directory]\n\nDESCRIPTION\n       The cd command changes the current working directory to the specified location.\n       If no location is given, it changes to the root directory.`;
    }

    static async autocompleteArgs(currentArgs, services) {
        // Only provide suggestions for the first argument.
        if (currentArgs.length > 1) {
            return [];
        }
        const input = currentArgs[0] || '';
        // For 'cd', we only want to suggest directories.
        return await services.filesystem.autocompletePath(input, false);
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        let inputPath = args[1] || '/';
        let normalizedPath;
        if (inputPath.startsWith('/')) {
            normalizedPath = this.#filesystemService.normalizePath(inputPath);
        } else {
            const currentPath = this.#filesystemService.getCurrentPath();
            normalizedPath = this.#filesystemService.normalizePath(currentPath + '/' + inputPath);
        }
        log.log(`Attempting to change to normalized path: "${normalizedPath}"`);
        // Ensure the directory exists by fetching and caching if needed
        const contents = await this.#filesystemService.listContents(normalizedPath);
        if (!contents) {
            log.warn(`Directory not found: "${normalizedPath}"`);
            outputDiv.textContent = `cd: ${args[1] || '/'}: No such directory`;
            return outputDiv;
        }
        this.#filesystemService.setCurrentPath(normalizedPath);
        const absPath = this.#filesystemService.getCurrentPath();
        this.#environmentService.setVariable('PWD', absPath);
        log.log(`Successfully changed directory to: "${absPath}"`);
        outputDiv.textContent = `Changed directory to ${absPath}`;
        return outputDiv;
    }
}

export { Cd };
