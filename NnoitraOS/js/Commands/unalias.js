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
 * @class Unalias
 * @description Implements the 'unalias' command to remove command aliases.
 */
class Unalias extends BaseCommand {
    static DESCRIPTION = 'Remove an alias.';

    #getAliases;
    #setAliases;

    constructor(services) {
        super(services);
        this.#getAliases = this.services.getAliases;
        this.#setAliases = this.services.setAliases;
    }

    static man() {
        return `NAME\n       unalias - Remove an alias.\n\nSYNOPSIS\n       unalias <alias_name>\n\nDESCRIPTION\n       The unalias command removes the specified alias from the list of defined aliases.\n\nEXAMPLES\n       $ unalias l\n       (Removes the alias 'l'.)`;
    }

    async autocompleteArgs(currentArgs) { // Made async for consistency
        if (currentArgs.length > 1) {
            return [];
        }
        const aliases = await this.#getAliases();
        const aliasNames = Object.keys(aliases);
        const input = currentArgs[0] || '';

        return aliasNames.filter(name => name.startsWith(input));
    }

    async execute(args, outputElement) {
        this.log.log('Executing with args:', args);
        const outputDiv = document.createElement('div');
        if (outputElement) outputElement.appendChild(outputDiv);

        const aliasName = args[1];

        if (!aliasName) {
            this.log.warn('No alias name provided.');
            outputDiv.textContent = 'unalias: usage: unalias <alias_name>';
            return;
        }

        const aliases = await this.#getAliases();

        if (aliasName in aliases) {
            this.log.log(`Removing alias: "${aliasName}"`);
            delete aliases[aliasName];
            this.#setAliases(aliases);
            outputDiv.textContent = `Alias '${aliasName}' removed.`;
        } else {
            this.log.warn(`Alias not found: "${aliasName}"`);
            outputDiv.textContent = `unalias: ${aliasName}: not found`;
        }
    }
}

export { Unalias };