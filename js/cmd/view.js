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
import { ArefiMedia } from '../Components/Media.js';
/**
 * @class View
 * @description Implements the 'view' command, which displays an image or video file.
 */
class View {
    static DESCRIPTION = 'View a photo or video.';

    #filesystemService;

    constructor(services) {
        this.#filesystemService = services.filesystem;
    }

    static man() {
        return `NAME\n       view - Display an image or video file.\n\nSYNOPSIS\n       view [file]\n\nDESCRIPTION\n       The view command displays the specified image (png, jpg, gif) or video (mp4, webm) file.\n       The path can be absolute or relative to the current directory.`;
    }

    static async autocompleteArgs(currentArgs, services) {
        if (currentArgs.length > 1) {
            return [];
        }
        const input = currentArgs[0] || '';
        // For 'view', suggest both directories and files.
        return await services.filesystem.autocompletePath(input, true);
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        const filePathArg = args[1];

        if (!filePathArg) {
            outputDiv.textContent = 'view: missing file operand';
            return outputDiv;
        }

        let path = filePathArg;
        if (!path.startsWith('/')) {
            path = this.#filesystemService.getCurrentPath().replace(/\/$/, '') + '/' + path;
        }
        path = this.#filesystemService.normalizePath(path);

        if (!this.#filesystemService.isFile(path)) {
            outputDiv.textContent = `view: cannot access '${filePathArg}': No such file or it is a directory`;
            return outputDiv;
        }

        const mediaSrc = `/fs${path}`;
        const mediaElement = new ArefiMedia();
        mediaElement.src = mediaSrc;
        outputDiv.appendChild(mediaElement);

        return outputDiv;
    }
}

export { View };
