/**
 * Nnoitra Terminal
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
 * Draws a rounded square icon with a stylized "C" symbol and returns it as a data URL.
 * @param {object} options - The drawing options.
 * @param {number} options.size - The dimension of the icon.
 * @param {string} options.bgColor - The background color.
 * @param {string} options.symbolColor - The color of the symbol.
 * @param {number} options.borderWidth - The width of the border.
 * @returns {string} The data URL of the generated icon.
 */
export function drawLogoIcon(options) {
    const { size, bgColor, symbolColor } = options;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');

    const radius = Math.max(2, size * 0.15);
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();

    const outerCircleRadius = size * 0.3;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, outerCircleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = symbolColor;
    ctx.fill();

    const innerCircleRadius = size * 0.22;
    ctx.beginPath();
    ctx.arc(size * 0.47, size * 0.39, innerCircleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = bgColor;
    ctx.fill();

    return c.toDataURL('image/png');
}

/**
 * Draws an hourglass icon and returns it as a data URL.
 * @param {object} options - The drawing options.
 * @param {number} options.size - The dimension of the icon.
 * @param {string} options.bgColor - The background color.
 * @param {string} options.symbolColor - The color of the symbol.
 * @returns {string} The data URL of the generated icon.
 */
export function drawHourGlassIcon(options) {
    const { size, bgColor, symbolColor } = options;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');

    // Draw the background rounded rectangle
    const radius = Math.max(2, size * 0.15);
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Draw the hourglass shape
    const padding = size * 0.2;
    const top = padding;
    const bottom = size - padding;
    const left = padding;
    const right = size - padding;

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(right, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.closePath();
    ctx.fillStyle = symbolColor;
    ctx.fill();

    return c.toDataURL('image/png');
}

/**
 * Draws a key icon and returns it as a data URL.
 * @param {object} options - The drawing options.
 * @param {number} options.size - The dimension of the icon.
 * @param {string} options.bgColor - The background color.
 * @param {string} options.symbolColor - The color of the symbol.
 * @returns {string} The data URL of the generated icon.
 */
export function drawKeyIcon(options) {
    const { size, bgColor, symbolColor } = options;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');

    // Draw the background rounded rectangle
    const radius = Math.max(2, size * 0.15);
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();

    // --- Draw the key symbol ---
    ctx.fillStyle = symbolColor;
    ctx.strokeStyle = symbolColor;
    const lineWidth = Math.max(1, size * 0.08);
    ctx.lineWidth = lineWidth;

    // Key head (circle)
    const headRadius = size * 0.15;
    ctx.beginPath();
    ctx.arc(size * 0.35, size * 0.35, headRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Key body and tooth
    ctx.beginPath();
    ctx.moveTo(size * 0.45, size * 0.45); // Start of body
    ctx.lineTo(size * 0.7, size * 0.7);   // End of body
    ctx.moveTo(size * 0.6, size * 0.7);   // Tooth start
    ctx.lineTo(size * 0.7, size * 0.7);   // Tooth end
    ctx.stroke();

    return c.toDataURL('image/png');
}