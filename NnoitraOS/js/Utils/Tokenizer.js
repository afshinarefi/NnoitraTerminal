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
 * Tokenizes an input string based on shell-like rules for quotes and escapes.
 *
 * - Special characters (delimiters): space, slash, equals.
 * - Backslash `\` escapes the next character.
 * - Single `'` and double `"` quotes create string literals where delimiters are ignored.
 * - Unclosed quotes extend to the end of the input.
 * - Delimiters are appended to the token preceding them.
 *
 * @param {string} inputText The string to tokenize.
 * @returns {string[]} An array of tokens.
 */
export function tokenize(inputText) {
    const tokens = [];
    const tokenizers = [' ', '/', '='];
    const quotes = ["'", '"'];
    const escapes = ['\\'];

    let currentToken = '';
    let inQuote = null; // Can be ' or "
    let isEscaped = false;

    const finalizeToken = (delimiter = '') => {
        tokens.push(currentToken + delimiter);
        currentToken = '';
    };

    for (let i = 0; i < inputText.length; i++) {
        const char = inputText[i];

        if (isEscaped) {
            currentToken += char;
            isEscaped = false;
        } else if (quotes.includes(char)) {
            inQuote = inQuote === char ? null : (inQuote || char);
        } else if (escapes.includes(char)) {
            isEscaped = true;
        } else if (inQuote) {
            currentToken += char; // Always a generic character when in a quote
        } else if (tokenizers.includes(char)) {
            finalizeToken(char);
        } else {
            currentToken += char;
        }
    }
    finalizeToken();

    return tokens;
}

/**
 * Stringifies an array of tokens back into a single command-line string.
 * It handles quoting and escaping of special characters to ensure that
 * `tokenize(stringify(tokens))` would result in the original tokens.
 *
 * @param {string[]} tokens - An array of string tokens.
 * @returns {string} The reconstructed command-line string.
 */
export function stringify(tokens) {
    const tokenizers = [' ', '/', '='];
    const specialChars = [' ', '/', '=', "'", '"', '\\'];

    return tokens.map(token => {
        if (!token) {
            return ''; // Handle empty tokens
        }

        let body = token;
        let delimiter = '';
        const lastChar = token.slice(-1);

        // If the token ends with a delimiter, separate it from the body.
        if (token.length > 0 && tokenizers.includes(lastChar)) {
            body = token.slice(0, -1);
            delimiter = lastChar;
        }

        let escapedBody = '';
        for (const char of body) {
            if (specialChars.includes(char)) {
                escapedBody += '\\' + char;
            } else {
                escapedBody += char;
            }
        }
        return escapedBody + delimiter;
    }).join(''); // The original tokenize function includes delimiters in the tokens.
}
