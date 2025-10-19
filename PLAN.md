# Architecture Refactoring Plan: Event Bus Implementation

This document outlines the plan to refactor the application's architecture from a centralized orchestrator model to a more decoupled Event Bus (Pub/Sub) pattern.

## 1. Core Concept

The goal is to eliminate direct dependencies between services. Instead of a central `AppOrchestrator` that explicitly wires services together, we will introduce a central `EventBusService`.

- **Services as Publishers:** When a service needs to trigger an action in another part of the system, it will dispatch an event to the `EventBusService`. The publisher does not know or care who is listening.
- **Services as Subscribers:** Services that can perform actions will subscribe to specific events on the `EventBusService`. They will react when they hear an event they are interested in.
- **Configuration:** The main `Terminal.js` component will be responsible for instantiating all services and the event bus, but it will no longer contain the "wiring" logic.

### 1.1. Event Types

All events on the bus are "fire-and-forget." Services dispatch events without waiting for or expecting a direct return value.

When a response is needed, a "request/response via events" pattern will be used:
1.  A requester dispatches a `request-*` event (e.g., `request-previous-history`).
2.  A provider service listens for this event, performs an action, and dispatches a corresponding `receive-*` event (e.g., `receive-previous-history`) with the data in the payload.
3.  The original requester listens for the `receive-*` event to get its data.
4.  For complex cases where multiple requests may be in flight, the request payload can include a unique correlation ID, which the provider must include in the response event's payload.

## 2. Event Definitions

The following events will form the communication backbone of the application:

### Persistence Events

- **`persist-variable-request`**
  - **Dispatched By:** `EnvironmentService`
  - **Payload:** `{ key: string, value: string }`
  - **Purpose:** Signals that a `REMOTE` or `USERSPACE` variable has been changed and needs to be persisted on the server.

- **`persist-command-request`**
  - **Dispatched By:** `HistoryService`
  - **Payload:** `{ command: string }`
  - **Purpose:** Signals that a new command has been added to the history and needs to be persisted on the server.

- **`request-load-history`**
  - **Dispatched By:** `HistoryService`
  - **Payload:** None
  - **Purpose:** Asks the `LoginService` to fetch the remote command history.

### State Change & UI Update Events

- **`variable-changed-event`**
  - **Dispatched By:** `EnvironmentService`
  - **Payload:** `{ key: string, value: string }`
  - **Purpose:** A general announcement that any environment variable has been set. Used for reactive UI updates.

- **`login-success`**
  - **Dispatched By:** `LoginService`
  - **Payload:** None.
  - **Purpose:** Signals that a user has successfully logged in. Triggers the loading of the user's remote profile (environment and history).

- **`logout-success`**
  - **Dispatched By:** `LoginService`
  - **Payload:** None.
  - **Purpose:** Signals that a user has logged out. Triggers the reset of all services to the default "guest" state.

- **`terminal-clear`**
  - **Dispatched By:** `clear` command
  - **Payload:** None.
  - **Purpose:** Instructs the `Terminal` component to clear all visible output.

### Command & Interaction Events

- **`input-request`**
  - **Dispatched By:** `TerminalBusService`
  - **Payload:** `{ prompt: string, options: object, correlationId: string }`
  - **Purpose:** Requests user input from the command line.

- **`input-response`**
  - **Dispatched By:** `InputBusService`
  - **Payload:** `{ value: string, correlationId: string }`
  - **Purpose:** Provides the input submitted by the user.

- **`command-execute-broadcast`**
  - **Dispatched By:** `Terminal.js` (Component)
  - **Payload:** `{ commandString: string, outputElement: HTMLElement }`
  - **Purpose:** The central event for running a command. Multiple services will listen to this.

- **`command-execution-finished-broadcast`**
  - **Dispatched By:** `Terminal.js` (Component)
  - **Payload:** None
  - **Purpose:** Announces that a command has finished executing, allowing the main loop to continue.

### Request/Response Events

- **`variable-get-request`**
  - **Dispatched By:** Any service/component.
  - **Payload:** `{ key: string }`
  - **Purpose:** Retrieves the value of an environment variable.

- **`variable-get-response`**
  - **Dispatched By:** `EnvironmentService`
  - **Payload:** `{ key: string, value: string | undefined }`
  - **Purpose:** Provides the value of a requested environment variable.

- **`variable-set-request`**
  - **Dispatched By:** Any service/component.
  - **Payload:** `{ key: string, value: string, category: string }`
  - **Purpose:** Sets the value of an environment variable.

