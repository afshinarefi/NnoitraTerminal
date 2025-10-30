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
import { BaseService } from '../Core/BaseService.js';

/**
 * @class InputBusService
 * @description Acts as a presenter for the CommandLine component. It handles all user
 * input logic, state management for the prompt, and communication with other services.
 *
 * @listens for `input-request` - Handles all requests for user input, configurable with options.
 * @listens for `history-indexed-response` - Updates the command line view with a history item.
 * @listens for `autocomplete-broadcast` - Updates the command line view with autocomplete suggestions.
 *
 * @dispatches `command-execute-broadcast` - When the user submits a command.
 * @dispatches `input-response-broadcast` - In response to an `input-request`.
 * @dispatches `history-previous-request` - When the user requests the previous history item.
 * @dispatches `history-next-request` - When the user requests the next history item.
 * @dispatches `autocomplete-request` - When the user requests autocomplete.
 */
class InputService extends BaseService{
    #view = null; // The CommandLine component instance
    #inputBuffer = '';
    #isSecret = false;
    // State properties for the current input mode
    #allowHistory = false;
    #allowAutocomplete = false;
    #isNavigatingHistory = false;

    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the CommandLine component.
     */
    setView(view) {
        this.#view = view;
        // Listen for custom events from the command line component.
        this.#view.addEventListener('enter', (e) => this.#submitInput(e.detail.value));
        this.#view.addEventListener('tab', () => this.#requestAutocomplete());
        this.#view.addEventListener('arrow-up', () => this.#requestPreviousHistory());
        this.#view.addEventListener('arrow-down', () => this.#requestNextHistory());
        this.#view.addEventListener('swipe-right', () => this.#requestAutocomplete());
        // Set the initial state to disabled.
        this.#view.setAttribute('disabled', ''); // The view is disabled until an input request is received.
    }

    get eventHandlers() {
        return {
            [EVENTS.INPUT_REQUEST]: this.#handleInputRequest.bind(this),
            [EVENTS.HISTORY_INDEXED_RESPONSE]: this.#handleHistoryResponse.bind(this),
            [EVENTS.AUTOCOMPLETE_BROADCAST]: this.#handleAutocompleteBroadcast.bind(this)
        };
    }

    // --- Internal Event Handlers (called in response to view events) ---

    #submitInput(value) {
        // For any input, finish the read operation, which uses the `respond` function.
        // This handles both normal commands and interactive prompts consistently.
        if (this.respond) {
            this.#finishRead(value);
            this.#isNavigatingHistory = false; // Reset on command submission
            this.#view.clear();
        }
    }

    #requestAutocomplete() {
        this.log.log('Tab key pressed - triggering autocomplete if allowed.', this.#allowAutocomplete);
        if (this.#allowAutocomplete) {
            this.#onAutocompleteRequest(this.#view.getValue());
        }
    }

    #requestPreviousHistory() {
        if (this.#allowHistory) {
            if (!this.#isNavigatingHistory) {
                this.#inputBuffer = this.#view.getValue();
                this.#isNavigatingHistory = true;
            }
            this.#view.setAttribute('disabled', '');
            this.dispatch(EVENTS.HISTORY_PREVIOUS_REQUEST);
        }
    }

    #requestNextHistory() {
        this.log.log('ArrowDown key pressed - requesting next history if allowed.');
        if (this.#allowHistory && this.#isNavigatingHistory) {
            this.#view.setAttribute('disabled', '');
            this.dispatch(EVENTS.HISTORY_NEXT_REQUEST);
        }
    }

    // --- Private Logic ---

    #onAutocompleteRequest(value) {
        if (this.#allowAutocomplete) {
            this.#view.setAttribute('disabled', ''); // Disable input during the request.
            const cursorPosition = this.#view.getCursorPosition(); // This method needs to be added to CommandLine.js
            const beforeCursorText = value.substring(0, cursorPosition);
            const afterCursorText = value.substring(cursorPosition);

            this.log.log('Dispatching autocomplete request:', { beforeCursorText, afterCursorText });
            this.dispatch(EVENTS.AUTOCOMPLETE_REQUEST, { beforeCursorText, afterCursorText });
        }
    }

    #startRead(prompt, options = {}) {
        this.#isSecret = options.isSecret || false;
        // By default, a read operation should not allow history or autocomplete
        this.#allowHistory = options.allowHistory || false; // e.g. login prompt
        this.#allowAutocomplete = options.allowAutocomplete || false; // e.g. shell prompt
        this.#inputBuffer = '';
        this.#isNavigatingHistory = false;

        this.#view.clear();
        this.#view.removeAttribute('disabled');
        this.#view.setAttribute('placeholder', prompt);
        if (this.#isSecret) {
            this.#view.setAttribute('secret', '');
        } else {
            this.#view.removeAttribute('secret');
        }
        this.#view.focus();
    }

    #finishRead(value) {
        // The `respond` function is attached by the event bus's `request` method.
        this.respond({ value });
        this.#view.setAttribute('disabled', ''); // Disable prompt after responding.
    }

    // --- Listener Implementations ---

    #handleInputRequest(payload) {
        const { prompt, options, respond } = payload;
        this.#startRead(prompt, options);
        // Store the respond function to be called later in #finishRead
        this.respond = respond;
    }

    #handleHistoryResponse(payload) {
        if (!this.#view) return;
        this.#view.removeAttribute('disabled');
    
        if (payload.command !== undefined) {
            if (payload.index > 0) {
                this.#view.setValue(payload.command);
                // Use the new generic method to set the icon text
                this.#view.setAttribute('icon-text', `H:${payload.index}`);
            } else {
                // Index 0 means we've returned to the current, un-submitted command.
                this.#view.setValue(this.#inputBuffer);
                this.#isNavigatingHistory = false;
                this.#inputBuffer = '';
                this.#view.removeAttribute('icon-text');
            }
        }
    }

    #handleAutocompleteBroadcast(payload) {
        if (!this.#view) return;

        try {
            const { newTextBeforeCursor, afterCursorText } = payload;

            if (newTextBeforeCursor !== undefined) {
                const fullText = newTextBeforeCursor + afterCursorText;
                this.#view.setValue(fullText);
                this.#view.setCursorPosition(newTextBeforeCursor.length);
            }
        } finally {
            // Always re-enable the prompt after an autocomplete attempt.
            this.#view.removeAttribute('disabled');
        }
    }
}

export { InputService };
