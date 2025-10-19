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
import { parseAssignment } from '../Utils/ParseUtil.js';
const log = createLogger('export');

/**
 * @class Export
 * @description Implements the 'export' command to set or display user-modifiable environment variables.
 */
class Export {
    static DESCRIPTION = 'Set or display user environment variables.';

    #environmentService;

    constructor(services) {
        this.#environmentService = services.environment;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       export - Set or display user environment variables.\n\nSYNOPSIS\n       export [name[=value] ...]\n\nDESCRIPTION\n       The export command allows you to view and modify user-configurable environment variables.\n       These variables are saved to your user profile.\n\n       - With no arguments, 'export' prints the list of all current user variables.\n       - With 'name=value', it defines a variable. The value can be a string in quotes.\n\nEXAMPLES\n       $ export\n       (Displays all user-configurable variables.)\n\n       $ export PS1="{user}$ "\n       (Changes the command prompt format.)`;
    }

    /**
     * Provides autocomplete suggestions for the export command.
     * @param {string[]} currentArgs - The arguments typed so far.
     * @param {object} services - A collection of all services.
     * @returns {string[]} An array of suggested variable names.
     */
    static autocompleteArgs(currentArgs, services) {
        // The export command only operates on a single argument (e.g., 'PS1=value').
        // If there's more than one argument part, we should not offer any suggestions.
        if (currentArgs.length > 1) {
            return [];
        }

        const arg = currentArgs[0] || '';
        const userSpaceVars = services.environment.getAllVariablesCategorized().USERSPACE;
        const userSpaceVarNames = Object.keys(userSpaceVars);

        const parts = arg.split('=');
        const varName = parts[0].toUpperCase();

        // Case 1: Completing the variable name (before the '=')
        if (parts.length === 1) {
            const matchingVars = userSpaceVarNames.filter(name => name.startsWith(varName));
            // If there's only one match, suggest the name followed by an equals sign.
            if (matchingVars.length === 1) {
                return [`${matchingVars[0]}=`];
            }
            return matchingVars;
        }

        // Case 2: Completing the value (after the '=')
        if (parts.length > 1 && userSpaceVars.hasOwnProperty(varName)) {
            const currentValue = userSpaceVars[varName];
            // Suggest the full assignment string, with the value quoted.
            return [`${varName}="${currentValue}"`];
        }

        return [];
    }

    async execute(args) {
        log.log('Executing with args:', args);
        const output = document.createElement('pre');
        const exportString = args.slice(1).join(' ');

        const allVars = this.#environmentService.getAllVariablesCategorized();
        const userSpaceVars = allVars.USERSPACE;

        // If no arguments, display all USERSPACE variables
        if (!exportString) {
            let outputText = '';
            for (const [name, value] of Object.entries(userSpaceVars)) {
                outputText += `export ${name}="${value}"\n`;
            }
            output.textContent = outputText.trim() || 'No user variables defined.';
            return output;
        }

        // If arguments are provided, define a new variable
        const newVar = parseAssignment(exportString);

        if (newVar) {
            const success = this.#environmentService.exportVariable(newVar.name.toUpperCase(), newVar.value);
            if (success) {
                log.log(`Set variable: ${newVar.name}='${newVar.value}'`);
                // No output on successful export, which is standard shell behavior.
            } else {
                output.textContent = `export: permission denied: \`${newVar.name}\` is a read-only variable.`;
                log.warn(`Attempted to export non-userspace variable: ${newVar.name}`);
            }
        } else {
            output.textContent = `export: invalid format. Use name="value"`;
            log.warn('Invalid export format:', exportString);
        }

        return output;
    }
}

export { Export };