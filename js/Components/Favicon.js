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
 * GNU Affero General Public License for more details. You should have received
 * a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @class ArefiFavicon
 * @description A declarative Web Component to dynamically generate and manage the website's favicon.
 * It is styled via CSS custom properties and controlled via attributes.
 * @example <arefi-favicon color="green" symbol="✓"></arefi-favicon>
 */
class ArefiFavicon extends HTMLElement {
    /**
     * @private
     * @static
     * @readonly
     * @type {number[]}
     */
    static #SIZES = [16, 32, 64, 128, 180]; // Added 180 for apple-touch-icon

    constructor() {
        super();
        // This component has no visible output
        this.style.display = 'none';
    }

    connectedCallback() {
        this.#renderFavicon();
    }

    /**
     * Public method to manually trigger a re-render of the favicon.
     * This is useful if CSS custom properties change after the component is connected.
     */
    rerender() {
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
 
        // Draw background
        // Use the built-in roundRect function for a reliable rounded rectangle path.
        // The path is inset by half the border width to ensure the stroke is within the canvas bounds.
        const inset = borderWidth / 2;
        const radius = Math.max(2, size * 0.15);
        ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, radius);
        ctx.fillStyle = bgColor;
        ctx.fill();
 
        // Draw border
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
 
        // Draw symbol
        ctx.font = `bold ${Math.floor(size * 0.8)}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = symbolColor;
        ctx.fillText(symbol, size / 2, size / 2 + (size * 0.05)); // Slight vertical adjustment

        return c.toDataURL('image/png');
    }

    /**
     * Renders and sets the favicon based on current attributes and CSS properties.
     * @private
     */
    #renderFavicon() {
        const styles = getComputedStyle(this);
        const symbol = styles.getPropertyValue('--favicon-symbol').trim() || '>';

        const drawOptions = {
            bgColor: styles.getPropertyValue('--favicon-bg-color').trim() || 'green',
            symbol: symbol,
            symbolColor: styles.getPropertyValue('--favicon-symbol-color').trim() || '#000',
            fontFamily: styles.getPropertyValue('--arefi-font-family').trim() || 'monospace',
            borderColor: styles.getPropertyValue('--favicon-border-color').trim() || '#000',
            borderWidth: parseFloat(styles.getPropertyValue('--favicon-border-width')) || 1
        };

        // Remove any existing favicon links
        document.querySelectorAll("link[rel~='icon']").forEach(el => el.remove());
        document.querySelectorAll("link[rel='apple-touch-icon']").forEach(el => el.remove());

        ArefiFavicon.#SIZES.forEach(size => {
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

customElements.define('arefi-favicon', ArefiFavicon);

export { ArefiFavicon };