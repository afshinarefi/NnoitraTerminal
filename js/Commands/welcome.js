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
import { fetchTextFile } from '../Utils/FileUtil.js';
import { createLogger } from '../Managers/LogManager.js';
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
    #log = createLogger('welcome');

    /**
     * Executes the welcome command.
     * Fetches the welcome message from `data/motd.txt` and displays it.
     * @param {string[]} args - An array of arguments passed to the command (not used by this command).
     * @returns {Promise<HTMLPreElement>} A promise that resolves with a `<pre>` HTML element containing the welcome message.
     */
    async execute(args) {
      this.#log.log('Executing...');
      const outputDiv = document.createElement('div');
      outputDiv.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and line breaks
      try {
        const welcomeText = await fetchTextFile('data/motd.txt');
        this.#log.log(`Welcome message loaded successfully. ${welcomeText.length} characters.`);
        outputDiv.innerText = welcomeText;
      } catch (error) {
        this.#log.error('Error loading welcome message:', error);
        outputDiv.innerText = 'Error: Could not load welcome message.';
      }
      return outputDiv;
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
    async autocompleteArgs(currentArgs) { // Made async for consistency
        return []; // Welcome command takes no arguments.
    }
}

export { Welcome };
