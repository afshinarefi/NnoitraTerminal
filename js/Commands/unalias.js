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
import { createLogger } from '../Services/LogService.js';
const log = createLogger('unalias');
/**
 * @class Unalias
 * @description Implements the 'unalias' command to remove command aliases.
 */
class Unalias {
    static DESCRIPTION = 'Remove an alias.';

    #environmentService;
    #commandService;

    constructor(services) {
        this.#environmentService = services.environment;
        this.#commandService = services.command;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       unalias - Remove an alias.\n\nSYNOPSIS\n       unalias <alias_name>\n\nDESCRIPTION\n       The unalias command removes the specified alias from the list of defined aliases.\n\nEXAMPLES\n       $ unalias l\n       (Removes the alias 'l'.)`;
    }

    static autocompleteArgs(currentArgs, services) {
        if (currentArgs.length > 1) {
            return [];
        }
        const aliases = services.command.getAliases();
        const aliasNames = Object.keys(aliases);
        const input = currentArgs[0] || '';

        return aliasNames.filter(name => name.startsWith(input));
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const output = document.createElement('pre');
        const aliasName = args[1];

        if (!aliasName) {
            log.warn('No alias name provided.');
            output.textContent = 'unalias: usage: unalias <alias_name>';
            return output;
        }

        const aliases = this.#commandService.getAliases();

        if (aliasName in aliases) {
            log.log(`Removing alias: "${aliasName}"`);
            delete aliases[aliasName];
            this.#commandService.setAliases(aliases);
            output.textContent = `Alias '${aliasName}' removed.`;
        } else {
            log.warn(`Alias not found: "${aliasName}"`);
            output.textContent = `unalias: ${aliasName}: not found`;
        }

        return output;
    }
}

export { Unalias };