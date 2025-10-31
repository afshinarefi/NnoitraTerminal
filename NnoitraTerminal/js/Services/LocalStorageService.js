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

    async #getStorageKey(namespace) {
        const { value: uuid } = await this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: 'UUID' });
        return namespace ? `${this.#storageKeyPrefix}_${uuid}_${namespace.toUpperCase()}` : `${this.#storageKeyPrefix}_${uuid}`;
    }

    async #readAllLocal(namespace) {
        const stored = localStorage.getItem(await this.#getStorageKey(namespace));
        if (!stored) return {};
        try {
            return JSON.parse(stored);
        } catch (e) {
            this.log.error('Failed to parse local environment variables from localStorage:', e);
            return {};
        }
    }

    async #writeAllLocal(data, namespace) {
        try {
            localStorage.setItem(await this.#getStorageKey(namespace), JSON.stringify(data));
        } catch (e) {
            this.log.error('Failed to write to localStorage:', e);
        }
    }

    async #handleSaveLocalVar({ key, value, respond, namespace }) {
        if (key === undefined || value === undefined) {
            this.log.warn('SAVE_LOCAL_VAR requires both a key and a value.');
            if (respond) respond({ success: false });
            return;
        }
        let currentData = await this.#readAllLocal(namespace);
        currentData[key] = value;
        await this.#writeAllLocal(currentData, namespace);

        if (respond) respond({ success: true });
    }

    async #handleLoadLocalVar({ key, respond, namespace }) {
        const allData = await this.#readAllLocal(namespace);
        const value = key !== undefined ? allData[key] : allData;
        if (respond) respond({ value });
    }

    async #handleDeleteLocalVar({ key, respond, namespace }) {
        if (key === undefined) {
            this.log.warn('DELETE_LOCAL_VAR requires a key.');
            if (respond) respond({ success: false });
            return;
        }
        let currentData = await this.#readAllLocal(namespace);
        delete currentData[key];
        await this.#writeAllLocal(currentData, namespace);
        if (respond) respond({ success: true });
    }

    async #handleResetLocalVar({ namespace }) {
        this.log.log(`Resetting localStorage for namespace: ${namespace}`);
        localStorage.removeItem(await this.#getStorageKey(namespace));
    }
}

export { LocalStorageService };
