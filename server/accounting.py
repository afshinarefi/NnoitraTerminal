#!/usr/bin/env python3
# Arefi Terminal
# Copyright (C) 2025 Arefi
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
import json
import sqlite3
import hashlib
import uuid
import os
import sys
from datetime import datetime, timedelta, timezone
from email import message_from_string
from urllib.parse import parse_qs

# Construct the absolute path to the database file to ensure it's always in the correct location.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DB_DIR = os.path.join(PROJECT_ROOT, 'db')
DB_FILE = os.path.join(DB_DIR, 'users.db')

def init_db():
    """Initializes the database and creates tables if they don't exist."""
    # Ensure the db directory exists before trying to connect to the database.
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    # Create sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            expires_at INTEGER NOT NULL,
            username TEXT NOT NULL,
            FOREIGN KEY (username) REFERENCES users (username)
        )
    ''')
    # Create user_env table for remote environment variables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_env (
            username TEXT NOT NULL,
            var_name TEXT NOT NULL,
            var_value TEXT,
            var_category TEXT NOT NULL,
            PRIMARY KEY (username, var_name)
        )
    ''')
    # Create user_history table for remote command history
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            command TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    ''')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_history_user_ts ON user_history (username, timestamp DESC)')
    conn.commit()
    conn.close()

def cleanup_expired_tokens():
    """Removes all expired tokens from the sessions table."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions WHERE expires_at < ?", (int(datetime.now(timezone.utc).timestamp()),))
    conn.commit()
    conn.close()

def hash_password(password):
    """Hashes a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def handle_useradd(form_data):
    """Handles user creation."""
    username = form_data.get('username')
    password = form_data.get('password')

    if not username or not password:
        return {'status': 'error', 'message': 'Username and password are required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, hash_password(password)))
        conn.commit()
        return {'status': 'success', 'message': f'User "{username}" created successfully.'}
    except sqlite3.IntegrityError:
        return {'status': 'error', 'message': f'User "{username}" already exists.'}
    finally:
        conn.close()

def handle_login(form_data):
    """Handles user login and session token generation."""
    username = form_data.get('username')
    password = form_data.get('password')

    if not username or not password:
        return {'status': 'error', 'message': 'Username and password are required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()

    if result and result[0] == hash_password(password):
        # Clean up any old, expired tokens before creating a new one.
        cleanup_expired_tokens()

        token = str(uuid.uuid4())
        expires_at = int((datetime.now(timezone.utc) + timedelta(days=7)).timestamp())
        # Create a new session
        cursor.execute("INSERT INTO sessions (token, username, expires_at) VALUES (?, ?, ?)", (token, username, expires_at))
        conn.commit()
        conn.close()
        return {'status': 'success', 'message': 'Login successful.', 'token': token, 'user': username, 'expires_at': expires_at}
    else:
        conn.close()
        return {'status': 'error', 'message': 'Invalid username or password.'}

def handle_logout(form_data):
    """Handles user logout by invalidating the session token."""
    token = form_data.get('token')
    if not token:
        return {'status': 'error', 'message': 'Token is required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # First, validate the token to ensure it's not expired.
    if validate_token(token):
        # If token is valid, delete it for logout.
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()
        return {'status': 'success', 'message': 'Logout successful.'}
    else:
        # Token was invalid or expired and has been cleaned up.
        conn.close()
        return {'status': 'error', 'message': 'Invalid or expired session.'}

def handle_passwd(form_data):
    """Handles a user's password change request."""
    token = form_data.get('token')
    old_password = form_data.get('old_password')
    new_password = form_data.get('new_password')

    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session. Please log in again.'}

    if not old_password or not new_password:
        return {'status': 'error', 'message': 'Old and new passwords are required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        # First, verify the old password is correct
        cursor.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
        result = cursor.fetchone()
        if result and result[0] == hash_password(old_password):
            # Old password is correct, update to the new one
            cursor.execute("UPDATE users SET password_hash = ? WHERE username = ?", (hash_password(new_password), username))
            conn.commit()
            return {'status': 'success', 'message': 'Password changed successfully.'}
        else:
            return {'status': 'error', 'message': 'Incorrect old password.'}
    finally:
        conn.close()

def validate_token(token):
    """Checks if a token is valid and not expired, deleting it if it is expired."""
    if not token:
        return None

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT username, expires_at FROM sessions WHERE token = ?", (token,))
    result = cursor.fetchone()

    if not result:
        conn.close()
        return None # Token does not exist.

    username, expires_at = result

    if expires_at < int(datetime.now(timezone.utc).timestamp()):
        # Token is expired, delete it and return failure.
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()
        return None

    conn.close()
    return username # Return the associated username on success.

def validate_and_update_token(token):
    """Checks if a token is valid and not expired, and extends its life."""
    if not token:
        return None

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT username, expires_at FROM sessions WHERE token = ?", (token,))
    result = cursor.fetchone()

    if not result:
        conn.close()
        return None # Token does not exist.

    username, expires_at = result

    if expires_at < int(datetime.now(timezone.utc).timestamp()):
        # Token is expired, delete it and return failure.
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()
        return None

    # Token is valid, extend its expiration.
    new_expires_at = int((datetime.now(timezone.utc) + timedelta(days=7)).timestamp())
    cursor.execute("UPDATE sessions SET expires_at = ? WHERE token = ?", (new_expires_at, token))
    conn.commit()
    conn.close()
    return username # Return the associated username on success.

def handle_get_env(form_data):
    """Fetches all environment variables for a validated user."""
    token = form_data.get('token')
    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT var_name, var_value, var_category FROM user_env WHERE username = ?", (username,))
    rows = cursor.fetchall()
    conn.close()

    env_vars = {row[0]: {'value': row[1], 'category': row[2]} for row in rows}
    return {'status': 'success', 'env': env_vars}

def handle_set_env(form_data):
    """Sets a single environment variable for a validated user."""
    token = form_data.get('token')
    var_name = form_data.get('var_name')
    var_value = form_data.get('var_value')
    var_category = form_data.get('var_category')

    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session.'}

    if not var_name or var_value is None or not var_category:
        return {'status': 'error', 'message': 'Variable name, value, and category are required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        # Use INSERT OR REPLACE to handle both creation and update
        cursor.execute("INSERT OR REPLACE INTO user_env (username, var_name, var_value, var_category) VALUES (?, ?, ?, ?)",
                       (username, var_name, var_value, var_category))
        conn.commit()
        return {'status': 'success', 'message': f'Variable {var_name} set.'}
    finally:
        conn.close()

def handle_get_history(form_data):
    """Fetches command history for a validated user."""
    token = form_data.get('token')
    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Get HISTSIZE for the user, default to 1000
    cursor.execute("SELECT var_value FROM user_env WHERE username = ? AND var_name = 'HISTSIZE'", (username,))
    histsize_row = cursor.fetchone()
    histsize = int(histsize_row[0]) if histsize_row and histsize_row[0].isdigit() else 1000

    cursor.execute("SELECT command FROM user_history WHERE username = ? ORDER BY timestamp DESC LIMIT ?", (username, histsize))
    rows = cursor.fetchall()
    conn.close()

    history = [row[0] for row in rows]
    return {'status': 'success', 'history': history}

def handle_add_history(form_data):
    """Adds a command to the user's history and trims old entries."""
    token = form_data.get('token')
    command = form_data.get('command')

    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session.'}

    if not command:
        return {'status': 'error', 'message': 'Command is required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        # Add new history item
        timestamp = int(datetime.now(timezone.utc).timestamp())
        cursor.execute("INSERT INTO user_history (username, command, timestamp) VALUES (?, ?, ?)",
                       (username, command, timestamp))

        # Get HISTSIZE and trim history
        cursor.execute("SELECT var_value FROM user_env WHERE username = ? AND var_name = 'HISTSIZE'", (username,))
        histsize_row = cursor.fetchone()
        histsize = int(histsize_row[0]) if histsize_row and histsize_row[0].isdigit() else 1000

        # Delete oldest entries if history exceeds HISTSIZE
        cursor.execute("""
            DELETE FROM user_history WHERE id IN (
                SELECT id FROM user_history WHERE username = ? ORDER BY timestamp ASC LIMIT -1 OFFSET ?
            )
        """, (username, histsize))
        conn.commit()
        return {'status': 'success'}
    finally:
        conn.close()

def parse_form_data():
    """Parses multipart/form-data from stdin without using the cgi module."""
    try:
        content_type = os.environ.get('CONTENT_TYPE', '')
        if 'multipart/form-data' in content_type:
            # Construct a full message header to use the email parser
            headers = f"Content-Type: {content_type}\n\n"
            # Read the body from stdin
            body = sys.stdin.read()
            msg = message_from_string(headers + body)
            form_data = {}
            if msg.is_multipart():
                for part in msg.get_payload():
                    name = part.get_param('name', header='content-disposition')
                    if name:
                        form_data[name] = part.get_payload(decode=True).decode('utf-8')
            return form_data
    except Exception as e:
        return {}
    return {}

def main():
    """Main function to handle CGI requests."""
    print("Content-Type: application/json")
    print() # End of headers

    init_db()

    query_string = os.environ.get('QUERY_STRING', '')
    query_params = parse_qs(query_string)
    action = query_params.get('action', [None])[0]

    form_data = parse_form_data()

    # Debug print to see what the server is receiving. This will go to the Apache error log.
    print(f"DEBUG: action='{action}', form_data='{form_data}'", file=sys.stderr)

    response = {}
    # Add a validate action to check and extend the token on page load
    if action == 'validate':
        token = form_data.get('token')
        username = validate_and_update_token(token)
        if username:
            response = {'status': 'success', 'message': 'Session is valid.'}
        else:
            response = {'status': 'error', 'message': 'Invalid or expired session.'}
    elif action == 'useradd':
        response = handle_useradd(form_data)
    elif action == 'login':
        response = handle_login(form_data)
    elif action == 'passwd':
        response = handle_passwd(form_data)
    elif action == 'logout':
        response = handle_logout(form_data)
    elif action == 'get_env':
        response = handle_get_env(form_data)
    elif action == 'set_env':
        response = handle_set_env(form_data)
    elif action == 'get_history':
        response = handle_get_history(form_data)
    elif action == 'add_history':
        response = handle_add_history(form_data)
    else:
        response = {'status': 'error', 'message': 'Invalid action.'}

    print(json.dumps(response))

if __name__ == "__main__":
    main()