/**
 * Nnoitra Terminal
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
 * A fluent test runner for services.
 * It provides a declarative API to define test scenarios, mock dependencies,
 * and assert outcomes.
 */
export class ServiceTest {
    /**
     * Custom error class to distinguish test assertion failures from other errors.
     */
    static AssertionError = class extends Error {};

    #serviceInstance;
    #dispatchedEvents = [];
    #listenedEvents = [];
    #expectedListens = [];
    #expectedDispatches = [];
    #expectedResponse = undefined;
    #actualResponse = undefined;
    #triggerEvent = null;
    #triggerPayload = {};
    #serviceName = '';
    #outputContainer = null;
    
    // Containers for structured, collapsible logging
    #testContainer = null;
    #interactionsContainer = null;
    #interactionsPass = true;
    #verificationContainer = null;

    /**
     * @param {class} ServiceClass - The service class to be tested.
     * @param {HTMLElement} outputContainer - The DOM element to render test results to.
     */
    constructor(ServiceClass, outputContainer) {
        // Use console.log here as this is the earliest point of execution.
        console.log(`[ServiceTest] CONSTRUCTOR for ${ServiceClass.name}`);
        this.#serviceName = ServiceClass.name;
        this.#outputContainer = outputContainer;
    }

    /**
     * Asynchronous factory to create and initialize a ServiceTest instance.
     * This is necessary because service instantiation can have async side effects.
     * @param {class} ServiceClass - The service class to be tested.
     * @param {HTMLElement} outputContainer - The DOM element to render test results to.
     */
    static async create(ServiceClass, outputContainer) {
        // 1. Create the test instance first, so we have its methods available.
        const testInstance = new this(ServiceClass, outputContainer);

        // 2. Create a mock event bus that is bound to the test instance's methods.
        const mockEventBus = {
            listen: (eventName) => testInstance.#listenedEvents.push(eventName),
            request: testInstance.#request.bind(testInstance),
            dispatch: testInstance.#dispatch.bind(testInstance),
        };
        testInstance.#serviceInstance = ServiceClass.create(mockEventBus);
        return testInstance;
    }

    /**
     * Defines the event that will trigger the test.
     * @param {string} eventName - The event to trigger on the service's handler.
     * @param {object} payload - The payload for the trigger event.
     * @returns {this}
     */
    trigger(eventName, payload = {}) {
        this.#log(`[ServiceTest] -> .trigger('${eventName}')`);
        this.#triggerEvent = eventName;
        this.#triggerPayload = payload;
        return this;
    }

    /**
     * Defines an expected interaction (a request or dispatch) from the service.
     * @param {string} eventName - The name of the event the service is expected to send.
     * @param {object} payload - The expected payload of the event.
     * @returns {{andRespond: function(any): ServiceTest}}
     */
    expectInteraction(eventName, payload) {
        this.#log(`[ServiceTest] -> .expectInteraction('${eventName}')`);
        const interaction = { eventName, payload };
        this.#expectedDispatches.push(interaction);

        const chain = {
            andRespond: (response) => {
                this.#log(`[ServiceTest]    -> .andRespond()`);
                interaction.mockResponse = response;
                return this; // Return the main ServiceTest instance for further chaining.
            },
            expectInteraction: this.expectInteraction.bind(this),
            andContinue: () => this,
        };

        // Return an object with an `andRespond` method to chain the mock response.
        return chain;
    }

    /**
     * Defines the events the service is expected to listen for.
     * @param {string[]} events - An array of expected event names.
     * @returns {this}
     */
    expectListenedTo(events) {
        this.#log(`[ServiceTest] -> .expectListenedTo()`);
        // Sort for consistent comparison
        this.#expectedListens = events.sort();
        return this;
    }

    /**
     * Defines the expected final response from the triggered handler.
     * @param {any} response - The expected response payload.
     * @returns {this}
     */
    expectResponse(response) {
        this.#log(`[ServiceTest] -> .expectResponse()`);
        // Use a special object to signify that we expect a response, even if it's undefined
        this.#expectedResponse = { payload: response };
        return this;
    }

