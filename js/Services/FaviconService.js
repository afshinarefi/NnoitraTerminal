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
import { EVENTS } from '../Core/Events.js';

const log = createLogger('FaviconService');

/**
 * @class FaviconService
 * @description Manages the website's favicon. It dynamically generates and updates the
 * favicon in the document head when the application's theme changes.
 *
 * @listens for `theme-changed-broadcast` - To trigger a favicon re-render.
 */
class FaviconService {
    static #SIZES = [16, 32, 64, 128, 180]; // 180 for apple-touch-icon
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
        log.log('Initializing...');
    }

    start() {
        // Render the initial favicon on startup.
        this.#renderFavicon();
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.THEME_CHANGED_BROADCAST, this.#handleThemeChanged.bind(this));
    }

    #handleThemeChanged() {
        log.log('Theme changed, rerendering favicon.');
        this.#renderFavicon();
    }

    /**
     * Draws a rounded square icon and returns it as a data URL.
     * @private
     * @param {object} options - The drawing options.
     * @returns {string} The data URL of the generated icon.
     */
    #drawIcon(options) {
        const { size, bgColor, symbol, symbolColor, fontFamily, borderColor, borderWidth } = options;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const canvasSize = size * dpr;
        const c = document.createElement('canvas');
        c.width = c.height = canvasSize;
        const ctx = c.getContext('2d');
        ctx.scale(dpr, dpr);

        const inset = borderWidth / 2;
        const radius = Math.max(2, size * 0.15);
        ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, radius);
        ctx.fillStyle = bgColor;
        ctx.fill();

        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();

        ctx.font = `bold ${Math.floor(size * 0.8)}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = symbolColor;
        ctx.fillText(symbol, size / 2, size / 2 + (size * 0.05));

        return c.toDataURL('image/png');
    }

    /**
     * Renders and sets the favicon by reading current CSS custom properties.
     * @private
     */
    #renderFavicon() {
        const styles = getComputedStyle(document.documentElement);
        const drawOptions = {
            bgColor: styles.getPropertyValue('--arefi-color-theme').trim() || 'green',
            symbol: '>',
            symbolColor: styles.getPropertyValue('--arefi-color-text-highlight').trim() || '#000',
            fontFamily: styles.getPropertyValue('--arefi-font-family').trim() || 'monospace',
            borderColor: styles.getPropertyValue('--arefi-color-text-highlight').trim() || '#000',
            borderWidth: 1
        };

        // Remove any existing favicon links
        document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']").forEach(el => el.remove());

        FaviconService.#SIZES.forEach(size => {
            const url = this.#drawIcon({ ...drawOptions, size });
            const link = document.createElement('link');
            link.rel = size === 180 ? 'apple-touch-icon' : 'icon';
            link.type = 'image/png';
            link.sizes = `${size}x${size}`;
            link.href = url;
            document.head.appendChild(link);
        });
    }
}

export { FaviconService };