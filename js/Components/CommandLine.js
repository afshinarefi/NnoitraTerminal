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
import { Icon } from './Icon.js';
const log = createLogger('CommandLine');

/**
 * @constant {string} TEMPLATE - HTML template for the CommandLine component's shadow DOM.
 */
const TEMPLATE = `
  <div part="footer">
  <arefi-icon part="icon"></arefi-icon>
  <input type="text" autocomplete="off" spellcheck="false" autocapitalize="off" part="prompt">
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
  min-width: 0; /* Prevents overflow in flex container */
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
   * Handles the input event to manually mask characters for secret (password) input.
   * This implementation correctly handles insertions, deletions, and replacements
   * at any position within the input field.
   * @private
   * @param {InputEvent} event - The input event.
   */
  #onInput(event) {
    if (!this.#isSecret) {
      this.#dispatch('input', { realValue: this.refs.prompt.value });
      return;
    }

    const input = this.refs.prompt;
    const oldRealValue = this.#secretValue;
    const newDisplayValue = input.value;
    const newCursorPos = input.selectionStart;

    // The number of characters deleted or replaced.
    const deletedCount = oldRealValue.length - (newDisplayValue.length - (event.data ? event.data.length : 0));

    // The position where the change started.
    const changeStartPos = newCursorPos - (event.data ? event.data.length : 0);

    // Slice the old real value to get the parts before and after the change.
    const before = oldRealValue.slice(0, changeStartPos);
    const after = oldRealValue.slice(changeStartPos + deletedCount);

    // Construct the new real value. event.data is null for deletions.
    const newRealValue = before + (event.data || '') + after;
    this.#secretValue = newRealValue;

    // Update the display to be all masked characters.
    // We do this inside a requestAnimationFrame to avoid potential race
    // conditions with the browser's rendering of the input value,
    // especially on mobile browsers or with IMEs.
    requestAnimationFrame(() => {
      input.value = '●'.repeat(this.#secretValue.length);
      // Restore the cursor position.
      input.setSelectionRange(newCursorPos, newCursorPos);
    });

    // Dispatch the real value for external listeners.
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
      // The input service will be responsible for clearing the input.
    } else if (event.key === 'Tab' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // For special keys that affect the input value, prevent the default browser action
      // and forward the raw event to the InputService for handling.
      event.preventDefault();
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
   * Retrieves the current secret value when in secret mode.
   * @returns {string} The current secret value.
   */
  getSecretValue() {
    return this.#secretValue;
  }

  /**
   * Sets the value of the command prompt input field.
   * @param {string} value - The string to set as the input's value.
   */
  setValue(value) {
    this.refs.prompt.value = value;
  }

  /**
   * Gets the current cursor position within the input field.
   * @returns {number} The cursor position index.
   */
  getCursorPosition() {
    return this.refs.prompt.selectionStart;
  }

  /**
   * Sets the cursor position within the input field.
   * @param {number} position - The position to set the cursor at.
   */
  setCursorPosition(position) {
    this.refs.prompt.setSelectionRange(position, position);
  }
  
  /**
   * Clears the command prompt input field.
   */
  clear() {
    this.refs.prompt.value = '';
    this.#secretValue = '';
  }

  /**
   * Sets the enabled or disabled state of the command prompt.
   * @param {boolean} isEnabled - True to enable, false to disable.
   */
  setEnabled(isEnabled) {
    this.refs.prompt.disabled = !isEnabled;
    if (isEnabled) {
      this.refs.prompt.placeholder = ''; // Clear any temporary message.
      this.setReadyIcon(); // Set icon back to ready state.
      this.focus(); // Set focus back to the prompt.
    } else {
      this.setBusyIcon(); // Set icon to busy state.
      this.refs.prompt.placeholder = 'Running Command ...'; // Provide feedback to the user.
    }
  }

  /**
   * Sets the placeholder text of the input field.
   * Note: This is used for prompts like 'Password:', not for status messages
   * like 'Running Command...'.
   * @param {string} text - The placeholder text.
   */
  setPlaceholder(text) {
    this.refs.prompt.placeholder = text;
  }

  setReadyIcon() {
    if (this.refs.icon) this.refs.icon.ready();
  }

  /**
   * Sets the icon to the busy state.
   */
  setBusyIcon() {
    if (this.refs.icon) this.refs.icon.busy();
  }

  /**
   * Sets the icon to the key state for password prompts.
   */
  setKeyIcon() {
    if (this.refs.icon) this.refs.icon.key();
  }

  /**
   * Sets the icon to display a history index.
   * @param {number} index - The history index to display.
   */
  setHistoryIcon(index) {
    if (this.refs.icon) this.refs.icon.history(index);
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
