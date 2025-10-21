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
import sys
import urllib.parse

# --- Constants ---

FS_ROOT = os.path.join('../', 'fs') # The absolute path to the virtual filesystem root.

# --- Utility Functions ---

def get_query_param(params, name, default=''):
    """Safely gets a query parameter from the CGI environment."""
    return params.get(name, [default])[0]

def get_safe_path(requested_path, pwd, root_dir):
    """Validates and returns a safe, absolute path, preventing directory traversal."""
    # If the requested path is not absolute, join it with the present working directory.
    # os.path.join correctly handles joining with '/'
    if not requested_path.startswith('/'):
        requested_path = os.path.join(pwd, requested_path)

    # Normalize the path and join it with the root directory
    safe_path = os.path.normpath(os.path.join(root_dir, requested_path.lstrip('/\\')))
    
    # Security check: ensure the resolved path is still within the root directory
    if not os.path.commonpath([root_dir, safe_path]) == root_dir:
        return None
        
    return safe_path

# --- Action Handlers ---

def handle_ls(path):
    """Lists the contents of a given directory."""
    result = {"directories": [], "files": []}
    with os.scandir(path) as it:
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

def handle_cat(path):
    """Reads the content of a file."""
    if not os.path.exists(path):
        raise FileNotFoundError("No such file or directory")
    if os.path.isdir(path):
        raise IsADirectoryError("Is a directory")
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    return {"content": content}

def handle_resolve(path, must_be_dir):
    """Resolves a path and checks if it's a valid directory or file."""
    if not os.path.exists(path):
        raise FileNotFoundError("No such file or directory")
    if must_be_dir and not os.path.isdir(path):
        raise NotADirectoryError("Not a directory")
    
    # Return the path relative to the 'fs' root, which is what the frontend expects
    relative_path = '/' + os.path.relpath(path, FS_ROOT).replace('\\', '/')
    return {"path": relative_path}

def handle_get_public_url(path):
    """Constructs a public-facing URL for a given virtual file path."""
    # This is where the knowledge of the '/fs' prefix lives.
    return {"url": f"/fs{path}"}

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
        path_param = get_query_param(params, 'path', '.')
        pwd_param = get_query_param(params, 'pwd', '/')
        
        safe_path = get_safe_path(path_param, pwd_param, FS_ROOT)
        if safe_path is None:
            raise ValueError("Invalid path: Directory traversal attempt detected.")

        if action == 'ls':
            response_data = handle_ls(safe_path)
        elif action == 'cat':
            response_data = handle_cat(safe_path)
        elif action == 'resolve':
            must_be_dir = get_query_param(params, 'must_be_dir', 'false').lower() == 'true'
            # We use safe_path here to ensure the path is valid before resolving
            response_data = handle_resolve(safe_path, must_be_dir)
        elif action == 'get_public_url':
            response_data = handle_get_public_url(path_param)
        else:
            response_data = {"error": f"Unknown action: {action}"}

    except Exception as e:
        response_data = {"error": str(e)}

    print(json.dumps(response_data))

if __name__ == "__main__":
    main()
