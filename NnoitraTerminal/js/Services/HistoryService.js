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
const HISTORY_FILE = '.history';

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
    #navigationHistoryCache = null;
    #cursorIndex = 0;
    #isNavigating = false;


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

    async #handleAddCommand({ commandString }) {
        await this.addCommand(commandString);
        this.resetCursor();
    }


    #handleUpdateDefaultRequest({ key, respond }) {
        if (key === ENV_VARS.HISTSIZE) {
            respond({ value: DEFAULT_HISTSIZE });
        }
    }

    async #handleUserChanged() {
        // When user changes, clear any cached history and reset cursor.
        this.#navigationHistoryCache = null;
        this.resetCursor();
    }

    async addCommand(command) {
        const trimmedCommand = command.trim();
        if (!trimmedCommand) return;

        const { value: home } = await this.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.HOME, category: 'TEMP' });
        const historyFilePath = `${home}/${HISTORY_FILE}`;

        let history = [];
        const { contents, error } = await this.request(EVENTS.FS_READ_FILE_REQUEST, { path: historyFilePath });
        if (!error && contents) {
            history = contents.split('\n').filter(line => line.trim() !== '');
        } else {
            // File probably doesn't exist, which is fine. We'll create it.
            this.log.log(`History file not found at ${historyFilePath}. A new one will be created.`);
        }

        // Prevent adding duplicate consecutive commands
        if (history.length > 0 && history[history.length - 1] === trimmedCommand) {
            return;
        }

        history.push(trimmedCommand);

        // Enforce HISTSIZE limit
        const { value: histsizeStr } = await this.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.HISTSIZE, category: 'SYSTEM' });
        const histsize = parseInt(histsizeStr || DEFAULT_HISTSIZE, 10);
        if (history.length > histsize) {
            history.splice(0, history.length - histsize);
        }

        // Write the updated history back to the file
        this.dispatch(EVENTS.FS_WRITE_FILE_REQUEST, { path: historyFilePath, content: history.join('\n') });

        this.resetCursor();
    }

    resetCursor() {
        this.#cursorIndex = 0;
        this.#isNavigating = false;
        this.#navigationHistoryCache = null;
    }

    async #handleGetPrevious() {
        if (!this.#isNavigating) {
            const history = await this.#loadHistoryFromFile();
            // History from accounting is oldest-to-newest. We need newest-to-oldest for navigation.
            this.#navigationHistoryCache = history.slice().reverse();
            this.#isNavigating = true;
        }

        if (this.#cursorIndex < this.#navigationHistoryCache.length) {
            this.#cursorIndex++;
        }
        const response = {
            command: this.#navigationHistoryCache[this.#cursorIndex - 1] || '',
            index: this.#cursorIndex
        };
        this.dispatch(EVENTS.HISTORY_INDEXED_RESPONSE, response);
    }

    async #handleGetNext() {
        if (this.#cursorIndex > 0) {
            this.#cursorIndex--;
        }
        const response = {
            command: this.#navigationHistoryCache ? (this.#navigationHistoryCache[this.#cursorIndex - 1] || '') : '',
            index: this.#cursorIndex
        };
        this.dispatch(EVENTS.HISTORY_INDEXED_RESPONSE, response);
    }

    #handleGetAllHistory({ respond }) {
        // The history is stored with the most recent command at index 0.
        // For display, we want oldest to newest. Accounting service now provides it in this order.
        (async () => {
            const history = await this.#loadHistoryFromFile();
            if (!history || history.length === 0) {
                respond({ history: [] });
                return;
            }
            // The `history` command numbers from 1 to N, oldest to newest.
            const displayHistory = history.map((item, index) => ` ${String(index + 1).padStart(String(history.length).length)}:  ${item}`);
            respond({ history: displayHistory });
        })();
    }

    async #loadHistoryFromFile() {
        const { value: home } = await this.request(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.HOME, category: 'TEMP' });
        const historyFilePath = `${home}/${HISTORY_FILE}`;
        try {
            const { contents, error } = await this.request(EVENTS.FS_READ_FILE_REQUEST, { path: historyFilePath });
            if (error || contents === undefined) throw new Error(error?.message || 'File content is undefined.');
            return contents.split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            this.log.warn(`Could not load history file: ${error.message}`);
            return [];
        }
    }
}

export { HistoryService };