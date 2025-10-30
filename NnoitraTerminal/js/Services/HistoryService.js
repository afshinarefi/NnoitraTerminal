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
import { EVENTS } from '../Core/Events.js';
import { ENV_VARS } from '../Core/Variables.js';
import { BaseService } from '../Core/BaseService.js';

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
class HistoryService extends BaseService{
    #history = [];
    #cursorIndex = 0;
    #maxSize = parseInt(DEFAULT_HISTSIZE, 10);

    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    get eventHandlers() {
        return {
            [EVENTS.HISTORY_PREVIOUS_REQUEST]: this.#handleGetPrevious.bind(this),
            [EVENTS.HISTORY_NEXT_REQUEST]: this.#handleGetNext.bind(this),
            [EVENTS.COMMAND_EXECUTE_BROADCAST]: this.#handleAddCommand.bind(this),
            [EVENTS.HISTORY_GET_ALL_REQUEST]: this.#handleGetAllHistory.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.USER_CHANGED_BROADCAST]: this.#handleUserChanged.bind(this)
        };
    }

    #handleAddCommand({ commandString }) {
        this.addCommand(commandString);
    }


    #handleUpdateDefaultRequest({ key, respond }) {
        if (key === ENV_VARS.HISTSIZE) {
            respond({ value: DEFAULT_HISTSIZE });
        }
    }

    async #handleUserChanged() {
        const { history } = await this.request(EVENTS.HISTORY_LOAD_REQUEST);
        this.loadHistory(history);
    }

    #updateMaxSize(histSizeValue) {
        const parsedSize = parseInt(histSizeValue, 10);
        if (!isNaN(parsedSize) && parsedSize >= 0) {
            this.#maxSize = parsedSize;
        } else {
            this.log.warn(`Invalid HISTSIZE value "${histSizeValue}". Resetting to default: ${DEFAULT_HISTSIZE}`);
            this.#maxSize = parseInt(DEFAULT_HISTSIZE, 10);
        }
    }

    async addCommand(command) {
        const trimmedCommand = command.trim();
        if (!trimmedCommand || (this.#history.length > 0 && this.#history[0] === trimmedCommand)) {
            return; // Don't add empty or duplicate consecutive commands
        }

        this.#history.unshift(trimmedCommand);
        this.dispatch(EVENTS.COMMAND_PERSIST_REQUEST, { command: trimmedCommand });

        // Lazily get HISTSIZE and update the internal max size.
        const { value } = await this.request(EVENTS.VAR_GET_SYSTEM_REQUEST, { key: ENV_VARS.HISTSIZE });
        this.#updateMaxSize(value || DEFAULT_HISTSIZE);

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
        this.dispatch(EVENTS.HISTORY_INDEXED_RESPONSE, response);
    }

    #handleGetNext() {
        if (this.#cursorIndex > 0) {
            this.#cursorIndex--;
        }
        const response = {
            command: this.#history[this.#cursorIndex - 1] || '',
            index: this.#cursorIndex
        };
        this.dispatch(EVENTS.HISTORY_INDEXED_RESPONSE, response);
    }

    #handleGetAllHistory({ respond }) {
        // The history is stored with the most recent command at index 0.
        // For display, we reverse it to show oldest to newest.
        const displayHistory = this.#history.slice().reverse();
        respond({ history: displayHistory });
    }

    loadHistory(data) {
        if (data) {
            // The backend returns an object with timestamps as keys. We want the values, sorted by key (timestamp).
            const sortedCommands = Object.keys(data).sort().map(key => data[key]);
            // The local history is newest-first, so we need to reverse the loaded history which is oldest-first.
            this.#history = sortedCommands.reverse();
            this.resetCursor();
            this.log.log(`Loaded ${this.#history.length} commands into history.`);
        }
    }

    clearHistory() {
        this.#history = [];
        this.resetCursor();
    }
}

export { HistoryService };