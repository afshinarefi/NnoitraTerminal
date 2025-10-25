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
import { TerminalItem } from './TerminalItem.js';
import { CommandLine } from './CommandLine.js';
import { HintBox } from './HintBox.js';
import { createLogger } from '../Managers/LogManager.js';

const log = createLogger('Terminal');

/**
 * @constant {string} TEMPLATE - HTML template for the Terminal component's shadow DOM.
 */
const TEMPLATE = `
  <div part="terminal">
  <div part="welcome-output"></div>
  <div part="output"></div>
  <arefi-hint-box part="hint"></arefi-hint-box>
  </div>
  <arefi-cmd part="prompt"></arefi-cmd>
  `;

/**
 * @constant {string} CSS - CSS styles for the Terminal component's shadow DOM.
 */
const CSS = `
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
[part=terminal] {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  height: 100%;
  width: 100%;
}
[part=prompt] {
  flex-shrink: 0;
}

`;

// Define component-specific styles (now much smaller)
const terminalSpecificStyles = new CSSStyleSheet();
terminalSpecificStyles.replaceSync(CSS);

/**
 * @class Terminal
 * @extends BaseComponent
 * @description Represents the main terminal component, handling user input, command execution, and output display.
 * It integrates various services like history, command execution, environment, and autocomplete.
 */
class Terminal extends BaseComponent {

  /** @private {ResizeObserver} #resizeObserver - Observes changes to the terminal's size to adjust scrolling. */
  #resizeObserver;
  /** @private {MutationObserver} #mutationObserver - Observes changes in the terminal output to automatically scroll. */
  #mutationObserver;

  /**
   * Creates an instance of Terminal.
   * Initializes the shadow DOM, applies styles, sets up services, and attaches event listeners.
   */
  constructor() {
    // Pass the template and map to the base constructor
    super(TEMPLATE, { 'arefi-cmd': CommandLine, 'arefi-hint-box': HintBox });

    // Apply component-specific styles
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, terminalSpecificStyles];

    this.#attachEventListeners();
  }

  // --- Public Getters for Views ---

  get promptView() {
    return this.refs.prompt;
  }

  get hintView() {
    return this.refs.hint;
  }

  /**
   * Attaches all necessary event listeners for the terminal component.
   * @private
   */
  #attachEventListeners() {

    // Set tab index for focus management and add keydown listener for terminal-wide shortcuts
    this.tabIndex = 1;

    // Add focus listener to ensure prompt is always focused when terminal is focused
    this.addEventListener('focus', this.setFocus);
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Sets up the ResizeObserver and initial focus.
   */
  connectedCallback() {
    // Initialize ResizeObserver to scroll to bottom when terminal size changes
    this.#resizeObserver = new ResizeObserver(() => {
      this.scrollToBottom();
    });
    this.#resizeObserver.observe(this.refs.terminal);

    // Observe mutations in the terminal output to automatically scroll to the bottom
    this.#mutationObserver = new MutationObserver(() => this.scrollToBottom());
    this.#mutationObserver.observe(this.refs.terminal, { childList: true, subtree: true });

    // Set initial focus to the command prompt
    this.setFocus();
  }

  /**
   * Lifecycle callback when the element is removed from the DOM.
   * Cleans up event listeners and observers to prevent memory leaks.
   */
  disconnectedCallback() {
    this.removeEventListener('focus', this.setFocus);
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
    }
  }

  /**
   * Appends a child element (like a TerminalItem) to the main output area.
   * @param {HTMLElement} child - The element to append.
   */
  appendToOutput(child) {
    this.refs.output.appendChild(child);
  }

  /**
   * Clears all output from the terminal.
   */
  clearOutput() {
    if (this.refs.output) {
      this.refs.output.innerHTML = '';
    }
  }

  /**
   * Sets focus to the command prompt input field.
   */
  setFocus() {
    this.promptView.focus();
  }

  /**
   * Scrolls the terminal output to the bottom.
   * Uses requestAnimationFrame for smoother scrolling.
   */
  scrollToBottom() {
    requestAnimationFrame(() => {
      this.refs.terminal.scrollTop = this.refs.terminal.scrollHeight;
    });
  }
}

// Define the custom element 'arefi-terminal'
customElements.define('arefi-terminal', Terminal);

export { Terminal };
