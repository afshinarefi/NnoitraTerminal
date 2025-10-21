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

/**
 * @description Central repository for all event names used in the application's event bus.
 */
export const EVENTS = {
    // Environment
    ENV_RESET_REQUEST: 'environment-reset-request',
    VAR_GET_REQUEST: 'variable-get-request',
    VAR_GET_RESPONSE: 'variable-get-response',
    VAR_CHANGED_BROADCAST: 'variable-changed-broadcast',
    VAR_UPDATE_DEFAULT_REQUEST: 'variable-update-default-request',
    VAR_PERSIST_REQUEST: 'variable-persist-request',
    VAR_LOAD_REMOTE_REQUEST: 'variable-load-remote-request',
    VAR_SET_TEMP_REQUEST: 'variable-set-temp-request',
    VAR_SET_LOCAL_REQUEST: 'variable-set-local-request',
    VAR_SET_REMOTE_REQUEST: 'variable-set-remote-request',
    VAR_SET_USERSPACE_REQUEST: 'variable-set-userspace-request',
    GET_ALL_CATEGORIZED_VARS_REQUEST: 'get-all-categorized-vars-request',

    // Accounting & User
    USER_CHANGED_BROADCAST: 'user-changed-broadcast',
    LOGIN_REQUEST: 'login-request',
    LOGOUT_REQUEST: 'logout-request',
    PASSWORD_CHANGE_REQUEST: 'password-change-request',
    IS_LOGGED_IN_REQUEST: 'is-logged-in-request',

    // History
    HISTORY_PREVIOUS_REQUEST: 'history-previous-request',
    HISTORY_NEXT_REQUEST: 'history-next-request',
    HISTORY_INDEXED_RESPONSE: 'history-indexed-response',
    HISTORY_LOAD_REQUEST: 'history-load-request',
    COMMAND_PERSIST_REQUEST: 'command-persist-request',

    // Command & Execution
    COMMAND_EXECUTE_BROADCAST: 'command-execute-broadcast',
    COMMAND_EXECUTION_FINISHED_BROADCAST: 'command-execution-finished-broadcast',
    AUTOCOMPLETE_REQUEST: 'autocomplete-request',
    AUTOCOMPLETE_BROADCAST: 'autocomplete-broadcast',
    GET_ALIASES_REQUEST: 'get-aliases-request',
    SET_ALIASES_REQUEST: 'set-aliases-request',
    GET_AUTOCOMPLETE_CONTEXT_REQUEST: 'get-autocomplete-context-request',
    GET_COMMAND_LIST_REQUEST: 'get-command-list-request',
    GET_COMMAND_META_REQUEST: 'get-command-meta-request',

    // Input
    INPUT_REQUEST: 'input-request',
    INPUT_RESPONSE: 'input-response',

    // UI
    CLEAR_SCREEN_REQUEST: 'clear-screen-request',
    THEME_CHANGED_BROADCAST: 'theme-changed-broadcast',
    UI_SCROLL_TO_BOTTOM_REQUEST: 'ui-scroll-to-bottom-request',
    SET_THEME_REQUEST: 'set-theme-request',
    GET_VALID_THEMES_REQUEST: 'get-valid-themes-request',

    // Filesystem
    FS_CHANGE_DIRECTORY_REQUEST: 'fs-change-directory-request',
    FS_IS_DIR_REQUEST: 'fs-is-directory-request',
    FS_IS_DIR_RESPONSE: 'fs-is-directory-response',
    FS_AUTOCOMPLETE_PATH_REQUEST: 'fs-autocomplete-path-request',
    FS_AUTOCOMPLETE_PATH_RESPONSE: 'fs-autocomplete-path-response',
    FS_GET_DIRECTORY_CONTENTS_REQUEST: 'fs-get-directory-contents-request',
    FS_GET_DIRECTORY_CONTENTS_RESPONSE: 'fs-get-directory-contents-response',
    FS_GET_FILE_CONTENTS_REQUEST: 'fs-get-file-contents-request',
    FS_GET_FILE_CONTENTS_RESPONSE: 'fs-get-file-contents-response',
};