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
 * @description Central repository for all storage API method names.
 * This prevents the use of "magic strings" when dispatching STORAGE_API_REQUEST events.
 */
export const STORAGE_APIS = {
    GET_NODE: 'getNode',
    SET_NODE: 'setNode',
    DELETE_NODE: 'deleteNode',
    LIST_KEYS_WITH_PREFIX: 'listKeysWithPrefix',
    LOCK_NODE: 'lockNode',
    UNLOCK_NODE: 'unlockNode',
};
