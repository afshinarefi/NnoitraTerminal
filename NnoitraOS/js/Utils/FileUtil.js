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

/**
 * Fetches and parses a JSON file from a given URL.
 * @param {string} url - The URL of the JSON file to fetch.
 * @returns {Promise<object>} A promise that resolves with the parsed JSON object.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function fetchJsonFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for url: ${url}`);
    }
    return response.json();
}

/**
 * Fetches a text file from a given URL.
 * @param {string} url - The URL of the text file to fetch.
 * @returns {Promise<string>} A promise that resolves with the text content.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function fetchTextFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for url: ${url}`);
    }
    return response.text();
}