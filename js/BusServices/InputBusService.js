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

const log = createLogger('InputBusService');

/**
 * @class InputBusService
 * @description Acts as a presenter for the CommandLine component. It handles all user
 * input logic, state management for the prompt, and communication with other services.
 *
 * @listens for `input-request` - Handles all requests for user input, configurable with options.
 * @listens for `history-indexed-response` - Updates the command line view with a history item.
 * @listens for `autocomplete-broadcast` - Updates the command line view with autocomplete suggestions.
 *
 * @dispatches `input-response` - In response to an `input-request`.
 * @dispatches `history-previous-request` - When the user requests the previous history item.
 * @dispatches `history-next-request` - When the user requests the next history item.
 * @dispatches `autocomplete-request` - When the user requests autocomplete.
 */
class InputBusService {
    #eventBus;
    #eventNames;
    #view = null; // The CommandLine component instance
    #inputBuffer = '';
    #isReading = false;
    #isSecret = false;
    #secretValue = '';

    #allowHistory = false;
    #allowAutocomplete = false;

    static EVENTS = {
        PROVIDE_INPUT: 'provideInput',
        USE_HISTORY_PREVIOUS: 'useHistoryPrevious',
        USE_HISTORY_NEXT: 'useHistoryNext',
        USE_AUTOCOMPLETE_REQUEST: 'useAutocompleteRequest',
        LISTEN_HISTORY_RESPONSE: 'listenHistoryResponse',
        LISTEN_AUTOCOMPLETE_BROADCAST: 'listenAutocompleteBroadcast',
        USE_INPUT_RESPONSE: 'useInputResponse'
    };

    constructor(eventBus, eventNameConfig) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
        this.#registerListeners();
        log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the CommandLine component.
     */
    setView(view) {
        this.#view = view;
        // The view should delegate its keydown events to this service.
        this.#view.addEventListener('keydown', (e) => this.onKeyDown(e));
        this.#view.addEventListener('input', (e) => this.#onInput(e));
    }

    #registerListeners() {
        this.#eventBus.listen(this.#eventNames[InputBusService.EVENTS.PROVIDE_INPUT], (payload) => {
            // When a command requests input, this service enters "read" mode.
            const { prompt, options, correlationId } = payload;
            this.read(prompt, options, correlationId);
        });

        this.#eventBus.listen(this.#eventNames[InputBusService.EVENTS.LISTEN_HISTORY_RESPONSE], (payload) => {
            if (this.#view) {
                this.#view.setValue(payload.command);
                // This logic could be expanded to show the history index icon
            }
        });

        this.#eventBus.listen(this.#eventNames[InputBusService.EVENTS.LISTEN_AUTOCOMPLETE_BROADCAST], (payload) => {
            if (this.#view) {
                this.#view.setValue(payload.suggestions[0] || this.#view.getValue());
                // This logic could be expanded to show the hint box
            }
        });
    }

    /**
     * Handles all keydown events delegated from the view.
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        if (!this.#view) return;

        if (this.#isReading) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.#finishRead();
            }
            return;
        }

        if (this.#view.isDisabled()) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }

        this.#view.focus();

        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                const command = this.#view.getValue();
                // For any input, finish the read operation, which dispatches the response.
                this.#finishRead();
                break;

            case 'ArrowUp':
                if (this.#allowHistory) {
                    event.preventDefault();
                    if (this.#inputBuffer === '') {
                        this.#inputBuffer = this.#view.getValue();
                    }
                    this.#eventBus.dispatch(this.#eventNames[InputBusService.EVENTS.USE_HISTORY_PREVIOUS]);
                }
                break;

            case 'ArrowDown':
                if (this.#allowHistory) {
                    event.preventDefault();
                    this.#eventBus.dispatch(this.#eventNames[InputBusService.EVENTS.USE_HISTORY_NEXT]);
                }
                break;

            case 'Tab':
                if (this.#allowAutocomplete) {
                    event.preventDefault();
                    const parts = this.#view.getValue().split(/\s+/);
                    this.#eventBus.dispatch(this.#eventNames[InputBusService.EVENTS.USE_AUTOCOMPLETE_REQUEST], { parts });
                }
                break;
        }
    }

    /**
     * Handles the input event from the view, primarily for masking secret input.
     * @param {InputEvent} event
     */
    #onInput(event) {
        if (!this.#isSecret || !this.#view) return;

        const input = this.#view.getInputElement();
        // This is a simplified masking logic. A robust implementation would handle
        // pastes, deletions, and cursor movements more gracefully.
        const lastChar = event.data;
        if (lastChar) {
            this.#secretValue += lastChar;
        } else {
            // Handle backspace
            this.#secretValue = this.#secretValue.slice(0, -1);
        }
        input.value = '●'.repeat(this.#secretValue.length);
    }

    read(prompt, options = {}, correlationId) {
        this.#isReading = true;
        this.#isSecret = options.isSecret || false;
        this.#allowHistory = options.allowHistory || false;
        this.#allowAutocomplete = options.allowAutocomplete || false;
        this.#secretValue = '';
        this.correlationId = correlationId; // Store the ID for the response
        this.#inputBuffer = '';
        this.#view.clear();
        this.#view.enable();
        this.#view.setPlaceholder(prompt);
        this.#view.focus();
    }

    #finishRead() {
        const value = this.#isSecret ? this.#secretValue : this.#view.getValue();

        // Dispatch the response event with the value and the original correlationId.
        this.#eventBus.dispatch(this.#eventNames[InputBusService.EVENTS.USE_INPUT_RESPONSE], {
            value: value,
            correlationId: this.correlationId
        });

        this.#isReading = false;
        this.#isSecret = false;
        this.#allowHistory = false;
        this.#allowAutocomplete = false;
        this.#secretValue = '';
        this.correlationId = null;
        this.#view.clear();
        this.#view.enable();
        this.#view.setPlaceholder('');
        this.#inputBuffer = '';
    }
}

export { InputBusService };