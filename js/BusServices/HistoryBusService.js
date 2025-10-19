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
import { createLogger } from './LogManager.js';
import { VAR_CATEGORIES } from './constants.js';

const log = createLogger('HistoryBusService');

// Define constants for hardcoded strings
const VAR_HISTSIZE = 'HISTSIZE';
const DEFAULT_HISTSIZE = '1000';

/**
 * @class HistoryBusService
 * @description Manages command history, communicating exclusively via the event bus.
 *
 * @listens for `history-previous-request` - Responds with the previous command in history.
 * @listens for `history-next-request` - Responds with the next command in history.
 * @listens for `command-execute-broadcast` - Adds the executed command to its internal history.
 * @listens for `variable-get-response` - For the HISTSIZE value.
 *
 * @dispatches `command-persist-request` - When a new command needs to be saved remotely.
 * @dispatches `history-load-request` - To request the loading of remote history.
 * @dispatches `history-indexed-response` - The requested history item.
 * @dispatches `variable-get-request` - To get the HISTSIZE variable.
 * @dispatches `variable-set-request` - To set the HISTSIZE variable.
 */
class HistoryBusService {
    #eventBus;
    #eventNames;
    #history = [];
    #cursorIndex = 0;
    #maxSize = parseInt(DEFAULT_HISTSIZE, 10);

    static EVENTS = {
        PROVIDE_PREVIOUS: 'providePrevious',
        PROVIDE_NEXT: 'provideNext',
        LISTEN_EXECUTE: 'listenExecute',
        USE_PERSIST: 'usePersist',
        USE_LOAD: 'useLoad',
        USE_INDEXED_RESPONSE: 'useIndexedResponse',
        USE_VAR_GET: 'useVarGet',
        USE_VAR_SET: 'useVarSet',
        LISTEN_VAR_GET_RESPONSE: 'listenVarGetResponse'
    };

    constructor(eventBus, eventNameConfig) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
        this.#registerListeners();
        log.log('Initializing...');

        // After a short delay to ensure env service is ready, check for HISTSIZE
        setTimeout(() => {
            this.#eventBus.dispatch(this.#eventNames[HistoryBusService.EVENTS.USE_VAR_GET], { key: VAR_HISTSIZE });
        }, 100);
    }

    #registerListeners() {
        this.#eventBus.listen(this.#eventNames[HistoryBusService.EVENTS.PROVIDE_PREVIOUS], () => this.#handleGetPrevious());
        this.#eventBus.listen(this.#eventNames[HistoryBusService.EVENTS.PROVIDE_NEXT], () => this.#handleGetNext());
        this.#eventBus.listen(this.#eventNames[HistoryBusService.EVENTS.LISTEN_EXECUTE], (payload) => this.addCommand(payload.commandString));
        this.#eventBus.listen(this.#eventNames[HistoryBusService.EVENTS.LISTEN_VAR_GET_RESPONSE], (payload) => this.#handleHistSizeResponse(payload));
    }

    #handleHistSizeResponse(payload) {
        if (payload.key !== VAR_HISTSIZE) return;

        if (payload.value === undefined) {
            // If HISTSIZE is not set at all, set it to the default.
            this.#eventBus.dispatch(this.#eventNames[HistoryBusService.EVENTS.USE_VAR_SET], {
                key: VAR_HISTSIZE,
                value: DEFAULT_HISTSIZE,
                category: VAR_CATEGORIES.USERSPACE
            });
            this.#maxSize = parseInt(DEFAULT_HISTSIZE, 10);
        } else {
            // If it is set, validate it.
            this.#validateHistSize(payload.value);
        }
    }

    #validateHistSize(histSizeValue) {
        const parsedSize = parseInt(histSizeValue, 10);
        if (!isNaN(parsedSize) && parsedSize >= 0) {
            this.#maxSize = parsedSize;
        } else {
            log.warn(`Invalid HISTSIZE value "${histSizeValue}". Resetting to default: ${DEFAULT_HISTSIZE}`);
            this.#maxSize = parseInt(DEFAULT_HISTSIZE, 10);
            this.#eventBus.dispatch(this.#eventNames[HistoryBusService.EVENTS.USE_VAR_SET], {
                key: VAR_HISTSIZE,
                value: DEFAULT_HISTSIZE,
                category: VAR_CATEGORIES.USERSPACE
            });
        }
    }

    addCommand(command) {
        const trimmedCommand = command.trim();
        if (!trimmedCommand || (this.#history.length > 0 && this.#history[0] === trimmedCommand)) {
            return;
        }

        this.#history.unshift(trimmedCommand);
        this.#eventBus.dispatch(this.#eventNames[HistoryBusService.EVENTS.USE_PERSIST], { command: trimmedCommand });

        // Re-validate HISTSIZE in case it was changed by the user.
        this.#eventBus.dispatch(this.#eventNames[HistoryBusService.EVENTS.USE_VAR_GET], { key: VAR_HISTSIZE });

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
        this.#eventBus.dispatch(this.#eventNames[HistoryBusService.EVENTS.USE_INDEXED_RESPONSE], response);
    }

    #handleGetNext() {
        if (this.#cursorIndex > 0) {
            this.#cursorIndex--;
        }
        const response = {
            command: this.#history[this.#cursorIndex - 1] || '',
            index: this.#cursorIndex
        };
        this.#eventBus.dispatch(this.#eventNames[HistoryBusService.EVENTS.USE_INDEXED_RESPONSE], response);
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

export { HistoryBusService };