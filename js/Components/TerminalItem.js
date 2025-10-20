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
import { BaseComponent } from './BaseComponent.js';
import { createLogger } from '../Managers/LogManager.js';
const log = createLogger('TerminalItem');
import { Icon } from './Icon.js';

/**
 * @constant {string} TEMPLATE - HTML template for the TerminalItem component's shadow DOM.
 */
const TEMPLATE = `
  <div part='header'></div>
  <div part='command-container'>
  <arefi-icon part='icon'></arefi-icon>
  <span part='command'></span>
  </div>
  <div part='output'></div>
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
[part=command-container],
[part=output] {
  display: none;
}

:host(.header-visible) [part=header] {
  display: block;
}

:host(.active) [part=command-container],
:host(.active) [part=output] {
  display: block;
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
  color: var(--arefi-color-text); /* VAR */
}
[part=header] {
  color: var(--arefi-color-text-highlight); /* VAR */
  background-color: var(--arefi-color-highlight); /* VAR */
  padding: 3px 5px;
  border-radius: 3px;
  margin-right: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
}
[part=output] {
  color: var(--arefi-color-output);
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
class TerminalItem extends BaseComponent {
  /** @private {number} #id - The unique ID for this specific TerminalItem instance. */
  #id;

  /**
   * Creates an instance of TerminalItem.
   * Initializes the shadow DOM and applies component-specific styles.
   */
  constructor() {
    // Pass the template and map to the base constructor, including the Icon component.
    super(TEMPLATE, { 'arefi-icon': Icon });

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, terminalItemSpecificStyles];
  }

  /**
   * Returns the output element of this terminal item.
   * This element is where the command's output will be appended.
   * @returns {HTMLElement} The output div element.
   */
  getOutput() {
    return this.refs.output;
  }

  /**
   * Sets the header content and makes it visible.
   * @param {number} id - The unique ID for this item.
   * @param {string} headerText - The pre-formatted header string (PS1).
   */
  setHeader(id, headerText) {
    log.log(`Setting header for ID ${id}`);
    this.#id = id;
    this.id = `term-item-${id}`;
    this.refs.header.textContent = headerText;
    this.classList.add('header-visible');
  }

  /**
   * Sets the command content and makes the command and output areas visible.
   * @param {string} command - The command string to display.
   */
  setContent(command) {
    if (this.#id === undefined) {
      log.error('setContent called before setHeader. ID is not set.');
      return;
    }
    log.log(`Setting command content for ID ${this.#id}:`, { command });
    this.refs.command.textContent = command;
    this.refs.icon.indexed(this.#id);
    this.classList.add('active');
  }
}

// Define the custom element 'arefi-term-item'
customElements.define('arefi-term-item', TerminalItem);

export { TerminalItem };
