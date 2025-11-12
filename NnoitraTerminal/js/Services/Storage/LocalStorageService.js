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
import { EVENTS } from '../../Core/Events.js';
import { ENV_VARS } from '../../Core/Variables.js';

/**
 * @class LocalStorageService
 * @description Implements a storage backend using the browser's localStorage.
 */
class LocalStorageService extends BaseStorageService {
    static STORAGE_NAME = 'LOCAL';
    #storageKeyPrefix = 'NNOITRA_LOCAL';

    constructor(eventBus) {
        super(eventBus);
    }

    /**
     * Retrieves a node by its key (path).
     * @param {object} data
     * @param {string} data.key - The key (path) of the node.
     * @returns {Promise<object|undefined>} The node object or undefined if not found.
     */
    async getNode({ key, id }) {
        const physicalKey = await this.#getPhysicalKey(key, id);
        const storedValue = localStorage.getItem(physicalKey);
        if (storedValue === null) {
            return undefined;
        }
        try {
            return JSON.parse(storedValue);
        } catch (e) {
            this.log.error(`Failed to parse localStorage key ${physicalKey}:`, e);
            return undefined;
        }
    }

    /**
     * Sets a node for a given key (path).
     * @param {object} data
     * @param {string} data.key - The key (path) of the node.
     * @param {object} data.node - The node object to store.
     */
    async setNode({ key, node, id }) {
        console.warn('ZZZ', { key, node, id });
        const physicalKey = await this.#getPhysicalKey(key, id);
        try {
            localStorage.setItem(physicalKey, JSON.stringify(node));
        } catch (e) {
            this.log.error(`Failed to write to localStorage for key ${physicalKey}:`, e);
            throw e;
        }
    }

    /**
     * Deletes a node by its key (path).
     * @param {object} data
     * @param {string} data.key - The key (path) of the node to delete.
     */
    async deleteNode({ key, id }) {
        const physicalKey = await this.#getPhysicalKey(key, id);
        localStorage.removeItem(physicalKey);
    }

    /**
     * Returns a list of all keys that start with a given prefix.
     * @param {object} data
     * @param {string} data.key - The prefix to search for.
     * @returns {Promise<string[]>} A list of matching keys.
     */
    async listKeysWithPrefix({ key, id }) {
        const physicalPrefix = await this.#getPhysicalKey(key, id);
        const matchingKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k.startsWith(physicalPrefix)) {
                // Return the logical key, not the physical one
                matchingKeys.push(k.substring(physicalPrefix.length - key.length));
            }
        }
        return matchingKeys;
    }

    /**
     * Constructs the actual key used in localStorage by prepending the UUID.
     * @param {string} logicalKey - The key provided by the consuming service.
     * @returns {Promise<string>} The physical key for localStorage.
     */
    async #getPhysicalKey(logicalKey, id) {
        const { value: uuid } = await this.request(EVENTS.GET_UUID_REQUEST, { key: ENV_VARS.UUID });
        return `${this.#storageKeyPrefix}_${uuid}_${id}_${logicalKey}`;
    }
}

export { LocalStorageService };
