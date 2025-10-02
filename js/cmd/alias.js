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
 * @class Alias
 * @description Implements the 'alias' command to define or display command aliases.
 */
class Alias {
    static DESCRIPTION = 'Define or display aliases.';

    #environmentService;

    constructor(services) {
        this.#environmentService = services.environment;
    }

    static man() {
        return `NAME\n       alias - Define or display command aliases.\n\nSYNOPSIS\n       alias [name[=value] ...]\n\nDESCRIPTION\n       The alias command allows you to create shortcuts for longer commands.\n\n       - With no arguments, 'alias' prints the list of all current aliases.\n       - With 'name=value', it defines an alias. The value can be a string in quotes.\n\nEXAMPLES\n       $ alias\n       (Displays all aliases.)\n\n       $ alias l="ls -l"\n       (Creates an alias 'l' for 'ls -l'.)`;
    }

    static autocompleteArgs(currentArgs, services) {
        // For now, no specific autocomplete for alias arguments.
        return [];
    }

    /**
     * Parses the alias string (e.g., 'l="ls -a"') into a key-value pair.
     * @param {string} arg - The argument string.
     * @returns {{name: string, value: string}|null} The parsed alias or null.
     */
    #parseAlias(arg) {
        const match = arg.match(/^([^=]+)=(.*)$/);
        if (!match) return null;

        let name = match[1].trim();
        let value = match[2].trim();

        // Strip quotes from the value if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
        }

        return { name, value };
    }

    async execute(args) {
        const output = document.createElement('pre');
        const aliasString = args.slice(1).join(' ');

        const aliases = this.#environmentService.getAliases();

        // If no arguments, display all aliases
        if (!aliasString) {
            if (Object.keys(aliases).length === 0) {
                output.textContent = 'No aliases defined.';
            } else {
                let aliasText = '';
                for (const [name, value] of Object.entries(aliases)) {
                    aliasText += `alias ${name}='${value}'\n`;
                }
                output.textContent = aliasText.trim();
            }
            return output;
        }

        // If arguments are provided, define a new alias
        const newAlias = this.#parseAlias(aliasString);

        if (newAlias) {
            aliases[newAlias.name] = newAlias.value;
            this.#environmentService.setAliases(aliases);
            output.textContent = `Alias '${newAlias.name}' created.`;
        } else {
            output.textContent = `alias: invalid format. Use name="value"`;
        }

        return output;
    }
}

export { Alias };