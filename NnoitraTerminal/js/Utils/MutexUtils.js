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
 * @class Mutex
 * @description Provides a simple async mutex implementation for resource locking based on keys.
 */
export class Mutex {
    #operationQueues = new Map();

    /**
     * Acquires a lock for a given key.
     * @param {string} key The key for the resource to lock.
     * @param {string} [explicitLockId] - An existing lock ID to re-acquire. If provided, it will
     * either grant access if the ID is correct or throw an error if it's invalid. If omitted,
     * it will queue to acquire a new lock.
     * @returns {Promise<string>} A promise that resolves with the lock ID.
     */
    async acquire(key, explicitLockId) {
        const queue = this.#operationQueues.get(key);

        if (explicitLockId) {
            if (queue?.lockId && queue.lockId === explicitLockId) {
                // The correct lock is already held, grant access without waiting.
                return explicitLockId;
            } else {
                // An incorrect or expired lock ID was provided.
                throw new Error(`Invalid lock ID '${explicitLockId}' for operation on '${key}'. Current lock is '${queue?.lockId}'.`);
            }
        } else {
            // No explicit lockId, so queue for a new lock.
            let newGateResolver;
            const newGatePromise = new Promise(resolve => { newGateResolver = resolve; });

            const lastGatePromise = queue?.promise || Promise.resolve();

            if (!queue) {
                this.#operationQueues.set(key, { promise: newGatePromise });
            } else {
                queue.promise = newGatePromise;
            }

            await lastGatePromise;

            const lockId = crypto.randomUUID();
            const currentQueue = this.#operationQueues.get(key);
            currentQueue.resolve = newGateResolver;
            currentQueue.lockId = lockId;

            return lockId;
        }
    }

    /**
     * Releases a lock for a given key if the lockId is valid.
     * @param {string} key The key for the resource to unlock.
     * @param {string} lockId The ID of the lock to release.
     */
    release(key, lockId) {
        const queueEntry = this.#operationQueues.get(key);
        if (queueEntry && queueEntry.lockId === lockId) {
            queueEntry.resolve();
        } else {
            throw new Error(`Attempted to unlock '${key}' with an invalid or expired lockId.`);
        }
    }
}
