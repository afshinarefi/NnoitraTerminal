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
import { BaseComponent } from '../Core/BaseComponent.js';
import { drawIcon } from '../Utils/IconUtil.js';

/**
 * @constant {string} TEMPLATE - HTML template for the Icon component's shadow DOM.
 */
const TEMPLATE = `<span part="symbol-container"></span>`;

/**
 * @constant {string} CSS - CSS styles for the Icon component's shadow DOM.
 */
const CSS = `
[part=symbol] {
  font-family: var(--nnoitra-font-family);
  font-size: inherit;
  color: var(--nnoitra-color-text-highlight); /* VAR */
  background-color: var(--nnoitra-color-highlight); /* VAR */
  display: inline-flex;
  justify-content: center; /* Center horizontally */
  align-items: center;     /* Center vertically */
  border-radius: 3px;
  margin: 3px 3px 3px 0px;
  min-width: 1.5em;
  height: 1.5em;
  padding: 0.25em;
}

[part=symbol-container] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 3px;
}
`;

// Define component-specific styles
const iconSpecificStyles = new CSSStyleSheet();
iconSpecificStyles.replaceSync(CSS);

/**
 * @class Icon
 * @extends BaseComponent
 * @description A custom element that displays various symbolic icons within the terminal,
 * indicating different states like ready, busy, or history index.
 */
class TerminalSymbol extends BaseComponent {
  /**
   * @private
   * @type {Object.<string, string>}
   * @description A map of icon names to their corresponding string representations.
   */
  #icons = {
    ready: '>', // The default prompt icon
    busy: '⧗',  // The "spinner" for when a command is running
    key: '⚷'   // The key symbol for password prompts
  };

  /** @private @const {number[]} #ICON_SIZES - Sizes for generating image sets. */
  static #ICON_SIZES = [16, 32, 48, 64];

  /**
   * Creates an instance of Icon.
   * Initializes the shadow DOM and applies component-specific styles.
   */
  constructor() {
    super(TEMPLATE);
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, iconSpecificStyles];
    // Set a default state if no type is provided on creation.
    if (!this.hasAttribute('type')) {
      this.setAttribute('type', 'ready');
    }
  }

  static get observedAttributes() {
    return ['type', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.#render();
  }

  #render() {
    const type = this.getAttribute('type') || 'ready';
    const value = this.getAttribute('value');
    const container = this.refs['symbol-container'];
    container.innerHTML = ''; // Clear previous content

    switch (type) {
      case 'busy':
      case 'key':
        const textSymbol = document.createElement('span');
        textSymbol.part = 'symbol';
        textSymbol.textContent = this.#icons[type];
        container.appendChild(textSymbol);
        break;
      case 'indexed':
        const indexedSymbol = document.createElement('span');
        indexedSymbol.part = 'symbol';
        indexedSymbol.textContent = `${value || ''}:>`;
        container.appendChild(indexedSymbol);
        break;
      case 'text':
        const customTextSymbol = document.createElement('span');
        customTextSymbol.part = 'symbol';
        customTextSymbol.textContent = value || '';
        container.appendChild(customTextSymbol);
        break;
      case 'ready':
      default:
        const styles = getComputedStyle(this);
        const drawOptions = {
            bgColor: styles.getPropertyValue('--nnoitra-color-highlight').trim(),
            symbolColor: styles.getPropertyValue('--nnoitra-color-text-highlight').trim(),
            borderWidth: 0 // No border for the inline icon
        };
        const img = document.createElement('img');
        img.part = 'symbol'; // Revert to using the standard symbol part
        img.style.padding = '0'; // Remove padding for the image to fill its container
        img.style.borderRadius = '3px'; // Apply the border-radius directly
        
        img.src = drawIcon({ ...drawOptions, size: 32 }); // Default src
        img.srcset = TerminalSymbol.#ICON_SIZES
            .map(size => `${drawIcon({ ...drawOptions, size })} ${size}w`)
            .join(', ');
        container.appendChild(img);
        break;
    }
  }
}

// Define the custom element 'nnoitra-icon'
customElements.define('nnoitra-icon', TerminalSymbol);

export { TerminalSymbol };
