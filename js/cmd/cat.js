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
