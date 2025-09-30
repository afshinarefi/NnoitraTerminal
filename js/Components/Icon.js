import { ArefiBaseComponent } from './ArefiBaseComponent.js';

/**
 * @constant {string} TEMPLATE - HTML template for the Icon component's shadow DOM.
 */
const TEMPLATE = `<span part="symbol"></span>`;

/**
 * @constant {string} CSS - CSS styles for the Icon component's shadow DOM.
 */
const CSS = `
[part=symbol] {
  color: var(--arefi-color-text-highlight); /* VAR */
  background-color: var(--arefi-color-highlight); /* VAR */
  padding: 3px 0.3em;
  display: inline-block;
  border-radius: 3px;
  margin: 3px 3px 3px 0px;
  text-align: center;
  min-width: 1.5em;
}
`;

// Define component-specific styles
const iconSpecificStyles = new CSSStyleSheet();
iconSpecificStyles.replaceSync(CSS);

/**
 * @class Icon
 * @extends ArefiBaseComponent
 * @description A custom element that displays various symbolic icons within the terminal,
 * indicating different states like ready, busy, or history index.
 */
class Icon extends ArefiBaseComponent {

  /**
   * @private
   * @type {Object.<string, string>}
   * @description A map of icon names to their corresponding string representations.
   */
  #icons = {
    ready: '>',
    busy: '⧗',
    history: 'H:',
    indexed: ':>',
    password: '$'
  };

  /**
   * Creates an instance of Icon.
   * Initializes the shadow DOM, applies component-specific styles, and sets the icon to the 'ready' state.
   */
  constructor() {
    // Pass only the template to the base constructor.
    super(TEMPLATE);

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, iconSpecificStyles];

    // Set the initial icon to 'ready'.
    this.ready();
  }

  /**
   * Sets the icon to a key symbol, for password prompts.
   */
  key() {
    this.refs.symbol.innerHTML = this.#icons.password;
  }

  /**
   * Sets the icon's text directly. Used for custom prompts like "Password:".
   * @param {string} text - The text to display.
   */
  setText(text) {
    this.refs.symbol.innerHTML = text;
  }

  /**
   * Sets the icon to the 'ready' state, typically a prompt symbol.
   */
  ready() {
    this.refs.symbol.innerHTML = this.#icons.ready;
  }

  /**
   * Sets the icon to the 'busy' state, indicating an ongoing operation.
   */
  busy() {
    this.refs.symbol.innerHTML = this.#icons.busy;
  }

  /**
   * Sets the icon to display a history index.
   * @param {number} index - The history index to display.
   */
  history(index) {
    this.refs.symbol.innerHTML = this.#icons.history + index;
  }

  /**
   * Sets the icon to display an indexed item, typically for output.
   * @param {number} index - The index of the item.
   */
  indexed(index) {
    this.refs.symbol.innerHTML = index + this.#icons.indexed;
  }
}

// Define the custom element 'arefi-icon'
customElements.define('arefi-icon', Icon);

export { Icon };
