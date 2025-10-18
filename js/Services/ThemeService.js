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

const log = createLogger('ThemeService');

/**
 * @class ThemeService
 * @description Manages the terminal's color theme.
 */
class ThemeService {
    static VALID_THEMES = ['green', 'yellow', 'orange', 'red'];
    #environmentService;

    constructor(services) {
        this.#environmentService = services.environment;
        log.log('Initializing...');
    }

    /**
     * Applies the color theme based on the THEME environment variable.
     * If the theme is invalid, it defaults to 'green'.
     */
    applyTheme() {
        let themeName = this.#environmentService.getVariable('THEME');
        if (!ThemeService.VALID_THEMES.includes(themeName)) {
            themeName = 'green';
        }
        const themeColor = `var(--arefi-color-${themeName})`;
        document.documentElement.style.setProperty('--arefi-color-theme', themeColor);
        log.log(`Applied theme: ${themeName}`);
    }

    getValidThemes() {
        return ThemeService.VALID_THEMES;
    }
}

export { ThemeService };