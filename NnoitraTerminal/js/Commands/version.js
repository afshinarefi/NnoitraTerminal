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
/**
 * @class Version
 * @description Implements the 'version' command, displaying the application version.
 */
class Version extends BaseCommand {
    static DATA_FILE = new URL('../../data/version.txt', import.meta.url);
    /**
     * @static
     * @type {string}
     * @description A brief description of the version command.
     */
    static DESCRIPTION = 'Show version information.';

    constructor(services) {
        super(services);
    }

    async execute(args) {
      this.log.log('Executing...');
      const outputDiv = document.createElement('div');
      outputDiv.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and line breaks
      try {
        const response = await fetch(Version.DATA_FILE);
        if (!response.ok) {
          throw new Error(`Failed to load version information: ${response.statusText}`);
        }
        const versionText = await response.text();
        outputDiv.innerText = versionText;
      } catch (error) {
        this.log.error('Error loading version information:', error);
        outputDiv.innerText = 'Error: Could not load version information.';
      }
      return outputDiv;
    }

    static man() {
        return `NAME\n       version - Show version information.\n\nDESCRIPTION\n       The version command displays the application's version and build information.`;
    }
}

export { Version };