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

const log = createLogger('HintBusService');

/**
 * @class HintBusService
 * @description Acts as a presenter for the HintBox component. It controls the visibility
 * and content of the hint box based on application-wide events.
 *
 * @listens for `autocomplete-broadcast` - To show autocomplete suggestions in the hint box.
 * @listens for `command-execute-broadcast` - To hide the hint box when a command is executed.
 */
class HintBusService {
    #eventBus;
    #eventNames;
    #view = null; // The HintBox component instance

    static EVENTS = {
        LISTEN_AUTOCOMPLETE_BROADCAST: 'listenAutocompleteBroadcast',
        LISTEN_COMMAND_EXECUTE: 'listenCommandExecute'
    };

    constructor(eventBus, eventNameConfig) {
        this.#eventBus = eventBus;
        this.#eventNames = eventNameConfig;
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
        this.#eventBus.listen(this.#eventNames[HintBusService.EVENTS.LISTEN_AUTOCOMPLETE_BROADCAST], (payload) => {
            if (this.#view) {
                if (payload.suggestions && payload.suggestions.length > 1) {
                    // The prefix is needed to correctly display multi-word suggestions.
                    this.#view.show(payload.suggestions, payload.prefix);
                } else {
                    this.#view.hide();
                }
            }
        });

        this.#eventBus.listen(this.#eventNames[HintBusService.EVENTS.LISTEN_COMMAND_EXECUTE], () => {
            if (this.#view) {
                this.#view.hide();
            }
        });
    }
}

export { HintBusService };