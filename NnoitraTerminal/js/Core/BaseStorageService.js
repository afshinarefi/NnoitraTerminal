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
        if (storageName !== this.constructor.STORAGE_NAME) {
            return; // Not for this storage service
        }

        if (typeof this[api] !== 'function') {
            const errorMsg = `${this.constructor.name} does not implement API method: ${api}`;
            this.log.error(errorMsg);
            if (respond) respond({ error: new Error(errorMsg) });
            return;
        }

        try {
            const result = await this[api](data);
            if (respond) respond({ result });
        } catch (error) {
            this.log.error(`Error executing API method '${api}' in ${this.constructor.name}:`, error);
            if (respond) respond({ error });
        }
    }

    // --- Abstract methods to be implemented by child classes ---

    async getNode({ key }) {
        throw new Error(`${this.constructor.name} must implement the 'getNode' method.`);
    }

    async setNode({ key, node }) {
        throw new Error(`${this.constructor.name} must implement the 'setNode' method.`);
    }

    async deleteNode({ key }) {
        throw new Error(`${this.constructor.name} must implement the 'deleteNode' method.`);
    }

    async listKeysWithPrefix({ prefix }) {
        throw new Error(`${this.constructor.name} must implement the 'listKeysWithPrefix' method.`);
    }
}

export { BaseStorageService };
