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

    async execute(args) {
        const outputDiv = document.createElement('div');
        const username = args[1];
        const password = args[2];

        if (!username || !password) {
            outputDiv.textContent = 'Usage: login <username> <password>';
            return outputDiv;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('/server/accounting.py?action=login', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            outputDiv.textContent = result.message;

            if (result.status === 'success') {
                this.#environmentService.setVariable('TOKEN', result.token);
                this.#environmentService.setVariable('USER', result.user);
                this.#environmentService.setVariable('TOKEN_EXPIRY', result.expires_at);
            }
        } catch (error) {
            outputDiv.textContent = `Error during login: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Login };