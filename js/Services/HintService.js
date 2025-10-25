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

const log = createLogger('HintService');

/**
 * @class HintService
 * @description Acts as a presenter for the HintBox component. It listens for
 * autocomplete and command execution events to control the visibility and
 * content of the hint box.
 *
 * @listens for `autocomplete-broadcast` - Shows the hint box with suggestions.
 * @listens for `command-execute-broadcast` - Hides the hint box.
 */
class HintService {
    #eventBus;
    #view = null; // The HintBox component instance

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
        log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the HintBox component.
     */
    setView(view) {
        this.#view = view;
    }

    #registerListeners() {
        // Listen for autocomplete suggestions to display them
        this.#eventBus.listen(EVENTS.AUTOCOMPLETE_BROADCAST, (payload) => { // eslint-disable-line no-unused-vars
            this.#handleShowHints(payload);
        }, this.constructor.name);

        // Listen for command submission to hide the hints
        this.#eventBus.listen(EVENTS.COMMAND_EXECUTE_BROADCAST, () => { // eslint-disable-line no-unused-vars
            this.#handleHideHints();
        }, this.constructor.name);
    }

    /**
     * Shows or hides the hint box based on the received suggestions.
     * @param {object} payload - The event payload.
     * @param {string[]} payload.suggestions - The list of suggestions.
     * @param {number} payload.prefixLength - The length of the common prefix.
     */
    #handleShowHints(payload) {
        if (!this.#view) return;

        const { newTextBeforeCursor, options, description } = payload;

        // Show hints if there are multiple options, or a single option that isn't empty,
        // or if a description is provided.
        if ((options && (options.length > 1 || (options.length === 1 && options[0] !== ''))) || description) {
            if (description) {
                // If a description is provided, show it as-is with no prefix highlighting.
                this.#view.show([description], 0);
            } else {
                // For normal suggestions, calculate the prefix to highlight.
                const lastToken = newTextBeforeCursor.split(/[\s/]/).pop() || '';
                const fullSuggestions = options.map(suffix => lastToken + suffix);
                this.#view.show(fullSuggestions, lastToken.length);
            }
        } else {
            this.#view.hide();
        }
    }

    #handleHideHints() {
        if (this.#view) {
            this.#view.hide();
        }
    }
}

export { HintService };