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
import { TerminalSymbol } from './TerminalSymbol.js';

/**
 * @constant {string} TEMPLATE - HTML template for the TerminalPrompt component's shadow DOM.
 */
const TEMPLATE = `
  <div part="footer">
  <nnoitra-icon part="icon"></nnoitra-icon>
  <input type="text" autocomplete="off" spellcheck="false" autocapitalize="off" part="prompt">
  </div>
  `;

/**
 * @constant {string} CSS - CSS styles for the TerminalPrompt component's shadow DOM.
 */
const CSS = `
[part=footer] {
  margin: 0;
  padding: 3px;
  display: flex;
  align-items: stretch; /* Change to stretch */
  border-top: 1px solid var(--nnoitra-color-highlight); /* VAR */
  background-color: var(--nnoitra-color-background); /* VAR */
  box-sizing: border-box;
  z-index: 100;
  font-size: var(--nnoitra-font-size);
  height: 2.2em;
}
[part=prompt] {
  background: none;
  border: none;
  outline: none;
  padding: 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin: 0;
  flex-grow: 1;
  color: var(--nnoitra-color-text); /* VAR */
  min-width: 0; /* Prevents overflow in flex container */
  flex-grow: 1;
  font-family: var(--nnoitra-font-family);
  font-size: var(--nnoitra-font-size);
  width: 100%;
}
[part=prompt]::placeholder {
  color: var(--nnoitra-color-placeholder);
  font-family: var(--nnoitra-font-family);
  font-size: var(--nnoitra-font-size);
  opacity: 1; /* Firefox has a lower default opacity for placeholders */
  width: 100%;
}

[part=icon] {
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  padding: 0;
}
`;
// Define component-specific styles
const terminalPromptSpecificStyles = new CSSStyleSheet();
terminalPromptSpecificStyles.replaceSync(CSS);

/**
 * @class TerminalPrompt
 * @extends BaseComponent
 * @description A fully encapsulated, declarative Web Component for terminal input.
 *
 * @features
 * - **Declarative API**: Controlled via HTML attributes like `disabled`, `secret`, `placeholder`, and `icon-text`.
 * - **Secret Mode**: Automatically masks input for passwords when the `secret` attribute is present.
 * - **Custom Events**: Dispatches clear, high-level events for user interactions (`enter`, `tab`, `arrow-up`, `arrow-down`, `swipe-right`).
 * - **Rich Public API**: Provides methods like `getValue()`, `setValue()`, `getCursorPosition()`, `setCursorPosition()`, and `clear()` for programmatic control.
 * - **Stateful Icon**: Manages an internal icon that automatically updates based on the component's state (e.g., ready, busy, secret).
 * - **Touch Support**: Implements a swipe-right gesture to trigger autocomplete on touch devices.
 *
 * @fires enter - When the user presses the Enter key. Detail: `{ value: string }`
 * @fires tab - When the user presses the Tab key.
 * @fires arrow-up - When the user presses the ArrowUp key.
 * @fires arrow-down - When the user presses the ArrowDown key.
 * @fires swipe-right - When the user performs a right swipe gesture on the component.
 */
class TerminalPrompt extends BaseComponent {
  /** @private {boolean} #isSecret - Flag indicating if the read mode is for secret (password) input. */
  #isSecret = false;
  /** @private {string} #secretValue - Stores the actual value when in secret input mode. */
  #secretValue = '';
  /** @private {boolean} #isEnabled - Flag to control if the input should accept changes. */
  #isEnabled = true;
  // Properties for swipe gesture detection
  #touchStartX = 0;
  #touchStartY = 0;

  /**
   * Creates an instance of TerminalPrompt.
   * Initializes the shadow DOM and applies component-specific styles.
   */
  constructor() {
    // Pass the template and map to the base constructor, including the Icon component.
    super(TEMPLATE);

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, terminalPromptSpecificStyles];

