import { ArefiBaseComponent } from './ArefiBaseComponent.js';
import { TerminalItem } from './TerminalItem.js';
import { CommandLine } from './CommandLine.js';
import { HintBox } from './HintBox.js';

import { EnvironmentService } from '../Services/EnvironmentService.js';
import { HistoryService } from '../Services/HistoryService.js';
import { CommandService } from '../Services/CommandService.js';
import { AutocompleteService } from '../Services/AutocompleteService.js';
import { FilesystemService } from '../Services/FilesystemService.js';

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
 * @extends ArefiBaseComponent
 * @description Represents the main terminal component, handling user input, command execution, and output display.
 * It integrates various services like history, command execution, environment, and autocomplete.
 */
class Terminal extends ArefiBaseComponent {

  /** @private {ResizeObserver} #resizeObserver - Observes changes to the terminal's size to adjust scrolling. */
  #resizeObserver;
  /** @private {MutationObserver} #mutationObserver - Observes changes in the terminal output to automatically scroll. */
  #mutationObserver;
  #services = {};

  /**
   * Clears all output from the terminal
   * @private
   */
  #clearOutput = () => {
    const output = this.shadowRoot.querySelector('[part=output]');
    if (output) {
      output.innerHTML = '';
    }
  };

  /**
   * Creates an instance of Terminal.
   * Initializes the shadow DOM, applies styles, sets up services, and attaches event listeners.
   */
  constructor() {
    // Pass the template and map to the base constructor
    super(TEMPLATE, { 'arefi-cmd': CommandLine, 'arefi-hint-box': HintBox });

    // Apply component-specific styles
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, terminalSpecificStyles];

    this.#initializeServices();
    this.#attachEventListeners();

    // Use an immediately-invoked async function to handle async setup
    (async () => {
      // Display the initial welcome message before creating the first prompt.
      await this.#displayWelcomeMessage();
      // Now that the welcome message is loaded, create the first command prompt.
      this.createNextItem();
    })();
  }

  /**
   * Executes the 'welcome' command and displays its output.
   * @private
   */
  async #displayWelcomeMessage() {
    const welcomeCommand = this.#services.command.getCommand('welcome');
    if (welcomeCommand) {
      try {
        const welcomeOutput = await welcomeCommand.execute([]);
        this.refs['welcome-output'].appendChild(welcomeOutput);
      } catch (error) {
        console.error("Failed to display welcome message:", error);
      }
    }
  }

  /**
   * Initializes core services (environment, history, commands, autocomplete, filesystem).
   * @private
   */
  #initializeServices() {
    this.#services.environment = new EnvironmentService();
    // Set initial environment variables before other services use them
    this.#services.environment.setVariable('USER', 'guest');
    this.#services.environment.setVariable('PWD', '/');
    this.#services.environment.setVariable('HOST', window.location.host);

    this.#services.history = new HistoryService(this.#services);
    this.#services.filesystem = new FilesystemService();
    this.#services.command = new CommandService(this.#services);

    // Initialize the filesystem service asynchronously
    this.#services.filesystem.init('/fs/index.py').then(() => {
    }).catch(error => {
        console.error('Failed to initialize filesystem service:', error);
    });

    // Pass the full services object for consistency
    this.#services.autocomplete = new AutocompleteService(this.refs.prompt, this.#services);
  }

  /**
   * Attaches all necessary event listeners for the terminal component.
   * @private
   */
  #attachEventListeners() {
    // Listen for terminal-clear events. Using a direct event listener on `document`
    // is a pragmatic way to handle events from deeply nested components (like a command)
    // without complex prop-drilling or a state management library.
    document.addEventListener('terminal-clear', () => this.#clearOutput());

    // Add event listeners for command submission and autocomplete suggestions
    this.refs.prompt.addEventListener('command-submit', this.commandReceive.bind(this));
    this.#services.autocomplete.addEventListener('autocomplete-suggestions', this.autocompleteReceive.bind(this));

    // Listen for the custom 'media-loaded' event to handle scrolling after media loads.
    this.refs.output.addEventListener('media-loaded', () => this.scrollToBottom());

    // Set tab index for focus management and add keydown listener for terminal-wide shortcuts
    this.tabIndex = 1;
    this.addEventListener('keydown', this.#handleTerminalKeydown.bind(this));
    // Provide the history service to the command line component
    this.refs.prompt.setHistoryService(this.#services.history);

    // Add focus listener to ensure prompt is always focused when terminal is focused
    this.addEventListener('focus', this.setFocus);
  }

  /**
   * Handles keydown events on the terminal, delegating to the command line component.
   * @private
   * @param {KeyboardEvent} event - The keyboard event.
   */
  #handleTerminalKeydown(event) {
    this.refs.prompt.handleEvent(event);
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
   * Receives a submitted command from the CommandLine component.
   * Hides hints, runs the command, and scrolls to the bottom.
   * @param {CustomEvent} event - The custom 'command-submit' event containing the command string.
   */
  commandReceive(event) {
    event.stopPropagation();
    this.refs.hint.hide();
    this.runCommand(event.detail);
  }

  /**
   * Receives autocomplete suggestions from the AutocompleteService.
   * Displays hints if multiple suggestions exist, updates the command line, and scrolls to the bottom.
   * @param {CustomEvent} event - The custom 'autocomplete-suggestions' event.
   * @param {string[]} event.detail.suggestions - Array of suggested commands.
   * @param {string} event.detail.prefix - The prefix used for autocomplete.
   * @param {string} event.detail.complete - The complete command with the best suggestion.
   */
  autocompleteReceive(event) {
    event.stopPropagation();
    if (event.detail.suggestions.length > 1) {
      this.refs.hint.show(event.detail.suggestions, event.detail.prefix);
    } else {
      this.refs.hint.hide();
    }
    this.refs.prompt.setCommand(event.detail.complete);
    this.scrollToBottom();
  }

  /**
   * Executes a given command.
   * Adds the command to history, clears the prompt, disables it during execution,
   * creates a new TerminalItem for output, and re-enables the prompt after execution.
   * @param {string} cmd - The command string to execute.
   */
  runCommand(cmd) {
    this.#services.history.addCommand(cmd);
    this.refs.prompt.clear();
    this.refs.prompt.disable();

    // Find the last terminal item, which is our placeholder for the current command.
    const item = this.refs.output.lastElementChild;

    // Populate the placeholder item with the actual command details and activate it.
    const user = this.#services.environment.getVariable('USER');
    const path = this.#services.environment.getVariable('PWD');
    const host = this.#services.environment.getVariable('HOST');
    item.setContent(user, path, cmd, host);
    item.classList.add('active');

    // Scroll to the bottom immediately to show the command being run.
    this.scrollToBottom();

    this.#services.command.execute(cmd, item.getOutput())
      .then(() => {
        // This block runs after the command successfully executes.
      }).catch(err => {
        console.error("Command Execution Error", err);
        // This block runs if the command execution throws an error.
      }).finally(() => {
        // This block runs regardless of success or failure.
        this.refs.prompt.enable();
        this.createNextItem(); // Create the placeholder for the *next* command.
        this.scrollToBottom();
      });
  }

  /**
   * Creates a new, empty TerminalItem that acts as a placeholder for the next command.
   */
  createNextItem() {
    const user = this.#services.environment.getVariable('USER');
    const path = this.#services.environment.getVariable('PWD');
    const host = this.#services.environment.getVariable('HOST');
    const item = new TerminalItem();
    item.setContent(user, path, '', host); // Create with an empty command for the placeholder
    this.refs.output.appendChild(item);
    return item;
  }

  /**
   * Sets focus to the command prompt input field.
   */
  setFocus() {
    this.refs.prompt.focus();
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
