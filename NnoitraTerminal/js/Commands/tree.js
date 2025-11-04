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
 * @class Tree
 * @description Implements the 'tree' command, which displays the filesystem structure.
 */
class Tree extends BaseCommand {
    static DESCRIPTION = 'Display the filesystem structure as a tree.';

    #getTree;

    constructor(services) {
        super(services);
        this.#getTree = this.services.getTree;
    }

    static man() {
        return `NAME\n       tree - List contents of directories in a tree-like format.\n\nSYNOPSIS\n       tree\n\nDESCRIPTION\n       The tree command recursively displays the directory structure of the filesystem.`;
    }

    #formatTree(node, prefix = '') {
        let result = '';
        const entries = Object.keys(node).sort();
        entries.forEach((entry, index) => {
            const isLast = index === entries.length - 1;
            result += `${prefix}${isLast ? '└── ' : '├── '}${entry}\n`;
            if (node[entry] && typeof node[entry] === 'object') {
                result += this.#formatTree(node[entry], `${prefix}${isLast ? '    ' : '│   '}`);
            }
        });
        return result;
    }

    async execute(args, outputElement) {
        this.log.log('Executing...');
        const outputPre = document.createElement('pre');
        if (outputElement) outputElement.appendChild(outputPre);

        const treeData = await this.#getTree();
        const treeString = `/\n${this.#formatTree(treeData)}`;
        outputPre.textContent = treeString;
    }
}

export { Tree };
