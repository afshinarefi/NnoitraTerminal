#!/usr/bin/python3
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

import os
import json
import urllib.parse
from pathlib import PurePath

SERVER_CONF_PATH = './server.conf'

# --- Constants ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WEBSITE_ROOT = os.path.dirname(SCRIPT_DIR)  # This should be /var/www/html

def get_fs_root_from_config():
    """Reads the readonly-filesystem-location from server.conf."""
    default_fs_path = '../fs'
    try:
        with open(SERVER_CONF_PATH, 'r') as f:
            for line in f:
                if line.strip().startswith('readonly-filesystem-location'):
                    _, raw_value = line.split('=', 1)
                    value = raw_value.strip().strip('"') # Remove whitespace and surrounding quotes
                    return os.path.abspath(os.path.join(SCRIPT_DIR, value))
    except FileNotFoundError:
        pass  # Config file not found, will use default
    return os.path.abspath(os.path.join(SCRIPT_DIR, default_fs_path))

FS_ROOT = get_fs_root_from_config()

def get_query_param(params, name, default=''):
    """Safely gets a query parameter from the CGI environment."""
    return params.get(name, [default])[0]

def vfs_to_abs_sys_path(vfs_path, vfs_pwd, vfs_root_abs_sys_path):
    """Converts a VFS path to a safe, absolute system path, preventing directory traversal."""
    # If the requested path is not absolute, join it with the present working directory.
    # os.path.join correctly handles joining with '/'
    if not vfs_path.startswith('/'):
        vfs_path = os.path.join(vfs_pwd, vfs_path)

    # Normalize the path and join it with the root directory
    abs_sys_path = os.path.normpath(os.path.join(vfs_root_abs_sys_path, vfs_path.lstrip('/\\')))
    
    # Security check: ensure the resolved path is still within the root directory
    if not os.path.commonpath([vfs_root_abs_sys_path, abs_sys_path]) == vfs_root_abs_sys_path:
        return None
        
    return abs_sys_path

def abs_sys_to_relative_path(abs_sys_path, root_abs_sys_path):
    """Converts an absolute system path to a root-prefixed, POSIX-style path relative to a given root."""
    relative = os.path.relpath(abs_sys_path, root_abs_sys_path)
    # Use PurePath to correctly join the root ('/') with the relative path.
    # This handles the '.' case (for the root directory) automatically.
    return PurePath('/').joinpath(relative).as_posix()

# --- Action Handlers ---

def handle_ls(abs_sys_path):
    """Lists the contents of a directory, or details of a single file."""
    if not os.path.exists(abs_sys_path):
        raise FileNotFoundError("No such file or directory")

    if os.path.isdir(abs_sys_path):
        result = {"directories": [], "files": []}
        with os.scandir(abs_sys_path) as it:
            for entry in it:
                if entry.name.startswith('.'):  # Hide dotfiles
                    continue
                if entry.is_dir():
                    result["directories"].append({"name": entry.name})
                elif not entry.name.endswith(".py"):
                    try:
                        size = os.path.getsize(entry.path)
                    except OSError:
                        size = None
                    result["files"].append({"name": entry.name, "size": size})

        # Sort by name
        result["directories"].sort(key=lambda x: x['name'])
        result["files"].sort(key=lambda x: x['name'])
        return result
    elif os.path.isfile(abs_sys_path):
        # If the path is a file, return a list containing only that file.
        size = os.path.getsize(abs_sys_path)
        filename = os.path.basename(abs_sys_path)
        return {"directories": [], "files": [{"name": filename, "size": size}]}
    else:
        # Path exists but is not a regular file or directory (e.g., a socket or broken symlink)
        raise FileNotFoundError("Is not a file or directory")

def handle_cat(abs_sys_path):
    """Reads the content of a file."""
    if not os.path.exists(abs_sys_path):
        raise FileNotFoundError("No such file or directory")
    if os.path.isdir(abs_sys_path):
        raise IsADirectoryError("Is a directory")
    
    with open(abs_sys_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return {"content": content}

def handle_resolve(abs_sys_path, must_be_dir):
    """Resolves a path and checks if it's a valid directory or file."""
    if not os.path.exists(abs_sys_path):
        raise FileNotFoundError("No such file or directory")
    if must_be_dir and not os.path.isdir(abs_sys_path):
        raise NotADirectoryError("Not a directory")
    
    # Return the path relative to the 'fs' root, which is what the frontend expects
    # The leading slash is important for the frontend's virtual path representation.
    return {"path": abs_sys_to_relative_path(abs_sys_path, FS_ROOT)}

def handle_get_public_url(abs_sys_path):
    """Constructs a public-facing URL for a given virtual file path."""
    # The path passed here is already the safe, absolute path on the server.
    if not os.path.exists(abs_sys_path):
        raise FileNotFoundError("No such file or directory")
    # We need to convert it back to a public-facing path relative to the web root.
    return {"url": abs_sys_to_relative_path(abs_sys_path, WEBSITE_ROOT)}

# --- Main Execution ---

def main():
    """Main CGI script execution function."""
    print("Content-Type: application/json")
    print() # Required blank line

    query = os.environ.get('QUERY_STRING', '')
    params = urllib.parse.parse_qs(query)
    response_data = {}
    
    try:
        action = get_query_param(params, 'action')
        vfs_path_param = get_query_param(params, 'path', '.')
        vfs_pwd_param = get_query_param(params, 'pwd', '/')
        
        abs_sys_path = vfs_to_abs_sys_path(vfs_path_param, vfs_pwd_param, FS_ROOT)
        if abs_sys_path is None:
            raise ValueError("Invalid path: Directory traversal attempt detected.")

        if action == 'ls':
            response_data = handle_ls(abs_sys_path)
        elif action == 'cat':
            response_data = handle_cat(abs_sys_path)
        elif action == 'resolve':
            must_be_dir = get_query_param(params, 'must_be_dir', 'false').lower() == 'true'
            # We use abs_sys_path here to ensure the path is valid before resolving
            response_data = handle_resolve(abs_sys_path, must_be_dir)
        elif action == 'get_public_url':
            response_data = handle_get_public_url(abs_sys_path)
        else:
            response_data = {"error": f"Unknown action: {action}"}

    except Exception as e:
        response_data = {"error": str(e)}

    print(json.dumps(response_data))

if __name__ == "__main__":
    main()
