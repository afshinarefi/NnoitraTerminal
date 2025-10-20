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

# --- Utility Functions ---

def get_query_param(name, default=''):
    """Safely gets a query parameter from the CGI environment."""
    query = os.environ.get('QUERY_STRING', '')
    params = urllib.parse.parse_qs(query)
    return params.get(name, [default])[0]

def get_safe_path(requested_path, root_dir):
    """Validates and returns a safe, absolute path, preventing directory traversal."""
    if not requested_path:
        return root_dir
    
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

def handle_autocomplete(path, include_files):
    """Provides autocomplete suggestions for a given path."""
    suggestions = []
    parent_dir = os.path.dirname(path)
    base_name = os.path.basename(path)

    if not os.path.exists(parent_dir):
        return {"suggestions": []}

    with os.scandir(parent_dir) as it:
        for entry in it:
            if entry.name.startswith(base_name) and not entry.name.startswith('.'):
                # Construct the suggestion relative to the original input path's directory
                suggestion = os.path.join(os.path.dirname(path), entry.name)
                if entry.is_dir():
                    suggestions.append(suggestion + '/')
                elif include_files:
                    suggestions.append(suggestion)
    
    suggestions.sort()
    return {"suggestions": suggestions}

# --- Main Execution ---

def main():
    """Main CGI script execution function."""
    print("Content-Type: application/json")
    print() # Required blank line

    response_data = {}
    
    try:
        # Define the root directory for the virtual filesystem
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        fs_root = os.path.join(project_root, 'fs')

        action = get_query_param('action')
        path_param = get_query_param('path', '.')
        
        safe_path = get_safe_path(path_param, fs_root)
        if safe_path is None:
            raise ValueError("Invalid path: Directory traversal attempt detected.")

        if action == 'ls':
            response_data = handle_ls(safe_path)
        elif action == 'autocomplete':
            include_files = get_query_param('files', 'false').lower() == 'true'
            response_data = handle_autocomplete(path_param, include_files)
        else:
            response_data = {"error": f"Unknown action: {action}"}

    except Exception as e:
        response_data = {"error": str(e)}

    print(json.dumps(response_data))

if __name__ == "__main__":
    main()
