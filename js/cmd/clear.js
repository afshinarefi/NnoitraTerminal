/**
 * @class Clear
 * @description Implements the 'clear' command, which clears the terminal output.
 */
class Clear {
    static DESCRIPTION = 'Clear the terminal output.';
    static dependencies = [];

    constructor() {
        // No dependencies needed
    }

    /**
     * Executes the clear command by dispatching a terminal-clear event
     * @param {string[]} args - Command arguments (not used)
     * @returns {HTMLElement} The output div
     */
    execute(args) {
        const outputDiv = document.createElement('div');
        // Dispatch a custom event that the Terminal component will listen for
        const clearEvent = new CustomEvent('terminal-clear');
        document.dispatchEvent(clearEvent);
        return outputDiv;
    }

    /**
     * Returns manual page content for the clear command
     * @returns {string} The manual page content
     */
    static man() {
        return `NAME
       clear - Clear the terminal output.

SYNOPSIS
       clear

DESCRIPTION
       The clear command erases all output in the terminal window.`;
    }

    /**
     * Returns array of possible argument completions
     * @returns {string[]} Empty array since clear takes no arguments
     */
    static autocompleteArgs() {
        return [];
    }
}

export { Clear };
