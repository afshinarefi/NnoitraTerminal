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
import { createLogger } from '../Managers/LogManager.js';
/**
 * @class NnoitraBaseComponent
 * @extends HTMLElement
 * @description Provides a foundational class for all Nnoitra custom components.
 * It automates the setup of a closed Shadow DOM, applies shared styles,
 * and provides a mechanism for mapping elements with `part` attributes to `refs` for easy access.
 *
 * To use this base component:
 * 1. Extend `NnoitraBaseComponent` instead of `HTMLElement`.
 * 2. Call `super(htmlTemplate, componentMap)` in the constructor of the derived class.
 */
class BaseComponent extends HTMLElement {
  /** @private {ShadowRoot} #shadow - The closed Shadow DOM root for the component. */
  #shadow;
  /** @protected {Object.<string, Element>} #internalRefs - A map of elements within the Shadow DOM, keyed by their `part` attribute. */
  #internalRefs = {};
  #log;

  get log() { return this.#log; }

  /**
   * Creates an instance of NnoitraBaseComponent.
   * @param {string} htmlTemplate - The HTML string that defines the structure of the component's Shadow DOM.
   */
  constructor(htmlTemplate) {
    super();
    this.#log = createLogger(this.constructor.name);
    // --- 1. Define Shared Styles ---
    // These styles provide a consistent base aesthetic for all components extending NnoitraBaseComponent.
    const sharedStyles = new CSSStyleSheet();
    sharedStyles.replaceSync(`
      /* Styles for encapsulation and structural fundamentals remain here.
       * The 'var()' function will look up the Custom Property
       * (which pierces the Shadow DOM) from the :root or host element.
       */

      /* Good practice to add this for consistent box model */
      * {
        box-sizing: border-box;
      }

      /* Apply colors and font-family to the host to establish inheritance
       * These custom properties should be defined at a higher level (e.g., :root or body).
       */
      :host {
        font-family: var(--nnoitra-font-family);
        color: var(--nnoitra-color-text);
        font-size: var(--nnoitra-font-size);
      }
      `);

    // --- 2. Attach Shadow DOM and Apply Styles ---
    // Attach a closed Shadow DOM to prevent external access and style leakage.
    this.#shadow = this.attachShadow({ mode: 'closed' });
    // Apply the shared styles to the Shadow DOM.
    this.#shadow.adoptedStyleSheets = [sharedStyles];

    // --- 3. Process Template and Append ---
    // If an HTML template is provided, create a document fragment and append it to the Shadow DOM.
    if (htmlTemplate) {
      const fragment = this.#createFragment(htmlTemplate);
      this.#shadow.appendChild(fragment);
    }

    // --- 4. Automatic Reference Mapping ---
    // Automatically map elements with 'part' attributes to the #refs object.
    this.#setupRefs();
  }

  /**
   * Finds all elements in the shadow root that have a 'part' attribute
   * and maps them to the `#internalRefs` object using the 'part' value as the key.
   * This provides a convenient way to access internal elements of the component.
   * @private
   */
  #setupRefs() {
    // Query for all elements that have a 'part' attribute within the Shadow DOM.
    const elementsWithPart = this.#shadow.querySelectorAll('[part]');
    elementsWithPart.forEach(el => {
      const partName = el.getAttribute('part');
      // Use the part name as the key for the refs object.
      this.log.log(`Mapping ref: "${partName}" to element`, el);
      this.#internalRefs[partName] = el;
    });
  }

  /**
   * Provides protected read-only access to the mapped element references for use by child classes.
   * This should not be accessed from outside the component's class hierarchy.
   * @protected
   * @returns {Object.<string, Element>} An object containing references to internal elements
   *   keyed by their `part` attribute.
   */
  get refs() {
    return this.#internalRefs;
  }

  /**
   * Provides read-only access to the component's ShadowRoot.
   * @returns {ShadowRoot} The ShadowRoot instance of the component.
   */
  get shadowRoot() {
    return this.#shadow;
  }

  #createFragment(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    return template.content;
  }
}

export { BaseComponent };
