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
import { BaseService } from '../Core/BaseService.js';

/**
 * @class HintService
 * @description Acts as a presenter for the HintBox component. It listens for
 * autocomplete and command execution events to control the visibility and
 * content of the hint box.
 *
 * @listens for `autocomplete-broadcast` - Shows the hint box with suggestions.
 * @listens for `command-execute-broadcast` - Hides the hint box.
 */
class HintService extends BaseService{
    #view = null; // The HintBox component instance
    #resizeObserver;

    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the HintBox component.
     */
    setView(view) {
        this.#view = view;

        // Observe the HintBox view. Whenever its size changes (e.g., when it's
        // shown or hidden), the observer will fire and request a scroll.
        this.#resizeObserver = new ResizeObserver(() => {
            this.dispatch(EVENTS.UI_SCROLL_TO_BOTTOM_REQUEST);
        });
        this.#resizeObserver.observe(this.#view);
    }

    get eventHandlers() {
        return {
            [EVENTS.AUTOCOMPLETE_BROADCAST]: this.#handleShowHints.bind(this),
            [EVENTS.COMMAND_EXECUTE_BROADCAST]: this.#handleHideHints.bind(this)
        };
    }

    /**
     * Shows or hides the hint box based on the received suggestions.
     * @param {object} payload - The event payload.
     * @param {string[]} payload.suggestions - The list of suggestions.
     * @param {number} payload.prefixLength - The length of the common prefix.
     */
    #handleShowHints(payload) {
        if (!this.#view) return;
        const { options = [], description, prefixLength } = payload;

        // Clear existing hints first
        this.#view.innerHTML = '';

        // Show hints if there are multiple options, or a single option that isn't empty,
        // or if a description is provided.
        if (description) {
            const li = document.createElement('li');
            li.textContent = description;
            this.#view.appendChild(li);
            this.#view.setAttribute('prefix-length', '0');
            this.#view.removeAttribute('hidden');
        } else if (options.length > 1) {
            const fragment = document.createDocumentFragment();
            options.forEach((fullSuggestion, index) => {
                const li = document.createElement('li');
                li.textContent = fullSuggestion;
                fragment.appendChild(li);
            });
            this.#view.appendChild(fragment);
            this.#view.setAttribute('prefix-length', prefixLength);
            this.#view.removeAttribute('hidden');
        } else {
            this.#view.setAttribute('hidden', '');
        }
    }

    #handleHideHints() {
        if (this.#view) {
            this.#view.setAttribute('hidden', ''); // Hide the box
            this.#view.innerHTML = ''; // Clear its content
        }
    }
}

export { HintService };