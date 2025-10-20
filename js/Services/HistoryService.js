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
import { createLogger } from '../Managers/LogManager.js';
import { EVENTS } from './Events.js';

const log = createLogger('HistoryBusService');

// Define constants for hardcoded strings
const VAR_HISTSIZE = 'HISTSIZE';
const DEFAULT_HISTSIZE = '1000';

/**
 * @class HistoryBusService
 * @description Manages command history, communicating exclusively via the event bus.
 *
 * @listens for `HISTORY_PREVIOUS_REQUEST` - Responds with the previous command in history.
 * @listens for `HISTORY_NEXT_REQUEST` - Responds with the next command in history.
 * @listens for `COMMAND_EXECUTE_BROADCAST` - Adds the executed command to its internal history.
 * @listens for `VAR_GET_RESPONSE` - For the HISTSIZE value.
 *
 * @dispatches `COMMAND_PERSIST_REQUEST` - When a new command needs to be saved remotely.
 * @dispatches `HISTORY_LOAD_REQUEST` - To request the loading of remote history.
 * @dispatches `HISTORY_INDEXED_RESPONSE` - The requested history item.
 * @dispatches `VAR_GET_REQUEST` - To get the HISTSIZE variable.
 * @dispatches `VAR_SET_REQUEST` - To set the HISTSIZE variable.
 */
class HistoryService {
    #eventBus;
    #history = [];
    #cursorIndex = 0;
    #maxSize = parseInt(DEFAULT_HISTSIZE, 10);

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.HISTORY_PREVIOUS_REQUEST, () => this.#handleGetPrevious());
        this.#eventBus.listen(EVENTS.HISTORY_NEXT_REQUEST, () => this.#handleGetNext());
        this.#eventBus.listen(EVENTS.COMMAND_EXECUTE_BROADCAST, (payload) => this.addCommand(payload.commandString));
        this.#eventBus.listen(EVENTS.VAR_GET_RESPONSE, ({ values }) => this.#handleHistSizeResponse(values));
    }

    start() {
        // Now that all services are listening, check for HISTSIZE.
        this.#eventBus.dispatch(EVENTS.VAR_GET_REQUEST, { key: VAR_HISTSIZE });
    }

    #handleHistSizeResponse(values) {
        if (!values.hasOwnProperty(VAR_HISTSIZE)) return;

        const histSizeValue = values[VAR_HISTSIZE];

        if (histSizeValue === undefined) {
            // If HISTSIZE is not set at all, set it to the default.
            this.#eventBus.dispatch(EVENTS.VAR_SET_USERSPACE_REQUEST, { key: VAR_HISTSIZE, value: DEFAULT_HISTSIZE });
            this.#maxSize = parseInt(DEFAULT_HISTSIZE, 10);
        } else {
            // If it is set, validate it.
            this.#validateHistSize(histSizeValue);
        }
    }

    #validateHistSize(histSizeValue) {
        const parsedSize = parseInt(histSizeValue, 10);
        if (!isNaN(parsedSize) && parsedSize >= 0) {
            this.#maxSize = parsedSize;
        } else {
            log.warn(`Invalid HISTSIZE value "${histSizeValue}". Resetting to default: ${DEFAULT_HISTSIZE}`);
            this.#maxSize = parseInt(DEFAULT_HISTSIZE, 10);
            this.#eventBus.dispatch(EVENTS.VAR_SET_USERSPACE_REQUEST, { key: VAR_HISTSIZE, value: DEFAULT_HISTSIZE });
        }
    }

    addCommand(command) {
        const trimmedCommand = command.trim();
        if (!trimmedCommand || (this.#history.length > 0 && this.#history[0] === trimmedCommand)) {
            return;
        }

        this.#history.unshift(trimmedCommand);
        this.#eventBus.dispatch(EVENTS.COMMAND_PERSIST_REQUEST, { command: trimmedCommand });

        // Re-validate HISTSIZE in case it was changed by the user.
        this.#eventBus.dispatch(EVENTS.VAR_GET_REQUEST, { key: VAR_HISTSIZE });

        if (this.#history.length > this.#maxSize) {
            this.#history.pop();
        }
        this.resetCursor();
    }

    resetCursor() {
        this.#cursorIndex = 0;
    }

    #handleGetPrevious() {
        if (this.#cursorIndex < this.#history.length) {
            this.#cursorIndex++;
        }
        const response = {
            command: this.#history[this.#cursorIndex - 1] || '',
            index: this.#cursorIndex
        };
        this.#eventBus.dispatch(EVENTS.HISTORY_INDEXED_RESPONSE, response);
    }

    #handleGetNext() {
        if (this.#cursorIndex > 0) {
            this.#cursorIndex--;
        }
        const response = {
            command: this.#history[this.#cursorIndex - 1] || '',
            index: this.#cursorIndex
        };
        this.#eventBus.dispatch(EVENTS.HISTORY_INDEXED_RESPONSE, response);
    }

    loadHistory(data) {
        if (data) {
            this.#history = Object.values(data);
            this.resetCursor();
            log.log(`Loaded ${this.#history.length} commands into history.`);
        }
    }

    clearHistory() {
        this.#history = [];
        this.resetCursor();
    }
}

export { HistoryService };