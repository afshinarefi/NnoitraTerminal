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
// CommandHistory.js

/**
 * @class HistoryService
 * @description Manages the command history for the terminal, allowing users to navigate
 * through previously executed commands. It supports adding new commands, resetting the cursor,
 * and retrieving commands in chronological order.
 */
class HistoryService {
    /** @private {string[]} #history - An array storing the command history, with the most recent command at the beginning. */
    #history = [];
    /** @private {number} #cursorIndex - The current position in the history array (0-based), where 0 means the newest command. */
    #cursorIndex = 0;
    /** @private {number} #maxSize - The maximum number of commands to store in the history. */
    #maxSize = 1000; 
    /** @private {EnvironmentService} #environmentService - Reference to the EnvironmentService for managing HISTSIZE. */
    #environmentService;

    /**
     * Creates an instance of HistoryService.
     * @param {object} services - The services object containing the EnvironmentService.
     */
    constructor(services) {
        this.#environmentService = services.environment;
        // Initialize maxSize from environment, or use default if not set.
        const histSizeEnv = this.#environmentService.getVariable('HISTSIZE');
        if (histSizeEnv && !isNaN(parseInt(histSizeEnv))) {
            this.#maxSize = parseInt(histSizeEnv);
        } else {
            // If HISTSIZE is not set or invalid, set it in the environment with the default.
            this.#environmentService.setVariable('HISTSIZE', String(this.#maxSize));
        }
    }

    /**
     * Adds a command to the history list and persists it if the user is logged in.
     * Empty or sequentially repeated commands are ignored.
     * @param {string} command - The command string to add.
     */
    async addCommand(command) {
        const trimmedCommand = command.trim();
        if (!trimmedCommand) return;

        // Prevent adding repeated commands sequentially.
        if (this.#history.length > 0 && this.#history[0] === trimmedCommand) {
            return;
        }

        // Add the new command to the beginning of the history array.
        this.#history.unshift(trimmedCommand);

        // If the user is logged in, save the command to the remote history.
        const token = this.#environmentService.getVariable('TOKEN');
        if (token && this.#environmentService.getVariable('USER') !== 'guest') {
            try {
                const formData = new FormData();
                formData.append('token', token);
                formData.append('command', trimmedCommand);
                await fetch('/server/accounting.py?action=add_history', {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.error('Failed to save command to remote history:', error);
            }
        }

        // Update maxSize from environment in case it changed
        const histSizeEnv = this.#environmentService.getVariable('HISTSIZE');
        this.#maxSize = (histSizeEnv && !isNaN(parseInt(histSizeEnv))) ? parseInt(histSizeEnv) : 1000;

        // Enforce maximum history size.
        if (this.#history.length > this.#maxSize) {
            this.#history.pop(); // Remove the oldest command.
        }

        this.resetCursor(); // Reset cursor to the newest position after adding a command.
    }
    
    /**
     * Resets the history cursor index to the "new command" position (i.e., beyond the last history item).
     */
    resetCursor() {
        this.#cursorIndex = 0;
    }

    /**
     * Returns the current 0-based cursor index in the history.
     * @returns {number} The current cursor index.
     */
    getCursorIndex() {
        return this.#cursorIndex;
    }

    /**
     * Moves the cursor up (backwards in time) through the history.
     * @returns {{command: string, index: number}} An object containing the command string and its 1-based index.
     *   Returns the oldest command if at the beginning of history.
     */
    getPrevious() {
        if (this.#cursorIndex < this.#history.length) {
            this.#cursorIndex++;
        }
        
        return {
            command: this.#history[this.#cursorIndex - 1],
            index: this.#cursorIndex // 1-based index for display.
        };
    }

    /**
     * Moves the cursor down (forwards in time) through the history.
     * @returns {{command: string, index: number}} An object containing the command string and its 1-based index.
     *   Returns an empty string and index 0 if at the end of history (ready for a new command).
     */
    getNext() {
        // Only decrement if we are NOT already at the end (this.#history.length).
        if (this.#cursorIndex > 0) {
            this.#cursorIndex--;
        }
        
        if (this.#cursorIndex > 0) {
            // Return the next command.
            return {
                command: this.#history[this.#cursorIndex - 1],
                index: this.#cursorIndex // 1-based index for display.
            };
        }
        
        // If the cursor is at the end (ready for a new command).
        return {
            command: '', // Empty string for a new prompt.
            index: this.#cursorIndex // Next expected command index (0 for new command).
        };
    }

    /**
     * Retrieves the complete history list with 1-based indices.
     * @returns {{command: string, index: number}[]} An array of history objects, each with a command string and its 1-based index.
     */
    getFullHistory() {
        return this.#history.map((command, index) => ({
            command: command,
            index: index + 1
        }));
    }

    /**
     * Fetches and loads the command history from the server for a logged-in user.
     */
    async loadRemoteHistory() {
        const token = this.#environmentService.getVariable('TOKEN');
        if (!token || this.#environmentService.getVariable('USER') === 'guest') {
            return; // Not logged in, do nothing.
        }

        try {
            const formData = new FormData();
            formData.append('token', token);
            const response = await fetch('/server/accounting.py?action=get_history', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.status === 'success' && Array.isArray(result.history)) {
                this.#history = result.history;
                this.resetCursor();
            }
        } catch (error) {
            console.error('Failed to load remote history:', error);
        }
    }

    /**
     * Clears the current history array and resets the cursor. Used on logout.
     */
    clearHistory() {
        this.#history = [];
        this.resetCursor();
    }
}

export { HistoryService };
