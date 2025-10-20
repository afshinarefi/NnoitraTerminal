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
import { EVENTS } from './Events.js';

const log = createLogger('ThemeService');

// Define constants for hardcoded strings
const VAR_THEME = 'THEME';
const DEFAULT_THEME = 'green';

/**
 * @class ThemeBusService
 * @description Manages the terminal's color theme by reacting to environment variable changes.
 *
 * @listens for `variable-changed-broadcast` - For changes to the THEME variable.
 * @listens for `variable-get-response` - For the initial THEME value.
 *
 * @dispatches `variable-get-request` - To get the initial THEME variable on startup.
 * @dispatches `theme-changed-broadcast` - When the theme is successfully applied.
 */
class ThemeService {
    static VALID_THEMES = ['green', 'yellow', 'orange', 'red'];
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
        log.log('Initializing...');
    }

    async start() {
        // After all services are initialized, request the initial theme value.
        const { values } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, { key: VAR_THEME });
        const theme = values[VAR_THEME] || DEFAULT_THEME;
        this.applyTheme(theme, false); // Don't persist on initial load
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.VAR_CHANGED_BROADCAST, this.#handleVarChanged.bind(this));
        this.#eventBus.listen(EVENTS.SET_THEME_REQUEST, this.#handleSetThemeRequest.bind(this));
        this.#eventBus.listen(EVENTS.GET_VALID_THEMES_REQUEST, this.#handleGetValidThemesRequest.bind(this));
    }

    #handleVarChanged(payload) {
        // This handles changes from other sources, like manual `export THEME=...`
        if (payload.key === VAR_THEME) {
            this.applyTheme(payload.value, false);
        }
    }

    #handleSetThemeRequest({ themeName, respond }) {
        const finalTheme = this.applyTheme(themeName);
        respond({ theme: finalTheme });
    }

    #handleGetValidThemesRequest({ respond }) {
        respond({ themes: this.getValidThemes() });
    }

    applyTheme(themeName, persist = true) {
        const finalTheme = ThemeService.VALID_THEMES.includes(themeName) ? themeName : DEFAULT_THEME;
        const themeColor = `var(--arefi-color-${finalTheme})`;
        document.documentElement.style.setProperty('--arefi-color-theme', themeColor);
        this.#eventBus.dispatch(EVENTS.THEME_CHANGED_BROADCAST, { themeName: finalTheme });
        log.log(`Applied theme: ${finalTheme}`);

        if (persist) {
            this.#eventBus.dispatch(EVENTS.VAR_SET_REQUEST, { key: VAR_THEME, value: finalTheme, category: 'USERSPACE' });
        }
        return finalTheme;
    }

    getValidThemes() {
        return ThemeService.VALID_THEMES;
    }
}

export { ThemeService };