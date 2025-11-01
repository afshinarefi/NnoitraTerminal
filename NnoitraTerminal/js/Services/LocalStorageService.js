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
import { EVENTS } from '../Core/Events.js';
import { BaseService } from '../Core/BaseService.js';
import { ENV_VARS } from '../Core/Variables.js';

/**
 * @class LocalStorageService
 * @description Manages all direct interactions with the browser's localStorage for environment variables.
 *
 * @listens for `SAVE_LOCAL_VAR` - Saves a specific key-value pair or overwrites all local data.
 * @listens for `LOAD_LOCAL_VAR` - Loads a specific key's value or all local data.
 * Both events can optionally take a `namespace` string in their payload.
 */
class LocalStorageService extends BaseService {
    #storageKeyPrefix = 'AREFI_LOCAL_ENV';
    #DEFAULT_NAMESPACE = 'DEFAULT'; // Fallback namespace


    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    get eventHandlers() {
        return {
            [EVENTS.SAVE_LOCAL_VAR]: this.#handleSaveLocalVar.bind(this),
            [EVENTS.LOAD_LOCAL_VAR]: this.#handleLoadLocalVar.bind(this),
            [EVENTS.RESET_LOCAL_VAR]: this.#handleResetLocalVar.bind(this),
            [EVENTS.DELETE_LOCAL_VAR]: this.#handleDeleteLocalVar.bind(this),
        };
    }

    /**
     * Generates a unique localStorage key for a specific variable.
     * Format: PREFIX_UUID_NAMESPACE_KEY
     */
    async #getStorageKey(namespace, key) {
        const { value: uuid } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.UUID });
        const ns = (namespace || this.#DEFAULT_NAMESPACE).toUpperCase();
        const k = key.toUpperCase();
        return `${this.#storageKeyPrefix}[${uuid}][${ns}][${k}]`;
    }

    /**
     * Generates the prefix used to find all keys for a given namespace and UUID.
     * Format: PREFIX_UUID_NAMESPACE_
     */
    async #getNamespacePrefix(namespace) {
        const { value: uuid } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.UUID });
        const ns = (namespace || this.#DEFAULT_NAMESPACE).toUpperCase();
        return `${this.#storageKeyPrefix}[${uuid}][${ns}]`;
    }

    async #handleSaveLocalVar({ key, value, respond, namespace }) {
        if (key === undefined || value === undefined) {
            this.log.warn('SAVE_LOCAL_VAR requires both a key and a value.');
            if (respond) respond({ success: false });
            return;
        }
        try {
            const storageKey = await this.#getStorageKey(namespace, key);
            localStorage.setItem(storageKey, JSON.stringify(value));
            if (respond) respond({ success: true });
        } catch (e) {
            this.log.error('Failed to write to localStorage:', e);
            if (respond) respond({ success: false, error: e });
        }
    }

    async #handleLoadLocalVar({ key, respond, namespace }) {
        if (key !== undefined) {
            // Load a single variable
            const storageKey = await this.#getStorageKey(namespace, key);
            const storedValue = localStorage.getItem(storageKey);
            let value = undefined;
            if (storedValue !== null) {
                try {
                    value = JSON.parse(storedValue);
                } catch (e) {
                    this.log.error(`Failed to parse localStorage key ${storageKey}:`, e);
                }
            }
            if (respond) respond({ value });
        } else {
            // Load all variables for the namespace
            const prefix = await this.#getNamespacePrefix(namespace);
            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const storageKey = localStorage.key(i);
                if (storageKey.startsWith(prefix)) {
                    const varKey = storageKey.substring(prefix.length);
                    const storedValue = localStorage.getItem(storageKey);
                    try {
                        allData[varKey] = JSON.parse(storedValue);
                    } catch (e) {
                        this.log.error(`Failed to parse localStorage key ${storageKey}:`, e);
                    }
                }
            }
            if (respond) respond({ value: allData });
        }
    }

    async #handleDeleteLocalVar({ key, respond, namespace }) {
        if (key === undefined) {
            this.log.warn('DELETE_LOCAL_VAR requires a key.');
            if (respond) respond({ success: false });
            return;
        }
        const storageKey = await this.#getStorageKey(namespace, key);
        localStorage.removeItem(storageKey);
        if (respond) respond({ success: true });
    }

    async #handleResetLocalVar({ namespace }) {
        this.log.log(`Resetting localStorage for namespace: ${namespace}`);
        const prefix = await this.#getNamespacePrefix(namespace);
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}

export { LocalStorageService };
