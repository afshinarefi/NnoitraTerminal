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
import { createLogger } from '../Managers/LogManager.js';

/**
 * @class BaseCommand
 * @description Provides a foundational class for all terminal commands.
 * It automates logger creation and provides default implementations for common command methods.
 */
class BaseCommand {
    /** @protected {object} services - A collection of service functions injected by CommandService. */
    #services;
    /** @protected {Logger} log - A logger instance for the command. */
    #log;

    /**
     * Creates an instance of BaseCommand.
     * @param {object} services - A collection of service functions injected by CommandService.
     */
    constructor(services) {
        this.#services = services;
        // The logger name will be the class name of the concrete command.
        this.#log = createLogger(this.constructor.name.toLowerCase());
        this.#log.log('Initializing...');
    }

    /**
     * Provides access to the injected services.
     * @returns {object} The services object.
     */
    get services() {
        return this.#services;
    }

    /**
     * Provides access to the command's logger.
     * @returns {Logger} The logger instance.
     */
    get log() {
        return this.#log;
    }

    /**
     * Provides autocomplete suggestions for the arguments of the command.
     * Child classes should override this if they need custom autocomplete logic.
     * @param {string[]} currentArgs - The arguments typed so far.
     * @returns {Promise<string[]|{suggestions: string[], description: string}>} An array of suggested arguments or an object with suggestions and a description.
     */
    async autocompleteArgs(currentArgs) {
        return []; // By default, commands take no arguments or have no autocomplete.
    }

    /**
     * Executes the command. Child classes MUST override this.
     * @param {string[]} args - An array of arguments passed to the command.
     * @returns {Promise<HTMLElement>} A promise that resolves with an HTML element containing the command's output.
     * @throws {Error} If not overridden by a child class.
     */
    async execute(args) {
        throw new Error(`Command '${this.constructor.name}' must implement the 'execute' method.`);
    }
}

export { BaseCommand };