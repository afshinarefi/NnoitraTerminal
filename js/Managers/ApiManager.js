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
const log = createLogger('ApiManager');

/**
 * @class ApiManager
 * @description A manager for making authenticated requests to a specific backend API endpoint.
 */
export class ApiManager {
    #apiEndpoint;

    constructor(endpoint) {
        this.#apiEndpoint = endpoint;
    }

    /**
     * Makes a POST request to the backend API, automatically including the session token.
     * @param {string} action - The action to perform (e.g., 'login', 'get_env').
     * @param {Object} [data={}] - An object containing the data to send.
     * @param {string|null} [token=null] - The session token to include, if any.
     * @returns {Promise<object>} The JSON response from the server.
     */
    async post(action, data = {}, token = null) {
        const formData = new FormData();

        if (token) {
            formData.append('token', token);
        }

        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }

        log.log(`Making API call: action=${action}`);
        const response = await fetch(`${this.#apiEndpoint}?action=${action}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Invalid response from server: Expected JSON but received ${contentType}. Is the server running with the --cgi flag?`);
        }
        return response.json();
    }

    /**
     * Makes a GET request to the backend API.
     * @param {Object} [data={}] - An object containing data to be sent as URL query parameters.
     * @returns {Promise<object>} The JSON response from the server.
     */
    async get(data = {}) {
        const url = new URL(this.#apiEndpoint, window.location.origin);
        for (const [key, value] of Object.entries(data)) {
            url.searchParams.append(key, value);
        }

        log.log(`Making API call (GET): url=${url}`);
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Invalid response from server: Expected JSON but received ${contentType}. Is the server running with the --cgi flag?`);
        }
        return response.json();
    }
}