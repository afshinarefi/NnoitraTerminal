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
import { BaseComponent } from './BaseComponent.js';
import { createLogger } from '../Managers/LogManager.js';
const log = createLogger('Media');

/**
 * @constant {string} CSS - CSS styles for the Media component's shadow DOM.
 */
const CSS = `
  :host {
    display: block; /* Ensures the host element takes up space */
  }
  .media {
    /* Let the browser calculate width and height to preserve aspect ratio */
    width: auto;
    height: auto;
    /* On larger screens, cap the width at a reasonable size (e.g., 80rem) */
    /* Use min() to be responsive but also cap the width on large screens. */
    max-width: min(100%, 80rem);
    max-height: 80vh;
    margin: 10px 0;
    display: block; /* Helps with layout and margin */
  }
`;

const mediaSpecificStyles = new CSSStyleSheet();
mediaSpecificStyles.replaceSync(CSS);

/**
 * @class ArefiMedia
 * @extends BaseComponent
 * @description A custom element for displaying images or videos. It handles the loading
 * of media and dispatches a 'media-loaded' event upon completion to solve scroll timing issues.
 */
class Media extends BaseComponent {
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
      log.error(`Unsupported file type for src: ${source}`);
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
      this.#mediaElement.onerror = () => log.error(`Failed to load image ${source}`);
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
customElements.define('arefi-media', Media);

export { Media };