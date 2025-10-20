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
import { EnvironmentService } from './Services/EnvironmentService.js';
import { AccountingService } from './Services/AccountingService.js';
import { HistoryService } from './Services/HistoryService.js';
import { CommandService } from './Services/CommandService.js';
import { FilesystemService } from './Services/FilesystemService.js';
import { ThemeService } from './Services/ThemeService.js';
import { InputService } from './Services/InputService.js';
import { HintService } from './Services/HintService.js';
import { FaviconService } from './Services/FaviconService.js';
import { TerminalService } from './Services/TerminalService.js';
import { AutocompleteService } from './Services/AutocompleteService.js';

const log = createLogger('Main');

function main() {
    log.log('Application starting...');

    const services = {};

    const bus = new EventBusService();
    services.bus = bus;

    // Instantiate all the new services
    services.environment = new EnvironmentService(bus);
    services.accounting = new AccountingService(bus);
    services.history = new HistoryService(bus);
    services.command = new CommandService(bus);
    services.theme = new ThemeService(bus);
    services.input = new InputService(bus);
    services.hint = new HintService(bus);
    services.favicon = new FaviconService(bus);
    services.terminal = new TerminalService(bus);
    services.filesystem = new FilesystemService(bus);
    services.autocomplete = new AutocompleteService(bus);

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