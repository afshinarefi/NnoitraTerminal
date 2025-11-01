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
import { BaseStorageService } from './BaseStorageService.js';
import { ApiManager } from '../Managers/ApiManager.js';
import { EVENTS } from '../Core/Events.js';
import { ENV_VARS } from '../Core/Variables.js';

/**
 * @class RemoteStorageService
 * @description Implements a storage backend that communicates with a remote server API.
 */
class RemoteStorageService extends BaseStorageService {
    static STORAGE_NAME = 'REMOTE';

    #apiManager;

    constructor(eventBus, config = {}) {
        super(eventBus);
        if (!config.apiUrl) {
            this.log.warn('RemoteStorageService initialized without an apiUrl. It will not be able to function.');
        }
        this.#apiManager = new ApiManager(config.apiUrl);
    }

    /**
     * Retrieves the current user's auth token from the environment.
     * @returns {Promise<string|null>} The token, or null if not available.
     * @private
     */
    async #getToken() {
        const { value: token } = await this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.TOKEN });
        return token;
    }

    /**
     * Retrieves a node by its key (path) from the remote server.
     * @param {object} data
     * @param {string} data.key - The key (path) of the node.
     * @returns {Promise<object|undefined>} The node object or undefined if not found.
     */
    async getNode({ key }) {
        const token = await this.#getToken();
        if (!token) throw new Error('Authentication required.');
        const response = await this.#apiManager.post('get_node', { key }, token);
        return response.node;
    }

    /**
     * Sets a node for a given key (path) on the remote server.
     * @param {object} data
     * @param {string} data.key - The key (path) of the node.
     * @param {object} data.node - The node object to store.
     */
    async setNode({ key, node }) {
        const token = await this.#getToken();
        if (!token) throw new Error('Authentication required.');
        // We stringify the node because FormData only supports strings or Blobs.
        const response = await this.#apiManager.post('set_node', { key, node: JSON.stringify(node) }, token);
        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to set node.');
        }
    }

    /**
     * Deletes a node by its key (path) on the remote server.
     * @param {object} data
     * @param {string} data.key - The key (path) of the node to delete.
     */
    async deleteNode({ key }) {
        const token = await this.#getToken();
        if (!token) throw new Error('Authentication required.');
        const response = await this.#apiManager.post('delete_node', { key }, token);
        if (response.status !== 'success') {
            throw new Error(response.message || 'Failed to delete node.');
        }
    }

    /**
     * Returns a list of all keys that start with a given prefix from the remote server.
     * @param {object} data
     * @param {string} data.prefix - The prefix to search for.
     * @returns {Promise<string[]>} A list of matching keys.
     */
    async listKeysWithPrefix({ prefix }) {
        const token = await this.#getToken();
        if (!token) throw new Error('Authentication required.');
        const response = await this.#apiManager.post('list_keys', { prefix }, token);
        return response.keys || [];
    }
}

export { RemoteStorageService };
