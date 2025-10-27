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
import { EVENTS } from '../Core/Events.js';
import { createLogger } from '../Managers/LogManager.js';
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
    #eventBus;
    #eventNames;
    #view = null; // The CommandLine component instance
    #inputBuffer = '';
    #isSecret = false;

    // Properties for swipe gesture detection
    #touchStartX = 0;
    #touchStartY = 0;

    // State properties for the current input mode
    #allowHistory = false;
    #allowAutocomplete = false;
    #isNavigatingHistory = false;

    constructor(eventBus) {
        super(eventBus);
        this.#eventBus = eventBus;
        this.#registerListeners();
        this.log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the CommandLine component.
     */
    setView(view) {
        this.#view = view;
        // The view delegates its raw user interaction events to this service.
        this.#view.addEventListener('keydown', (e) => this.#onKeyDown(e.detail));
        this.#view.addEventListener('command-submit', (e) => this.#onCommandSubmit(e.detail));
        this.#view.addEventListener('autocomplete-request', (e) => this.#onAutocompleteRequest(e.detail));
        this.#view.addEventListener('touchstart', (e) => this.#onTouchStart(e.detail));
        this.#view.addEventListener('touchend', (e) => this.#onTouchEnd(e.detail));

        // Set the initial state to disabled. The prompt is not usable until the main loop requests input.
        this.#view.setEnabled(false);
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.INPUT_REQUEST, this.#handleInputRequest.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.HISTORY_INDEXED_RESPONSE, this.#handleHistoryResponse.bind(this), this.constructor.name);
        this.#eventBus.listen(EVENTS.AUTOCOMPLETE_BROADCAST, this.#handleAutocompleteBroadcast.bind(this), this.constructor.name);
    }

    // --- Event Handlers ---
    
    /**
     * Handles keydown events delegated from the view.
     * @param {KeyboardEvent} event
     */
    #onKeyDown(event) {
        if (!this.#view) return;

        switch (event.key) {
            // Enter is handled by the 'command-submit' event listener
            // to consolidate submission logic.
            case 'ArrowUp':
                if (this.#allowHistory) {
                    event.preventDefault();
                    if (!this.#isNavigatingHistory) {
                        this.#inputBuffer = this.#view.getValue();
                        this.#isNavigatingHistory = true;
                    }
                    this.#view.setEnabled(false);
                    this.dispatch(EVENTS.HISTORY_PREVIOUS_REQUEST);
                }
                break;

            case 'ArrowDown':
                this.log.log('ArrowDown key pressed - requesting next history if allowed.');
                if (this.#allowHistory && this.#isNavigatingHistory) {
                    event.preventDefault();
                    this.#view.setEnabled(false);
                    this.dispatch(EVENTS.HISTORY_NEXT_REQUEST);
                }
                break;

            case 'Tab':
                this.log.log('Tab key pressed - triggering autocomplete if allowed.', this.#allowAutocomplete);
                event.preventDefault(); // Ensure default tab behavior is stopped
                if (this.#allowAutocomplete) {
                    this.#onAutocompleteRequest(this.#view.getValue());
                }
                break;
        }
    }

    #onCommandSubmit(value) {
        // For any input, finish the read operation, which uses the `respond` function.
        // This handles both normal commands and interactive prompts consistently.
        if (this.respond) {
            this.#finishRead();
            this.#isNavigatingHistory = false; // Reset on command submission
            this.#view.clear();
        }
    }

    #onAutocompleteRequest(value) {
        if (this.#allowAutocomplete) {
            this.#view.setEnabled(false); // Disable input during the request.
            const cursorPosition = this.#view.getCursorPosition(); // This method needs to be added to CommandLine.js
            const beforeCursorText = value.substring(0, cursorPosition);
            const afterCursorText = value.substring(cursorPosition);

            this.log.log('Dispatching autocomplete request:', { beforeCursorText, afterCursorText });
            this.dispatch(EVENTS.AUTOCOMPLETE_REQUEST, { beforeCursorText, afterCursorText });
        }
    }

    // --- Gesture Handlers ---

    /**
     * Records the starting position of a touch event for swipe detection.
     * @param {Touch} touch - The touch object from the event.
     */
    #onTouchStart(touch) {
        if (!touch) return;
        this.#touchStartX = touch.clientX;
        this.#touchStartY = touch.clientY;
    }

    /**
     * Calculates the gesture at the end of a touch and triggers autocomplete on a right swipe.
     * @param {Touch} touch - The touch object from the event.
     */
    #onTouchEnd(touch) {
        if (this.#touchStartX === 0 || !touch) return;

        const deltaX = touch.clientX - this.#touchStartX;
        const deltaY = touch.clientY - this.#touchStartY;

        // Reset start coordinates
        this.#touchStartX = 0;
        this.#touchStartY = 0;

        // Check for a right swipe: significant horizontal movement, minimal vertical movement.
        if (deltaX > 50 && Math.abs(deltaY) < 50) {
            this.#onAutocompleteRequest(this.#view.getValue());
        }
    }

    // --- Core Logic Methods ---

    #startRead(prompt, options = {}, correlationId) {
        this.#isSecret = options.isSecret || false;
        // By default, a read operation should not allow history or autocomplete
        this.#allowHistory = options.allowHistory || false; // e.g. login prompt
        this.#allowAutocomplete = options.allowAutocomplete || false; // e.g. shell prompt
        this.#inputBuffer = '';
        this.#isNavigatingHistory = false;

        this.#view.clear();
        this.#view.setEnabled(true);
        this.#view.setPlaceholder(prompt);
        this.#view.setSecret(this.#isSecret);
        this.#view.focus();
    }

    #finishRead() {
        const value = this.#isSecret ? this.#view.getSecretValue() : this.#view.getValue();

        // The `respond` function is attached by the event bus's `request` method.
        this.respond({ value });
        this.#view.setEnabled(false); // Disable prompt after responding.
    }

    #resetState() {
        // Reset all state to default for a normal command prompt
        this.#isSecret = false;
        this.#allowHistory = true; // Normal prompt allows history
        this.#allowAutocomplete = true; // Normal prompt allows autocomplete
        this.#inputBuffer = '';
        this.#isNavigatingHistory = false;

        this.#view.clear();
        this.#view.setEnabled(true);
        this.#view.setPlaceholder('');
        this.#view.setSecret(false);
    }

    // --- Listener Implementations ---

    #handleInputRequest(payload) {
        const { prompt, options, respond } = payload;
        this.#startRead(prompt, options);
        if (options?.isSecret) {
            this.#view.setKeyIcon();
        }
        // Store the respond function to be called later in #finishRead
        this.respond = respond;
    }

    #handleHistoryResponse(payload) {
        if (!this.#view) return;
        this.#view.setEnabled(true);
    
        if (payload.command !== undefined) {
            if (payload.index > 0) {
                this.#view.setValue(payload.command);
                console.log(payload.index);
                this.#view.setHistoryIcon(payload.index);
            } else {
                // Index 0 means we've returned to the current, un-submitted command.
                this.#view.setValue(this.#inputBuffer);
                this.#isNavigatingHistory = false;
                this.#inputBuffer = '';
                this.#view.setReadyIcon();
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
            this.#view.setEnabled(true);
        }
    }
}

export { InputService };