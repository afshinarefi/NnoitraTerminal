/**
 * @class History
 * @description Implements the 'history' command, which displays the command history.
 */
class History {
    /**
     * @static
     * @type {string}
     * @description A brief description of the history command.
     */
    static DESCRIPTION = 'Shows the command history.';

    /** @private {HistoryService} #historyService - Reference to the HistoryService. */
    #historyService;

    /**
     * Creates an instance of History.
     * @param {HistoryService} historyService - The HistoryService instance to interact with.
     */
    constructor(services) {
        this.#historyService = services.history;
    }

    /**
     * Provides a detailed manual page for the history command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       history - Display the command history.\n\nSYNOPSIS\n       history\n\nDESCRIPTION\n       The history command displays a list of previously entered commands.\n\nUSAGE\n       history\n\nEXAMPLES\n       $ history\n       (Displays the list of commands entered in this session.)`;
    }

    /**
     * Provides autocomplete suggestions for the arguments of the history command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested arguments.
     */
    static autocompleteArgs(currentArgs, services) {
        return []; // History command takes no arguments.
    }

    /**
     * Executes the history command.
     * Displays the command history.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLDivElement>} A promise that resolves with a `<div>` HTML element containing the history.
     */
    async execute(args) {
        const outputDiv = document.createElement('div');
        const history = this.#historyService.getFullHistory();
        if (!history || history.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No history available.';
            outputDiv.appendChild(p);
            return outputDiv;
        }
        const pre = document.createElement('pre');
        pre.innerText = history.map(item => `${item.index}: ${item.command}`).join('\n');
        outputDiv.appendChild(pre);
        return outputDiv;
    }
}

export { History };
