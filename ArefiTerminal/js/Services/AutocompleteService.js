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
import { getLongestCommonPrefix } from '../Utils/StringUtil.js';
import { tokenize } from '../Utils/Tokenizer.js';
import { BaseService } from '../Core/BaseService.js';

/**
 * @class AutocompleteService
 * @description Orchestrates autocomplete logic by communicating with other services.
 *
 * @listens for `AUTOCOMPLETE_REQUEST` - The main trigger to start gathering suggestions.
 * @dispatches `AUTOCOMPLETE_BROADCAST` - The final list of suggestions.
 */
export class AutocompleteService extends BaseService{

    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    get eventHandlers() {
        return {
            [EVENTS.AUTOCOMPLETE_REQUEST]: this.#handleAutocompleteRequest.bind(this)
        };
    }

    async #handleAutocompleteRequest({ beforeCursorText, afterCursorText }) {
        this.log.log('Autocomplete request received:', { beforeCursorText, afterCursorText });

        const tokenizedParts = tokenize(beforeCursorText);
        // The new tokenizer preserves delimiters, so we pass the raw tokens.
        const parts = tokenizedParts;

        // The token to complete is the last one. The rest are the preceding arguments.
        const incompleteToken = parts.length > 0 ? parts[parts.length - 1] : '';

        let finalSuggestions = [];
        let completedToken = '';
        let description = '';
        let prefixLength = 0;

        try {
            // 1. Ask the CommandService for the final list of suggestions.
            // The CommandService will delegate to the specific command if necessary.
            const response = await this.request(EVENTS.GET_AUTOCOMPLETE_SUGGESTIONS_REQUEST, { parts });
            const { suggestions: potentialOptions } = response;
            description = response.description;

            if (potentialOptions && potentialOptions.length > 0) {

                // 2. Find the common prefix of the options.
                const filteredOptions = potentialOptions.filter(p => p.startsWith(incompleteToken));

                const commonPrefix = getLongestCommonPrefix(filteredOptions);

                // 3. The newly completed token is the common prefix.
                completedToken = commonPrefix;

                // 4. Determine the final suggestions and if a suffix should be added.
                if (potentialOptions.length === 1 && potentialOptions[0] === completedToken) {
                    finalSuggestions = []; // No more options to show.
                } else {
                    finalSuggestions = filteredOptions;
                    prefixLength = incompleteToken.length;
                }
            } else if (description) {
                // If there are no suggestions, but there is a description, pass it along.
                // This is for hinting arguments like usernames.
                completedToken = incompleteToken;   // Keep what the user typed.
                finalSuggestions = [];              // No actual suggestions to complete.
            }

        } catch (error) {
            this.log.error('Error during autocomplete request:', error);
        }

        // 5. Construct the new command line parts and broadcast.
        // Reconstruct the string before the cursor using the original tokenized parts.
        // The most robust way to create the new text is to append the "newly completed"
        // part of the token to the original text.
        const completionSuffix = completedToken.substring(incompleteToken.length);
        const newTextBeforeCursor = beforeCursorText + completionSuffix;

        this.dispatch(EVENTS.AUTOCOMPLETE_BROADCAST, { newTextBeforeCursor, options: finalSuggestions, afterCursorText, description, prefixLength });
    }
}