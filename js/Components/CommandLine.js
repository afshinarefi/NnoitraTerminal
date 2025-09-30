import { ArefiBaseComponent } from './ArefiBaseComponent.js';
import { Icon } from './Icon.js';

/**
 * @constant {string} TEMPLATE - HTML template for the CommandLine component's shadow DOM.
 */
const TEMPLATE = `
  <div part="footer">
  <arefi-icon part="icon"></arefi-icon>
  <input type="text" autocomplete="new-password" autofocus="true" part="prompt">
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
[part=prompt] {
  background: none;
  border: none;
  outline: none;
  color: var(--arefi-color-text); /* VAR */
  flex-grow: 1;
  width: 100%;
  font-family: var(--arefi-font-family);
  font-size: var(--arefi-font-size);
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

  /**
   * Creates an instance of CommandLine.
   * Initializes the shadow DOM and applies component-specific styles.
   */
  constructor() {
    // Pass the template and map to the base constructor, including the Icon component.
    super(TEMPLATE, { 'arefi-icon': Icon });

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, commandLineSpecificStyles];
  }

  /**
   * Sets the history service for the command line.
   * @param {HistoryService} service - The history service instance to use.
   */
  setHistoryService(service) {
    if (!service) {
      console.error("Attempted to set null history manager on CommandLine.");
      return;
    }
    this.#services.history = service;
  }

  /**
   * Switches the command line into a password input mode.
   * @param {string} promptText - The text to display before the password input (e.g., "Password:").
   * @returns {Promise<string>} A promise that resolves with the entered password.
   */
  requestPassword(promptText = 'Password:') {
    return new Promise(resolve => {
      // Temporarily enable the prompt for password entry.
      this.refs.prompt.disabled = false;
      this.clear();

      this.refs.icon.key(); // Change icon to a key
      this.refs.prompt.type = 'password';
      this.refs.prompt.placeholder = promptText;

      const passwordHandler = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default 'Enter' behavior.
          event.stopPropagation(); // Stop the event from bubbling up to other listeners.

          const password = this.refs.prompt.value;
          this.refs.prompt.removeEventListener('keydown', passwordHandler);
          this.refs.prompt.type = 'text'; // Revert input type
          this.refs.prompt.placeholder = ''; // Clear placeholder
          this.clear();
          // The calling command will re-disable the prompt, so we don't need to change the icon here.
          resolve(password);
        }
      };
      this.refs.prompt.addEventListener('keydown', passwordHandler);
    });
  }

  /**
   * Handles various keyboard events for command input, history navigation, and autocomplete.
   * @param {KeyboardEvent} event - The keyboard event.
   */
  handleEvent(event) {
    // If the prompt is disabled, ignore all keyboard events.
    if (this.refs.prompt.disabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    this.focus(); // Ensure the prompt is focused on key interaction.

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        const command = this.refs.prompt.value;
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
        // Save current input before loading history if at the beginning of history navigation.
        if (this.#services.history.getCursorIndex() === 0) {
          this.#inputBuffer = this.refs.prompt.value;
        }

        const previousHistoryItem = this.#services.history.getPrevious();
        if (previousHistoryItem.index !== 0) {
          this.refs.prompt.value = previousHistoryItem.command;
          this.refs.icon.history(previousHistoryItem.index);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        const nextHistoryItem = this.#services.history.getNext();

        // If at the end of history (new/empty command line), restore the buffered input.
        if (nextHistoryItem.index === 0) {
          this.refs.prompt.value = this.#inputBuffer;
          this.refs.icon.ready();
        } else {
          // Otherwise, load the command from history.
          this.refs.prompt.value = nextHistoryItem.command;
          this.refs.icon.history(nextHistoryItem.index);
        }
        break;

      case 'Tab':
        event.preventDefault();
        // Dispatch a custom event to request autocomplete suggestions.
        const autocompleteEvent = new CustomEvent('autocomplete-request', {
          bubbles: true,
          composed: true,
          detail: this.refs.prompt.value
        });
        this.dispatchEvent(autocompleteEvent);
        break;

      default:
        // No specific action for other keys.
        break;
    }
  }

  /**
   * Sets focus on the command prompt input field.
   */
  focus() {
    this.refs.prompt.focus();
  }

  /**
   * Retrieves the current command string from the input field.
   * @returns {string} The current value of the command prompt.
   */
  command() {
    return this.refs.prompt.value;
  }

  /**
   * Sets the value of the command prompt input field.
   * @param {string} value - The string to set as the command prompt's value.
   */
  setCommand(value) {
    this.refs.prompt.value = value;
  }

  /**
   * Clears the command prompt input field.
   */
  clear() {
    this.refs.prompt.value = '';
  }

  /**
   * Disables the command prompt, visually indicating that a command is running.
   */
  disable() {
    this.refs.prompt.disabled = true;
    this.refs.icon.busy(); // Set icon to busy state.
    this.refs.prompt.value = '[Running Command ...]'; // Provide feedback to the user.
  }

  /**
   * Enables the command prompt, clearing any temporary messages and setting focus.
   */
  enable() {
    this.refs.prompt.value = ''; // Clear the temporary message.
    this.refs.icon.ready(); // Set icon back to ready state.
    this.refs.prompt.disabled = false; // Enable the input field.
    this.focus(); // Set focus back to the prompt.
  }
}

// Define the custom element 'arefi-cmd'
customElements.define('arefi-cmd', CommandLine);

export { CommandLine };
