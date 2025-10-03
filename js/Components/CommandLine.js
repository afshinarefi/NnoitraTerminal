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
import { ArefiBaseComponent } from './ArefiBaseComponent.js';
import { createLogger } from '../Services/LogService.js';
import { Icon } from './Icon.js';
const log = createLogger('CommandLine');

/**
 * @constant {string} TEMPLATE - HTML template for the CommandLine component's shadow DOM.
 */
const TEMPLATE = `
  <div part="footer">
  <arefi-icon part="icon"></arefi-icon>
  <input type="text" autocomplete="off" spellcheck="false" autofocus="true" part="prompt-text">
  <input type="password" autocomplete="password" spellcheck="false" part="prompt-password" style="display: none;">
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
  font-family: var(--arefi-font-family);
  font-size: var(--arefi-font-size);
}
[part=prompt-text],
[part=prompt-password] {
  background: none;
  border: none;
  outline: none;
  color: var(--arefi-color-text); /* VAR */
  flex-grow: 1;
  width: 100%;
  font-family: var(--arefi-font-family);
  font-size: var(--arefi-font-size);
}
[part=prompt-text]::placeholder,
[part=prompt-password]::placeholder {
  color: var(--arefi-color-placeholder);
  opacity: 1; /* Firefox has a lower default opacity for placeholders */
}
/* Override browser default autofill styles */
[part=prompt-text]:-webkit-autofill,
[part=prompt-text]:-webkit-autofill:hover,
[part=prompt-text]:-webkit-autofill:focus,
[part=prompt-text]:-webkit-autofill:active,
[part=prompt-password]:-webkit-autofill,
[part=prompt-password]:-webkit-autofill:hover,
[part-password]:-webkit-autofill:focus,
[part=prompt-password]:-webkit-autofill:active {
    -webkit-text-fill-color: var(--arefi-color-text);
    box-shadow: 0 0 0 1000px var(--arefi-color-background) inset;
    -webkit-box-shadow: 0 0 0 1000px var(--arefi-color-background) inset;
    transition: background-color 5000s ease-in-out 0s;
}
`;
// Define component-specific styles
const commandLineSpecificStyles = new CSSStyleSheet();
commandLineSpecificStyles.replaceSync(CSS);

/**
 * @class CommandLine
 * @extends ArefiBaseComponent
 * @description Represents the command input line in the terminal. It handles user input,
 * keyboard navigation for command history, and dispatches events for command submission and autocomplete.
 */
class CommandLine extends ArefiBaseComponent {
  /** @private {Object.<string, Service>} #services - A collection of services used by the command line (e.g., history). */
  #services = {};
  /** @private {string} #inputBuffer - Stores the current input value when navigating history. */
  #inputBuffer;
  /** @private {HTMLInputElement} #activeInput - A reference to the currently visible input element. */
  #activeInput;
  /** @private {number} #touchStartX - The starting X coordinate of a touch event. */
  #touchStartX = 0;
  /** @private {number} #touchStartY - The starting Y coordinate of a touch event. */
  #touchStartY = 0;
  /** @private {Function|null} #readResolve - The resolve function for the current read operation. */
  #readResolve = null;
  /** @private {boolean} #isReading - Flag indicating if the component is in interactive read mode. */
  #isReading = false;

  /**
   * Creates an instance of CommandLine.
   * Initializes the shadow DOM and applies component-specific styles.
   */
  constructor() {
    // Pass the template and map to the base constructor, including the Icon component.
    super(TEMPLATE, { 'arefi-icon': Icon });

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, commandLineSpecificStyles];

    // Set the initial active input to the text prompt.
    this.#activeInput = this.refs['prompt-text'];

