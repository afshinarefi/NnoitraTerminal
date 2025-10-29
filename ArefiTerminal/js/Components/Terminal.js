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
import { ServiceContainer } from '../Core/ServiceContainer.js';
import { BaseComponent } from '../Core/BaseComponent.js';
import { TerminalPrompt } from './TerminalPrompt.js';
import { SuggestionBox } from './SuggestionBox.js';
import { createLogger } from '../Managers/LogManager.js';

const log = createLogger('Terminal');

/**
 * @constant {string} TEMPLATE - HTML template for the Terminal component's shadow DOM.
 */
const TEMPLATE = `
  <div part="terminal">
  <div part="welcome-output"></div>
  <div part="output"></div>
  <arefi-hint-box part="hint" hidden></arefi-hint-box>
  </div>
  <arefi-cmd part="prompt"></arefi-cmd>
  `;

/**
 * @constant {string} CSS - CSS styles for the Terminal component's shadow DOM.
 */
const FONT_STYLES = `
@font-face {
  font-family: 'Ubuntu Mono'; src: url('/fonts/ubuntu/UbuntuMono-R.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Ubuntu Mono'; src: url('/fonts/ubuntu/UbuntuMono-B.ttf') format('truetype'); font-weight: bold; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Ubuntu Mono'; src: url('/fonts/ubuntu/UbuntuMono-RI.ttf') format('truetype'); font-weight: normal; font-style: italic; font-display: swap;
}
@font-face {
  font-family: 'Ubuntu Mono'; src: url('/fonts/ubuntu/UbuntuMono-BI.ttf') format('truetype'); font-weight: bold; font-style: italic; font-display: swap;
}
`;

const HOST_STYLES = `
:host {
  /* Default Theme & Font Variables */
  --arefi-color-green: #5CB338;
  --arefi-color-yellow: #ECE852;
  --arefi-color-orange: #FFC145;
  --arefi-color-red: #FB4141;
  --arefi-color-black: #000000;
  --arefi-color-white: #FFFFFF;
  --arefi-color-theme: var(--arefi-color-green);
  --arefi-color-muted: color-mix(in srgb, var(--arefi-color-theme), black 40%);
  --arefi-color-placeholder: var(--arefi-color-muted);
  --arefi-color-output: var(--arefi-color-white);
  --arefi-color-highlight: var(--arefi-color-theme);
  --arefi-color-text-highlight: var(--arefi-color-black);
  --arefi-font-family: 'Ubuntu Mono', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace;

  /* Default Layout & Appearance */
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--arefi-color-black);
  color: var(--arefi-color-theme);
  font-size: clamp(0.8rem, 3vw, 1.1rem);
}
`;

const COMPONENT_STYLES = `
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

const CSS = FONT_STYLES + HOST_STYLES + COMPONENT_STYLES;

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
  /** @private {object} #services - A dedicated set of services for this terminal instance. */
  #services;

  /**
   * Creates an instance of Terminal.
   * Initializes the shadow DOM, applies styles, sets up services, and attaches event listeners.
   */
  constructor() {
    // Pass the template and map to the base constructor
    super(TEMPLATE);

    // Apply component-specific styles
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, terminalSpecificStyles];

  }

  /**
   * Observe the 'autofocus' attribute for changes.
   */
  static get observedAttributes() {
    return ['autofocus', 'filesystem-api', 'accounting-api'];
  }

  // --- Public Getters for Views ---

  get promptView() {
    return this.refs.prompt;
  }

  get hintView() {
    return this.refs.hint;
  }

  get welcomeOutputView() {
    return this.refs['welcome-output'];
  }

  /**
   * Bootstraps the terminal by creating services, connecting views, and attaching listeners.
   * @private
   */
  #bootstrap() {
    // Read API configuration from component attributes
    const config = {
      filesystemApi: this.getAttribute('filesystem-api'),
      accountingApi: this.getAttribute('accounting-api')
    };

    // 1. Create a new, independent set of services for this terminal instance.
    const container = new ServiceContainer(config);
    this.#services = container.services;

    // 2. Connect this component's views to its dedicated services.
    // This makes each terminal a completely sandboxed application.
    this.#services.input.setView(this.promptView);
    this.#services.hint.setView(this.hintView);
    this.#services.terminal.setView(this);
    this.#services.theme.setView(this);
    this.#services.favicon.setView(this);

    // 3. Attach UI event listeners.
    this.#attachEventListeners();
    log.log('Terminal bootstrapped successfully.');
  }

  /**
   * Attaches all necessary event listeners for the terminal component.
   * @private
   */
  #attachEventListeners() {

    // Make the terminal component itself focusable by adding it to the tab order.
    // A value of 0 is standard for including an element in the natural tab sequence.
    this.tabIndex = 0;

    // When the terminal component receives focus (e.g., via tabbing),
    // delegate that focus to the internal command prompt.
    this.addEventListener('focus', this.setFocus);

    // If the user clicks anywhere in the main terminal area that isn't other
    // content, focus the prompt. This makes the whole component feel interactive.
    this.refs.terminal.addEventListener('click', this.#handleClick.bind(this));
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Sets up the ResizeObserver and initial focus.
   */
  connectedCallback() {
    // Bootstrap services now that the component is in the DOM and attributes are available.
    this.#bootstrap();

    // Initialize ResizeObserver to scroll to bottom when terminal size changes
    this.#resizeObserver = new ResizeObserver(() => {
      this.scrollToBottom();
    });
    this.#resizeObserver.observe(this.refs.terminal);

    // Observe mutations in the terminal output to automatically scroll to the bottom
    this.#mutationObserver = new MutationObserver(() => this.scrollToBottom());
    this.#mutationObserver.observe(this.refs.terminal, { childList: true, subtree: true });

    // Start all services now that the component is in the DOM and views are connected.
    // This ensures services like TerminalService can access their views during startup.
    Object.values(this.#services).forEach(service => {
      if (service && typeof service.start === 'function') {
        service.start();
      }
    });
  }

  /**
   * Lifecycle callback when the element is removed from the DOM.
   * Cleans up event listeners and observers to prevent memory leaks.
   */
  disconnectedCallback() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
    }
  }

  /**
   * Handles changes to observed attributes.
   * @param {string} name - The name of the attribute that changed.
   */
  attributeChangedCallback(name) {
    // This handles the case where the autofocus attribute is added dynamically
    // after the component is already in the DOM.
    if (name === 'autofocus' && this.hasAttribute('autofocus')) {
      this.setFocus();
    }
  }

  /**
   * Handles click events on the terminal area to focus the prompt.
   * This ensures that clicking the "background" of the terminal focuses the input.
   * @param {MouseEvent} event - The click event.
   * @private
   */
  #handleClick(event) {
    // If the click target is the terminal container itself (and not text or other elements inside),
    // then we should focus the prompt.
    if (event.target === this.refs.terminal) {
      this.setFocus();
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
