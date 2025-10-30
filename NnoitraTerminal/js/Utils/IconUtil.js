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
export function drawIcon(options) {
    const { size, bgColor, symbolColor, borderWidth } = options;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');

    const inset = borderWidth / 2;
    const radius = Math.max(2, size * 0.15);
    ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, radius);
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
