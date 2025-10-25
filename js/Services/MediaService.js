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
import { createLogger } from '../Managers/LogManager.js';
import { Media } from '../Components/Media.js';

const log = createLogger('MediaService');

/**
 * @class MediaService
 * @description A service responsible for creating media elements and managing their side effects, like scrolling.
 */
export class MediaService {
    #eventBus;

    constructor(eventBus) {
        this.#eventBus = eventBus;
        this.#registerListeners();
        log.log('Initializing...');
    }

    #registerListeners() {
        this.#eventBus.listen(EVENTS.MEDIA_REQUEST, this.#handleMediaRequest.bind(this), this.constructor.name);
    }

    #handleMediaRequest({ src, respond }) {
        const mediaElement = new Media();
        mediaElement.src = src;

        // Observe the media element. When it loads and its size changes,
        // automatically request a scroll to keep the prompt in view.
        const observer = new ResizeObserver(() => {
            this.#eventBus.dispatch(EVENTS.UI_SCROLL_TO_BOTTOM_REQUEST);
        });
        observer.observe(mediaElement);

        respond({ mediaElement });
    }
}