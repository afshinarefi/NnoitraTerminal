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
import { BaseService } from '../Core/BaseService.js';

// Define constants for hardcoded strings
const VAR_THEME = 'THEME';
const DEFAULT_THEME = 'green';

/**
 * @class ThemeBusService
 * @description Manages the terminal's color theme by reacting to environment variable changes.
 *
 * @listens for `variable-get-response` - For the initial THEME value.
 *
 * @dispatches `variable-get-request` - To get the initial THEME variable on startup.
 * @dispatches `theme-changed-broadcast` - When the theme is successfully applied.
 */
class ThemeService extends BaseService{
    static VALID_THEMES = ['green', 'yellow', 'orange', 'red'];
    #view = null; // The Terminal component instance

    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the Terminal component.
     */
    setView(view) {
        this.#view = view;
        this.log.log('View connected.');
    }

    async start() {
        // After all services are initialized, request the initial theme value.
        const { value } = await this.request(EVENTS.VAR_GET_SYSTEM_REQUEST, { key: VAR_THEME });
        const theme = value || DEFAULT_THEME;
        this.applyTheme(theme);
    }

    get eventHandlers() {
        return {
            [EVENTS.SET_THEME_REQUEST]: this.#handleSetThemeRequest.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.GET_VALID_THEMES_REQUEST]: this.#handleGetValidThemesRequest.bind(this),
            [EVENTS.USER_CHANGED_BROADCAST]: this.#handleUserChanged.bind(this)
        };
    }

    #handleSetThemeRequest({ themeName, respond }) {
        const finalTheme = this.applyTheme(themeName);
        respond({ theme: finalTheme });
    }

    async #handleUserChanged() {
        this.log.log('User changed, re-evaluating theme.');
        // This will trigger the lazy-loading of remote variables if a user logged in,
        // or fall back to defaults if logged out, because the environment state has changed.
        const { value } = await this.request(EVENTS.VAR_GET_SYSTEM_REQUEST, { key: VAR_THEME });
        const theme = value || DEFAULT_THEME;
        this.applyTheme(theme, false); // Don't persist, just apply the current state.
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        if (key === VAR_THEME) {
            this.dispatch(EVENTS.VAR_SET_SYSTEM_REQUEST, { key, value: DEFAULT_THEME });
            respond({ value: DEFAULT_THEME });
        }
    }

    #handleGetValidThemesRequest({ respond }) {
        respond({ themes: this.getValidThemes() });
    }

    applyTheme(themeName) {
        const finalTheme = ThemeService.VALID_THEMES.includes(themeName) ? themeName : DEFAULT_THEME;

        if (this.#view) {
            const themeColor = `var(--arefi-color-${finalTheme})`;
            // Set the CSS variable directly on the host component, not the global document.
            // This ensures each terminal instance can have its own independent theme.
            this.#view.style.setProperty('--arefi-color-theme', themeColor);
        }

        this.dispatch(EVENTS.THEME_CHANGED_BROADCAST, { themeName: finalTheme });
        this.dispatch(EVENTS.VAR_SET_SYSTEM_REQUEST, { key: VAR_THEME, value: finalTheme });
        this.log.log(`Applied theme: ${finalTheme}`);

        // The theme command itself will handle persisting the variable.
        // This service only applies the theme based on the variable's value.

        return finalTheme;
    }

    getValidThemes() {
        return ThemeService.VALID_THEMES;
    }
}

export { ThemeService };