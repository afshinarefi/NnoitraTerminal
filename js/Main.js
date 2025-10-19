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
import { Terminal } from './Components/Terminal.js';
import { createLogger } from './Managers/LogManager.js';

// Import all new Bus-based services
import { EventBusService } from './Services/EventBusService.js';
import { EnvironmentBusService } from './Services/EnvironmentService.js';
import { AccountingBusService } from './Services/AccountingService.js';
import { HistoryBusService } from './Services/HistoryService.js';
import { CommandBusService } from './Services/CommandService.js';
import { FilesystemBusService } from './Services/FilesystemService.js';
import { ThemeBusService } from './Services/ThemeService.js';
import { InputBusService } from './Services/InputService.js';
import { HintBusService } from './Services/HintService.js';
import { FaviconBusService } from './Services/FaviconService.js';
import { TerminalBusService } from './Services/TerminalService.js';

const log = createLogger('main');

function main() {
    log.log('Application starting...');

    const services = {};

    const bus = new EventBusService();
    services.bus = bus;

    // Instantiate all the new services
    services.environment = new EnvironmentBusService(bus);
    services.accounting = new AccountingBusService(bus);
    services.history = new HistoryBusService(bus);
    services.command = new CommandBusService(bus, services);
    services.theme = new ThemeBusService(bus);
    services.input = new InputBusService(bus);
    services.hint = new HintBusService(bus);
    services.favicon = new FaviconBusService(bus);
    services.terminal = new TerminalBusService(bus);
    services.filesystem = new FilesystemBusService(bus);

    // Create the main terminal component and add it to the DOM
    const terminalComponent = new Terminal();
    document.body.appendChild(terminalComponent);

    // Connect presenter services to their views
    services.input.setView(terminalComponent.promptView);
    services.hint.setView(terminalComponent.hintView);
    services.terminal.setView(terminalComponent);

    // Start all services. This is the "go-live" signal.
    // The loop ensures we don't have to worry about the order of initialization.
    for (const service of Object.values(services)) {
        if (service && typeof service.start === 'function') {
            service.start();
        }
    }
}

// Run the application once the DOM is fully loaded and ready for manipulation.
document.addEventListener('DOMContentLoaded', main);