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
import { BaseComponent } from '../Core/BaseComponent.js';
import { createLogger } from '../Managers/LogManager.js';
const log = createLogger('Icon');

/**
 * @constant {string} TEMPLATE - HTML template for the Icon component's shadow DOM.
 */
const TEMPLATE = `<span part="symbol"></span>`;

/**
 * @constant {string} CSS - CSS styles for the Icon component's shadow DOM.
 */
const CSS = `
[part=symbol] {
  font-family: var(--arefi-font-family);
  font-size: var(--arefi-font-size);
  color: var(--arefi-color-text-highlight); /* VAR */
  background-color: var(--arefi-color-highlight); /* VAR */
  display: inline-flex;
  justify-content: center; /* Center horizontally */
  align-items: center;     /* Center vertically */
  border-radius: 3px;
  margin: 3px 3px 3px 0px;
  min-width: 1.5em;
  height: 1.5em;
  padding: 0.25em;
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
    let symbol = '';

    switch (type) {
      case 'ready':
      case 'busy':
      case 'key':
        symbol = this.#icons[type];
        break;
      case 'indexed':
        symbol = `${value || ''}:>`;
        break;
      case 'text':
        symbol = value || '';
        break;
    }
    this.refs.symbol.innerHTML = symbol;
  }
}

// Define the custom element 'arefi-icon'
customElements.define('arefi-icon', TerminalSymbol);

export { TerminalSymbol };
