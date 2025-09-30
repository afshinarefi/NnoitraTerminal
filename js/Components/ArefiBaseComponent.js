/**
 * @class ArefiBaseComponent
 * @extends HTMLElement
 * @description Provides a foundational class for all Arefi custom components.
 * It automates the setup of a closed Shadow DOM, applies shared styles,
 * and provides a mechanism for mapping elements with `part` attributes to `refs` for easy access.
 *
 * To use this base component:
 * 1. Extend `ArefiBaseComponent` instead of `HTMLElement`.
 * 2. Call `super(htmlTemplate, componentMap)` in the constructor of the derived class.
 */
class ArefiBaseComponent extends HTMLElement {

  /** @private {ShadowRoot} #shadow - The closed Shadow DOM root for the component. */
  #shadow;
  /** @private {Object.<string, Element>} #refs - A map of elements within the Shadow DOM, keyed by their `part` attribute. */
  #refs = {};

  /**
   * Creates an instance of ArefiBaseComponent.
   * @param {string} htmlTemplate - The HTML string that defines the structure of the component's Shadow DOM.
   * @param {Object.<string, CustomElementConstructor>} [componentMap={}] - An optional map where keys are custom element tag names
   *   and values are their corresponding class constructors. This allows for programmatic upgrading of custom elements
   *   within the `htmlTemplate` before they are appended to the Shadow DOM.
   */
  constructor(htmlTemplate, componentMap = {}) {
    super();

    // --- 1. Define Shared Styles ---
    // These styles provide a consistent base aesthetic for all components extending ArefiBaseComponent.
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
        font-family: var(--arefi-font-family);
        color: var(--arefi-color-text);
        font-size: var(--arefi-font-size);
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
      const fragment = this.#createFragment(htmlTemplate, componentMap);
      this.#shadow.appendChild(fragment);
    }

    // --- 4. Automatic Reference Mapping ---
    // Automatically map elements with 'part' attributes to the #refs object.
    this.#setupRefs();
  }

  /**
   * Finds all elements in the shadow root that have a 'part' attribute
   * and maps them to the `#refs` object using the 'part' value as the key.
   * This provides a convenient way to access internal elements of the component.
   * @private
   */
  #setupRefs() {
    // Query for all elements that have a 'part' attribute within the Shadow DOM.
    const elementsWithPart = this.#shadow.querySelectorAll('[part]');

    elementsWithPart.forEach(el => {
      const partName = el.getAttribute('part');
      // Use the part name as the key for the refs object.
      this.#refs[partName] = el;
    });
  }

  /**
   * Provides read-only access to the mapped element references.
   * @returns {Object.<string, Element>} An object containing references to internal elements,
   *   keyed by their `part` attribute.
   */
  get refs() {
    return this.#refs;
  }

  /**
   * Provides read-only access to the component's ShadowRoot.
   * @returns {ShadowRoot} The ShadowRoot instance of the component.
   */
  get shadowRoot() {
    return this.#shadow;
  }

  /**
   * Utility method to create a DocumentFragment from an HTML string.
   * It also handles the programmatic upgrading of custom elements specified in the `componentMap`,
   * ensuring their constructors are executed immediately upon creation.
   * @private
   * @param {string} htmlString - The HTML string to convert into a DocumentFragment.
   * @param {Object.<string, CustomElementConstructor>} componentMap - A map of custom element tag names to their class constructors.
   * @returns {DocumentFragment} A DocumentFragment containing the parsed HTML and upgraded custom elements.
   */
  #createFragment(htmlString, componentMap) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    const fragment = template.content;

    // Iterate over the component map to find and replace placeholder custom elements
    // with their live instances, transferring attributes in the process.
    for (const [tag, ComponentClass] of Object.entries(componentMap)) {
      fragment.querySelectorAll(tag).forEach(placeholder => {
        const liveInstance = new ComponentClass();

        // Transfer attributes (e.g., part="prompt") from the placeholder to the live instance.
        for (const attr of placeholder.attributes) {
          liveInstance.setAttribute(attr.name, attr.value);
        }

        placeholder.replaceWith(liveInstance);
      });
    }
    return fragment;
  }
}

export { ArefiBaseComponent };
