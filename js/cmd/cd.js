
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
        const outputDiv = document.createElement('div');
        let inputPath = args[1] || '/';
        let normalizedPath;
        if (inputPath.startsWith('/')) {
            normalizedPath = this.#filesystemService.normalizePath(inputPath);
        } else {
            const currentPath = this.#filesystemService.getCurrentPath();
            normalizedPath = this.#filesystemService.normalizePath(currentPath + '/' + inputPath);
        }
        // Ensure the directory exists by fetching and caching if needed
        const contents = await this.#filesystemService.listContents(normalizedPath);
        if (!contents) {
            outputDiv.textContent = `cd: ${args[1] || '/'}: No such directory`;
            return outputDiv;
        }
        this.#filesystemService.setCurrentPath(normalizedPath);
        const absPath = this.#filesystemService.getCurrentPath();
        this.#environmentService.setVariable('PWD', absPath);
        outputDiv.textContent = `Changed directory to ${absPath}`;
        return outputDiv;
    }
}

export { Cd };
