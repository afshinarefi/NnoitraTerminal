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

import { EnvironmentService } from '../Services/EnvironmentService.js';
import { EVENTS } from '../Core/Events.js';
import { ENV_VARS } from '../Core/Variables.js';
import { ServiceTest } from './ServiceTest.js';

export async function runEnvironmentServiceTests(outputContainer) {
    const LISTENED_EVENTS = [
        EVENTS.GET_ALL_CATEGORIZED_VARS_REQUEST,
        EVENTS.VAR_GET_REQUEST,
        EVENTS.VAR_SET_REQUEST,
        EVENTS.VAR_DEL_REQUEST,
    ];

    // --- GET ---

    // Test 1: Get a TEMP variable that doesn't exist, triggering a default value fetch and write.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.PWD, category: 'TEMP' })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/session/ENV/PWD' })
            .andRespond(Promise.reject(new Error('File not found')))
        .expectInteraction(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, { key: 'PWD' })
            .andRespond({ value: '/home/guest' })
        .expectInteraction(EVENTS.FS_WRITE_FILE_REQUEST, { path: '/var/session/ENV/PWD', content: '/home/guest' })
            .andContinue()
        .expectResponse({
            value: '/home/guest'
        })
        .run('[GET] should fetch and set a default value for a temp variable');

    // Test 2: Get a LOCAL variable that already exists.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_GET_REQUEST, { key: ENV_VARS.USER, category: 'LOCAL' })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/local/ENV/USER' })
            .andRespond({ contents: 'guest' })
        .expectResponse({ value: 'guest' })
        .run('[GET] should fetch an existing local variable from its file');

    // Test 3: Get a SYSTEM variable that doesn't exist and has no default.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_GET_REQUEST, { key: 'UNDEFINED_VAR', category: 'SYSTEM' })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/remote/SYSTEM/UNDEFINED_VAR' })
            .andRespond(Promise.reject(new Error('File not found')))
        .expectInteraction(EVENTS.VAR_UPDATE_DEFAULT_REQUEST, { key: 'UNDEFINED_VAR' })
            .andRespond({ value: undefined }) // No default value provided
        .expectResponse({ value: undefined })
        .run('[GET] should return undefined for a non-existent variable with no default');

    // Test 4: Attempt to get a variable with an invalid category.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_GET_REQUEST, { key: 'ANYKEY', category: 'INVALID_CATEGORY' })
        .expectResponse({ error: new Error('Invalid variable category: INVALID_CATEGORY') })
        .run('[GET] should respond with an error for an invalid category');

    // --- SET ---

    // Test 5: Set a LOCAL variable.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_SET_REQUEST, { key: 'FOO', value: 'bar', category: 'LOCAL' })
        .expectInteraction(EVENTS.FS_WRITE_FILE_REQUEST, { path: '/var/local/ENV/FOO', content: 'bar' })
            .andContinue()
        .run('[SET] should set a variable by writing to its file');

    // Test 6: Set a USERSPACE variable with a number value (should be converted to string).
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_SET_REQUEST, { key: 'NUMVAR', value: '123', category: 'USERSPACE' })
        .expectInteraction(EVENTS.FS_WRITE_FILE_REQUEST, { path: '/var/remote/USERSPACE/NUMVAR', content: '123' })
            .andContinue()
        .run('[SET] should convert a number value to a string before writing');

    // Test 7: Attempt to set a variable with an invalid value type (object).
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_SET_REQUEST, { key: 'BADVAR', value: { a: 1 }, category: 'TEMP' })
        // No interaction should occur because validation fails.
        .run('[SET] should not write a file for an invalid value type (object)');

    // Test 8: Attempt to set a variable with an invalid category.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_SET_REQUEST, { key: 'ANYKEY', value: 'anyvalue', category: 'INVALID_CATEGORY' })
        // No interaction should occur.
        .run('[SET] should not write a file for an invalid category');

    // --- DELETE ---

    // Test 9: Delete a LOCAL variable.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_DEL_REQUEST, { key: 'FOO', category: 'LOCAL' })
        .expectInteraction(EVENTS.FS_DELETE_FILE_REQUEST, { path: '/var/local/ENV/FOO' })
            .andContinue()
        .run('[DELETE] should delete a variable by deleting its file');

    // Test 10: Attempt to delete a variable with an invalid category.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.VAR_DEL_REQUEST, { key: 'ANYKEY', category: 'INVALID_CATEGORY' })
        // No interaction should occur.
        .run('[DELETE] should not delete a file for an invalid category');

    // --- GET ALL ---

    // Test 11: Get all categorized variables.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.GET_ALL_CATEGORIZED_VARS_REQUEST)
        // TEMP
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/session/ENV' })
            .andRespond({ contents: [{ name: 'PWD' }] })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/session/ENV/PWD' })
            .andRespond({ contents: '/home/guest' })
        // LOCAL
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/local/ENV' })
            .andRespond({ contents: [{ name: 'USER' }] })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/local/ENV/USER' })
            .andRespond({ contents: 'localuser' })
        // SYSTEM
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/remote/SYSTEM' })
            .andRespond({ contents: [{ name: 'THEME' }] })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/remote/SYSTEM/THEME' })
            .andRespond({ contents: 'green' })
        // USERSPACE
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/remote/USERSPACE' })
            .andRespond({ contents: [{ name: 'PS1' }] })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/remote/USERSPACE/PS1' })
            .andRespond({ contents: '$ ' })
        .expectResponse({
            categorized: {
                TEMP: {
                    PWD: '/home/guest'
                },
                LOCAL: {
                    USER: 'localuser'
                },
                SYSTEM: {
                    THEME: 'green'
                },
                USERSPACE: {
                    PS1: '$ '
                }
            }
        })
        .run('[GET ALL] should get all categorized variables');

    // Test 12: Get all categorized variables when some categories are empty or fail.
    await (await ServiceTest.create(EnvironmentService, outputContainer))
        .expectListenedTo(LISTENED_EVENTS)
        .trigger(EVENTS.GET_ALL_CATEGORIZED_VARS_REQUEST)
        // TEMP (exists)
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/session/ENV' })
            .andRespond({ contents: [{ name: 'PWD' }] })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/session/ENV/PWD' })
            .andRespond({ contents: '/home/guest' })
        // LOCAL (empty)
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/local/ENV' })
            .andRespond({ contents: [] })
        // SYSTEM (fails to list)
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/remote/SYSTEM' })
            .andRespond(Promise.reject(new Error('Permission denied')))
        // USERSPACE (exists)
        .expectInteraction(EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST, { path: '/var/remote/USERSPACE' })
            .andRespond({ contents: [{ name: 'PS1' }] })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/var/remote/USERSPACE/PS1' })
            .andRespond({ contents: '$ ' })
        .expectResponse({
            categorized: {
                TEMP: {
                    PWD: '/home/guest'
                },
                LOCAL: {},
                SYSTEM: {},
                USERSPACE: {
                    PS1: '$ '
                }
            }
        })
        .run('[GET ALL] should handle empty or failing categories gracefully');
}