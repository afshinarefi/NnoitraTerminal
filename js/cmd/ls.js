
/**
 * @class Ls
 * @description Implements the 'ls' command, which lists the contents of a directory using FilesystemService.
 */
class Ls {
    static DESCRIPTION = 'Lists directory contents.';

    #filesystemService;

    constructor(services) {
        this.#filesystemService = services.filesystem;
    }

    static man() {
        return `NAME\n       ls - List directory contents.\n\nSYNOPSIS\n       ls [directory]\n\nDESCRIPTION\n       The ls command lists files and directories in the specified location.\n       If no location is given, it lists the current directory.`;
    }

    static async autocompleteArgs(currentArgs, services) {
        // Only provide suggestions for the first argument.
        if (currentArgs.length > 1) {
            return [];
        }
        const input = currentArgs[0] || '';
        // For 'ls', suggest both directories and files.
        return await services.filesystem.autocompletePath(input, true);
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        let path = args[1] || this.#filesystemService.getCurrentPath();
        if (!path.startsWith('/')) {
            path = this.#filesystemService.getCurrentPath().replace(/\/$/, '') + '/' + path;
        }
        path = this.#filesystemService.normalizePath(path);
        // Check if path is a file
        if (this.#filesystemService.isFile(path)) {
            // Extract file name from path
            const parts = path.split('/').filter(p => p);
            const fileName = parts.length > 0 ? parts[parts.length - 1] : path;
            // Try to get metadata from parent directory
            const parentPath = this.#filesystemService.normalizePath(path.substring(0, path.lastIndexOf('/')) || '/');
            const parentContents = await this.#filesystemService.listContents(parentPath);
            let fileMeta = null;
            if (parentContents && Array.isArray(parentContents.files)) {
                fileMeta = parentContents.files.find(f => f.name === fileName);
            }
            const pre = document.createElement('pre');
            if (fileMeta) {
                pre.innerText = `${fileMeta.name}\t${fileMeta.size} bytes`;
            } else {
                pre.innerText = fileName;
            }
            outputDiv.appendChild(pre);
            return outputDiv;
        }
        const contents = await this.#filesystemService.listContents(path);
        if (!contents) {
            outputDiv.textContent = `ls: cannot access '${path}': No such directory`;
            return outputDiv;
        }
        const files = Array.isArray(contents.files) ? contents.files : [];
        const directories = Array.isArray(contents.directories) ? contents.directories : [];
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';
        if (directories.length === 0 && files.length === 0) {
            const li = document.createElement('li');
            li.textContent = '(no files or directories)';
            ul.appendChild(li);
        } else {
            for (const dir of directories) {
                if (!dir || typeof dir.name !== 'string') continue;
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.gap = '0.5em';
                li.style.alignItems = 'center';
                li.style.justifyContent = 'flex-start';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = dir.name + '/';
                nameSpan.style.display = 'inline-block';
                nameSpan.style.minWidth = '10em';
                nameSpan.style.flex = '0 0 auto';
                nameSpan.style.textAlign = 'left';
                const metaSpan = document.createElement('span');
                metaSpan.textContent = `${(dir.count !== null && dir.count !== undefined) ? dir.count : 0} items`;
                metaSpan.style.display = 'inline-block';
                metaSpan.style.flex = '0 0 auto';
                metaSpan.style.textAlign = 'left';
                li.appendChild(nameSpan);
                li.appendChild(metaSpan);
                ul.appendChild(li);
            }
            for (const file of files) {
                if (!file || typeof file.name !== 'string') continue;
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.gap = '0.5em';
                li.style.alignItems = 'center';
                li.style.justifyContent = 'flex-start';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = file.name;
                nameSpan.style.display = 'inline-block';
                nameSpan.style.minWidth = '0';
                nameSpan.style.flex = '0 0 auto';
                const metaSpan = document.createElement('span');
                metaSpan.textContent = `${(file.size !== null && file.size !== undefined) ? file.size : 0} bytes`;
                metaSpan.style.display = 'inline-block';
                metaSpan.style.flex = '0 0 auto';
                li.appendChild(nameSpan);
                li.appendChild(metaSpan);
                ul.appendChild(li);
            }
        }
        outputDiv.appendChild(ul);
        return outputDiv;
    }
}

export { Ls };
