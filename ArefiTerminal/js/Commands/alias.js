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
import { createLogger } from '../Managers/LogManager.js';
const log = createLogger('alias');
/**
 * @class Alias
 * @description Implements the 'alias' command to define or display command aliases.
 */
class Alias {
    static DESCRIPTION = 'Define or display aliases.';

    #getAliases;
    #setAliases;

    constructor(services) {
        this.#getAliases = services.getAliases;
        this.#setAliases = services.setAliases;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       alias - Define or display command aliases.\n\nSYNOPSIS\n       alias [name[=value] ...]\n\nDESCRIPTION\n       The alias command allows you to create shortcuts for longer commands.\n\n       - With no arguments, 'alias' prints the list of all current aliases.\n       - With 'name=value', it defines an alias. The value can be a string in quotes.\n\nEXAMPLES\n       $ alias\n       (Displays all aliases.)\n\n       $ alias l="ls -l"\n       (Creates an alias 'l' for 'ls -l'.)`;
    }

    async autocompleteArgs(currentArgs) { // Made async for consistency
        // For now, no specific autocomplete for alias arguments.
        return [];
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const output = document.createElement('div');
        output.style.whiteSpace = 'pre-wrap';

        const aliases = await this.#getAliases();

        // If no arguments, display all aliases
        if (args.length <= 1) {
            if (Object.keys(aliases).length === 0) {
                log.log('No aliases found to display.');
                output.textContent = 'No aliases defined.';
            } else {
                let aliasText = '';
                for (const [name, value] of Object.entries(aliases)) {
                    aliasText += `alias ${name}='${value}'\n`;
                }
                output.textContent = aliasText.trim();
                log.log('Displaying all defined aliases.');
            }
            return output;
        }

        // Reconstruct the full argument string from the tokens to parse it.
        const aliasString = args.slice(1).join('');
        const assignmentIndex = aliasString.indexOf('=');

        if (assignmentIndex === -1) {
            output.textContent = 'alias: usage: alias [name[=value] ...]'
            return output;
        }

        const name = aliasString.substring(0, assignmentIndex).trim();
        let value = aliasString.substring(assignmentIndex + 1).trim();

        // If the value was quoted, unwrap the quotes.
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (name) {
            aliases[name] = value;
            this.#setAliases(aliases);
            log.log(`Created alias: ${name}='${value}'`);
        } else {
            log.warn('Invalid alias format:', aliasString);
            output.textContent = `alias: invalid alias name`;
        }

        return output;
    }
}

export { Alias };