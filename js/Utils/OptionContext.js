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
 * @description Defines the types of option contexts that can be used for communication.
 */
export const OPTION_CONTEXT_TYPES = {
    COMMAND: 'COMMAND',
    PATH: 'PATH',
    CHOICE: 'CHOICE',
    NONE: 'NONE'
};

/**
 * @class OptionContext
 * @description A factory for creating standardized option context objects.
 * This is used to declare what kind of data is expected or provided, for example in autocompletion.
 */
export class OptionContext {
    // A base object to ensure all contexts have the same shape.
    static #baseContext = {
        isPath: () => false,
        isChoice: () => false,
        isCommand: () => false,
        isNone: () => false,
    };

    static path(options = { includeFiles: false }) {
        return {
            ...this.#baseContext,
            type: OPTION_CONTEXT_TYPES.PATH,
            options,
            isPath: () => true,
        };
    }

    static choice(suggestions = []) {
        return {
            ...this.#baseContext,
            type: OPTION_CONTEXT_TYPES.CHOICE,
            suggestions,
            isChoice: () => true,
        };
    }

    static command(suggestions = []) {
        return {
            ...this.#baseContext,
            type: OPTION_CONTEXT_TYPES.COMMAND,
            suggestions,
            isCommand: () => true,
        };
    }

    static none() {
        return {
            ...this.#baseContext,
            type: OPTION_CONTEXT_TYPES.NONE,
            isNone: () => true,
        };
    }
}
