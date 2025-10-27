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

const log = createLogger('view');
/**
 * @class View
 * @description Implements the 'view' command, which displays an image or video file.
 */
class View {
    static DESCRIPTION = 'View a photo or video.';

    #getDirectoryContents;
    #getPublicUrl;
    #requestMedia;

    constructor(services) {
        this.#getDirectoryContents = services.getDirectoryContents;
        this.#getPublicUrl = services.getPublicUrl;
        this.#requestMedia = services.requestMedia;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       view - Display an image or video file.\n\nSYNOPSIS\n       view [file]\n\nDESCRIPTION\n       The view command displays the specified image (png, jpg, gif) or video (mp4, webm) file.\n       The path can be absolute or relative to the current directory.`;
    }

    async autocompleteArgs(currentArgs) { // Made async for consistency
        // Reconstruct the path from all argument tokens.
        const pathArg = currentArgs.join('');

        try {
            // Get all contents of the target directory. If path is empty, use current dir.
            const contents = await this.#getDirectoryContents(pathArg || '.');
            const supportedFormats = /\.(png|jpg|jpeg|gif|webp|mp4|webm)$/i;

            // Suggest all directories.
            const directories = (contents.directories || []).map(dir => dir.name + '/');
            // Suggest only files with supported formats.
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
        const outputDiv = document.createElement('div');
        
        // Reconstruct the file path from all argument tokens.
        const commandArgs = args.slice(1);
        const filePathArg = commandArgs.join('').trim();

        if (!filePathArg) {
            log.warn('Missing file operand.');
            outputDiv.textContent = 'view: missing file operand';
            return outputDiv;
        }

        const supportedFormats = /\.(png|jpg|jpeg|gif|webp|mp4|webm)$/i;
        if (!supportedFormats.test(filePathArg)) {
            log.warn(`File is not a supported media type: "${filePathArg}"`);
            outputDiv.textContent = `view: ${filePathArg}: Unsupported file type.`;
            return outputDiv;
        }
        const mediaSrc = await this.#getPublicUrl(filePathArg);
        const mediaElement = await this.#requestMedia(mediaSrc);
        outputDiv.appendChild(mediaElement);

        return outputDiv;
    }
}

export { View };
