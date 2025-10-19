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
import { createLogger } from './LogManager.js';

const log = createLogger('EventBus');

/**
 * @class EventBusService
 * @description A simple, central event bus for decoupled communication between services.
 */
class EventBusService {
    #listeners = new Map();

    constructor() {
        log.log('Initializing...');
    }

    /**
     * Registers a listener for an event.
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} callback - The function to execute when the event is dispatched.
     */
    listen(eventName, callback) {
        if (!this.#listeners.has(eventName)) {
            this.#listeners.set(eventName, []);
        }
        this.#listeners.get(eventName).push(callback);
    }

    /**
     * Dispatches an event to all registered listeners.
     * @param {string} eventName - The name of the event to dispatch.
     * @param {*} [payload] - The data to pass to the listeners.
     */
    dispatch(eventName, payload) {
        if (this.#listeners.has(eventName)) {
            this.#listeners.get(eventName).forEach(callback => callback(payload));
        }
    }
}

export { EventBusService };
