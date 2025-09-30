/**
 * @class Help
 * @description Implements the 'help' command, which lists all available commands and their descriptions.
 */
class Help {
    /**
     * @static
     * @type {string}
     * @description A brief description of the help command.
     */
    static DESCRIPTION = 'Lists available commands.';

    /** @private {CommandService} #commandService - Reference to the CommandService. */
    #commandService;

    /**
     * Creates an instance of Help.
     * @param {CommandService} commandService - The CommandService instance to interact with.
     */
    constructor(services) {
        this.#commandService = services.command;
    }

    /**
     * Provides a detailed manual page for the help command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       help - Display information about available commands.\n\nSYNOPSIS\n       help\n\nDESCRIPTION\n       The help command lists all commands available in the terminal, along with a brief description for each.\n       It is useful for discovering what commands can be used.\n\nUSAGE\n       help\n\n       This command takes no arguments.\n\nEXAMPLES\n       $ help\n       (Displays a list of all commands and their descriptions.)`;
    }

    /**
     * Provides autocomplete suggestions for the arguments of the help command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested arguments.
     */
    static autocompleteArgs(currentArgs, services) {
        return []; // Help command takes no arguments.
    }

    /**
     * Executes the help command.
     * Retrieves all registered commands and their descriptions from the CommandService and formats them for display.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the list of commands.
     */
    async execute(args) {
        const outputDiv = document.createElement('div');
        const commands = this.#commandService.getCommandNames();

        if (commands.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No commands available.';
            outputDiv.appendChild(p);
            return outputDiv;
        }

        const pre = document.createElement('pre');
        let helpText = '';

        commands.forEach(cmdName => {
            const CommandClass = this.#commandService.getCommandClass(cmdName); // Assuming CommandService has this method
            const description = CommandClass ? CommandClass.DESCRIPTION || 'No description available.' : 'No description available.';
            helpText += `${cmdName.padEnd(15)} : ${description}\n`;
        });

        pre.innerText = helpText.trim();
        outputDiv.appendChild(pre);
        return outputDiv;
    }
}

export { Help };
