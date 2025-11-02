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

import { HistoryService } from '../Services/HistoryService.js';
import { EVENTS } from '../Core/Events.js';
import { ServiceTest } from './ServiceTest.js';

export async function runHistoryServiceTests(outputContainer) {
    await (await ServiceTest.create(HistoryService, outputContainer))
        .expectListenedTo([
            EVENTS.HISTORY_PREVIOUS_REQUEST,
            EVENTS.HISTORY_NEXT_REQUEST,
            EVENTS.COMMAND_EXECUTE_BROADCAST,
            EVENTS.HISTORY_GET_ALL_REQUEST,
            EVENTS.VAR_UPDATE_DEFAULT_REQUEST,
            EVENTS.USER_CHANGED_BROADCAST
        ])
        .trigger(EVENTS.COMMAND_EXECUTE_BROADCAST, { commandString: 'cat file.txt' })

        .expectInteraction(EVENTS.VAR_GET_REQUEST, { key: 'HOME', category: 'TEMP' }).andRespond({ value: '/home/guest' })
        .expectInteraction(EVENTS.FS_READ_FILE_REQUEST, { path: '/home/guest/.nnoitra_history' }).andRespond({ contents: 'ls -l\ncd /var' })
        .expectInteraction(EVENTS.VAR_GET_REQUEST, { key: 'HISTSIZE', category: 'SYSTEM' }).andRespond({ value: '1000' })
        .expectInteraction(EVENTS.FS_WRITE_FILE_REQUEST, {
            path: '/home/guest/.nnoitra_history',
            content: 'ls -l\ncd /var\ncat file.txt'
        }).andContinue()

        .run('should read history, add a new command, and write back');
}