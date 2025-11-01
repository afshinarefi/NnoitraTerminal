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
 * Normalizes a path, resolving '..' and '.' segments and removing multiple slashes.
 * @param {string} path - The path to normalize.
 * @returns {string} The normalized, absolute path.
 */
export function normalizePath(path) {
    if (!path) return '/';

    const parts = path.split('/');
    const stack = [];

    for (const part of parts) {
        if (part === '..') {
            // If stack is not empty, pop. This handles going up a directory.
            if (stack.length > 0) {
                stack.pop();
            }
        } else if (part !== '.' && part !== '') {
            // Ignore '.' and empty parts (from multiple slashes), push others.
            stack.push(part);
        }
    }

    return '/' + stack.join('/');
}

/**
 * Resolves a given path relative to a current working directory (pwd).
 * @param {string} path - The path to resolve (can be relative or absolute).
 * @param {string} pwd - The current working directory (must be an absolute path, e.g., '/home/guest').
 * @param {string} home - The user's home directory (must be an absolute path, e.g., '/home/guest').
 * @returns {string} The resolved absolute path.
 */
export function resolvePath(path, pwd, home) {
    if (!path) return pwd;

    let effectivePath;

    if (path === '~') {
        effectivePath = home;
    } else if (path.startsWith('~/')) {
        effectivePath = `${home}${path.substring(1)}`;
    } else if (path.startsWith('/')) {
        effectivePath = path;
    } else {
        effectivePath = `${pwd === '/' ? '' : pwd}/${path}`;
    }

    return normalizePath(effectivePath);
}