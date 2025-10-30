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
 * Creates a simple list element from an array of items.
 * @param {Array<string|{text: string, style: object}>} items - An array of strings or objects to display in the list.
 * @returns {HTMLUListElement} The generated UL element.
 */
export function createList(items) {
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';

    if (!items || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = '(empty)';
        ul.appendChild(li);
    } else {
        items.forEach(item => {
            const li = document.createElement('li');
            if (typeof item === 'string') {
                li.textContent = item;
            } else if (typeof item === 'object' && item.text) {
                li.textContent = item.text;
                Object.assign(li.style, item.style);
            }
            ul.appendChild(li);
        });
    }
    return ul;
}

/**
 * Creates a formatted list specifically for directory contents.
 * @param {object} contents - The directory contents object.
 * @param {Array<{name: string}>} contents.directories - Array of directory objects.
 * @param {Array<{name: string, size: number|null}>} contents.files - Array of file objects.
 * @returns {HTMLUListElement} The generated UL element.
 */
export function createDirectoryList(contents) {
    const files = Array.isArray(contents?.files) ? contents.files : [];
    const directories = Array.isArray(contents?.directories) ? contents.directories : [];

    const directoryItems = directories.map(dir => ({
        text: `${dir.name}/`,
        style: { color: 'var(--nnoitra-color-directory)' }
    }));

    const fileItems = files.map(file => {
        const size = file.size !== null ? `(${file.size}b)` : '';
        return `${file.name} ${size}`;
    });

    const allItems = [...directoryItems, ...fileItems];

    return createList(allItems.length > 0 ? allItems : ['(empty directory)']);
}