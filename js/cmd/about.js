import { ArefiMedia } from '../Components/Media.js';
/**
 * @class About
 * @description Implements the 'about' command, which displays personal information from a JSON file.
 */
class About {
    static DATA_FILE = '/data/about.json';
    static DESCRIPTION = 'A short introduction.';

    static man() {
        return `NAME\n       about - Display information about the author.\n\nSYNOPSIS\n       about\n\nDESCRIPTION\n       The about command displays a short bio, contact information, and a profile picture.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // 'about' command takes no arguments.
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        try {
            const response = await fetch(About.DATA_FILE);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
            outputDiv.textContent = `Error fetching about information: ${error.message}`;
        }
        return outputDiv;
    }
}

export { About };
