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
import { drawIcon } from '../Utils/IconUtil.js';

/**
 * @class FaviconService
 * @description Manages the website's favicon. It dynamically generates and updates the
 * favicon in the document head when the application's theme changes.
 *
 * @listens for `theme-changed-broadcast` - To trigger a favicon re-render.
 */
class FaviconService extends BaseService{
    static #SIZES = [16, 32, 64, 128, 180]; // 180 for apple-touch-icon
    #view = null; // The Terminal component instance

    constructor(eventBus) {
        super(eventBus);
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

    get eventHandlers() {
        return {
            [EVENTS.THEME_CHANGED_BROADCAST]: this.#renderFavicon.bind(this)
        };
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
            bgColor: styles.getPropertyValue('--nnoitra-color-theme').trim() || 'green',
            symbolColor: styles.getPropertyValue('--nnoitra-color-text-highlight').trim() || '#000',
            borderColor: styles.getPropertyValue('--nnoitra-color-text-highlight').trim() || '#000',
            borderWidth: 1
        };

        // Remove any existing favicon links
        document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']").forEach(el => el.remove());

        FaviconService.#SIZES.forEach(size => {
            const url = drawIcon({ ...drawOptions, size });
            this.log.log(url);
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