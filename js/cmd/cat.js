import * as C from '../const.js';
import { Cmd } from './cmd.js'

export class Cat extends Cmd {
    static DESCRIPTION = 'Print the content of a FILE';

    static {
        this.register();
    }

    async process(args, div) {
        div.appendChild(document.createTextNode('NOT IMPLEMENTED'));
        return div;
    }

    args() {
        return '[FILE]';
    }
}

