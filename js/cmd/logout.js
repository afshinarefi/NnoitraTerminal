/**
 * @class Logout
 * @description Implements the 'logout' command to end a user session.
 */
class Logout {
    static DESCRIPTION = 'Log out of the current session.';

    #environmentService;

    constructor(services) {
        this.#environmentService = services.environment;
    }

    static man() {
        return `NAME\n       logout - Log out of the system.\n\nSYNOPSIS\n       logout\n\nDESCRIPTION\n       Ends the current user session.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return [];
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        const token = this.#environmentService.getVariable('TOKEN');

        if (!token) {
            outputDiv.textContent = 'Not logged in.';
            return outputDiv;
        }

        const formData = new FormData();
        formData.append('token', token);

        try {
            const response = await fetch('/server/accounting.py?action=logout', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            outputDiv.textContent = result.message;

            if (result.status === 'success') {
                this.#environmentService.removeVariable('TOKEN');
                this.#environmentService.removeVariable('TOKEN_EXPIRY');
                this.#environmentService.setVariable('USER', 'guest'); // Reset to default user
            }
        } catch (error) {
            outputDiv.textContent = `Error during logout: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Logout };