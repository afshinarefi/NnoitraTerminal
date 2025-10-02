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

/**
 * @class Unalias
 * @description Implements the 'unalias' command to remove command aliases.
 */
class Unalias {
    static DESCRIPTION = 'Remove an alias.';

    #environmentService;

    constructor(services) {
        this.#environmentService = services.environment;
    }

    static man() {
        return `NAME\n       unalias - Remove an alias.\n\nSYNOPSIS\n       unalias <alias_name>\n\nDESCRIPTION\n       The unalias command removes the specified alias from the list of defined aliases.\n\nEXAMPLES\n       $ unalias l\n       (Removes the alias 'l'.)`;
    }

    static autocompleteArgs(currentArgs, services) {
        if (currentArgs.length > 1) {
            return [];
        }
        const aliases = services.environment.getAliases();
        const aliasNames = Object.keys(aliases);
        const input = currentArgs[0] || '';

        return aliasNames.filter(name => name.startsWith(input));
    }

    async execute(args) {
        const output = document.createElement('pre');
        const aliasName = args[1];

        if (!aliasName) {
            output.textContent = 'unalias: usage: unalias <alias_name>';
            return output;
        }

        const aliases = this.#environmentService.getAliases();

        if (aliasName in aliases) {
            delete aliases[aliasName];
            this.#environmentService.setAliases(aliases);
            output.textContent = `Alias '${aliasName}' removed.`;
        } else {
            output.textContent = `unalias: ${aliasName}: not found`;
        }

        return output;
    }
}

export { Unalias };