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

const log = createLogger('TerminalBusService');

/**
 * @class TerminalBusService
 * @description Orchestrates the main command loop of the terminal. It requests user input,
 * waits for the response, triggers command execution, and then repeats the cycle.
 *
 * @listens for `input-response` - To receive the command string submitted by the user.
 * @listens for `command-execution-finished-broadcast` - To know when to request the next command.
 * @listens for `user-changed-broadcast` - To restart the command loop on login/logout.
 * @listens for `clear-screen-request` - To clear the terminal view.
 *
 * @dispatches `input-request` - To ask the InputBusService to prompt the user for a command.
 * @dispatches `command-execute-broadcast` - To trigger command execution.
 */
class TerminalBusService {
    #eventBus;
    #eventNames;
    #view = null; // The Terminal component instance
    #currentCorrelationId = 0;

    static EVENTS = {
        LISTEN_INPUT_RESPONSE: 'listenInputResponse',
        LISTEN_EXECUTION_FINISHED: 'listenExecutionFinished',
        LISTEN_USER_CHANGED: 'listenUserChanged',
        USE_INPUT_REQUEST: 'useInputRequest',
        USE_COMMAND_EXECUTE_BROADCAST: 'useCommandExecuteBroadcast',
        LISTEN_CLEAR_SCREEN: 'listenClearScreen'
    };

    constructor(eventBus, eventNameConfig) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
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

    /**
     * Starts the main application loop by requesting the first command.
     */
    start() {
        this.#requestNextCommand();
    }

    #registerListeners() {
        // When we get a response for our input request, trigger the next step.
        this.#eventBus.listen(this.#eventNames[TerminalBusService.EVENTS.LISTEN_INPUT_RESPONSE], (payload) => {
            // We only care about the response that matches our request for a command.
            if (payload.correlationId === this.#currentCorrelationId && payload.value.trim() && this.#view) {
                const commandString = payload.value;
                const outputElement = this.#view.createCommandOutput(commandString);
                this.#eventBus.dispatch(this.#eventNames[TerminalBusService.EVENTS.USE_COMMAND_EXECUTE_BROADCAST], { commandString, outputElement });

                // For now, we assume the command finishes instantly and request the next one.
                // A more robust solution would wait for a 'command-finished' event.
                this.#eventBus.dispatch(this.#eventNames[TerminalBusService.EVENTS.LISTEN_EXECUTION_FINISHED]);
            } else {
                // If input was empty, just request the next command immediately.
                this.#requestNextCommand();
            }
        });

        // When a command has finished executing, we can ask for the next one.
        this.#eventBus.listen(this.#eventNames[TerminalBusService.EVENTS.LISTEN_EXECUTION_FINISHED], () => {
            this.#requestNextCommand();
        });

        // If the user logs in or out, restart the command loop.
        this.#eventBus.listen(this.#eventNames[TerminalBusService.EVENTS.LISTEN_USER_CHANGED], () => {
            this.#requestNextCommand();
        });

        this.#eventBus.listen(this.#eventNames[TerminalBusService.EVENTS.LISTEN_CLEAR_SCREEN], () => {
            if (this.#view) {
                this.#view.clearOutput();
            }
        });
    }

    /**
     * Dispatches a request for the next command from the user.
     */
    #requestNextCommand() {
        this.#currentCorrelationId++;
        log.log(`Requesting next command with correlationId: ${this.#currentCorrelationId}`);
        this.#eventBus.dispatch(this.#eventNames[TerminalBusService.EVENTS.USE_INPUT_REQUEST], {
            prompt: '', // Main prompt is handled by PS1, not here.
            options: { allowHistory: true, allowAutocomplete: true },
            correlationId: this.#currentCorrelationId
        });
    }
}

export { TerminalBusService };