    // Add touch event listeners for swipe-to-autocomplete gesture.
    this.refs.footer.addEventListener('touchstart', this.#handleTouchStart.bind(this), { passive: true });
    this.refs.footer.addEventListener('touchend', this.#handleTouchEnd.bind(this), { passive: true });
  }

  /**
   * Sets the history service for the command line.
   * @param {HistoryService} service - The history service instance to use.
   */
  setHistoryService(service) {
    if (!service) {
      log.error("Attempted to set null history manager on CommandLine.");
      return;
    }
    this.#services.history = service;
  }

  /**
   * Reads a single line of input from the user for interactive commands.
   * @param {string} prompt - The prompt to display to the user (e.g., "Password:").
   * @param {boolean} [isSecret=false] - If true, the input will be masked.
   * @returns {Promise<string|null>} A promise that resolves with the user's input, or null if cancelled (Ctrl+C).
   */
  read(prompt, isSecret = false) {
      this.#isReading = true;
      if (isSecret) {
          this.refs['prompt-text'].style.display = 'none';
          this.refs['prompt-password'].style.display = 'block';
          this.#activeInput = this.refs['prompt-password'];
      } else {
          this.refs['prompt-password'].style.display = 'none';
          this.refs['prompt-text'].style.display = 'block';
          this.#activeInput = this.refs['prompt-text'];
      }

      this.refs.icon.key(); // Use a key icon for prompts
      
      this.clear();
      this.enable(); // Ensure the prompt is enabled for reading
      this.#activeInput.placeholder = prompt;
      this.focus();

      return new Promise(resolve => {
          this.#readResolve = resolve;
      });
  }

  /**
   * Switches the command line into a password input mode.
   * @param {string} promptText - The text to display before the password input (e.g., "Password:").
   * @returns {Promise<string>} A promise that resolves with the entered password.
   */
  requestPassword(promptText = 'Password') {
    log.log(`Requesting password with prompt: "${promptText}"`);
    return new Promise(resolve => {
      // Switch to the password input.
      this.refs['prompt-text'].style.display = 'none';
      this.refs['prompt-password'].style.display = 'block';
      this.#activeInput = this.refs['prompt-password'];

      this.#activeInput.disabled = false;
      this.clear();

      this.refs.icon.key(); // Change icon to a key
      this.#activeInput.placeholder = promptText;
      this.focus(); // Ensure the input field has focus in password mode.

      const passwordHandler = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default 'Enter' behavior.
          event.stopPropagation(); // Stop the event from bubbling up to other listeners.
          const password = this.#activeInput.value;
          log.log('Password entered, resolving promise.');
          this.#activeInput.removeEventListener('keydown', passwordHandler);

          // Switch back to the text input.
          this.refs['prompt-password'].style.display = 'none';
          this.refs['prompt-text'].style.display = 'block';
          this.#activeInput = this.refs['prompt-text'];

          this.clear();
          // The calling command will re-disable the prompt, so we don't need to change the icon here.
          resolve(password);
        }
      };
      this.#activeInput.addEventListener('keydown', passwordHandler);
    });
  }

  /**
   * Records the starting position of a touch event for swipe detection.
   * @private
   * @param {TouchEvent} event - The touchstart event.
   */
  #handleTouchStart(event) {
    if (event.touches.length === 1) {
      this.#touchStartX = event.touches[0].clientX;
      this.#touchStartY = event.touches[0].clientY;
    }
  }

  /**
   * Calculates the gesture at the end of a touch and triggers autocomplete on a right swipe.
   * @private
   * @param {TouchEvent} event - The touchend event.
   */
  #handleTouchEnd(event) {
    if (this.#touchStartX === 0) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - this.#touchStartX;
    const deltaY = touchEndY - this.#touchStartY;

    // Reset start coordinates
    this.#touchStartX = 0;
    this.#touchStartY = 0;

    // Check for a right swipe: significant horizontal movement, minimal vertical movement.
    if (deltaX > 50 && Math.abs(deltaY) < 50) {
      log.log('Right swipe detected, dispatching autocomplete request.');
      this.dispatchEvent(new CustomEvent('autocomplete-request', {
        bubbles: true,
        composed: true,
        detail: this.#activeInput.value
      }));
    }
  }

  /**
   * Handles various keyboard events for command input, history navigation, and autocomplete.
   * @param {KeyboardEvent} event - The keyboard event.
   */
  handleEvent(event) {
    // If we are in interactive read mode, handle input differently.
    if (this.#isReading) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const value = this.#activeInput.value;
            this.#finishRead(value);
        } else if (event.key === 'c' && event.ctrlKey) {
            event.preventDefault();
            this.#finishRead(null); // Resolve with null for cancellation
        }
        // In read mode, we don't process other special keys like Tab or ArrowUp.
        return;
    }

    // If the prompt is disabled, ignore all keyboard events.
    if (this.#activeInput.disabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    this.focus(); // Ensure the prompt is focused on key interaction.

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        log.log('Enter key pressed.');
        const command = this.#activeInput.value;
        this.#services.history.resetCursor(); // Reset history cursor after command submission.
        this.clear(); // Clear the input field.
        this.refs.icon.ready(); // Set icon to ready state.

        // Dispatch a custom event for command submission.
        const commandEvent = new CustomEvent('command-submit', {
          bubbles: true, // Allows event to bubble up the DOM.
          composed: true, // Allows event to pass through Shadow DOM boundaries.
          detail: command // The payload: the actual command string.
        });
        this.dispatchEvent(commandEvent);
        break;

      case 'ArrowUp':
        event.preventDefault();
        log.log('ArrowUp key pressed.');
        // Save current input before loading history if at the beginning of history navigation.
        if (this.#services.history.getCursorIndex() === 0) {
          this.#inputBuffer = this.#activeInput.value;
        }

        const previousHistoryItem = this.#services.history.getPrevious();
        if (previousHistoryItem.index !== 0) {
          this.#activeInput.value = previousHistoryItem.command;
          this.refs.icon.history(previousHistoryItem.index);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        log.log('ArrowDown key pressed.');
        const nextHistoryItem = this.#services.history.getNext();

        // If at the end of history (new/empty command line), restore the buffered input.
        if (nextHistoryItem.index === 0) {
          this.#activeInput.value = this.#inputBuffer;
          this.refs.icon.ready();
        } else {
          // Otherwise, load the command from history.
          this.#activeInput.value = nextHistoryItem.command;
          this.refs.icon.history(nextHistoryItem.index);
        }
        break;

      case 'Tab':
        event.preventDefault();
        log.log('Tab key pressed, dispatching autocomplete request.');
        // Dispatch a custom event to request autocomplete suggestions.
        const autocompleteEvent = new CustomEvent('autocomplete-request', {
          bubbles: true,
          composed: true,
          detail: this.#activeInput.value
        });
        this.dispatchEvent(autocompleteEvent);
        break;

      default:
        // No specific action for other keys.
        break;
    }
  }

  /**
   * Finishes an interactive read operation and restores the normal prompt.
   * @private
   * @param {string|null} value - The value to resolve the read promise with.
   */
  #finishRead(value) {
      if (this.#readResolve) {
          this.#readResolve(value);
      }
      this.#isReading = false;
      this.#readResolve = null;

      // Restore normal prompt state
      this.refs['prompt-password'].style.display = 'none';
      this.refs['prompt-text'].style.display = 'block';
      this.#activeInput = this.refs['prompt-text'];
      this.enable();
  }
  /**
   * Sets focus on the command prompt input field.
   */
  focus() {
    this.#activeInput.focus();
  }

  /**
   * Retrieves the current command string from the input field.
   * @returns {string} The current value of the command prompt.
   */
  command() {
    return this.#activeInput.value;
  }

  /**
   * Sets the value of the command prompt input field.
   * @param {string} value - The string to set as the command prompt's value.
   */
  setCommand(value) {
    this.#activeInput.value = value;
  }

  /**
   * Clears the command prompt input field.
   */
  clear() {
    this.#activeInput.value = '';
  }

  /**
   * Disables the command prompt, visually indicating that a command is running.
   */
  disable() {
    this.#activeInput.disabled = true;
    this.refs.icon.busy(); // Set icon to busy state.
    this.#activeInput.placeholder = 'Running Command ...'; // Provide feedback to the user.
  }

  /**
   * Enables the command prompt, clearing any temporary messages and setting focus.
   */
  enable() {
    this.#activeInput.placeholder = ''; // Clear the temporary message.
    this.refs.icon.ready(); // Set icon back to ready state.
    this.#activeInput.disabled = false; // Enable the input field.
    this.focus(); // Set focus back to the prompt.
  }
}

// Define the custom element 'arefi-cmd'
customElements.define('arefi-cmd', CommandLine);

export { CommandLine };
