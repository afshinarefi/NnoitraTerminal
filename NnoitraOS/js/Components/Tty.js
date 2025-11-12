/**
 * Nnoitra OS TTY
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
import { BaseComponent } from '../Core/BaseComponent.js';
import { Terminal } from './Terminal.js';

const TEMPLATE = ``;

const CSS = `
:host {
  display: block;
  width: 100%;
  height: 100%;
}
nnoitra-terminal {
  width: 100%;
  height: 100%;
}
`;

const ttySpecificStyles = new CSSStyleSheet();
ttySpecificStyles.replaceSync(CSS);

class Tty extends BaseComponent {
  constructor() {
    super(TEMPLATE); // Start with an empty shadow DOM
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, ttySpecificStyles];
  }

  /**
   * Receives a terminal component from the OS and adds it to the TTY's view.
   * @param {HTMLElement} terminalElement - The <nnoitra-terminal> element to display.
   */
  setTerminal(terminalElement) {
    this.shadowRoot.appendChild(terminalElement);
  }
}

customElements.define('nnoitra-tty', Tty);

export { Tty };