    // Add touch event listeners for swipe-to-autocomplete gesture.
    this.refs.footer.addEventListener('touchstart', this.#handleTouchStart.bind(this), { passive: true });
    this.refs.footer.addEventListener('touchend', this.#handleTouchEnd.bind(this), { passive: true });
    // Listen for input to handle manual password masking.
    this.refs.prompt.addEventListener('input', this.#onInput.bind(this));
    // Centralize keydown handling
    this.refs.prompt.addEventListener('keydown', this.#onKeyDown.bind(this));
  }

  static get observedAttributes() {
    return ['disabled', 'secret', 'placeholder', 'icon-text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'disabled':
        this.#isEnabled = !this.hasAttribute('disabled');
        this.refs.prompt.disabled = !this.#isEnabled;
        if (this.#isEnabled && !this.#isSecret) {
          this.#setReadyIcon();
          this.focus();
        } else if (!this.#isEnabled) {
          this.#setBusyIcon();
        }
        break;
      case 'secret':
        this.#isSecret = this.hasAttribute('secret');
        this.#isSecret ? this.#setKeyIcon() : this.#setReadyIcon();
        break;
      case 'placeholder':
        this.refs.prompt.placeholder = newValue || '';
        break;
      case 'icon-text':
        if (newValue !== null) {
          // If the attribute is being set, tell the icon to display custom text.
          if (this.refs.icon) this.refs.icon.setAttribute('type', 'text');
          if (this.refs.icon) this.refs.icon.setAttribute('value', newValue);
        } else {
          // If the attribute is being removed, revert to the default state icon.
          this.#isSecret ? this.#setKeyIcon() : this.#setReadyIcon();
        }
        break;
    }
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
  }

  /**
   * Handles keyboard events and dispatches them for the presenter to handle.
   * @private
   * @param {KeyboardEvent} event - The keyboard event.
   */
  #onKeyDown(event) {
    // If the input is not enabled, prevent all key actions and stop further processing.
    // This ensures no input is registered and no default browser behavior occurs.
    if (!this.#isEnabled) {
      event.preventDefault();
      event.stopPropagation(); // Stop event from bubbling up to parent elements
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.#dispatch('enter', { value: this.getValue() });
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.#dispatch('tab');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.#dispatch('arrow-up');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.#dispatch('arrow-down');
    }
  }

  /**
   * Records the starting position of a touch event for swipe detection.
   * @param {TouchEvent} event - The touch event.
   */
  #handleTouchStart(event) {
    const touch = event.touches[0];
    if (!touch) return;
    this.#touchStartX = touch.clientX;
    this.#touchStartY = touch.clientY;
  }

  /**
   * Calculates the gesture at the end of a touch and triggers the swipe right callback.
   * @param {TouchEvent} event - The touch event.
   */
  #handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    if (this.#touchStartX === 0 || !touch) return;

    const deltaX = touch.clientX - this.#touchStartX;
    const deltaY = touch.clientY - this.#touchStartY;

    // Check for a right swipe: significant horizontal movement, minimal vertical movement.
    if (deltaX > 50 && Math.abs(deltaY) < 50) {
      this.#dispatch('swipe-right');
    }
  }

  /**
   * Helper to dispatch custom events.
   * @private
   * @param {string} name - The event name.
   * @param {*} detail - The event payload.
   */
  #dispatch(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  /**
   * Sets focus on the command prompt input field.
   */
  focus() {
    this.refs.prompt.focus();
  }

  /**
   * Retrieves the real value from the input, whether in normal or secret mode.
   * @returns {string} The current, unmasked value of the input.
   */
  getValue() {
    if (this.#isSecret) {
      return this.#secretValue;
    }
    return this.refs.prompt.value;
  }

  /**
   * Sets the value of the command prompt input field.
   * In secret mode, this sets the internal real value and updates the display with masked characters.
   * @param {string} value - The string to set as the input's value.
   */
  setValue(value) {
    if (this.#isSecret) {
      this.#secretValue = value;
      this.refs.prompt.value = '●'.repeat(value.length);
    } else {
      this.refs.prompt.value = value;
    }
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

  // --- Private Icon Methods ---

  #setReadyIcon() {
    if (this.refs.icon) this.refs.icon.setAttribute('type', 'ready');
  }

  #setBusyIcon() {
    if (this.refs.icon) this.refs.icon.setAttribute('type', 'busy');
  }

  #setKeyIcon() {
    if (this.refs.icon) this.refs.icon.setAttribute('type', 'key');
  }
}

// Define the custom element 'nnoitra-cmd'
customElements.define('nnoitra-cmd', TerminalPrompt);

export { TerminalPrompt };
