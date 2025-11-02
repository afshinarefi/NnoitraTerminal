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

/**
 * @description Central repository for shared constant values, such as environment variable names.
 */
export const ENV_VARS = {
    // Core Prompt/System Variables
    PS1: 'PS1',
    HOME: 'HOME',
    PWD: 'PWD',
    HOST: 'HOST',
    USER: 'USER',
    UUID: 'UUID',
    // User-configurable Variables
    HISTSIZE: 'HISTSIZE',
    THEME: 'THEME',
    ALIAS: 'ALIAS',
    // Session/Authentication Variables
    TOKEN: 'TOKEN',
    TOKEN_EXPIRY: 'TOKEN_EXPIRY',
};