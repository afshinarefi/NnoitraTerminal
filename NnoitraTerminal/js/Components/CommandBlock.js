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
import { TerminalSymbol } from './TerminalSymbol.js';

/**
 * @constant {string} TEMPLATE - HTML template for the TerminalItem component's shadow DOM.
 */
const TEMPLATE = `
  <div part='header'></div>
  <div part='command-container'>
  <nnoitra-icon part='icon'></nnoitra-icon>
  <span part='command'></span>
  </div>
  <div part='output'><slot></slot></div>
  `;

/**
 * @constant {string} CSS - CSS styles for the TerminalItem component's shadow DOM.
 */
const CSS = `
:host {
  display: block;
  margin-bottom: 10px; /* Add some space between terminal items */
}

[part=header],
[part=icon],
[part=command-container],
[part=output] {
  display: none;
}

:host(.header-visible) [part=header] {
  display: block;
}

:host(.active) [part=output] {
  display: block;
}

:host(.active) [part=command-container],
:host(.active) [part=icon] {
  display: inline-block;
}

[part=command-container] {
  display: flex;
  align-items: center;
}

[part=command] {
  word-break: break-all;
  white-space: pre-wrap;
  margin-top: 3px;
  margin-bottom: 3px;
  color: var(--nnoitra-color-text); /* VAR */
}
[part=header] {
  color: var(--nnoitra-color-text-highlight); /* VAR */
  background-color: var(--nnoitra-color-highlight); /* VAR */
  padding: 3px 5px;
  border-radius: 3px;
  margin-right: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
}

[part=header]::before {
  content: '\\200b'; /* Zero-width space */
  display: inline-block; /* Ensures it contributes to the line box */
}
[part=output] {
  color: var(--nnoitra-color-output);
  margin-top: 5px;
  margin-bottom: 5px;
}

[part=output] pre {
  white-space: pre-wrap; /* Preserve whitespace but wrap long lines */
  word-wrap: break-word; /* Ensure long words without spaces also break */
  margin: 0; /* Reset default margins on pre for consistency */
}

/* Styles for 'about' command content */
.about-title {
    font-weight: bold;
}

/* Styles for links injected by commands like 'about' */
[part=output] a {
    color: inherit; /* Inherit color from the output part */
    text-decoration: none; /* Remove underline for a cleaner look */
}
`;

// Define component-specific styles
const terminalItemSpecificStyles = new CSSStyleSheet();
terminalItemSpecificStyles.replaceSync(CSS);

/**
 * @class TerminalItem
 * @extends BaseComponent
 * @description Represents a single entry in the terminal output, displaying a command and its corresponding output.
 * Each item includes a timestamp, user/host/path information, an indexed icon, and the command text.
 */
class CommandBlock extends BaseComponent {
  /**
   * Creates an instance of TerminalItem.
   * Initializes the shadow DOM and applies component-specific styles.
   */
  constructor() {
    // Pass the template and map to the base constructor, including the Icon component.
    super(TEMPLATE);

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, terminalItemSpecificStyles];
  }

  static get observedAttributes() {
    return ['item-id', 'header-text', 'command'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'item-id':
        this.id = `term-item-${newValue}`;
        // If the command is already set, update the icon's value.
        if (this.hasAttribute('command')) {
          this.refs.icon.setAttribute('value', newValue);
        }
        break;
      case 'header-text':
        this.refs.header.textContent = newValue;
        this.classList.add('header-visible');
        break;
      case 'command':
        this.refs.command.textContent = newValue;
        const itemId = this.getAttribute('item-id');
        if (itemId) {
          this.refs.icon.setAttribute('type', 'indexed');
          this.refs.icon.setAttribute('value', itemId);
        }
        this.classList.add('active');
        break;
    }
  }
}

// Define the custom element 'nnoitra-term-item'
customElements.define('nnoitra-term-item', CommandBlock);

export { CommandBlock };
