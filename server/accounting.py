#!/usr/bin/env python3
import json
import sqlite3
import hashlib
import uuid
import os
import sys
from datetime import datetime, timedelta
from urllib.parse import parse_qs

DB_FILE = 'users.db'

def init_db():
    """Initializes the database and creates tables if they don't exist."""
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
            expires_at DATETIME NOT NULL,
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
    cursor.execute("DELETE FROM sessions WHERE expires_at < ?", (datetime.utcnow(),))
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
        expires_at = datetime.utcnow() + timedelta(days=7)
        # Create a new session
        cursor.execute("INSERT INTO sessions (token, username, expires_at) VALUES (?, ?, ?)", (token, username, expires_at))
        conn.commit()
        conn.close()
        return {'status': 'success', 'message': 'Login successful.', 'token': token, 'user': username, 'expires_at': expires_at.isoformat()}
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

    username, expires_at_str = result
    expires_at = datetime.fromisoformat(expires_at_str)

    if expires_at < datetime.utcnow():
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

    username, expires_at_str = result
    expires_at = datetime.fromisoformat(expires_at_str)

    if expires_at < datetime.utcnow():
        # Token is expired, delete it and return failure.
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()
        return None

    # Token is valid, extend its expiration.
    new_expires_at = datetime.utcnow() + timedelta(days=7)
    cursor.execute("UPDATE sessions SET expires_at = ? WHERE token = ?", (new_expires_at, token))
    conn.commit()
    conn.close()
    return username # Return the associated username on success.

def parse_form_data():
    """Parses multipart/form-data from stdin without using the cgi module."""
    form_data = {}
    # This is a simplified parser for the FormData sent by the JS client.
    # It expects a simple key-value structure.
    try:
        content_type = os.environ.get('CONTENT_TYPE', '')
        if 'multipart/form-data' in content_type:
            boundary = content_type.split("boundary=")[1]
            data = sys.stdin.read()
            parts = data.split('--' + boundary)
            for part in parts:
                if 'Content-Disposition: form-data;' in part:
                    headers, value = part.split('\r\n\r\n', 1)
                    name_field = [h for h in headers.split('\r\n') if 'name=' in h]
                    if name_field:
                        name = name_field[0].split('name="')[1].split('"')[0]
                        form_data[name] = value.strip('\r\n--')
    except Exception:
        # Fallback or error logging can be added here
        pass
    return form_data

def main():
    """Main function to handle CGI requests."""
    print("Content-Type: application/json")
    print() # End of headers

    init_db()

    query_string = os.environ.get('QUERY_STRING', '')
    query_params = parse_qs(query_string)
    action = query_params.get('action', [None])[0]

    form_data = parse_form_data()

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