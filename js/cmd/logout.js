import * as C from '../const.js';
import { Cmd } from './cmd.js'

export class Logout extends Cmd{
    static DESCRIPTION = 'Logout to guest.';

    static {
        this.register();
    }

    async process(args, div) {
        window.environment[C.USER] = "guest";
        return div;
    }
}

