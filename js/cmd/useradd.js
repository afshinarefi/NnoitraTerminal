/**
 * @class Useradd
 * @description Implements the 'useradd' command to create a new user.
 */
class Useradd {
    static DESCRIPTION = 'Create a new user account.';

    #prompt;

    constructor(services) {
        this.#prompt = services.prompt;
    }

    static man() {
        return `NAME\n       useradd - Create a new user account.\n\nSYNOPSIS\n       useradd [username] [password]\n\nDESCRIPTION\n       Creates a new user with the specified username and password.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // No autocomplete for username/password.
    }

    /**
     * Determines if the command is available in the current context.
     * For now, only 'guest' can add users. This can be updated for 'root' privileges later.
     * @param {object} services - A collection of all services.
     * @returns {boolean} True if the command is available, false otherwise.
     */
    static isAvailable(services) {
        return services.environment.getVariable('USER') === 'guest';
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        const username = args[1];
        let password = args[2];

        if (!username) {
            outputDiv.textContent = 'Usage: useradd <username>';
            return outputDiv;
        }

        // If password is not provided as an argument, prompt for it interactively.
        if (!password) {
            password = await this.#prompt.requestPassword();
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('/server/accounting.py?action=useradd', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            outputDiv.textContent = result.message;
        } catch (error) {
            outputDiv.textContent = `Error creating user: ${error.message}`;
        }

        return outputDiv;
    }
}

export { Useradd };