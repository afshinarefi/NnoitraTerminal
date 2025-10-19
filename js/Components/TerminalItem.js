import { VAR_CATEGORIES } from '../Services/EnvironmentService.js';
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
import { ArefiBaseComponent } from './BaseComponent.js';
import { createLogger } from '../Services/LogService.js';
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
[part=command-container],
[part=output] {
  display: none;
}

:host(.active) [part=command-container],
:host(.active) [part=output] {
  display: block;
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
 * @extends ArefiBaseComponent
 * @description Represents a single entry in the terminal output, displaying a command and its corresponding output.
 * Each item includes a timestamp, user/host/path information, an indexed icon, and the command text.
 */
class TerminalItem extends ArefiBaseComponent {
  /** @private {number} #nextId - A static counter to generate unique IDs for each TerminalItem instance. */
  static #nextId = 1;
  /** @private {number} #id - The unique ID for this specific TerminalItem instance. */
  #id;
  /** @private {Date} #timestamp - The timestamp when the item was created. */
  #timestamp;
  /** @private {string} #DEFAULT_PS1 - The default prompt format. */
  static #DEFAULT_PS1 = '[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}';


  /**
   * Resets the static ID counter back to 1.
   */
  static resetIdCounter() {
    TerminalItem.#nextId = 1;
  }

  /**
   * Creates an instance of TerminalItem.
   * Initializes the shadow DOM, applies component-specific styles, and assigns a unique ID.
   */
  constructor() {
    // Pass the template and map to the base constructor, including the Icon component.
    super(TEMPLATE, { 'arefi-icon': Icon });

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, terminalItemSpecificStyles];

    // Assign a unique ID to this terminal item and set its `id` attribute.
    this.#id = TerminalItem.#nextId++;
    this.id = `term-item-${this.#id}`;
    this.#timestamp = new Date(); // Store the creation timestamp.
    log.log(`Created item with ID: ${this.#id}`);
  }

  /**
   * Sets the header information for the terminal item.
   * @private
   * @param {EnvironmentService} environmentService - The environment service to get variables from.
   */
  #setHeader(environmentService) {
    const format = environmentService.getVariable('PS1');

    const replacements = {
      user: environmentService.getVariable('USER'),
      host: environmentService.getVariable('HOST'),
      path: environmentService.getVariable('PWD'),
      year: this.#timestamp.getFullYear(),
      month: String(this.#timestamp.getMonth() + 1).padStart(2, '0'),
      day: String(this.#timestamp.getDate()).padStart(2, '0'),
      hour: String(this.#timestamp.getHours()).padStart(2, '0'),
      minute: String(this.#timestamp.getMinutes()).padStart(2, '0'),
      second: String(this.#timestamp.getSeconds()).padStart(2, '0')
    };

    // Replace all {key} placeholders with their corresponding values.
    const headerText = format.replace(/\{(\w+)\}/g, (match, key) => {
      return replacements[key] !== undefined ? replacements[key] : match;
    });

    this.refs.header.textContent = headerText;
  }

  /**
   * Sets the command text displayed in the terminal item.
   * @param {string} text - The command string to display.
   */
  setCommand(text) {
    this.refs.command.textContent = text;
  }

  /**
   * Sets the icon for the terminal item, typically displaying its unique ID.
   * @private
   */
  #setIcon() {
    this.refs.icon.indexed(this.#id);
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
   * Sets the full content of the terminal item.
   * @param {EnvironmentService} environmentService - The environment service for context.
   * @param {string} command - The command string to display.
   */
  setContent(environmentService, command) {
    log.log(`Setting content for ID ${this.#id}:`, { command });
    this.setCommand(command);
    this.#setHeader(environmentService);
    this.#setIcon();
  }
}

// Define the custom element 'arefi-term-item'
customElements.define('arefi-term-item', TerminalItem);

export { TerminalItem };
