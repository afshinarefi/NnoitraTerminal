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
    # Create a generic user_data table for all user-specific remote data
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_data (
            username TEXT NOT NULL,
            category TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT,
            PRIMARY KEY (username, category, key)
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

def handle_get_data(form_data):
    """Fetches all data for a given data_key for a validated user."""
    token = form_data.get('token')
    category = form_data.get('category')
    sort_order = form_data.get('sort_order', 'ASC').upper() # Default to ASC
    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session.'}

    if not category:
        return {'status': 'error', 'message': 'category is required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    data = {}

    if category == 'ENV':
        # Special case: fetch all environment-related categories
        data = {'REMOTE': {}, 'USERSPACE': {}}
        cursor.execute("SELECT category, key, value FROM user_data WHERE username = ? AND category IN ('REMOTE', 'USERSPACE')", (username,))
        rows = cursor.fetchall()
        for row in rows:
            cat, key, value = row
            if cat in data:
                data[cat][key] = value
    else:
        # Fetch a single category
        order_by_clause = ""
        if sort_order in ['ASC', 'DESC']:
            order_by_clause = f"ORDER BY key {sort_order}"
        cursor.execute(f"SELECT key, value FROM user_data WHERE username = ? AND category = ? {order_by_clause}", (username, category))
        rows = cursor.fetchall()
        data = {row[0]: row[1] for row in rows}
    conn.close()
    return {'status': 'success', 'data': data}

def handle_set_data(form_data):
    """Sets a single data item for a validated user."""
    token = form_data.get('token')
    category = form_data.get('category')
    key = form_data.get('key')
    value = form_data.get('value')

    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session.'}

    if not category or key is None or value is None:
        return {'status': 'error', 'message': 'category, key, and value are required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        # Use INSERT OR REPLACE to handle both creation and update
        cursor.execute("INSERT OR REPLACE INTO user_data (username, category, key, value) VALUES (?, ?, ?, ?)",
                       (username, category, key, value))
        conn.commit()
        return {'status': 'success', 'message': f'Data for category {category} set.'}
    finally:
        conn.close()

def handle_delete_data(form_data):
    """Deletes a single data item for a validated user."""
    token = form_data.get('token')
    category = form_data.get('category')
    key = form_data.get('key')
    username = validate_token(token)
    if not username:
        return {'status': 'error', 'message': 'Invalid or expired session.'}
    if not category or not key:
        return {'status': 'error', 'message': 'category and key are required.'}

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM user_data WHERE username = ? AND category = ? AND key = ?",
                       (username, category, key))
        conn.commit()
        return {'status': 'success', 'message': f'Data for category {category} at key {key} deleted.'}
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
    elif action == 'get_data':
        response = handle_get_data(form_data)
    elif action == 'set_data':
        response = handle_set_data(form_data)
    elif action == 'delete_data':
        response = handle_delete_data(form_data)
    else:
        response = {'status': 'error', 'message': 'Invalid action.'}

    print(json.dumps(response))

if __name__ == "__main__":
    main()