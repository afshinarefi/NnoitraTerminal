/**
 * Nnoitra Terminal
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
import { BaseCommand } from '../Core/BaseCommand.js';
import { fetchTextFile } from '../Utils/FileUtil.js'; // Still needed for fetchTextFile
/**
 * @class Welcome
 * @description Implements the 'welcome' command, displaying an ASCII art welcome message.
 */
class Welcome extends BaseCommand {
    static DATA_FILE = new URL('../../data/motd.txt', import.meta.url);
    /**
     * @static
     * @type {string}
     * @description A brief description of the welcome command.
     */
    static DESCRIPTION = 'A short introduction.';

    constructor(services) {
        super(services);
    }

    async execute(args, outputElement) {
      this.log.log('Executing...');
      const outputPre = document.createElement('div');
      outpuPre.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and line breaks
      if (outputElement) outputElement.appendChild(outputPre);

      try {
        const welcomeText = await fetchTextFile(Welcome.DATA_FILE); // Use static property
        this.log.log(`Welcome message loaded successfully. ${welcomeText.length} characters.`);
        outputPre.textContent = welcomeText;
      } catch (error) {
        this.log.error('Error loading welcome message:', error);
        outputPre.textContent = 'Error: Could not load welcome message.';
      }
    }

    /**
     * Provides a detailed manual page for the welcome command.
     * @static
     * @returns {string} The detailed manual text.
     */
    static man() {
        return `NAME\n       welcome - A friendly introduction to the terminal.\n\nDESCRIPTION\n       The welcome command displays a greeting message and basic instructions for using the terminal.\n       It is typically the first command executed when the terminal starts.\n\nUSAGE\n       welcome\n\n       This command takes no arguments.\n\nEXAMPLES\n       $ welcome\n       (Displays the welcome message.)`;
    }
}

export { Welcome };