    /**
     * Runs the test scenario.
     * @param {string} testName - A descriptive name for the test case.
     */
    async run(testName) {
        // --- Create the main container for this test ---
        this.#testContainer = document.createElement('details');
        const summary = document.createElement('summary');
        this.#testContainer.appendChild(summary);
        this.#outputContainer.appendChild(this.#testContainer);
        
        const testTitle = `${this.#serviceName}${testName ? `: ${testName}` : ''}`;
        summary.textContent = `⏳ ${testTitle}`;

        try {
            // --- 1. Static check: What is the service listening for? ---
            const listenersContainer = this.#createDetailsSection('LISTENERS', this.#testContainer);
            const listenersPass = this.#compareListens(listenersContainer);
            this.#updateSectionSummary(listenersContainer, 'LISTENERS', listenersPass);
            
            if (!this.#triggerEvent) {
                throw new Error('Test execution failed: No trigger event defined. Use .trigger().');
            }

            const handler = this.#serviceInstance.eventHandlers[this.#triggerEvent];
            if (!handler) {
                throw new Error(`Test execution failed: Service ${this.#serviceName} has no handler for event ${this.#triggerEvent}.`);
            }

            // --- Create containers for interactions and verification ---
            this.#interactionsContainer = this.#createDetailsSection('INTERACTIONS & VERIFICATION', this.#testContainer);

            // Create a sub-section just for the trigger information.
            const triggerContainer = this.#createDetailsSection('Trigger & Execution', this.#interactionsContainer);
            this.#log(`--- 1. TRIGGERING ---\n${this.#triggerEvent}: ${JSON.stringify(this.#triggerPayload, null, 2)}`, '#fbbf24', triggerContainer);

            // The `respond` function for the trigger event is now a spy.
            const triggerPayloadWithRespond = { 
                ...this.#triggerPayload, 
                respond: (response) => { this.#actualResponse = { payload: response }; } 
            };

            // --- 2. Execute the service's event handler ---
            this.#log('--> Executing service handler...', '#d1d5db', triggerContainer);
            try {
                await handler.call(this.#serviceInstance, triggerPayloadWithRespond);
                // If the handler completes without throwing an internal error, mark this section as passed.
                this.#updateSectionSummary(triggerContainer, 'Trigger & Execution', true);
            } catch (e) {
                // This catches assertion errors from failed interactions. Re-throw to halt the test.
                if (e.message.startsWith('Interaction #')) throw e;

                // Otherwise, it's an internal error from the service itself, which we log here.
                this.#updateSectionSummary(triggerContainer, 'Trigger & Execution', false);
                this.#logError(`--> Service handler threw an internal error (this may be expected): ${e.message}`, triggerContainer);
            }
            // --- 3. Verify the results ---
            const testPassed = this.#verifyResults(testTitle);
            
            // --- 4. Update the main test summary with the final result ---
            summary.textContent = `${testPassed ? '✅' : '❌'} ${testTitle}`;
            if (!testPassed) this.#testContainer.open = true; // Keep failed tests open

        } catch (e) {
            // This top-level catch handles failures during the test run (e.g., a mismatched interaction).
            // It ensures that a single test failure doesn't stop the entire suite.
            summary.textContent = `❌ ${testTitle}`;
            this.#testContainer.open = true;
            // If the interactions container exists, mark it as failed and log the error there.
            if (this.#interactionsContainer) {
                this.#updateSectionSummary(this.#interactionsContainer, 'INTERACTIONS & VERIFICATION', false);
                const responseContainer = this.#createDetailsSection('Final Response', this.#interactionsContainer);
                this.#updateSectionSummary(responseContainer, 'Final Response', false);
                this.#logError(`--- TEST HALTED ---\n${e.message}`, responseContainer);
            }
        }
    }

    async #request(eventName, payload) {
        const interactionIndex = this.#dispatchedEvents.length; // The index of the current interaction
        const expectedInteraction = this.#expectedDispatches[interactionIndex];

        const actualEvent = { eventName, payload };
        this.#dispatchedEvents.push(actualEvent);

        // Create a collapsible section for this specific interaction.
        const interactionDetails = this.#createDetailsSection('', this.#interactionsContainer);

        // --- Immediate Verification ---
        const pass = expectedInteraction && expectedInteraction.eventName === eventName && JSON.stringify(expectedInteraction.payload) === JSON.stringify(payload);
        if (!pass) {
            this.#updateSectionSummary(interactionDetails, `Interaction #${interactionIndex + 1} (request): ${this.#serviceName} => ${eventName}`, false);
            this.#log('--- EXPECTED ---', '#22c55e', interactionDetails); // Green
            this.#log(JSON.stringify(expectedInteraction || {}, null, 2), '#a7f3d0', interactionDetails);
            this.#log('--- ACTUAL ---', '#ef4444', interactionDetails); // Red
            this.#log(JSON.stringify(actualEvent, null, 2), '#fca5a5', interactionDetails);
            this.#interactionsPass = false;
            // Throw a specific error that can be identified by the service.
            throw new ServiceTest.AssertionError(`Interaction #${interactionIndex + 1} failed.`);
        }

        this.#updateSectionSummary(interactionDetails, `Interaction #${interactionIndex + 1} (request): ${this.#serviceName} => ${eventName}`, true);
        this.#log(JSON.stringify(payload, null, 2), '#d1d5db', interactionDetails);

        // --- Mock Response Handling ---
        // This part remains the same, providing the mock response if configured.

        if (expectedInteraction && 'mockResponse' in expectedInteraction) {
            const response = typeof expectedInteraction.mockResponse === 'function'
                ? await expectedInteraction.mockResponse(payload)
                : expectedInteraction.mockResponse;

            if (response instanceof Promise) {
                this.#log('<= Responding with (Promise)', '#38bdf8', interactionDetails); // Sky blue for responses
                // Attach a no-op catch handler to the promise before returning it.
                // This prevents the browser from flagging it as an "uncaught" rejection
                // before the service's `await` has a chance to handle it.
                response.catch(() => {});
            } else {
                this.#log(`<= Responding with:\n${JSON.stringify(response, null, 2)}`, '#38bdf8', interactionDetails); // Sky blue for responses
            }
            // Return the promise directly to the service, which will await it.
            return response instanceof Promise ? response : Promise.resolve(response);
        }

        this.#log(' -> No mock response configured for this step. Resolving with {}.', '#9ca3af', interactionDetails);
        return Promise.resolve({});
    }

    #dispatch(eventName, payload) {
        const interactionIndex = this.#dispatchedEvents.length;
        const expectedInteraction = this.#expectedDispatches[interactionIndex];

        const actualEvent = { eventName, payload };
        this.#dispatchedEvents.push(actualEvent);

        // Create a collapsible section for this specific interaction.
        const interactionDetails = this.#createDetailsSection('', this.#interactionsContainer);

        // --- Immediate Verification ---
        const pass = expectedInteraction && expectedInteraction.eventName === eventName && JSON.stringify(expectedInteraction.payload) === JSON.stringify(payload);
        if (!pass) {
            this.#updateSectionSummary(interactionDetails, `Interaction #${interactionIndex + 1} (dispatch): ${this.#serviceName} -> ${eventName}`, false);
            this.#log('--- EXPECTED ---', '#22c55e', interactionDetails); // Green
            this.#log(JSON.stringify(expectedInteraction || {}, null, 2), '#a7f3d0', interactionDetails);
            this.#log('--- ACTUAL ---', '#ef4444', interactionDetails); // Red
            this.#log(JSON.stringify(actualEvent, null, 2), '#fca5a5', interactionDetails);
            this.#interactionsPass = false;
            // Throw a specific error that can be identified by the service.
            throw new ServiceTest.AssertionError(`Interaction #${interactionIndex + 1} failed.`);
        }

        this.#updateSectionSummary(interactionDetails, `Interaction #${interactionIndex + 1} (dispatch): ${this.#serviceName} -> ${eventName}`, true);
        this.#log(JSON.stringify(payload, null, 2), '#d1d5db', interactionDetails);
    }

