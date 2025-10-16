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

/**
 * @class Favicon
 * @description A utility class to dynamically generate and set the website's favicon.
 */
class Favicon {
    /**
     * @private
     * @static
     * @type {Object.<string, string> | null}
     */
    static #COLORS = null;

    /**
     * Lazily initializes and retrieves the color palette from CSS custom properties.
     * @private
     * @static
     * @returns {Object.<string, string>} The color palette.
     */
    static #getColors() {
        if (!this.#COLORS) {
            const styles = getComputedStyle(document.documentElement);
            this.#COLORS = {
                green: styles.getPropertyValue('--arefi-color-green').trim(),
                yellow: styles.getPropertyValue('--arefi-color-yellow').trim(),
                orange: styles.getPropertyValue('--arefi-color-orange').trim(),
                red: styles.getPropertyValue('--arefi-color-red').trim(),
            };
        }
        return this.#COLORS;
    }


    /**
     * @private
     * @static
     * @type {Map<string, HTMLLinkElement[]>}
     */
    static #cache = new Map();

    /**
     * @private
     * @static
     * @readonly
     * @type {number[]}
     */
    static #SIZES = [16, 32, 64, 128];

    /**
     * Draws a rounded square icon with a chevron and returns it as a data URL.
     * @private
     * @param {object} options - The drawing options.
     * @returns {string} The data URL of the generated icon.
     */
    static #drawIcon({
        size = 32,
        bgColor = getComputedStyle(document.documentElement).getPropertyValue('--arefi-color-highlight').trim(),
        borderColor = getComputedStyle(document.documentElement).getPropertyValue('--arefi-color-text-highlight').trim(),
        borderWidthRatio = 32,
        chevron = '>',
        chevronColor = getComputedStyle(document.documentElement).getPropertyValue('--arefi-color-text-highlight').trim(),
        fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--arefi-font-family').trim()
    } = {}) {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const canvasSize = size * dpr;
        const c = document.createElement('canvas');
        c.width = c.height = canvasSize;
        const ctx = c.getContext('2d');

        ctx.scale(dpr, dpr);

        // Draw background
        const halfBorder = (size / borderWidthRatio) / 2;
        const radius = Math.max(2, size * 0.12);
        ctx.beginPath();
        ctx.moveTo(halfBorder + radius, halfBorder);
        ctx.arcTo(size - halfBorder, halfBorder, size - halfBorder, size - halfBorder, radius);
        ctx.arcTo(size - halfBorder, size - halfBorder, halfBorder, size - halfBorder, radius);
        ctx.arcTo(halfBorder, size - halfBorder, halfBorder, halfBorder, radius);
        ctx.arcTo(halfBorder, halfBorder, size - halfBorder, halfBorder, radius);
        ctx.closePath();
        ctx.fillStyle = bgColor;
        ctx.fill();

        // Draw border
        ctx.lineWidth = size / borderWidthRatio;
        ctx.strokeStyle = borderColor;
        ctx.stroke();

        // Draw chevron
        ctx.font = `bold ${Math.floor(size * 0.85)}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = chevronColor;
        ctx.fillText(chevron, size / 2, size / 2 + 2);

        return c.toDataURL('image/png');
    }

    /**
     * Sets the website's favicon to the specified color.
     * @param {('green'|'yellow'|'orange'|'red')} colorName - The name of the color to use.
     */
    static set(colorName = 'green') {
        // Always remove any existing favicon links from the document head.
        document.querySelectorAll("link[rel~='icon']").forEach(el => el.remove());

        // If the requested color is already in the cache, use the cached links.
        if (this.#cache.has(colorName)) {
            const cachedLinks = this.#cache.get(colorName);
            cachedLinks.forEach(link => document.head.appendChild(link.cloneNode(true)));
            return;
        }

        // If not cached, generate the new favicon links.
        const colors = this.#getColors();
        const bgColor = colors[colorName] || colors.green;
        const newLinks = [];

        this.#SIZES.forEach(size => {
            const url = this.#drawIcon({ size, bgColor });
            const link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            link.sizes = `${size}x${size}`;
            link.href = url;
            document.head.appendChild(link);
            newLinks.push(link);
        });

        // Store the newly generated links in the cache for future use.
        this.#cache.set(colorName, newLinks);
    }
}

export { Favicon };