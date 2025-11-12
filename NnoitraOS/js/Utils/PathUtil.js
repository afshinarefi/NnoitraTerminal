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
 * It returns an array of path components. For absolute paths, the first element
 * will be an empty string to represent the root.
 * @param {string} path - The path to normalize.
 * @returns {string[]} The normalized path as an array of components.
 */
export function normalizePath(path) {
    // Assumes path is always absolute. An empty path or '/' resolves to an empty array, representing the root.
    if (!path || path === '/') return [];

    // Since it's an absolute path, the first part after split is always '', so we skip it.
    const parts = path.split('/').slice(1);
    const stack = [];

    for (const part of parts) {
        if (part === '..') {
            // For an absolute path, '..' at the root does nothing.
            if (stack.length > 0) stack.pop();
        } else if (part !== '.' && part !== '') {
            stack.push(part);
        }
    }

    return stack;
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

    // Handle tilde expansion for home directory.
    if (path.startsWith('~')) {
        path = home + path.substring(1);
    }

    // If the path is not absolute, prepend the current working directory.
    const effectivePath = path.startsWith('/') ? path : `${pwd === '/' ? '' : pwd}/${path}`;

    return '/' + normalizePath(effectivePath).join('/');
}