- **`history-previous-request`**
  - **Dispatched By:** `CommandLine` component
  - **Payload:** None
  - **Purpose:** Requests the previous command from history.

- **`history-next-request`**
  - **Dispatched By:** `CommandLine` component
  - **Payload:** None
  - **Purpose:** Requests the next command from history.

- **`history-indexed-response`**
  - **Dispatched By:** `HistoryService`
  - **Payload:** `{ command: string, index: number }`
  - **Purpose:** Provides the history item in response to a request.

- **`autocomplete-request`**
  - **Dispatched By:** `CommandLine` component
  - **Payload:** `{ parts: string[] }`
  - **Purpose:** Requests autocomplete suggestions for the current input.

- **`autocomplete-response`**
  - **Dispatched By:** `CommandService`
  - **Payload:** `{ suggestions: string[] }`
  - **Purpose:** Provides the autocomplete suggestions.

## 3. Service Interaction Plan

This section details the responsibilities of each service within the new event-driven architecture.

### `EventBusService` (New Service)
- **Provides:** A central bus with `listen(eventName, callback)` and `dispatch(eventName, payload)` methods.
- **Requests:** None. It is a "dumb" message forwarder.

### `EnvironmentService`
- **Provides (Dispatches):**
  - `persist-variable-request`
  - `variable-changed-event`
  - `variable-get-response`
- **Requests (Listens for):**
  - `variable-get-request`
  - `variable-set-request`

### `HistoryService`
- **Provides (Dispatches):**
  - `persist-command-request`
  - `request-load-history`
  - `history-indexed-response`
- **Requests (Listens for):**
  - `command-execute-request` (to add the command to its internal history).
  - `history-previous-request`
  - `history-next-request`

### `LoginService`
- **Provides (Dispatches):**
  - `login-success`
  - `logout-success`
- **Requests (Listens for):**
  - `persist-variable-request` (to handle persistence via its `post` method).
  - `persist-command-request` (to handle persistence via its `post` method).
  - `request-load-history` (to fetch data and pass it back to `HistoryService`).

### `ThemeService`
- **Provides (Dispatches):**
  - None.
- **Requests (Listens for):**
  - `variable-changed-event` (to check if `event.detail.key === 'THEME'` and then call its internal `applyTheme()` method).

### `CommandService`
- **Provides (Dispatches):**
  - `autocomplete-response`
- **Requests (Listens for):**
  - `command-execute-request` (to find and run the appropriate command class).
  - `autocomplete-request`

### `clear` (Command)
- **Provides (Dispatches):**
  - `terminal-clear-broadcast`
- **Requests (Listens for):**
  - None.

### `CommandLine.js` (Component)
- **Provides (Dispatches):**
  - `history-previous-request`
  - `history-next-request`
  - `autocomplete-request`
- **Requests (Listens for):**
  - `input-request`
  - `history-indexed-response`
  - `autocomplete-broadcast`

### `InputBusService.js` (Presenter)
- **Provides (Dispatches):**
  - `input-response`
- **Requests (Listens for):**
  - `input-request`

### `Terminal.js` (Component)
- **Provides (Dispatches):**
  - `command-execute-broadcast`
- **Requests (Listens for):**
  - `user-changed-broadcast` (to trigger fetching remote data on login or clearing state on logout).
  - `terminal-clear-broadcast` (to call its internal `#clearOutput` method).

### `TerminalBusService.js` (New Service)
- **Provides (Dispatches):**
  - `input-request`
- **Requests (Listens for):**
  - `input-response`
  - `command-execution-finished-broadcast`

## 4. Implementation Steps

1.  Create the new `EventBusService.js`. It will manage a map of event names to listener callbacks.
2.  Refactor `Terminal.js` to instantiate `EventBusService` and pass it to all other services and relevant components in their constructors.
3.  Remove the `AppOrchestrator.js` service and all `EventTarget` inheritance from services.
4.  Modify each service/component listed above to replace direct method calls with `this.#eventBus.dispatch(...)`.
5.  Modify each service/component to subscribe to its required events in its constructor using `this.#eventBus.listen(...)`.
6.  The `start()` method concept is no longer strictly necessary, as the constructor injection of the event bus ensures it's available for listeners to be attached immediately. However, it might still be useful for services like `HistoryService` to dispatch a `request-load-history` event after initialization.

---