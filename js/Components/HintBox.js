import { ArefiBaseComponent } from './ArefiBaseComponent.js';

/**
 * @constant {string} TEMPLATE - HTML template for the HintBox component's shadow DOM.
 */
const TEMPLATE = `<ul part="box"></ul>`;

/**
 * @constant {string} CSS - CSS styles for the HintBox component's shadow DOM.
 */
const CSS = `
[part=box] {
  color: var(--arefi-color-text); /* VAR */
  background-color: var(--arefi-color-background); /* VAR */
  display: flex;        /* The key to horizontal alignment */
  flex-direction: row;  /* (Default, but explicit) Arranges children in a row */
  flex-wrap: wrap;
  list-style: none;     /* Removes the bullet points */
  width: 100%;
  padding: 0;
  margin: 0;
}

[part=box] li {
  flex-shrink: 1;
  /* Add spacing between the items */
  margin-right: 1em;
  margin-bottom: 0.5em; /* Add vertical space between wrapped rows */
  min-width: 0;
  /* Prevent list items from shrinking if text is long */
  white-space: normal;
  overflow-wrap: break-word;
  opacity: 0;
  transform: translateY(-5px); /* Start slightly above final position */
  transition: opacity 0.2s ease-out, transform 0.2s ease-out; /* The animation duration */
}

[part=box] li.visible {
  opacity: 1;
  transform: translateY(0);
}

.prefix {
  font-style: italic;
  color: var(--arefi-color-muted);
}

.suffix {
  font-weight: bold;
`;

// Define component-specific styles
const hintBoxSpecificStyles = new CSSStyleSheet();
hintBoxSpecificStyles.replaceSync(CSS);

/**
 * @class HintBox
 * @extends ArefiBaseComponent
 * @description A custom element that displays a box of hints or suggestions, typically used for autocomplete.
 * It handles the dynamic rendering of suggestions with a subtle animation.
 */
class HintBox extends ArefiBaseComponent {

  /**
   * Creates an instance of HintBox.
   * Initializes the shadow DOM, applies component-specific styles, and hides the box by default.
   */
  constructor() {
    // Pass only the template to the base constructor as it doesn't contain nested custom elements.
    super(TEMPLATE);

    // Apply component-specific styles to the shadow DOM.
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, hintBoxSpecificStyles];

    // Initially hide the hint box.
    this.hide();
  }

  /**
   * Clears all existing hint items from the hint box.
   */
  clean() {
    this.refs.box.innerHTML = '';
  }

  /**
   * Displays a list of suggestions in the hint box.
   * Each suggestion is rendered with a prefix and suffix, and animated into view.
   * @param {string[]} suggestions - An array of suggestion strings to display.
   * @param {number} prefixLength - The length of the prefix part of each suggestion (for styling).
   */
  show(suggestions, prefixLength) {
    this.clean(); // Clear any previous suggestions.
    const fragment = document.createDocumentFragment();
    this.style.display = 'block'; // Make the hint box visible.

    if (!this.refs.box) {
      console.error('HintBox: this.refs.box is not defined!');
      return;
    }

    suggestions.forEach((item, index) => {
      const li = document.createElement('li');
      const prefixSpan = document.createElement('span');
      const suffixSpan = document.createElement('span');

      // Set text content for prefix and suffix based on the provided prefixLength.
      prefixSpan.textContent = item.substring(0, prefixLength);
      prefixSpan.classList.add("prefix");
      suffixSpan.textContent = item.substring(prefixLength, item.length);
      suffixSpan.classList.add("suffix");

      li.appendChild(prefixSpan);
      li.appendChild(suffixSpan);
      fragment.appendChild(li);

      // Animate each list item into view with a slight delay.
      setTimeout(() => {
        li.classList.add('visible');
      }, index * 50);
    });
    this.refs.box.appendChild(fragment);
  }

  /**
   * Hides the hint box and clears its contents.
   */
  hide() {
    this.clean(); // Clear all suggestions.
    this.style.display = 'none'; // Hide the hint box.
  }
}

// Define the custom element 'arefi-hint-box'
customElements.define('arefi-hint-box', HintBox);

export { HintBox };
