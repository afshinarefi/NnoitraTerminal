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
    if action == 'useradd':
        response = handle_useradd(form_data)
    elif action == 'login':
        response = handle_login(form_data)
    elif action == 'logout':
        response = handle_logout(form_data)
    else:
        response = {'status': 'error', 'message': 'Invalid action.'}

    print(json.dumps(response))

if __name__ == "__main__":
    main()