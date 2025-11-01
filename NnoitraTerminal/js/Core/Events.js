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
 * @description Central repository for all event names used in the application's event bus.
 */
export const EVENTS = {
    // Environment
    GET_ALL_CATEGORIZED_VARS_REQUEST: 'get-all-categorized-vars-request',
    VAR_EXPORT_REQUEST: 'variable-export-request',
    VAR_GET_LOCAL_REQUEST: 'variable-get-local-request',
    VAR_GET_SYSTEM_REQUEST: 'variable-get-system-request',
    VAR_GET_TEMP_REQUEST: 'variable-get-temp-request',
    VAR_GET_USERSPACE_REQUEST: 'variable-get-userspace-request',
    VAR_SET_LOCAL_REQUEST: 'variable-set-local-request',
    VAR_SET_SYSTEM_REQUEST: 'variable-set-system-request',
    VAR_SET_TEMP_REQUEST: 'variable-set-temp-request',
    VAR_SET_USERSPACE_REQUEST: 'variable-set-userspace-request',
    VAR_DEL_LOCAL_REQUEST: 'variable-delete-local-request',
    VAR_DEL_SYSTEM_REQUEST: 'variable-delete-system-request',
    VAR_DEL_TEMP_REQUEST: 'variable-delete-temp-request',
    VAR_DEL_USERSPACE_REQUEST: 'variable-delete-userspace-request',
    
    // Local Storage
    LOAD_LOCAL_VAR: 'load-local-variable', // For LocalStorageService
    RESET_LOCAL_VAR: 'reset-local-variable', // For LocalStorageService
    SAVE_LOCAL_VAR: 'save-local-variable', // For LocalStorageService
    DELETE_LOCAL_VAR: 'delete-local-variable', // For LocalStorageService
    
    // Accounting & User
    VAR_UPDATE_DEFAULT_REQUEST: 'variable-update-default-request',
    USER_CHANGED_BROADCAST: 'user-changed-broadcast',
    LOGIN_REQUEST: 'login-request',
    LOGOUT_REQUEST: 'logout-request',
    PASSWORD_CHANGE_REQUEST: 'password-change-request',
    ADD_USER_REQUEST: 'add-user-request',
    IS_LOGGED_IN_REQUEST: 'is-logged-in-request',
    VAR_SAVE_REMOTE_REQUEST: 'variable-save-remote-request',
    VAR_LOAD_REMOTE_REQUEST: 'variable-load-remote-request',
    VAR_DEL_REMOTE_REQUEST: 'variable-delete-remote-request',

    // History
    HISTORY_PREVIOUS_REQUEST: 'history-previous-request',
    HISTORY_NEXT_REQUEST: 'history-next-request',
    HISTORY_INDEXED_RESPONSE: 'history-indexed-response',
    HISTORY_LOAD_REQUEST: 'history-load-request',
    HISTORY_GET_ALL_REQUEST: 'history-get-all-request',
    COMMAND_PERSIST_REQUEST: 'command-persist-request',

    // Command & Execution
    COMMAND_EXECUTE_BROADCAST: 'command-execute-broadcast',
    COMMAND_EXECUTION_FINISHED_BROADCAST: 'command-execution-finished-broadcast',
    AUTOCOMPLETE_REQUEST: 'autocomplete-request',
    AUTOCOMPLETE_BROADCAST: 'autocomplete-broadcast',
    GET_AUTOCOMPLETE_SUGGESTIONS_REQUEST: 'get-autocomplete-suggestions-request',
    GET_ALIASES_REQUEST: 'get-aliases-request',
    SET_ALIASES_REQUEST: 'set-aliases-request',
    GET_COMMAND_LIST_REQUEST: 'get-command-list-request',
    GET_COMMAND_META_REQUEST: 'get-command-meta-request',

    // Input
    INPUT_REQUEST: 'input-request',

    // UI
    CLEAR_SCREEN_REQUEST: 'clear-screen-request',
    THEME_CHANGED_BROADCAST: 'theme-changed-broadcast',
    UI_SCROLL_TO_BOTTOM_REQUEST: 'ui-scroll-to-bottom-request',
    SET_THEME_REQUEST: 'set-theme-request',
    GET_VALID_THEMES_REQUEST: 'get-valid-themes-request',
    MEDIA_REQUEST: 'media-request',

    // Filesystem
    FS_CHANGE_DIRECTORY_REQUEST: 'fs-change-directory-request',
    FS_IS_DIR_REQUEST: 'fs-is-directory-request',
    FS_GET_DIRECTORY_CONTENTS_REQUEST: 'fs-get-directory-contents-request',
    FS_GET_FILE_CONTENTS_REQUEST: 'fs-get-file-contents-request',
    FS_GET_PUBLIC_URL_REQUEST: 'fs-get-public-url-request',
    FS_RESOLVE_PATH_REQUEST: 'fs-resolve-path-request',

    // Unified Storage API
    STORAGE_API_REQUEST: 'storage-api-request',
};