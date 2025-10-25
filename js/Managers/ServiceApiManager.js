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
import { EVENTS } from '../Core/Events.js';
import { createLogger } from './LogManager.js';

const log = createLogger('ServiceApiManager');

/**
 * @class ServiceApiManager
 * @description Provides a clean, promise-based API for any service to interact with
 * the rest of the application via the event bus, abstracting away request/response logic.
 */
export class ServiceApiManager {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;
    }

    // --- UI Gateway Methods ---

    async prompt(promptText, options = {}) {
        const response = await this.#eventBus.request(EVENTS.INPUT_REQUEST, { prompt: promptText, options });
        return response.value;
    }

    clearScreen() {
        this.#eventBus.dispatch(EVENTS.CLEAR_SCREEN_REQUEST);
    }

    scrollToBottom() {
        this.#eventBus.dispatch(EVENTS.UI_SCROLL_TO_BOTTOM_REQUEST);
    }

    async requestMedia(src) {
        const response = await this.#eventBus.request(EVENTS.MEDIA_REQUEST, { src });
        return response.mediaElement;
    }

    // --- User/Accounting Gateway Methods ---

    async login(username, password) {
        return await this.#eventBus.request(EVENTS.LOGIN_REQUEST, { username, password });
    }

    async logout() {
        return await this.#eventBus.request(EVENTS.LOGOUT_REQUEST, {});
    }

    async changePassword(oldPassword, newPassword) {
        return await this.#eventBus.request(EVENTS.PASSWORD_CHANGE_REQUEST, { oldPassword, newPassword });
    }

    async isLoggedIn() {
        const response = await this.#eventBus.request(EVENTS.IS_LOGGED_IN_REQUEST, {});
        return response.isLoggedIn;
    }

    // --- Filesystem Gateway Methods ---

    async isDirectory(path) {
        const response = await this.#eventBus.request(EVENTS.FS_IS_DIR_REQUEST, { path });
        return response.isDirectory;
    }

    async getDirectoryContents(path) {
        const response = await this.#eventBus.request(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path });
        if (response.error) {
            throw new Error(response.error.message || 'Failed to get directory contents.');
        }
        return response.contents;
    }

    async getFileContents(path) {
        const response = await this.#eventBus.request(EVENTS.FS_GET_FILE_CONTENTS_REQUEST, { path });
        if (response.error) {
            throw new Error(response.error.message || 'Failed to get file contents.');
        }
        return response.contents;
    }

    async getPublicUrl(path) {
        const response = await this.#eventBus.request(EVENTS.FS_GET_PUBLIC_URL_REQUEST, { path });
        return response.url;
    }

    async resolvePath(path, mustBeDir = false) {
        const response = await this.#eventBus.request(EVENTS.FS_RESOLVE_PATH_REQUEST, { path, mustBeDir });
        if (response.error) {
            throw response.error;
        }
        return response.path;
    }

    // --- History Gateway Methods ---

    async getHistory() {
        const response = await this.#eventBus.request(EVENTS.HISTORY_GET_ALL_REQUEST, {});
        return response.history;
    }

    // --- Environment Gateway Methods ---

    async changeDirectory(path) {
        const response = await this.#eventBus.request(EVENTS.FS_CHANGE_DIRECTORY_REQUEST, { path });
        if (response.error) {
            // The error object from the service is a standard Error, so we can re-throw it.
            throw response.error;
        }
    }

    async getVariable(key) {
        const { values } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { key });
        return values ? values[key] : undefined;
    }

    setTempVariable(key, value) {
        this.#eventBus.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key, value });
    }

    setLocalVariable(key, value) {
        this.#eventBus.dispatch(EVENTS.VAR_SET_LOCAL_REQUEST, { key, value });
    }

    setRemoteVariable(key, value) {
        this.#eventBus.dispatch(EVENTS.VAR_SET_REMOTE_REQUEST, { key, value });
    }

    setUserspaceVariable(key, value) {
        this.#eventBus.dispatch(EVENTS.VAR_SET_USERSPACE_REQUEST, { key, value });
    }

    async getAllCategorizedVariables() {
        const { categorized } = await this.#eventBus.request(EVENTS.GET_ALL_CATEGORIZED_VARS_REQUEST, {});
        return categorized;
    }

    // --- Alias Gateway Methods ---

    async getAliases() {
        const response = await this.#eventBus.request(EVENTS.GET_ALIASES_REQUEST, {});
        return response.aliases;
    }

    setAliases(aliases) {
        // This is a fire-and-forget dispatch
        this.#eventBus.dispatch(EVENTS.SET_ALIASES_REQUEST, { aliases });
    }

    // --- Command Introspection Gateway Methods ---

    async getCommandList() {
        const response = await this.#eventBus.request(EVENTS.GET_COMMAND_LIST_REQUEST, {});
        return response.commands;
    }

    async getCommandMeta(commandName, metaKey) {
        const response = await this.#eventBus.request(EVENTS.GET_COMMAND_META_REQUEST, { commandName, metaKey });
        return response.value;
    }

    // --- Theme Gateway Methods ---

    async setTheme(themeName) {
        const response = await this.#eventBus.request(EVENTS.SET_THEME_REQUEST, { themeName });
        return response.theme;
    }

    async getValidThemes() {
        const response = await this.#eventBus.request(EVENTS.GET_VALID_THEMES_REQUEST, {});
        return response.themes;
    }
}