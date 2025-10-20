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
import { getLongestCommonPrefix } from '../Utils/StringUtil.js';

const log = createLogger('AutocompleteService');

/**
 * @class AutocompleteService
 * @description Orchestrates autocomplete logic by communicating with other services.
 *
 * @listens for `AUTOCOMPLETE_REQUEST` - The main trigger to start gathering suggestions.
 * @dispatches `AUTOCOMPLETE_BROADCAST` - The final list of suggestions.
 */
export class AutocompleteService {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.AUTOCOMPLETE_REQUEST, this.#handleAutocompleteRequest.bind(this));
    }

    async #handleAutocompleteRequest({ beforeCursorText, afterCursorText }) {
        log.log('Autocomplete request received:', { beforeCursorText, afterCursorText });

        const parts = beforeCursorText.split(/\s+/).filter(p => p !== '');
        let finalSuggestions = [];
        let completedToken = '';

        try {
            // 1. Ask the CommandService for the final list of suggestions.
            // The CommandService will delegate to the specific command if necessary.
            const response = await this.#eventBus.request(EVENTS.GET_AUTOCOMPLETE_SUGGESTIONS_REQUEST, { parts });
            const { suggestions: potentialOptions, input: partToComplete } = response;

            if (potentialOptions && potentialOptions.length > 0) {
                // 2. Find the common prefix of the options.
                const commonPrefix = getLongestCommonPrefix(potentialOptions.filter(p => p.startsWith(partToComplete)));

                // 3. The newly completed token is the common prefix.
                completedToken = commonPrefix;

                // 4. Determine the final suggestions and if a suffix should be added.
                if (potentialOptions.length === 1 && potentialOptions[0] === completedToken) {
                    // A single, exact match was found.
                    if (completedToken.endsWith('/')) {
                        // It's a directory, do nothing.
                    } else {
                        // It's a command or file, add a space.
                        completedToken += ' ';
                    }
                    finalSuggestions = []; // No more options to show.
                } else if (commonPrefix) {
                    finalSuggestions = potentialOptions.map(s => s.substring(commonPrefix.length));
                } else {
                    finalSuggestions = potentialOptions.map(s => s.substring(partToComplete.length));
                }
            }

        } catch (error) {
            log.error('Error during autocomplete request:', error);
        }

        // 5. Construct the new command line parts and broadcast.
        const beforeCursorTokens = parts.slice(0, -1);
        if (completedToken) {
            beforeCursorTokens.push(completedToken);
        } else {
            beforeCursorTokens.push(parts[parts.length - 1] || '');
        }

        this.#eventBus.dispatch(EVENTS.AUTOCOMPLETE_BROADCAST, { beforeCursorTokens, options: finalSuggestions, afterCursorText });
    }
}