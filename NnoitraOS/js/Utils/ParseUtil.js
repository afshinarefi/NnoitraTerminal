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
 * Parses a "KEY=VALUE" string, trimming whitespace and quotes from the value.
 * @param {string} arg - The string to parse (e.g., 'my_var="some value"').
 * @returns {{name: string, value: string}|null} An object with name and value, or null if the format is invalid.
 */
export function parseAssignment(arg) {
    const match = arg.match(/^([^=]+)=(.*)$/);
    if (!match) return null;
    const name = match[1].trim();
    const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Strip leading/trailing quotes
    return { name, value };
}