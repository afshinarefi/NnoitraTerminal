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
import { EVENTS } from '../Core/Events.js';
import { BaseService } from '../Core/BaseService.js';

/**
 * @class MediaService
 * @description A service responsible for creating media elements and managing their side effects, like scrolling.
 */
export class DummyService extends BaseService{

    constructor(eventBus) {
        super(eventBus);
        this.log.log('Initializing...');
    }
    get eventHandlers() {
        return {
            [EVENTS.FS_READ_FILE_REQUEST]: this.#handleReadFileRequest.bind(this),
            [EVENTS.FS_WRITE_FILE_REQUEST]: this.#handleWriteFile.bind(this),
            [EVENTS.FS_GET_DIRECTORY_CONTENTS_REQUEST]: this.#handleGetDirectoryContents.bind(this),
            [EVENTS.FS_MAKE_DIRECTORY_REQUEST]: this.#handleMakeDirectory.bind(this),
            [EVENTS.FS_DELETE_FILE_REQUEST]: this.#handleDeleteFile.bind(this),
            [EVENTS.FS_REMOVE_DIRECTORY_REQUEST]: this.#handleRemoveDirectory.bind(this),
            [EVENTS.FS_CHANGE_DIRECTORY_REQUEST]: this.#handleChangeDirectory.bind(this),
            [EVENTS.FS_RESOLVE_PATH_REQUEST]: this.#handleResolvePathRequest.bind(this),
            [EVENTS.FS_GET_PUBLIC_URL_REQUEST]: this.#handleGetPublicUrl.bind(this),
            [EVENTS.VAR_UPDATE_DEFAULT_REQUEST]: this.#handleUpdateDefaultRequest.bind(this),
        };
    }

    #handleReadFileRequest({ path, respond }) {
        this.log.log(`Dummy handling FS_READ_FILE_REQUEST for path: ${path}`);
        const dummyContent = `This is dummy content for the file at ${path}.`;
        respond({ contents: dummyContent });
    }

    #handleWriteFile({ path, content, respond }) {
        this.log.log(`Dummy handling FS_WRITE_FILE_REQUEST for path: ${path} with content length: ${content.length}`);
    }

    #handleGetDirectoryContents({ path, respond }) {
        this.log.log(`Dummy handling FS_GET_DIRECTORY_CONTENTS_REQUEST for path: ${path}`);
        const dummyContents = {
            directories: [{ name: 'dummy_dir' }],
            files: [{ name: 'dummy_file.txt', size: 123 }]
        };
        respond({ contents: dummyContents });
    }

    #handleMakeDirectory({ path, respond }) {
        this.log.log(`Dummy handling FS_MAKE_DIRECTORY_REQUEST for path: ${path}`);
        respond({ success: true });
    }

    #handleDeleteFile({ path, respond }) {
        this.log.log(`Dummy handling FS_DELETE_FILE_REQUEST for path: ${path}`);
        respond({ success: true });
    }

    #handleRemoveDirectory({ path, respond }) {
        this.log.log(`Dummy handling FS_REMOVE_DIRECTORY_REQUEST for path: ${path}`);
        respond({ success: true });
    }

    #handleChangeDirectory({ path, respond }) {
        this.log.log(`Dummy handling FS_CHANGE_DIRECTORY_REQUEST for path: ${path}`);
        respond({ success: true });
    }

    #handleResolvePathRequest({ path, respond }) {
        this.log.log(`Dummy handling FS_RESOLVE_PATH_REQUEST for path: ${path}`);
        respond({ path: `/dummy/resolved/${path.replace(/[^a-zA-Z0-9]/g, '_')}` });
    }

    #handleGetPublicUrl({ path, respond }) {
        this.log.log(`Dummy handling FS_GET_PUBLIC_URL_REQUEST for path: ${path}`);
        respond({ url: `/dummy/public/${path}` });
    }

    #handleUpdateDefaultRequest({ key, respond }) {
        this.log.log(`Dummy handling VAR_UPDATE_DEFAULT_REQUEST for key: ${key}`);
        respond({ value: `dummy_default_for_${key}` });
    }

}