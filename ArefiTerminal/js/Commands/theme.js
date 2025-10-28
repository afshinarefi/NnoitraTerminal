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

const log = createLogger('theme');

/**
 * @class Theme
 * @description Implements the 'theme' command to change the terminal's color theme.
 */
class Theme {
    static DESCRIPTION = 'Set the terminal color theme.';

    #setTheme;
    #getValidThemes;
    #getRemoteVariable;

    constructor(services) {
        // The environment service is used for getting/setting THEME variable.
        this.#setTheme = services.setTheme;
        this.#getRemoteVariable = services.getRemoteVariable;
        // The theme service is used for getting valid themes.
        this.#getValidThemes = services.getValidThemes;
        log.log('Initializing...');
    }

    static man() {
        return `NAME\n       theme - Set the terminal color theme.\n\nSYNOPSIS\n       theme [color]\n\nDESCRIPTION\n       Changes the terminal's color scheme. The selected theme is saved to your user profile.\n\n       Available colors: green, yellow, orange, red\n\nEXAMPLES\n       $ theme\n       (Displays the current theme.)\n\n       $ theme yellow\n       (Sets the theme to yellow.)`;
    }

    async autocompleteArgs(currentArgs) {
        if (currentArgs.length > 1) {
            return [];
        }
        const input = currentArgs[0] || '';
        return (await this.#getValidThemes()).filter(name => name.startsWith(input));
    }

    async execute(args) {
        const output = document.createElement('div');
        const themeName = args[1];
        const validThemes = await this.#getValidThemes();

        if (!themeName) {
            // Get the current theme variable from the correct category.
            const { value: currentTheme } = await this.#getRemoteVariable('THEME');
            output.textContent = `Current theme: ${currentTheme}\nAvailable themes: ${validThemes.join(', ')}`;
            return output;
        }

        if (validThemes.includes(themeName)) {
            // Set the environment variable. The Terminal component will listen for this change.
            this.#setTheme(themeName);
            output.textContent = `Theme set to '${themeName}'.`;
            log.log(`Theme set to: ${themeName}`);
        } else {
            output.textContent = `Error: Invalid theme '${themeName}'.\nAvailable themes: ${validThemes.join(', ')}`;
            log.warn(`Invalid theme name provided: ${themeName}`);
        }

        return output;
    }
}

export { Theme };