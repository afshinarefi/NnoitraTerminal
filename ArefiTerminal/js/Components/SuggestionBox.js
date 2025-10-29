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
 */
import { BaseComponent } from '../Core/BaseComponent.js';
import { createLogger } from '../Managers/LogManager.js';
const log = createLogger('HintBox');

/**
 * @constant {string} TEMPLATE - HTML template for the HintBox component's shadow DOM.
 */
const TEMPLATE = `
  <ul part="box"></ul>
  <slot hidden></slot>
`;

/**
 * @constant {string} CSS - CSS styles for the HintBox component's shadow DOM.
 */
const CSS = `
:host([hidden]) {
  display: none;
}

[part=box] {
  color: var(--arefi-color-text); /* VAR */
  background-color: var(--arefi-color-background); /* VAR */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  width: 100%;
  margin: 0;
  border-left: 3px solid var(--arefi-color-highlight);
  padding: 5px 0 0 10px;
}

[part=box] li {
  flex-shrink: 1;
  margin-right: 1em;
  margin-bottom: 0.5em;
  min-width: 0;
  white-space: normal;
  overflow-wrap: break-word;
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

[part=box] li.visible {
  opacity: 1;
  transform: translateY(0);
}

.prefix {
  color: var(--arefi-color-muted);
}

.suffix {
  font-weight: bold;
}
`;

// Define component-specific styles
const hintBoxSpecificStyles = new CSSStyleSheet();
hintBoxSpecificStyles.replaceSync(CSS);

/**
 * @class HintBox
 * @extends BaseComponent
 * @description A custom element that displays a box of hints or suggestions, typically used for autocomplete.
 * It handles the dynamic rendering of suggestions with a subtle animation.
 */
class SuggestionBox extends BaseComponent {
  /**
   * Creates an instance of HintBox.
   * Initializes the shadow DOM, applies component-specific styles, and hides the box by default.
   */
  constructor() {
    super(TEMPLATE);
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, hintBoxSpecificStyles];

    // Find the hidden slot and listen for changes to its assigned nodes.
    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => this.#render());
  }

  static get observedAttributes() {
    return ['hidden', 'prefix-length'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Re-render whenever a relevant attribute changes.
    this.#render();
  }

  #render() {
    const box = this.refs.box;
    box.innerHTML = ''; // Clear previous content.

    // If the component is hidden, do nothing further.
    if (this.hasAttribute('hidden')) return;

    const prefixLength = parseInt(this.getAttribute('prefix-length') || '0', 10);
    const hintItems = this.querySelectorAll('li');

    if (hintItems.length === 0) return;

    const fragment = document.createDocumentFragment();
    hintItems.forEach((item, index) => {
      const text = item.textContent || '';
      const li = document.createElement('li');
      const prefixSpan = document.createElement('span');
      const suffixSpan = document.createElement('span');

      prefixSpan.className = 'prefix';
      prefixSpan.textContent = text.substring(0, prefixLength);
      suffixSpan.className = 'suffix';
      suffixSpan.textContent = text.substring(prefixLength);

      li.appendChild(prefixSpan);
      li.appendChild(suffixSpan);
      fragment.appendChild(li);

      setTimeout(() => li.classList.add('visible'), index * 50);
    });
    box.appendChild(fragment);
  }
}

// Define the custom element 'arefi-hint-box'
customElements.define('arefi-hint-box', SuggestionBox);

export { SuggestionBox };