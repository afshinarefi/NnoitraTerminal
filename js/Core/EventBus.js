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
import { createLogger } from '../Managers/LogManager.js';

const log = createLogger('EventBus');

/**
 * @class EventBusService
 * @description A simple, central event bus for decoupled communication between services.
 */
class EventBus {
    #listeners = new Map();
    #pendingRequests = new Map();

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
        log.log(`Dispatching event "${eventName}" with payload: ${JSON.stringify(payload)}`);
        if (this.#listeners.has(eventName)) {
            // Schedule the execution of listeners asynchronously.
            // This allows the dispatch method to return immediately (fire-and-forget).
            Promise.resolve().then(async () => {
                // We get the list of listeners at the time of execution.
                const listeners = this.#listeners.get(eventName);
                if (listeners) {
                    // Execute each listener in its own asynchronous microtask.
                    // This prevents one listener from blocking another.
                    listeners.forEach(callback => {
                        // We don't await here. This ensures each listener is
                        // invoked independently.
                        log.log(`Dispatching event "${eventName}" to listener with payload: ${JSON.stringify(payload)}`);
                        Promise.resolve().then(() => callback(payload));
                    });
                }
            });
        }
    }

    /**
     * Dispatches a request and returns a promise that resolves with the response.
     * The dispatched event payload will be augmented with a `respond` function.
     * @param {string} eventName - The name of the request event to dispatch.
     * @param {*} payload - The data for the request.
     * @param {number} [timeout=5000] - Timeout in milliseconds.
     * @returns {Promise<any>} A promise that resolves with the response payload.
     */
    request(eventName, payload = {}, timeout = 60000) {
        const correlationId = `${eventName}-${Date.now()}-${Math.random()}`;

        return new Promise((resolve, reject) => {
            // Store the promise handlers
            this.#pendingRequests.set(correlationId, { resolve, reject });

            // Set up a timeout to reject the promise if no response is received
            let timeoutId = null;
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    if (this.#pendingRequests.has(correlationId)) {
                        this.#pendingRequests.get(correlationId).reject(new Error(`Request timed out for event "${eventName}"`));
                        this.#pendingRequests.delete(correlationId);
                    }
                }, timeout);
            }

            // Create the payload for the dispatched event, including the `respond` function
            const requestPayload = {
                ...payload,
                respond: (responsePayload) => {
                    if (this.#pendingRequests.has(correlationId)) {
                        if (timeoutId) clearTimeout(timeoutId); // Clear the timeout since we got a response
                        log.log(`Response received for event "${eventName}": ${JSON.stringify(responsePayload)}`);
                        this.#pendingRequests.get(correlationId).resolve(responsePayload);
                        this.#pendingRequests.delete(correlationId);
                        return true; // Response was successfully delivered
                    }
                    // The request timed out or was already fulfilled.
                    return false;
                }
            };

            this.dispatch(eventName, requestPayload);
        });
    }
}

export { EventBus };
