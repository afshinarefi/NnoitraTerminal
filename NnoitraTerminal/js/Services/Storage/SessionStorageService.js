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
import { BaseStorageService } from '../../Core/BaseStorageService.js';

/**
 * @class SessionStorageService
 * @description Implements an in-memory, temporary storage backend.
 * All data is lost when the page is reloaded.
 */
class SessionStorageService extends BaseStorageService {
    static STORAGE_NAME = 'SESSION';

    // A simple in-memory map to act as the key-value store for VFS nodes.
    #data = new Map();

    constructor(eventBus) {
        super(eventBus);
    }

    /**
     * Retrieves a node by its key.
     * @param {object} data
     * @param {string} data.key - The key (UUID) of the node.
     * @returns {Promise<object|undefined>} The node object or undefined if not found.
     */
    async getNode({ key }) {
        // The data is already a JS object, so no parsing is needed.
        return this.#data.get(key);
    }

    /**
     * Sets a node for a given key.
     * @param {object} data
     * @param {string} data.key - The key (UUID) of the node.
     * @param {object} data.node - The node object to store.
     */
    async setNode({ key, node }) {
        this.#data.set(key, node);
    }

    /**
     * Deletes a node by its key.
     * @param {object} data
     * @param {string} data.key - The key (UUID) of the node to delete.
     */
    async deleteNode({ key }) {
        this.#data.delete(key);
    }

    /**
     * Returns a list of all keys that start with a given prefix.
     * @param {object} data
     * @param {string} data.key - The prefix to search for.
     * @returns {Promise<string[]>} A list of matching keys.
     */
    async listKeysWithPrefix({ key }) {
        return Array.from(this.#data.keys()).filter(k => k.startsWith(key));
    }
}

export { SessionStorageService };