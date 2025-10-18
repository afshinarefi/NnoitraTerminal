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
import { TerminalItem } from './TerminalItem.js';
import { CommandLine } from './CommandLine.js';
import { HintBox } from './HintBox.js';

import { EnvironmentService, VAR_CATEGORIES } from '../Services/EnvironmentService.js';
import { HistoryService } from '../Services/HistoryService.js';
import { CommandService } from '../Services/CommandService.js';
import { AutocompleteService } from '../Services/AutocompleteService.js';
import { LoginService } from '../Services/LoginService.js';
import { ApiService } from '../Services/ApiService.js';
import { FilesystemService } from '../Services/FilesystemService.js';
import { createLogger } from '../Services/LogService.js';

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
    // Reset the command ID counter.
    TerminalItem.resetIdCounter();
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
      // Also, check for and restore a previous session.
      await this.#restoreSession();
      await this.#displayWelcomeMessage();
      // Now that the welcome message is loaded, create the first command prompt.
      this.createNextItem();
    })();
  }

  /**
   * Checks for a session token on load, validates it with the backend,
   * and restores the user's remote environment and history if valid.
   * @private
   */
  async #restoreSession() {
    const token = this.#services.environment.getVariable('TOKEN');
    const user = this.#services.environment.getVariable('USER');

    if (!token || !user || user === 'guest') {
      log.log('No active session found to restore.');
      return; // No session to restore.
    }

    const formData = new FormData();
    formData.append('token', token);

    try {
      const response = await fetch('/server/accounting.py?action=validate', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.status === 'success') {
        log.log('Session validated successfully. Restoring remote state.');
        await this.#handleSuccessfulLogin();
      } else {
        log.warn('Session validation failed. Clearing local session data.', result.message);
        this.#services.login.clearLocalSession();
      }
    } catch (error) {
      log.error('Session restoration failed:', error);
    }
  }

  /**
   * Fetches remote data after a successful login or session validation.
   * @private
   */
  async #handleSuccessfulLogin() {
    try {
      const envResult = await this.#services.login.post('get_data', { category: 'ENV' });
      if (envResult && envResult.status === 'success') {
        this.#services.environment.loadRemoteVariables(envResult.data);
      }
      // HistoryService still manages its own fetching for now.
      await this.#services.history.loadRemoteHistory();
    } catch (error) {
      log.error('Failed to fetch remote data after login:', error);
    }
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
        log.error("Failed to display welcome message:", error);
      }
    }
  }

  /**
   * Initializes core services (environment, history, commands, autocomplete, filesystem).
   * @private
   */
  #initializeServices() {
    // EnvironmentService is special as it's a dependency for ApiService.
    this.#services.environment = new EnvironmentService(this.#services);

    // Services now create their own internal ApiService instances.
    this.#services.login = new LoginService(this.#services);
    this.#services.history = new HistoryService(this.#services);
    this.#services.filesystem = new FilesystemService(this.#services);

    // Register variables that are core to the terminal's own operation.
    this.#services.environment.registerVariable('HOST', { category: VAR_CATEGORIES.TEMP, defaultValue: window.location.host });
    this.#services.environment.registerVariable('ALIAS', { category: VAR_CATEGORIES.REMOTE, defaultValue: '{}' });
    this.#services.environment.registerVariable('PS1', { category: VAR_CATEGORIES.USERSPACE, defaultValue: '[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}' });

    // Now that variables are registered, initialize the service to load from storage.
    this.#services.environment.init();

    this.#services.command = new CommandService(this.#services);

    // Add the command line prompt component to services so commands can interact with it.
    this.#services.prompt = this.refs.prompt;

    // Initialize the filesystem service asynchronously
    this.#services.filesystem.init().then(() => {
    }).catch(error => {
        log.error('Failed to initialize filesystem service:', error);
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

    // Listen for successful login to fetch remote data.
    this.#services.login.addEventListener('login-success', async () => {
      log.log('Login successful, handling post-login tasks.');
      await this.#handleSuccessfulLogin();
    });

    // Listen for successful logout to clear local state.
    this.#services.login.addEventListener('logout-success', () => {
      this.#services.history.clearHistory();
    });

    // Listen for requests from EnvironmentService to save a variable remotely.
    this.#services.environment.addEventListener('save-remote-variable', async (event) => {
      const { key, value } = event.detail;
      await this.#services.login.post('set_data', {
        category: 'ENV',
        key, value
      });
    });

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
  async runCommand(cmd) {
    await this.#services.history.addCommand(cmd);
    this.refs.prompt.clear();
    this.refs.prompt.disable();

    // Find the last terminal item, which is our placeholder for the current command.
    const item = this.refs.output.lastElementChild;

    // Populate the placeholder item with the actual command details and activate it.
    item.setContent(this.#services.environment, cmd);
    item.classList.add('active');

    // Scroll to the bottom immediately to show the command being run.
    this.scrollToBottom();

    this.#services.command.execute(cmd, item.getOutput())
      .then(() => {
        // This block runs after the command successfully executes.
      }).catch(err => {
        log.error("Command Execution Error", err);
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
    const item = new TerminalItem();
    item.setContent(this.#services.environment, ''); // Create with an empty command for the placeholder
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
