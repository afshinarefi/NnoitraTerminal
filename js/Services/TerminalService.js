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
import { TerminalItem } from '../Components/TerminalItem.js';

const log = createLogger('TerminalService');

// Define constants for environment variable keys to improve maintainability.
const VAR_PS1 = 'PS1';
const VAR_USER = 'USER';
const VAR_HOST = 'HOST';
const VAR_PWD = 'PWD';

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
        this.#eventBus.listen(EVENTS.INPUT_RESPONSE, this.#handleInputResponse.bind(this));
        this.#eventBus.listen(EVENTS.COMMAND_EXECUTION_FINISHED_BROADCAST, this.#requestNextCommand.bind(this));
        this.#eventBus.listen(EVENTS.CLEAR_SCREEN_REQUEST, this.#handleClear.bind(this));
        this.#eventBus.listen(EVENTS.VAR_GET_RESPONSE, this.#handlePromptVariablesResponse.bind(this));
    }

    /**
     * Starts the main terminal loop by requesting the first command.
     */
    start() {
        this.#requestNextCommand();
    }

    #handleClear() {
        if (!this.#view) return;
        this.#view.clearOutput();
        this.#nextId = 1;
        // After clearing, we might want to re-prompt the user.
        // However, the 'clear' command itself will finish and trigger the next prompt.
    }

    #handleInputResponse({ value: commandString }) {
        if (!this.#view) return;

        // Now that we have the command, populate the pending terminal item.
        this.#currentItem.setContent(commandString);
        // The setContent method now handles making the command part visible.

        const outputContainer = { element: this.#currentItem.getOutput() };

        // Dispatch the event for the CommandService to execute the command.
        this.#eventBus.dispatch(EVENTS.COMMAND_EXECUTE_BROADCAST, {
            commandString,
            outputElement: outputContainer
        });
    }

    #formatHeader(vars) {
        const format = vars[VAR_PS1] || '[{user}@{host}:{path}]';
        const timestamp = new Date();
        const replacements = {
            user: vars[VAR_USER] || 'guest',
            host: vars[VAR_HOST] || 'arefi.info',
            path: vars[VAR_PWD] || '~',
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

    #requestNextCommand() {
        // First, request the variables needed to build the prompt header (PS1).
        const correlationId = `prompt-vars-${Date.now()}`;
        this.#eventBus.dispatch(EVENTS.VAR_GET_REQUEST, {
            keys: [VAR_PS1, VAR_USER, VAR_HOST, VAR_PWD],
            correlationId: correlationId
        });
    }

    #requestInput() {
        const prompt = '';

        // Standard options for a command prompt.
        const options = {
            allowHistory: true,
            allowAutocomplete: true,
            isSecret: false
        };

        // Dispatch the request for user input.
        this.#eventBus.dispatch(EVENTS.INPUT_REQUEST, { prompt, options });
    }

    #handlePromptVariablesResponse({ values, correlationId }) {
        // Ensure this response is for our prompt variable request.
        if (!correlationId || !correlationId.startsWith('prompt-vars-')) {
            return;
        }

        // Now that we have the variables, format the header, create the item, and request input.
        const headerText = this.#formatHeader(values);
        this.#createAndDisplayHeader(headerText);
        this.#requestInput();
    }
}

export { TerminalService };