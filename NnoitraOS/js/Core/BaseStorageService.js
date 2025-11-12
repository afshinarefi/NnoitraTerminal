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
import { BaseService } from './BaseService.js';
import { EVENTS } from './Events.js';
import { STORAGE_APIS } from './StorageApis.js';
import { Mutex } from '../Utils/MutexUtils.js';

/**
 * @class BaseStorageService
 * @description Provides a foundational class for all storage backend services (e.g., Local, Remote, Session).
 * It defines a common interface for filesystem operations and handles routing of storage API requests.
 */
class BaseStorageService extends BaseService {
    
    /**
     * The unique name of this storage service (e.g., 'LOCAL', 'REMOTE').
     * Child classes MUST override this static property.
     * @type {string}
     */
    static STORAGE_NAME = 'BASE';

    #mutex = new Mutex();

    constructor(eventBus) {
        super(eventBus);
        this.log.log(`Initializing ${this.constructor.STORAGE_NAME} storage service...`);
    }

    get eventHandlers() {
        return {
            [EVENTS.STORAGE_API_REQUEST]: this.#handleStorageApiRequest.bind(this)
        };
    }

    /**
     * Handles incoming storage API requests and routes them to the appropriate method
     * if the request is intended for this specific storage service.
     * @param {object} payload - The event payload.
     * @param {string} payload.storageName - The name of the target storage service.
     * @param {string} payload.api - The name of the method to call.
     * @param {object} payload.data - The data for the method.
     * @param {Function} payload.respond - The function to call with the result.
     * @private
     */
    async #handleStorageApiRequest({ storageName, api, data, respond }) {
        if (storageName !== this.constructor.STORAGE_NAME) return;

        const { key, id, lockId: explicitLockId } = data;
        if (!key) throw new Error(`A 'key' must be provided for any storage operation. API: ${api}`);
        const mutexKey = `${id}:${key}`;
        let result;
        let lockId;

        try {
            lockId = await this.#mutex.acquire(mutexKey, explicitLockId);

            if (api === STORAGE_APIS.GET_NODE) {
                result = await this.getNode(data);
            } else if (api === STORAGE_APIS.SET_NODE) {
                result = await this.setNode(data);
            } else if (api === STORAGE_APIS.DELETE_NODE) {
                result = await this.deleteNode(data);
            } else if (api === STORAGE_APIS.LIST_KEYS_WITH_PREFIX) {
                result = await this.listKeysWithPrefix(data);
            } else if (api === STORAGE_APIS.LOCK_NODE) {
                result = { lockId };
            }
        } finally {
            // Release the lock if it was an explicit unlock, OR if it was an implicit lock for a single operation.
            if ((api === STORAGE_APIS.UNLOCK_NODE) || (lockId && !explicitLockId && api !== STORAGE_APIS.LOCK_NODE)) {
                this.#mutex.release(mutexKey, lockId);
            }
        }
        respond({ result });
    }

    // --- Abstract methods to be implemented by child classes ---

    async getNode({ key, id }) {
        throw new Error(`${this.constructor.name} must implement the 'getNode' method.`);
    }

    async setNode({ key, node, id }) {
        throw new Error(`${this.constructor.name} must implement the 'setNode' method.`);
    }

    async deleteNode({ key, id }) {
        throw new Error(`${this.constructor.name} must implement the 'deleteNode' method.`);
    }

    async listKeysWithPrefix({ key, id }) {
        throw new Error(`${this.constructor.name} must implement the 'listKeysWithPrefix' method.`);
    }

}

export { BaseStorageService };