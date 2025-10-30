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
 * @class Unset
 * @description Implements the 'unset' command to remove user-defined environment variables.
 */
class Unset extends BaseCommand {
    static DESCRIPTION = 'Remove a user environment variable.';

    #deleteUserspaceVariable;
    #getAllCategorizedVariables;

    constructor(services) {
        super(services);
        this.#deleteUserspaceVariable = this.services.deleteUserspaceVariable;
        this.#getAllCategorizedVariables = this.services.getAllCategorizedVariables;
    }

    static man() {
        return `NAME\n       unset - Remove a user environment variable.\n\nSYNOPSIS\n       unset <variable_name>\n\nDESCRIPTION\n       The unset command removes the specified variable from the list of user-defined environment variables.\n       It can only remove variables set with the 'export' command.\n\nEXAMPLES\n       $ unset MY_VAR\n       (Removes the user variable 'MY_VAR'.)`;
    }

    async autocompleteArgs(currentArgs) {
        if (currentArgs.length > 1) {
            return [];
        }
        const allVars = await this.#getAllCategorizedVariables();
        const userSpaceVars = allVars.USERSPACE || {};
        const userSpaceVarNames = Object.keys(userSpaceVars);
        const input = (currentArgs[0] || '').toUpperCase();

        return userSpaceVarNames.filter(name => name.startsWith(input));
    }

    async execute(args) {
        this.log.log('Executing with args:', args);
        const output = document.createElement('pre');
        const varName = args[1];

        if (!varName) {
            output.textContent = 'unset: usage: unset <variable_name>';
            return output;
        }

        const upperVarName = varName.toUpperCase();
        const allVars = await this.#getAllCategorizedVariables();
        const userSpaceVars = allVars.USERSPACE || {};

        if (Object.keys(userSpaceVars).includes(upperVarName)) {
            await this.#deleteUserspaceVariable(upperVarName);
            // No output on success, which is standard shell behavior.
        } else {
            output.textContent = `unset: ${varName}: not found in userspace`;
        }

        return output;
    }
}

export { Unset };