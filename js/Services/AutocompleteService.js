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
/**
 * @class AutocompleteService
 * @extends EventTarget
 * @description Manages autocomplete functionality for the terminal. It listens for autocomplete requests
 * from the command line, queries the command service for suggestions, and dispatches events with filtered
 * and processed suggestions.
 */
class AutocompleteService extends EventTarget {

  /** @private {CommandLine} #commandLine - Reference to the CommandLine component for event listening. */
  #commandLine;
  /** @private {CommandService} #commandService - Reference to the CommandService for fetching command suggestions. */
  #commandService;

  /**
   * Creates an instance of AutocompleteService.
   * @param {CommandLine} commandLine The CommandLine component instance.
   * @param {object} services The object containing all services.
   */
  constructor(commandLine, services) {
    super();
    this.#commandLine = commandLine;
    this.#commandService = services.command;
    // Listen for autocomplete requests from the command line.
    this.#commandLine.addEventListener('autocomplete-request', async (event) => {
      await this.autocompleteReceive(event);
    });
  }

  /**
   * Finds the Longest Common Prefix (LCP) among a list of strings.
   * @private
   * @param {string[]} strings - The list of strings to compare.
   * @returns {string} The longest common prefix, or an empty string if none exists.
   */
  #findSharedPrefix(strings) {
    // 1. Handle edge cases (empty or single-item list)
    if (!strings || strings.length === 0) {
      return "";
    }
    if (strings.length === 1) {
      return strings[0];
    }

    // 2. Initialize the prefix with the first string
    let prefix = strings[0];

    // 3. Iterate through the rest of the strings (starting from index 1)
    for (let i = 1; i < strings.length; i++) {
      const currentString = strings[i];

      // 4. Refine the prefix:
      // While the current prefix is NOT found at the beginning (index 0) of the current string,
      // shorten the prefix by one character from the end.
      while (currentString.indexOf(prefix) !== 0) {
        // Shorten the prefix: e.g., "apple" -> "appl"
        prefix = prefix.substring(0, prefix.length - 1);

        // If the prefix becomes empty, there is no common prefix.
        if (prefix.length === 0) {
          return "";
        }
      }
    }

    // 5. Return the final common prefix
    return prefix;
  }

  /**
   * Handles an autocomplete request event from the CommandLine.
   * Processes the input, fetches suggestions, finds the shared prefix, and dispatches
   * an 'autocomplete-suggestions' event.
   * @param {CustomEvent} event - The custom 'autocomplete-request' event containing the current command input.
   * @param {string} event.detail - The current command string from the prompt.
   */
  async autocompleteReceive(event) {
    event.stopPropagation();
    const input = event.detail;
    console.log('[AutocompleteService] Received input:', `"${input}"`);
    
    // Split the input into parts. If the input is empty or just spaces, parts will be [''].
    // If it ends with a space, the last part will be an empty string, which is what we want.
    const parts = input.split(/\s+/);
    console.log('[AutocompleteService] Split parts:', parts);
    
    // The part we are trying to complete is always the last one.
    const partial = parts[parts.length - 1];
    console.log('[AutocompleteService] Partial to complete:', `"${partial}"`);
    
    // The context for autocompletion is always the full set of parts.
    const commandContext = parts;
    console.log('[AutocompleteService] Context for CommandService:', commandContext);

    // Await all possible completions from the command service based on the context.
    const allSuggestions = await this.#commandService.autocomplete(commandContext);
    console.log('[AutocompleteService] Suggestions from CommandService:', allSuggestions);

    // Filter suggestions based on the partial word the user is typing.
    const filteredSuggestions = [...new Set(allSuggestions.filter(name => name.startsWith(partial)))];
    console.log('[AutocompleteService] Filtered suggestions:', filteredSuggestions);

    // Find the longest common prefix among the filtered suggestions.
    const sharedPrefix = this.#findSharedPrefix(filteredSuggestions);
    console.log('[AutocompleteService] Shared prefix:', `"${sharedPrefix}"`);

    let completeCommand = input; // Default to original input

    if (filteredSuggestions.length > 0) {
      // Reconstruct the command with the completed part.
      const currentParts = parts.slice(0, -1);
      currentParts.push(sharedPrefix);
      completeCommand = currentParts.join(" ");
    }
    console.log('[AutocompleteService] Completed command string:', `"${completeCommand}"`);

    const isInputEndingWithSpace = input.endsWith(" ");

    if (
      filteredSuggestions.length === 1 &&
      !isInputEndingWithSpace &&
      !filteredSuggestions[0].endsWith('/')
    ) {
      completeCommand += " ";
    }

    const autocompleteEvent = new CustomEvent('autocomplete-suggestions', {
      bubbles: true,
      composed: true,
      detail: {
        suggestions: filteredSuggestions,
        complete: completeCommand,
        prefix: sharedPrefix.length
      }
    });
    console.log('[AutocompleteService] Dispatching suggestions event with detail:', autocompleteEvent.detail);
    this.dispatchEvent(autocompleteEvent);
  }
}

export { AutocompleteService };
