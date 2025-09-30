import * as C from '../const.js';
import { Cmd } from './cmd.js'

export class Login extends Cmd{
    static DESCRIPTION = 'Login as user USER.';

    static {
        this.register();
    }

    async process(args, div) {
        window.environment[C.USER] = args[1];
        return div;
    }

    args() {
        return '[USER]';
    }
}

