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
import { ENV_VARS } from '../Core/Variables.js';
import { CommandBlock } from '../Components/CommandBlock.js';
import { fetchTextFile } from '../Utils/FileUtil.js';
import { BaseService } from '../Core/BaseService.js';

const DEFAULT_PS1 = '[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}';
const DEFAULT_HOST = window.location.hostname;

/**
 * @class TerminalService
 * @description Acts as a presenter for the terminal's output area. It handles
 * creating and populating TerminalItem components in response to command execution.
 * It also orchestrates the main command execution loop.
 *
 * @listens for `input-response` - Receives user input and triggers command execution.
 * @listens for `command-execution-finished-broadcast` - Restarts the input loop.
 * @listens for `clear-screen-request` - Clears the terminal output.
 */
class TerminalService extends BaseService{
    static MOTD_FILE = new URL('../../data/motd.txt', import.meta.url);
    #view = null; // The Terminal component instance
    #nextId = 1;
    #currentItem = null; // The currently pending terminal item

    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }

    /**
     * Connects this presenter service to its view component.
     * @param {object} view - The instance of the Terminal component.
     */
    setView(view) {
        this.#view = view;
    }
    get eventHandlers() {
        return {
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
            [EVENTS.CLEAR_SCREEN_REQUEST]: this.#handleClear.bind(this),
            [EVENTS.UI_SCROLL_TO_BOTTOM_REQUEST]: this.#handleScrollToBottom.bind(this),
            [EVENTS.COMMAND_EXECUTION_FINISHED_BROADCAST]: this.#runCommandLoop.bind(this)
        };
    }

    /**
     * Starts the main terminal loop by requesting the first command.
     */
    async start() {
        // Load the Message of the Day into the welcome area.
        if (this.#view && this.#view.welcomeOutputView) {
            try {
                const motdText = await fetchTextFile(TerminalService.MOTD_FILE);
                console.log(motdText);
                // Use white-space to preserve formatting without needing a <pre> tag.
                this.#view.welcomeOutputView.style.whiteSpace = 'pre-wrap';
                this.#view.welcomeOutputView.textContent = motdText;
            } catch (error) {
                this.log.error('Failed to load motd.dat:', error);
            }
        }
        // Start the main command input loop.
        this.#runCommandLoop();
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        switch (key) {
            case ENV_VARS.PS1:
                respond({ value: DEFAULT_PS1 });
                break;
            case ENV_VARS.HOST:
                respond({ value: DEFAULT_HOST });
                break;
        }
    }

    #formatHeader(vars) {
        // Defaults are now set in the environment, so we can expect the values to be present.
        const format = vars[ENV_VARS.PS1];
        const timestamp = new Date();
        const replacements = {
            user: vars[ENV_VARS.USER],
            host: vars[ENV_VARS.HOST],
            path: vars[ENV_VARS.PWD],
            year: timestamp.getFullYear(),
            month: String(timestamp.getMonth() + 1).padStart(2, '0'),
            day: String(timestamp.getDate()).padStart(2, '0'),
            hour: String(timestamp.getHours()).padStart(2, '0'),
            minute: String(timestamp.getMinutes()).padStart(2, '0'),
            second: String(timestamp.getSeconds()).padStart(2, '0')
        };

        return format.replace(/\{(\w+)\}/g, (match, key) => replacements[key] ?? match);
    }

    #createAndDisplayHeader(headerText) {
        const id = this.#nextId++;
        const item = new CommandBlock();
        
        item.setAttribute('item-id', id);
        item.setAttribute('header-text', headerText);

        this.#view.appendToOutput(item);
        this.#currentItem = item; // Store as the pending item.
    }

    async #runCommandLoop() {
        try {
            // 1. Get all required environment variables for the prompt from their specific categories.
            const [ps1, user, host, pwd] = await Promise.all([
                this.request(EVENTS.VAR_GET_USERSPACE_REQUEST, { key: ENV_VARS.PS1 }),
                this.request(EVENTS.VAR_GET_LOCAL_REQUEST, { key: ENV_VARS.USER }),
                this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.HOST }),
                this.request(EVENTS.VAR_GET_TEMP_REQUEST, { key: ENV_VARS.PWD })
            ]);

            // 2. Format and display the header.
            const promptVars = { PS1: ps1.value, USER: user.value, HOST: host.value, PWD: pwd.value };
            const headerText = this.#formatHeader(promptVars);
            this.#createAndDisplayHeader(headerText);

            // 2. Request user input and wait for the response.
            const { value: commandString } = await this.#requestInput();

        // 3. Populate the command item and dispatch for execution.
            if (this.#currentItem) {
                this.#currentItem.setAttribute('command', commandString);
                const outputContainer = { element: this.#currentItem };
                this.log.log(`Executing command: "${commandString}"`);
                this.#view.scrollToBottom();
                this.dispatch(EVENTS.COMMAND_EXECUTE_BROADCAST, {
                    commandString,
                    outputElement: outputContainer
                });
            }

        } catch (error) {
            this.log.error("Error in command loop:", error);
            // If something fails, dispatch the finished event to try again.
            this.dispatch(EVENTS.COMMAND_EXECUTION_FINISHED_BROADCAST);
        }
    }

    #handleClear() {
        if (!this.#view) return;
        this.#view.clearOutput();
        this.#nextId = 1;
    }

    #handleScrollToBottom() {
        if (this.#view) {
            this.#view.scrollToBottom();
        }
    }

    #requestInput() {
        const prompt = '';

        // Standard options for a command prompt.
        const options = {
            allowHistory: true,
            allowAutocomplete: true,
            isSecret: false
        };

        // Request user input and return the promise.
        return this.request(EVENTS.INPUT_REQUEST, { prompt, options }, 0);
    }
}

export { TerminalService };