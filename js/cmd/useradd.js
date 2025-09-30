/**
 * @class Useradd
 * @description Implements the 'useradd' command to create a new user.
 */
class Useradd {
    static DESCRIPTION = 'Create a new user account.';

    static man() {
        return `NAME\n       useradd - Create a new user account.\n\nSYNOPSIS\n       useradd [username] [password]\n\nDESCRIPTION\n       Creates a new user with the specified username and password.`;
    }

    static autocompleteArgs(currentArgs, services) {
        return []; // No autocomplete for username/password.
    }

    async execute(args) {
        const outputDiv = document.createElement('div');
        const username = args[1];
        const password = args[2];

        if (!username || !password) {
            outputDiv.textContent = 'Usage: useradd <username> <password>';
            return outputDiv;
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