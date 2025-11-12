/**
 * Nnoitra OS
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
import { Tty } from './Tty.js';
import { Terminal } from './Terminal.js';
import { createLogger } from '../Managers/LogManager.js';

const log = createLogger('OperatingSystem');

const TEMPLATE = ``;

const CSS = `
:host {
  display: block;
  width: 100%;
  height: 100%;
}
nnoitra-tty {
  width: 100%;
  height: 100%;
}
`;

const osSpecificStyles = new CSSStyleSheet();
osSpecificStyles.replaceSync(CSS);

class OperatingSystem extends BaseComponent {
  constructor() {
    super(); // Start with an empty shadow DOM
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, osSpecificStyles];
  }

  static get observedAttributes() {
    return ['filesystem-api', 'accounting-api'];
  }

  connectedCallback() {
    // Read API configuration from component attributes
    const config = {
      filesystemApi: this.getAttribute('filesystem-api'),
      accountingApi: this.getAttribute('accounting-api')
    };

    // 1. Create services.
    const container = new ServiceContainer(config);

    // 2. Create the TTY container.
    const tty = document.createElement('nnoitra-tty');
    this.shadowRoot.appendChild(tty);

    // 3. Create the Terminal application.
    const terminal = document.createElement('nnoitra-terminal');
    terminal.setAttribute('autofocus', ''); // The terminal should still focus itself once displayed.

    // 4. Inject services into the terminal.
    terminal.setServices(container.services);

    // 5. Place the terminal inside the TTY.
    tty.setTerminal(terminal);

    // 3. Start all services. This is the "boot sequence".
    Object.values(container.services).forEach(service => {
      if (service && typeof service.start === 'function') {
        service.start();
      }
    });
    log.log('OS booted successfully.');
  }
}

customElements.define('nnoitra-os', OperatingSystem);

export { OperatingSystem };