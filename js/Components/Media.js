import { ArefiBaseComponent } from './ArefiBaseComponent.js';

/**
 * @constant {string} CSS - CSS styles for the Media component's shadow DOM.
 */
const CSS = `
  :host {
    display: block; /* Ensures the host element takes up space */
  }
  .media {
    width: 96%;
    max-width: 600px;
    margin: 10px 2%;
    display: block; /* Helps with layout and margin */
  }
`;

const mediaSpecificStyles = new CSSStyleSheet();
mediaSpecificStyles.replaceSync(CSS);

/**
 * @class ArefiMedia
 * @extends ArefiBaseComponent
 * @description A custom element for displaying images or videos. It handles the loading
 * of media and dispatches a 'media-loaded' event upon completion to solve scroll timing issues.
 */
class ArefiMedia extends ArefiBaseComponent {
  #mediaElement;

  constructor() {
    // No initial template needed, it's created dynamically.
    super();
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, mediaSpecificStyles];
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && oldValue !== newValue) {
      this.src = newValue;
    }
  }

  set src(source) {
    if (!source) return;

    // Clear previous media if any
    if (this.#mediaElement) {
      this.#mediaElement.remove();
    }

    const supportedImage = /\.(png|jpg|jpeg|gif|webp)$/i;
    const supportedVideo = /\.(mp4|webm)$/i;

    if (supportedImage.test(source)) {
      this.#mediaElement = document.createElement('img');
    } else if (supportedVideo.test(source)) {
      this.#mediaElement = document.createElement('video');
      this.#mediaElement.controls = true;
    } else {
      console.error(`ArefiMedia: Unsupported file type for src: ${source}`);
      return;
    }

    this.#mediaElement.classList.add('media');
    this.#mediaElement.src = source;

    const onMediaLoaded = () => {
      // Dispatch a custom event that can bubble up and cross shadow DOM boundaries.
      this.dispatchEvent(new CustomEvent('media-loaded', {
        bubbles: true,
        composed: true
      }));
    };

    if (this.#mediaElement.tagName === 'IMG') {
      this.#mediaElement.onload = onMediaLoaded;
      this.#mediaElement.onerror = () => console.error(`ArefiMedia: Failed to load image ${source}`);
    } else if (this.#mediaElement.tagName === 'VIDEO') {
      this.#mediaElement.oncanplaythrough = onMediaLoaded;
    }

    this.shadowRoot.appendChild(this.#mediaElement);
  }

  get src() {
    return this.getAttribute('src');
  }
}

// Define the custom element 'arefi-media'
customElements.define('arefi-media', ArefiMedia);

export { ArefiMedia };