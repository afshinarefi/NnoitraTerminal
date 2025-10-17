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
import { createLogger } from './LogService.js';
const log = createLogger('ApiService');

/**
 * @class ApiService
 * @description A centralized service for making authenticated requests to the backend API.
 */
export class ApiService {
    #environmentService;
    #apiEndpoint;

    constructor(services, endpoint) {
        this.#environmentService = services.environment;
        this.#apiEndpoint = endpoint;
    }

    /**
     * Makes a POST request to the backend API, automatically including the session token.
     * @param {string} action - The action to perform (e.g., 'login', 'get_env').
     * @param {Object} [data={}] - An object containing the data to send.
     * @returns {Promise<object>} The JSON response from the server.
     */
    async post(action, data = {}) {
        const formData = new FormData();
        const token = this.#environmentService.getVariable('TOKEN');

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
        return response.json();
    }
}