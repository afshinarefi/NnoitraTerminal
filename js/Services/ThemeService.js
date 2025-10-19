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

const log = createLogger('ThemeBusService');

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
class ThemeBusService {
    static VALID_THEMES = ['green', 'yellow', 'orange', 'red'];
    #eventBus;
    #eventNames;

    static EVENTS = {
        LISTEN_VAR_CHANGED: 'listenVarChanged',
        USE_VAR_GET: 'useVarGet',
        LISTEN_VAR_GET_RESPONSE: 'listenVarGetResponse',
        USE_THEME_CHANGED_BROADCAST: 'useThemeChangedBroadcast'
    };

    constructor(eventBus, eventNameConfig) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
        this.#registerListeners();
        log.log('Initializing...');
    }

    start() {
        // After all services are initialized, request the initial theme value.
        this.#eventBus.dispatch(this.#eventNames[ThemeBusService.EVENTS.USE_VAR_GET], { key: VAR_THEME });
    }

    #registerListeners() {
        this.#eventBus.listen(this.#eventNames[ThemeBusService.EVENTS.LISTEN_VAR_CHANGED], (payload) => {
            if (payload.key === VAR_THEME) {
                this.applyTheme(payload.value);
            }
        });

        this.#eventBus.listen(this.#eventNames[ThemeBusService.EVENTS.LISTEN_VAR_GET_RESPONSE], (payload) => {
            if (payload.key !== VAR_THEME) return;
            const theme = payload.value || DEFAULT_THEME;
            this.applyTheme(theme);
        });
    }

    applyTheme(themeName) {
        const finalTheme = ThemeBusService.VALID_THEMES.includes(themeName) ? themeName : DEFAULT_THEME;
        const themeColor = `var(--arefi-color-${finalTheme})`;
        document.documentElement.style.setProperty('--arefi-color-theme', themeColor);
        this.#eventBus.dispatch(this.#eventNames[ThemeBusService.EVENTS.USE_THEME_CHANGED_BROADCAST], { themeName: finalTheme });
        log.log(`Applied theme: ${finalTheme}`);
    }

    getValidThemes() {
        return ThemeBusService.VALID_THEMES;
    }
}

export { ThemeBusService };