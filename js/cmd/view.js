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
