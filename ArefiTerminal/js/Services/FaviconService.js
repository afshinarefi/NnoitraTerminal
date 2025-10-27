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
import { BaseService } from '../Core/BaseService.js';

/**
 * @class FaviconService
 * @description Manages the website's favicon. It dynamically generates and updates the
 * favicon in the document head when the application's theme changes.
 *
 * @listens for `theme-changed-broadcast` - To trigger a favicon re-render.
 */
class FaviconService extends BaseService{
    static #SIZES = [16, 32, 64, 128, 180]; // 180 for apple-touch-icon
    #eventBus;
    #view = null; // The Terminal component instance

    constructor(eventBus) {
        super(eventBus);
        this.#eventBus = eventBus;
        this.#registerListeners();
        this.log.log('Initializing...');
    }

    /**
     * Connects this service to its view component.
     * @param {object} view - The instance of the Terminal component.
     */
    setView(view) {
        this.#view = view;
        this.log.log('View connected.');
    }

    start() {
        // The theme service will apply the initial theme, which will trigger the broadcast
        // that this service listens to. No need to call renderFavicon() directly.
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.THEME_CHANGED_BROADCAST, this.#renderFavicon.bind(this));
    }

    /**
     * Draws a rounded square icon with a path-based symbol and returns it as a data URL.
     * @private
     * @param {object} options - The drawing options.
     * @returns {string} The data URL of the generated icon.
     */
    #drawIcon(options) {
        const { size, bgColor, symbolColor, borderColor, borderWidth } = options;
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const canvasSize = size * dpr;
        const c = document.createElement('canvas');
        c.width = c.height = canvasSize;
        const ctx = c.getContext('2d');
        ctx.scale(dpr, dpr);

        // Draw rounded background
        const inset = borderWidth / 2;
        const radius = Math.max(2, size * 0.15);
        ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, radius);
        ctx.fillStyle = bgColor;
        ctx.fill();

        // Draw border
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();

        // Draw the '>' symbol with lines
        const symbolWidth = size * 0.4;
        const symbolHeight = size * 0.3;
        const symbolWeight = Math.max(1, size * 0.12);

        ctx.beginPath();
        ctx.moveTo((size - symbolWidth) / 2, (size - symbolHeight) / 2);
        ctx.lineTo((size + symbolWidth) / 2, size / 2);
        ctx.lineTo((size - symbolWidth) / 2, (size + symbolHeight) / 2);

        ctx.strokeStyle = symbolColor;
        ctx.lineWidth = symbolWeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        return c.toDataURL('image/png');
    }

    /**
     * Renders and sets the favicon by reading current CSS custom properties.
     * @private
     */
    #renderFavicon() {
        if (!this.#view) {
            this.log.warn('Cannot render favicon, view is not connected.');
            return;
        }

        const styles = getComputedStyle(this.#view);
        const drawOptions = {
            bgColor: styles.getPropertyValue('--arefi-color-theme').trim() || 'green',
            symbolColor: styles.getPropertyValue('--arefi-color-text-highlight').trim() || '#000',
            borderColor: styles.getPropertyValue('--arefi-color-text-highlight').trim() || '#000',
            borderWidth: 2
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