    #compareListens(container) {
        const actualSorted = [...this.#listenedEvents].sort();
        const expectedSorted = [...this.#expectedListens].sort();

        if (JSON.stringify(actualSorted) !== JSON.stringify(expectedSorted)) {
            this.#logError(`❌ Listeners do not match expectation.`, container);
            this.#logError('--- EXPECTED LISTENERS ---\n' + JSON.stringify(expectedSorted, null, 2), container);
            this.#logError('--- ACTUAL LISTENERS ---\n' + JSON.stringify(actualSorted, null, 2), container);
            return false;
        } else {
            this.#log(JSON.stringify(actualSorted, null, 2), '#6b7280', container); // Muted gray for static info
            return true;
        }
    }

    #verifyResults(testTitle) {
        let responsePass = true;

        // Check if all expected interactions were met
        if (this.#dispatchedEvents.length < this.#expectedDispatches.length) {
            this.#logError(`❌ Not all expected interactions were met. Expected ${this.#expectedDispatches.length}, but only ${this.#dispatchedEvents.length} occurred.`, this.#interactionsContainer);
            this.#interactionsPass = false;
        }

        // If we've gotten this far without an interaction failing and throwing an error,
        // we can proceed with the final response verification.
        const responseContainer = this.#createDetailsSection('Final Response', this.#interactionsContainer);
        this.#log('--> Service handler finished.', '#d1d5db', responseContainer);

        // Compare the final response
        if (this.#expectedResponse !== undefined) {
            const expectedResponse = JSON.stringify(this.#expectedResponse, null, 2);
            const actualResponse = JSON.stringify(this.#actualResponse, null, 2);
            this.#log(`<= Received final response:\n${actualResponse || 'undefined'}`, '#38bdf8', responseContainer);

            if (expectedResponse !== actualResponse) {
                this.#logError(`❌ Final response does not match expectation.`, responseContainer);
                this.#log('--- EXPECTED RESPONSE ---', '#22c55e', responseContainer);
                this.#log(expectedResponse, '#a7f3d0', responseContainer);
                this.#log('--- ACTUAL RESPONSE ---', '#ef4444', responseContainer);
                this.#log(actualResponse, '#fca5a5', responseContainer);
                responsePass = false;
            } else {
                this.#logSuccess(`✅ Final response matched expectation.`, responseContainer);
            }
        }
        this.#updateSectionSummary(responseContainer, 'Final Response', responsePass);

        const overallPass = this.#interactionsPass && responsePass;
        this.#updateSectionSummary(this.#interactionsContainer, 'INTERACTIONS & VERIFICATION', overallPass);

        if (!overallPass) throw new Error(`Test failed for: ${testTitle}`);
        return true;
    }

    #log(message, color, container = this.#testContainer) {
        if (container) {
            const line = document.createElement('div');
            line.textContent = message;
            if (color) {
                line.style.color = color;
            }
            container.appendChild(line);
        } else {
            console.log(message);
        }
    }

    #logSuccess(message, container) {
        this.#log(message, '#73c991', container); // A pleasant green
    }

    #logError(message, container) {
        this.#log(message, '#f87171', container); // A soft red
    }

    #createDetailsSection(summaryText, parentContainer) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = `⏳ ${summaryText}`;
        details.appendChild(summary);
        parentContainer.appendChild(details);
        return details;
    }

    #updateSectionSummary(container, summaryText, pass) {
        const summary = container.querySelector('summary');
        summary.textContent = `${pass ? '✅' : '❌'} ${summaryText}`;
        if (pass) container.open = false; else container.open = true;
    }
}