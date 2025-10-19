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
import { Icon } from './Icon.js';
const log = createLogger('CommandLine');

/**
 * @constant {string} TEMPLATE - HTML template for the CommandLine component's shadow DOM.
 */
const TEMPLATE = `
  <div part="footer">
  <arefi-icon part="icon"></arefi-icon>
  <input type="text" autocomplete="off" spellcheck="false" autocapitalize="off" autofocus="true" part="prompt">
  </div>
  `;

/**
 * @constant {string} CSS - CSS styles for the CommandLine component's shadow DOM.
 */
const CSS = `
[part=footer] {
  padding: 5px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--arefi-color-highlight); /* VAR */
  background-color: var(--arefi-color-background); /* VAR */
  box-sizing: border-box;
  z-index: 100;
  font-size: var(--arefi-font-size);
}
[part=prompt] {
  background: none;
  border: none;
  outline: none;
  color: var(--arefi-color-text); /* VAR */
  flex-grow: 1;
  font-family: var(--arefi-font-family);
  font-size: var(--arefi-font-size);
}
[part=prompt]::placeholder {
  color: var(--arefi-color-placeholder);
  font-family: var(--arefi-font-family);
  font-size: var(--arefi-font-size);
  opacity: 1; /* Firefox has a lower default opacity for placeholders */
}
`;
// Define component-specific styles
const commandLineSpecificStyles = new CSSStyleSheet();
commandLineSpecificStyles.replaceSync(CSS);

/**
 * @class CommandLine
 * @extends BaseComponent
 * @description Represents the command input line in the terminal. It handles user input,
 * keyboard navigation for command history, and dispatches events for command submission and autocomplete.
 */
class CommandLine extends BaseComponent {
  /** @private {boolean} #isSecret - Flag indicating if the read mode is for secret (password) input. */
  #isSecret = false;
  /** @private {string} #secretValue - Stores the actual value when in secret input mode. */
  #secretValue = '';

  /**
   * Creates an instance of CommandLine.
   * Initializes the shadow DOM and applies component-specific styles.
   */
  constructor() {
    // Pass the template and map to the base constructor, including the Icon component.
    super(TEMPLATE, { 'arefi-icon': Icon });

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, commandLineSpecificStyles];

    // Add touch event listeners for swipe-to-autocomplete gesture.
    this.refs.footer.addEventListener('touchstart', (e) => this.#dispatch('touchstart', e.touches[0]), { passive: true });
    this.refs.footer.addEventListener('touchend', (e) => this.#dispatch('touchend', e.changedTouches[0]), { passive: true });
    // Listen for input to handle manual password masking.
    this.refs.prompt.addEventListener('input', this.#onInput.bind(this));
    // Centralize keydown handling
    this.refs.prompt.addEventListener('keydown', this.#onKeyDown.bind(this));
  }

  /**
   * Handles the input event to manually mask characters for secret input.
   * @private
   * @param {InputEvent} event - The input event.
   */
  #onInput(event) {
      if (!this.#isSecret) {
          this.#dispatch('input', { realValue: this.refs.prompt.value });
          return; // Do nothing if not in secret mode.
      }

      const input = this.refs.prompt;
      const realValue = this.#secretValue;
      const displayValue = input.value;
      const selectionStart = input.selectionStart;

      // Find the difference between the real value and what's displayed
      let diff = '';
      if (displayValue.length > realValue.length) {
          // Character(s) were added
          const start = selectionStart - (displayValue.length - realValue.length);
          diff = displayValue.substring(start, selectionStart);
      } else if (displayValue.length < realValue.length) {
          // Character(s) were deleted (e.g., backspace)
          // This is a simplification; robust handling is complex.
          // We assume deletion happens at the end for this logic.
      }

      // Reconstruct the real value based on the change
      const before = realValue.slice(0, selectionStart - diff.length);
      const after = realValue.slice(selectionStart - diff.length + (realValue.length - displayValue.length) + diff.length);
      this.#secretValue = before + diff + after;

      // Update the display to be all asterisks again, preserving cursor position
      const newDisplay = '●'.repeat(this.#secretValue.length);
      input.value = newDisplay;
      // Restore the cursor position
      input.setSelectionRange(selectionStart, selectionStart);

      // Dispatch the real value to the presenter
      this.#dispatch('input', { realValue: this.#secretValue });
  }

  /**
   * Handles keyboard events and dispatches them for the presenter to handle.
   * @private
   * @param {KeyboardEvent} event - The keyboard event.
   */
  #onKeyDown(event) {
    if (this.refs.prompt.disabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.#dispatch('command-submit', this.refs.prompt.value);
      this.clear();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.#dispatch('autocomplete-request', this.refs.prompt.value);
    } else {
      // For other keys like ArrowUp/Down, just forward the event
      this.#dispatch('keydown', event);
    }
  }

  /**
   * Helper to dispatch custom events.
   * @private
   * @param {string} name - The event name.
   * @param {*} detail - The event payload.
   */
  #dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  /**
   * Sets focus on the command prompt input field.
   */
  focus() {
    this.refs.prompt.focus();
  }

  /**
   * Retrieves the current command string from the input field.
   * @returns {string} The current value of the input.
   */
  getValue() {
    return this.refs.prompt.value;
  }

  /**
   * Sets the value of the command prompt input field.
   * @param {string} value - The string to set as the input's value.
   */
  setValue(value) {
    this.refs.prompt.value = value;
  }
  
  /**
   * Clears the command prompt input field.
   */
  clear() {
    this.refs.prompt.value = '';
    this.#secretValue = '';
  }

  /**
   * Disables the command prompt.
   * @param {boolean} disabled - True to disable, false to enable.
   */
  setDisabled(disabled) {
    this.refs.prompt.disabled = disabled;
    this.refs.icon.busy(); // Set icon to busy state.
    this.refs.prompt.placeholder = 'Running Command ...'; // Provide feedback to the user.
  }

  /**
   * Enables the command prompt, clearing any temporary messages and setting focus.
   */
  enable() {
    this.refs.prompt.placeholder = ''; // Clear the temporary message.
    this.refs.icon.ready(); // Set icon back to ready state.
    this.refs.prompt.disabled = false; // Enable the input field.
    this.focus(); // Set focus back to the prompt.
  }

  /**
   * Sets the placeholder text of the input field.
   * @param {string} text - The placeholder text.
   */
  setPlaceholder(text) {
    this.refs.prompt.placeholder = text;
  }

  /**
   * Sets the icon for the prompt.
   * @param {'ready'|'busy'|'key'|'history'} type - The type of icon.
   * @param {number} [value] - Optional value for history icon.
   */
  setIcon(type, value) {
    this.refs.icon[type](value);
  }

  /**
   * Configures the component for secret (password) input mode.
   * @param {boolean} isSecret - True to enable secret mode.
   */
  setSecret(isSecret) {
    this.#isSecret = isSecret;
  }
}

// Define the custom element 'arefi-cmd'
customElements.define('arefi-cmd', CommandLine);

export { CommandLine };
