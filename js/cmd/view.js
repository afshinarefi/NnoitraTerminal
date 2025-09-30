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
        return new Promise((resolve) => {
            const outputDiv = document.createElement('div');
            const filePathArg = args[1];

            if (!filePathArg) {
                outputDiv.textContent = 'view: missing file operand';
                resolve(outputDiv);
                return;
            }

            let path = filePathArg;
            if (!path.startsWith('/')) {
                path = this.#filesystemService.getCurrentPath().replace(/\/$/, '') + '/' + path;
            }
            path = this.#filesystemService.normalizePath(path);

            if (!this.#filesystemService.isFile(path)) {
                outputDiv.textContent = `view: cannot access '${filePathArg}': No such file or it is a directory`;
                resolve(outputDiv);
                return;
            }

            const supportedImage = /\.(png|jpg|jpeg|gif|webp)$/i;
            const supportedVideo = /\.(mp4|webm)$/i;
            const mediaSrc = `/fs${path}`;

            if (supportedImage.test(path)) {
                const img = document.createElement('img');
                img.src = mediaSrc;
                img.classList.add('media');
                // Resolve the promise only after the image has loaded.
                img.onload = () => resolve(outputDiv);
                img.onerror = () => {
                    outputDiv.textContent = `view: failed to load image '${filePathArg}'`;
                    resolve(outputDiv);
                };
                outputDiv.appendChild(img);
            } else if (supportedVideo.test(path)) {
                const video = document.createElement('video');
                video.src = mediaSrc;
                video.controls = true;
                video.classList.add('media');
                // Resolve the promise after the video can be played through.
                video.oncanplaythrough = () => resolve(outputDiv);
                outputDiv.appendChild(video);
            } else {
                outputDiv.textContent = `view: unsupported file type for '${filePathArg}'`;
                resolve(outputDiv);
            }
        });
    }
}

export { View };
