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
import { Media } from '../Components/Media.js';
import { createLogger } from '../Managers/LogManager.js';

const log = createLogger('view');
/**
 * @class View
 * @description Implements the 'view' command, which displays an image or video file.
 */
class View {
    static DESCRIPTION = 'View a photo or video.';

    #autocompletePath;
    #getPublicUrl;

    constructor(services) {
        this.#autocompletePath = services.autocompletePath;
        this.#getPublicUrl = services.getPublicUrl;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       view - Display an image or video file.\n\nSYNOPSIS\n       view [file]\n\nDESCRIPTION\n       The view command displays the specified image (png, jpg, gif) or video (mp4, webm) file.\n       The path can be absolute or relative to the current directory.`;
    }

    async autocompleteArgs(currentArgs) { // Made async for consistency
        if (currentArgs.length > 1) {
            return [];
        }
        const input = currentArgs[0] || '';
        const allPaths = await this.#autocompletePath(input, true);
        const supportedFormats = /\.(png|jpg|jpeg|gif|webp|mp4|webm)$/i;
        // Filter to only suggest supported files or directories (to allow navigation)
        return allPaths.filter(p => p.endsWith('/') || supportedFormats.test(p));
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        const filePathArg = args[1];

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
        const mediaSrc = this.#getPublicUrl(filePathArg);
        log.log(`Creating media element with src: "${mediaSrc}"`);
        const mediaElement = new Media();
        mediaElement.src = mediaSrc;
        outputDiv.appendChild(mediaElement);

        return outputDiv;
    }
}

export { View };
