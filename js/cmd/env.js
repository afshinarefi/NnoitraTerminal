/**
 * @class Env
 * @description Implements the 'env' command, which lists all current environment variables.
 */
class Env {
    /**
     * @static
     * @type {string}
     * @description A brief description of the env command.
     */
    static DESCRIPTION = 'List current environment variables.';

    /** @private {EnvironmentService} #environmentService - Reference to the EnvironmentService. */
    #environmentService;

    /**
     * Creates an instance of Env.
     * @param {EnvironmentService} environmentService - The EnvironmentService instance to interact with.
     */
    constructor(environmentService) {
        this.#environmentService = environmentService;
    }

    /**
     * Executes the env command.
     * Retrieves all environment variables from the EnvironmentService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLPreElement>} A promise that resolves with a `<pre>` HTML element containing the environment variables.
     */
    async execute(args) {
        const pre = document.createElement('pre');
        const allVariables = this.#environmentService.getAllVariables();
        let output = '';

        for (const [key, value] of Object.entries(allVariables)) {
            output += `${key}=${JSON.stringify(value)}\n`;
        }
        pre.innerText = output.trim();
        return pre;
    }

    /**
     * Provides a detailed manual page for the env command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       env - Display environment variables.\n\nSYNOPSIS\n       env [OPTION]...\n\nDESCRIPTION\n       The env command prints the current environment variables to standard output.\n       Each variable is displayed on a new line in the format KEY=VALUE.\n\nOPTIONS\n       Currently, this command does not support any options.\n\nEXAMPLES\n       $ env\n       (Displays all current environment variables.)`;
    }

    /**
     * @static
     * @type {string[]}
     * @description Declares the services this command depends on.
     */
    static dependencies = ['environmentService'];

    /**
     * Provides autocomplete suggestions for the arguments of the env command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {CommandService} commandService - The CommandService instance.
     * @param {EnvironmentService} environmentService - The EnvironmentService instance.
     * @returns {string[]} An array of suggested arguments.
     */
    static autocompleteArgs(currentArgs, commandService, environmentService) {
        // For 'env', we might suggest environment variable names if the user is trying to set one,
        // or options like '-i' for ignoring environment (if implemented).
        // For now, let's return an empty array as it doesn't take arguments in its current form.
        return [];
    }
}

export { Env };

