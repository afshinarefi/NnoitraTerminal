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
import { data } from '../../data/about.js'; // Still needed for data'
/**
 * @class About
 * @description Implements the 'about' command, which displays personal information from a JSON file.
 */
class About extends BaseCommand {
    static DESCRIPTION = 'A short introduction.';
    #requestMedia;

    constructor(services) {
        super(services);
        this.#requestMedia = services.requestMedia;
    }

    static man() {
        return `NAME\n       about - Display information about the author.\n\nSYNOPSIS\n       about\n\nDESCRIPTION\n       The about command displays a short bio, contact information, and a profile picture.`;
    }

    async autocompleteArgs(currentArgs) { // Made async for consistency
        return []; // 'about' command takes no arguments.
    }

    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputDiv = outputElement; // Use the provided container directly

        try {
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
                    element = await this.#requestMedia(item.Source);
                    element.id = item.Id;
                }

                if (element) {
                    wrapper.appendChild(element);
                    outputDiv.appendChild(wrapper);
                }
            }
        } catch (error) {
            this.log.error('Failed to fetch about information:', error);
            outputDiv.textContent = `Error: ${error.message}`;
        }
    }
}

export { About };
