![Nnoitra](./Nnoitra.png)

# Nnoitra Terminal

Nnoitra Terminal is a sophisticated, web-based terminal simulator built entirely with vanilla JavaScript and modern web standards. It provides a Unix-like shell experience in the browser, complete with a simulated filesystem, command history, autocompletion, and user management features.

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

This project is written in dependency-free vanilla JavaScript. However, Node.js and npm are used for the development build process to bundle and minify the source code for production.

### Building for Production

1.  **Prerequisites**: Make sure you have Node.js and npm installed.

2.  **Create Production Build**: From the root of the project, run the following command to install dependencies, bundle, and minify the source files:
    ```bash
    npm run release
    ```
    This will generate an optimized `dist/Nnoitra.min.js` file. The `index.html` page is already configured to use this file if it exists, and will automatically fall back to the raw source modules if it doesn't.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the GNU Affero General Public License v3.0. See the `LICENSE` file for more details.
