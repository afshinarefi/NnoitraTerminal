/**
 * @class Login
 * @description Implements the 'login' command for user authentication.
 */
class Login {
    static DESCRIPTION = 'Log in as a user.';

    #environmentService;

    constructor(services) {
        this.#environmentService = services.environment;
    }

    static man() {
        return `NAME\n       login - Log in to the system.\n\nSYNOPSIS\n       login [username] [password]\n\nDESCRIPTION\n       Authenticates the user and starts a session.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // No autocomplete for username/password.
    }

    /**
     * Hashes a string using SHA-256.
     * @param {string} string - The string to hash.
     * @returns {Promise<string>} A promise that resolves to the hex-encoded hash.
     */
    async #hashString(string) {
        const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(string));
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        const username = args[1];
        const password = args[2];

        if (!username || !password) {
            outputDiv.textContent = 'Usage: login <username> <password>';
            return outputDiv;
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const loginResponse = await fetch('/server/accounting.py?action=login', {
                method: 'POST',
                body: formData
            });
            const loginResult = await loginResponse.json();
            outputDiv.textContent = loginResult.message;

            if (loginResult.status === 'success') {
                this.#environmentService.setVariable('TOKEN', loginResult.token);
                this.#environmentService.setVariable('USER', loginResult.user);
                this.#environmentService.setVariable('TOKEN_EXPIRY', loginResult.expires_at);
            }
        } catch (error) {
            outputDiv.textContent = `Error during login: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Login };