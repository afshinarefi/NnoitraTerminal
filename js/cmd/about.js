import * as C from '../const.js';
import { Cmd } from './cmd.js'

export class About extends Cmd {
    static DATA_FILE = '/data/about.txt';
    static DESCRIPTION = 'A short introduction.';

    static {
        this.register();
    }

    async process(args, div) {
        let data = await this.fetchJson(this.constructor.DATA_FILE);
        console.log(data);
        for (const item in data) {
            let row;
            if (data[item]['Type'] == 'Text') {
                row = document.createElement('span');
                let title = document.createElement('span');
                title.appendChild(document.createTextNode(data[item]['Title']));
                title.classList.add('about-title');
                row.appendChild(title);
                row.appendChild(document.createTextNode(': '));
                if (data[item]['Value'].startsWith('http')) {
                    let link = document.createElement('a');
                    link.href = data[item]['Value'];
                    link.textContent = data[item]['Value'];
                    link.target = '_blank';
                    row.appendChild(link);
                } else {
                    row.appendChild(document.createTextNode(data[item]['Value']));
                }
            } else if (data[item]['Type'] == 'Image') {
                row = document.createElement('img');
                row.id = data[item]['Id'];
                row.src = data[item]['Source'];
            }
            let wrapper = document.createElement('div');
            wrapper.appendChild(row);
            div.appendChild(wrapper);
            div.appendChild(document.createElement('br'));

        }
        return div;
    }
}

