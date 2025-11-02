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
import { EventBus } from './EventBus.js';
import { EnvironmentService } from '../Services/EnvironmentService.js';
import { AccountingService } from '../Services/AccountingService.js';
import { HistoryService } from '../Services/HistoryService.js';
import { CommandService } from '../Services/CommandService.js';
import { FilesystemService } from '../Services/FilesystemService.js';
import { ThemeService } from '../Services/ThemeService.js';
import { InputService } from '../Services/InputService.js';
import { HintService } from '../Services/HintService.js';
import { FaviconService } from '../Services/FaviconService.js';
import { TerminalService } from '../Services/TerminalService.js';
import { AutocompleteService } from '../Services/AutocompleteService.js';
import { MediaService } from '../Services/MediaService.js';
import { LocalStorageService } from '../Services/Storage/LocalStorageService.js';
import { SessionStorageService } from '../Services/Storage/SessionStorageService.js';

/**
 * A container that initializes and holds all application services for a single
 * terminal instance. Each time this class is instantiated, it creates a new,
 * independent set of services.
 */
export class ServiceContainer {
    constructor(config = {}) {
        const bus = new EventBus();
        this.services = {
            bus,
            environment: EnvironmentService.create(bus),
            accounting: AccountingService.create(bus, { apiUrl: config.accountingApi }),
            history: HistoryService.create(bus),
            command: CommandService.create(bus),
            theme: ThemeService.create(bus),
            input: InputService.create(bus),
            hint: HintService.create(bus),
            favicon: FaviconService.create(bus),
            terminal: TerminalService.create(bus),
            filesystem: FilesystemService.create(bus, { apiUrl: config.filesystemApi }),
            autocomplete: AutocompleteService.create(bus),
            media: MediaService.create(bus),
            localStorage: LocalStorageService.create(bus),
            sessionStorage: SessionStorageService.create(bus)
        };
    }
}
