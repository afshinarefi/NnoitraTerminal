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
import { EVENTS } from './Events.js';
import { createLogger } from '../Managers/LogManager.js';
import { ENV_VARS } from '../Constants.js';
import { TerminalItem } from '../Components/TerminalItem.js';

const log = createLogger('TerminalService');

const DEFAULT_PS1 = '[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}';
const DEFAULT_HOST = window.location.hostname;

/**
 * @class TerminalService
 * @description Acts as a presenter for the terminal's output area. It handles
 * creating and populating TerminalItem components in response to command execution.
 * It also orchestrates the main command execution loop.
 *
 * @listens for `input-response` - Receives user input and triggers command execution.
 * @listens for `command-execution-finished-broadcast` - Restarts the input loop.
 * @listens for `clear-screen-request` - Clears the terminal output.
 */
class TerminalService {
    #eventBus;
    #view = null; // The Terminal component instance
    #nextId = 1;
    #currentItem = null; // The currently pending terminal item

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
        log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the Terminal component.
     */
    setView(view) {
        this.#view = view;
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.COMMAND_EXECUTION_FINISHED_BROADCAST, this.#runCommandLoop.bind(this));
        this.#eventBus.listen(EVENTS.UI_SCROLL_TO_BOTTOM_REQUEST, this.#handleScrollToBottom.bind(this));
        this.#eventBus.listen(EVENTS.CLEAR_SCREEN_REQUEST, this.#handleClear.bind(this));
        this.#eventBus.listen(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, this.#handleUpdateDefaultRequest.bind(this));
    }

    /**
     * Starts the main terminal loop by requesting the first command.
     */
    async start() {
        // Check for core variables and set defaults if they don't exist.
        // Start the main command loop.
        this.#runCommandLoop();
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        switch (key) {
            case ENV_VARS.PS1:
                this.#eventBus.dispatch(EVENTS.VAR_SET_USERSPACE_REQUEST, { key, value: DEFAULT_PS1 });
                respond({ value: DEFAULT_PS1 });
                break;
            case ENV_VARS.HOST:
                this.#eventBus.dispatch(EVENTS.VAR_SET_TEMP_REQUEST, { key, value: DEFAULT_HOST });
                respond({ value: DEFAULT_HOST });
                break;
        }
    }

    #formatHeader(vars) {
        // Defaults are now set in the environment, so we can expect the values to be present.
        const format = vars[ENV_VARS.PS1];
        const timestamp = new Date();
        const replacements = {
            user: vars[ENV_VARS.USER],
            host: vars[ENV_VARS.HOST],
            path: vars[ENV_VARS.PWD],
            year: timestamp.getFullYear(),
            month: String(timestamp.getMonth() + 1).padStart(2, '0'),
            day: String(timestamp.getDate()).padStart(2, '0'),
            hour: String(timestamp.getHours()).padStart(2, '0'),
            minute: String(timestamp.getMinutes()).padStart(2, '0'),
            second: String(timestamp.getSeconds()).padStart(2, '0')
        };

        return format.replace(/\{(\w+)\}/g, (match, key) => replacements[key] ?? match);
    }

    #createAndDisplayHeader(headerText) {
        const id = this.#nextId++;
        const item = new TerminalItem();
        
        // Set only the header content initially and make it visible.
        item.setHeader(id, headerText);

        this.#view.appendToOutput(item);
        this.#currentItem = item; // Store as the pending item.
    }

    async #runCommandLoop() {
        try {
            // 1. Lazily get all required environment variables for the prompt.
            // This will trigger the new default-request flow if they don't exist.
            const { values: promptVars } = await this.#eventBus.request(EVENTS.VAR_GET_REQUEST, {
                keys: [ENV_VARS.PS1, ENV_VARS.USER, ENV_VARS.HOST, ENV_VARS.PWD]
            });

            // 2. Format and display the header.
            const headerText = this.#formatHeader(promptVars);
            this.#createAndDisplayHeader(headerText);

            // 2. Request user input and wait for the response.
            const { value: commandString } = await this.#requestInput();

            // 3. Populate the command item and dispatch for execution.
            if (this.#currentItem) {
                this.#currentItem.setContent(commandString);
                const outputContainer = { element: this.#currentItem.getOutput() };
                log.log(`Executing command: "${commandString}"`);
                this.#eventBus.dispatch(EVENTS.COMMAND_EXECUTE_BROADCAST, {
                    commandString,
                    outputElement: outputContainer
                });
            }

        } catch (error) {
            log.error("Error in command loop:", error);
            // If something fails, dispatch the finished event to try again.
            this.#eventBus.dispatch(EVENTS.COMMAND_EXECUTION_FINISHED_BROADCAST);
        }
    }

    #handleClear() {
        if (!this.#view) return;
        this.#view.clearOutput();
        this.#nextId = 1;
    }

    #handleScrollToBottom() {
        if (this.#view) {
            this.#view.scrollToBottom();
        }
    }

    #requestInput() {
        const prompt = '';

        // Standard options for a command prompt.
        const options = {
            allowHistory: true,
            allowAutocomplete: true,
            isSecret: false
        };

        // Request user input and return the promise.
        return this.#eventBus.request(EVENTS.INPUT_REQUEST, { prompt, options }, 0);
    }
}

export { TerminalService };