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
import { createLogger } from '../Managers/LogManager.js';

/**
 * @class BaseService
 * @description Provides a foundational class for all services. It automates
 * the setup of the event bus, logger, and event listener registration.
 */
class BaseService {
    #eventBus;
    #log;

    constructor(eventBus) {
        if (!eventBus) {
            throw new Error('BaseService requires an eventBus.');
        }
        this.#eventBus = eventBus;
        this.#log = createLogger(this.constructor.name);
    }

    /**
     * Factory method to create and initialize a service instance.
     * This ensures the instance is fully constructed before `start()` is called,
     * resolving initialization order issues with private fields in child classes.
     * @param {EventBus} eventBus The application's event bus.
     * @returns {this} A new, initialized instance of the service.
     */
    static create(eventBus, config = {}) {
        const instance = new this(eventBus, config);
        instance.#registerListeners();
        return instance;
    }

    /**
     * Child classes can override this method to perform specific startup logic
     * after all services have been constructed and listeners are registered.
     * This method is called by the main application entry point.
     */
    start() {
        // To be overridden by child classes for post-initialization logic.
    }

    get log() { return this.#log; }

    /**
     * Dispatches an event on the event bus.
     * @param {string} eventName - The name of the event to dispatch.
     * @param {object} [payload] - The data to send with the event.
     */
    dispatch(eventName, payload = {} ) {
        this.#eventBus.dispatch(eventName, payload);
    }

    /**
     * Sends a request on the event bus and awaits a response.
     * @param {string} eventName - The name of the request event.
     * @param {object} [payload] - The data to send with the request.
     * @returns {Promise<any>} A promise that resolves with the response.
     */
    request(eventName, payload, timeout = 0) {
        return this.#eventBus.request(eventName, payload, timeout);
    }

    /**
     * Child classes must override this getter to return a map of event names
     * to their corresponding handler methods. The handlers will be automatically
     * bound and registered.
     * @returns {Object.<string, Function>}
     */
    get eventHandlers() {
        return {};
    }

    #registerListeners() {
        const handlers = this.eventHandlers;
        for (const [eventName, handler] of Object.entries(handlers)) {
            this.#eventBus.listen(eventName, handler, this.constructor.name);
        }
    }
}

export { BaseService };
