# Arefi Terminal

Arefi Terminal is a sophisticated, web-based terminal simulator built entirely with vanilla JavaScript and modern web standards. It provides a Unix-like shell experience in the browser, complete with a simulated filesystem, command history, autocompletion, and user management features.

## Features

*   **Zero Dependencies**: Written in pure, modern JavaScript (ESM). No frameworks, no libraries.
*   **Component-Based UI**: Built with standard **Web Components** and the Shadow DOM for perfect encapsulation and modularity.
*   **Simulated Filesystem**: Navigate directories and view files within a virtual filesystem loaded from the server.
*   **Command Execution**: A robust command service that dynamically loads and executes command modules.
*   **Command History**: Navigate through previously executed commands using the `ArrowUp` and `ArrowDown` keys.
*   **Autocompletion**: Press `Tab` to autocomplete commands and file paths. Press `Tab` again to cycle through suggestions.
*   **User Management**: Includes commands for user creation (`useradd`) and login, with a simple Python backend for persistence.
*   **Persistent Sessions**: User sessions are stored in `localStorage` and automatically validated on page load. Remote environment variables (like aliases) and command history are fetched from the server, providing a seamless experience across browser reloads.
*   **Rich Command Output**: Commands can render rich HTML, including links, images, and formatted text, not just plain text.

## Live Demo

[View the live demo here](https://arefi.info/)

## Getting Started

### Prerequisites

To run this project locally, you will need a local web server capable of serving static files and executing Python CGI scripts.

*   Python 3.x

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Navigate to the web root:**
    The main application files are located in `/var/www/html`.
    ```sh
    cd var/www/html
    ```

3.  **(Optional) Generate Filesystem Index:**
    The virtual filesystem is powered by `fs/filesystem.json`. To generate or update this file based on the contents of the `fs/` directory, run the `index.py` script.
    ```sh
    python3 fs/index.py
    ```

4.  **Start the server:**
    Use Python's built-in server from the `html` directory. The `--cgi` flag enables the execution of backend scripts in the `/server/` directory.
    ```sh
    python3 -m http.server --cgi 8000
    ```

4.  **Open in browser:**
    Navigate to `http://localhost:8000` in your web browser.

## Usage

Interact with the terminal by typing commands into the prompt and pressing `Enter`.

*   **Command History**: Use `ArrowUp` and `ArrowDown` to cycle through your command history.
*   **Autocomplete**: Type part of a command or path and press `Tab`. If there are multiple options, a hint box will appear.

### Available Commands

| Command     | Description                                     | Usage Example                  |
|-------------|-------------------------------------------------|--------------------------------|
| `help`      | Lists all available commands.                   | `help`                         |
| `man`       | Displays the manual page for a specific command.| `man ls`                       |
| `ls`        | Lists the contents of a directory.              | `ls /documents`                |
| `cd`        | Changes the current working directory.          | `cd /documents`                |
| `cat`       | Displays the content of a file.                 | `cat /documents/notes.txt`     |
| `about`     | Shows information about the project.            | `about`                        |
| `welcome`   | Displays the welcome message (MOTD).            | `welcome`                      |
| `env`       | Lists all environment variables.                | `env`                          |
| `history`   | Shows the command history.                      | `history`                      |
| `view`      | Displays an image or video file.                | `view /images/photo.jpg`       |
| `alias`     | Define or display command aliases.              | `alias l="ls -a"`              |
| `unalias`   | Remove a command alias.                         | `unalias l`                    |
| `login`     | Log in as a registered user.                    | `login myuser`                 |
| `logout`    | Log out of the current session.                 | `logout`                       |
| `adduser`   | Create a new user account.                      | `adduser newuser`              |
| `clear`     | Clears the terminal screen.                     | `clear`                        |

## Project Structure

The project is organized to separate concerns, making it modular and easy to maintain.

```
/
├── var/www/html/
│   ├── js/
│   │   ├── Components/   # Reusable Web Components (Terminal, CommandLine, etc.)
│   │   ├── Services/     # Core logic (CommandService, FilesystemService, etc.)
│   │   └── cmd/          # Implementations for each terminal command
│   ├── fs/               # Simulated filesystem data (index.py generates JSON)
│   ├── server/           # Backend Python CGI scripts (e.g., user accounting)
│   ├── data/             # Static data files (e.g., motd.txt)
│   ├── css/              # Global CSS styles and variables
│   └── index.html        # Main entry point
└── README.md             # This file
```

## Architecture Deep Dive

This project demonstrates a modern approach to building web applications without relying on large frameworks.

### Frontend

*   **`ArefiBaseComponent`**: This is the cornerstone of the component architecture. It's a base class that all other components extend. It automatically handles:
    *   **Shadow DOM Creation**: Encapsulates the component's style and structure.
    *   **Shared Styling**: Applies a consistent base theme using `adoptedStyleSheets`.
    *   **`refs` Mapping**: Automatically maps elements with a `part` attribute to a `this.refs` object for easy access (e.g., `this.refs.output`).

*   **Web Components**: The UI is broken down into logical, reusable components:
    *   `arefi-terminal`: The main container that orchestrates all other components and services.
    *   `arefi-cmd`: The command line input, handling user input, history, and autocomplete events.
    *   `arefi-term-item`: A single entry in the terminal history, showing the command and its output.
    *   `arefi-hint-box`: Displays autocomplete suggestions.
    *   `arefi-icon`: A simple component for displaying status icons (e.g., `>`,`⧗`).

*   **Service Layer**: Core application logic is decoupled from the UI and organized into services:
    *   `CommandService`: Discovers, loads, and executes command modules from the `/js/cmd/` directory.
    *   `FilesystemService`: Manages the virtual filesystem, handling path resolution, directory listing, and file access.
    *   `HistoryService`: Manages the command history stack.
    *   `EnvironmentService`: Manages session variables like `USER`, `PWD`, and `HOST`.
    *   `AutocompleteService`: Provides command and path completion logic.
*   **`LogService`**: A centralized, performant logger that allows enabling/disabling logs by category for easier debugging.

### Backend

The backend is intentionally lightweight, using Python CGI scripts for simple server-side tasks.

*   `/server/filesystem.py`: A CGI script that dynamically lists the contents of the `/fs/` directory.
*   `/server/accounting.py`: A CGI script that handles user creation (`adduser`), login, and persistence of remote environment variables and command history.
*   `/db/users.db`: A SQLite database file that is automatically created to store user credentials and session tokens. It is recommended to add this file to your `.gitignore`.
This approach allows the frontend to remain a static application for the most part, while still enabling dynamic, persistent features like user accounts.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the GNU Affero General Public License v3.0. See the `LICENSE` file for more details.
