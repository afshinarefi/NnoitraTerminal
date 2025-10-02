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
import { ArefiMedia } from '../Components/Media.js';
import { createLogger } from '../Services/LogService.js';
/**
 * @class About
 * @description Implements the 'about' command, which displays personal information from a JSON file.
 */
class About {
    static DATA_FILE = '/data/about.json';
    static DESCRIPTION = 'A short introduction.';
    static #log = createLogger('about'); // Keep static for static methods

    static man() {
        return `NAME\n       about - Display information about the author.\n\nSYNOPSIS\n       about\n\nDESCRIPTION\n       The about command displays a short bio, contact information, and a profile picture.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // 'about' command takes no arguments.
    }

    async execute(args) {
        About.#log.log('Executing...');
        const outputDiv = document.createElement('div');
        try {
            const response = await fetch(About.DATA_FILE);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            About.#log.log('Successfully fetched about.json');
            const data = await response.json();

            for (const item of data) {
                const wrapper = document.createElement('div');
                let element;

                if (item.Type === 'Text') {
                    element = document.createElement('p');
                    const title = document.createElement('span');
                    title.textContent = item.Title;
                    title.classList.add('about-title');
                    element.appendChild(title);
                    element.appendChild(document.createTextNode(': '));

                    if (item.Value.startsWith('http')) {
                        const link = document.createElement('a');
                        link.href = item.Value;
                        link.textContent = item.Value;
                        link.target = '_blank';
                        element.appendChild(link);
                    } else {
                        element.appendChild(document.createTextNode(item.Value));
                    }
                } else if (item.Type === 'Image') {
                    element = new ArefiMedia();
                    element.id = item.Id;
                    element.src = item.Source;
                }

                if (element) {
                    wrapper.appendChild(element);
                    outputDiv.appendChild(wrapper);
                }
            }
        } catch (error) {
            About.#log.error('Failed to fetch about information:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }
        return outputDiv;
    }
}

export { About };
