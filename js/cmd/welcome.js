/**
 * @class Welcome
 * @description Implements the 'welcome' command, displaying an ASCII art welcome message.
 */
class Welcome {
    /**
     * @static
     * @type {string}
     * @description A brief description of the welcome command.
     */
    static DESCRIPTION = 'A short introduction.';

    /**
     * Executes the welcome command.
     * Fetches the welcome message from `data/welcome.txt` and displays it.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLPreElement>} A promise that resolves with a `<pre>` HTML element containing the welcome message.
     */
    async execute(args) {
      const pre = document.createElement('pre');
      try {
        const response = await fetch('data/welcome.txt');
        if (!response.ok) {
          throw new Error(`Failed to load welcome message: ${response.statusText}`);
        }
        const welcomeText = await response.text();
        pre.innerText = welcomeText;
      } catch (error) {
        console.error('Error loading welcome message:', error);
        pre.innerText = 'Error: Could not load welcome message.';
      }
      return pre;
    }

    /**
     * Provides a detailed manual page for the welcome command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       welcome - A friendly introduction to the terminal.\n\nDESCRIPTION\n       The welcome command displays a greeting message and basic instructions for using the terminal.\n       It is typically the first command executed when the terminal starts.\n\nUSAGE\n       welcome\n\n       This command takes no arguments.\n\nEXAMPLES\n       $ welcome\n       (Displays the welcome message.)`;
    }

    /**
     * Provides autocomplete suggestions for the arguments of the welcome command.
     * @static
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {CommandService} commandService - The CommandService instance.
     * @param {EnvironmentService} environmentService - The EnvironmentService instance.
     * @returns {string[]} An array of suggested arguments.
     */
    static autocompleteArgs(currentArgs, commandService, environmentService) {
        return []; // Welcome command takes no arguments.
    }
}

export { Welcome };
