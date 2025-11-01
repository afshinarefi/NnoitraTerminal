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
import { BaseService } from '../Core/BaseService.js';
import { EVENTS } from '../Core/Events.js';
import { STORAGE_APIS } from '../Core/StorageApis.js';

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

    // A map where the key is the resource path, and the value is the current
    // "gate" object: { promise, resolve, lockId }
    #operationQueues = new Map();

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
        const key = data.key;
        const hadExplicitLockId = !!data.lockId;
        let result;
        if (key == 'GUEST_STORAGE_HISTORY') {
            this.log.warn("BBBBB",data, key, api);
        }
        if(key) {
            if (!hadExplicitLockId) {
                let newGateResolver;
                const newGatePromise = new Promise(resolve => { newGateResolver = resolve; });
                // Get the promise of the operation currently in front of us.
                const lastGatePromise = this.#operationQueues.get(key)?.promise || Promise.resolve();

                // Ensure a queue entry exists and set our new promise as the next gate.
                if (!this.#operationQueues.has(key)) {
                    this.#operationQueues.set(key, {});
                }
                this.#operationQueues.get(key).promise = newGatePromise;

                // Wait for our turn. This is the core of the locking mechanism.
                await lastGatePromise;

                // Re-check and create the queue entry if it was deleted by a previous unlock operation.
                this.#operationQueues.get(key).resolve = newGateResolver;
                this.#operationQueues.get(key).lockId = crypto.randomUUID();
            } else if (data.lockId !== this.#operationQueues.get(key)?.lockId) {
                throw new Error(`Invalid lock ID for operation on '${key} for ${api}:${data} was ${data.lockId} != ${this.#operationQueues.get(key)?.lockId}'.`);
            }
        }
        // Reaching here means we have reserved the resource

        try {
            if (api === STORAGE_APIS.GET_NODE) {
                result = await this.getNode(data);
            } else if (api === STORAGE_APIS.SET_NODE) {
                result = await this.setNode(data);
            } else if (api === STORAGE_APIS.DELETE_NODE) {
                result = await this.deleteNode(data);
            } else if (api === STORAGE_APIS.LIST_KEYS_WITH_PREFIX) {
                result = await this.listKeysWithPrefix(data);
            } else if (api === STORAGE_APIS.LOCK_NODE) {
                result = await this.lockNode(data);
            } else if (api === STORAGE_APIS.UNLOCK_NODE) {
                result = await this.unlockNode(data);
            }
        } finally {
            // If this was a queued operation (not an explicit lock), open the gate for the next one,
            // unless it was a lockNode call, which intentionally holds the lock.
            if (!hadExplicitLockId && api !== STORAGE_APIS.LOCK_NODE) {
                this.#operationQueues.get(key)?.resolve();
            }
        }
        respond({ result });

    }

    // --- Abstract methods to be implemented by child classes ---

    async getNode({ key }) {
        throw new Error(`${this.constructor.name} must implement the 'getNode' method.`);
    }

    async setNode({ key, node, lockId }) {
        throw new Error(`${this.constructor.name} must implement the 'setNode' method.`);
    }

    async deleteNode({ key }) {
        throw new Error(`${this.constructor.name} must implement the 'deleteNode' method.`);
    }

    async listKeysWithPrefix({ prefix }) {
        throw new Error(`${this.constructor.name} must implement the 'listKeysWithPrefix' method.`);
    }

    /**
     * Acquires an explicit lock on a resource, preventing other operations on the same key.
     * This method is called from within the #handleStorageApiRequest queue.
     * It returns the lockId but does NOT resolve the promise, thus holding the lock.
     * @param {object} data
     * @param {string} data.key - The key of the resource to lock.
     * @returns {Promise<{lockId: string}>}
     */
    async lockNode({ key, timeout = 30000 }) {
        return {lockId: this.#operationQueues.get(key).lockId};
    }

    /**
     * Releases an explicit lock on a resource.
     * @param {object} data
     * @param {string} data.key - The key of the resource to unlock.
     * @param {string} data.lockId - The lock ID that was returned by lockNode.
     */
    async unlockNode({ key, lockId }) {
        const queueEntry = this.#operationQueues.get(key);
        if (queueEntry && queueEntry.lockId === lockId) {
            queueEntry.resolve();
        } else {
            // It's better to throw an error for an invalid unlock attempt.
            throw new Error(`Attempted to unlock '${key}' with an invalid or expired lockId.`);
        }
    }
}

export { BaseStorageService };