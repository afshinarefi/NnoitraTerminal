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
 * @description A set of categories to enable for logging.
 * To disable all logging, make this set empty: `new Set()`.
 * To enable all logging, you can use a special '*' value or list all categories.
 * Example categories: 'FS', 'CommandService', 'Autocomplete', 'Terminal'
 */
const ACTIVE_LOG_CATEGORIES = new Set([
    // --- Services ---
    //  'Autocomplete',
    //  'CommandService',
    //  'EnvService',
    //  'FS',
    //  'History',

    // --- Components ---
    //  'BaseComponent',
    //  'CommandLine',
    //  'HintBox',
    //  'Icon',
    //  'Media',
    //  'Terminal',
    //  'TerminalItem',

    // --- Commands ---
    //  'about',
    //  'alias',
    //  'cat',
    //  'cd',
    //  'clear',
    //  'env',
    //  'help',
    //  'history',
    //  'login',
    //  'logout',
    //  'ls',
    //  'man',
    //  'unalias',
    //  'adduser',
    //  'view',
    //  'welcome',
]);

const noop = () => {}; // The no-operation function.

/**
 * A map to cache logger instances for performance.
 * @type {Map<string, object>}
 */
const loggerCache = new Map();

/**
 * Creates a logger instance for a specific category.
 * If the category is not active, it returns a logger where all methods are no-op functions.
 * This is highly performant as the check is only done once per category.
 *
 * @param {string} category - The category of the logger (e.g., 'FS', 'CommandService').
 * @returns {{log: function, warn: function, error: function}} A logger object.
 */
export function createLogger(category) {
    if (loggerCache.has(category)) {
        return loggerCache.get(category);
    }

    const isEnabled = ACTIVE_LOG_CATEGORIES.has(category);

    const logger = {
        log: isEnabled ? console.log.bind(console, `[${category}]`) : noop,
        warn: isEnabled ? console.warn.bind(console, `[${category}]`) : noop,
        error: isEnabled ? console.error.bind(console, `[${category}]`) : noop,
    };

    loggerCache.set(category, logger);
    return logger;
}