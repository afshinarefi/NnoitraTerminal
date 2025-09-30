#!/usr/bin/python3

import os
import json
import sys
import urllib.parse

def get_query_param(name):
    # Parse QUERY_STRING from environment (for CGI)
    query = os.environ.get('QUERY_STRING', '')
    params = urllib.parse.parse_qs(query)
    return params.get(name, [''])[0]

def list_directory(path):
    result = {"directories": [], "files": []}
    try:
        with os.scandir(path) as it:
            for entry in it:
                if entry.is_dir():
                    # Count items in directory for metadata
                    try:
                        count = len(os.listdir(entry.path))
                    except Exception:
                        count = None
                    result["directories"].append({
                        "name": entry.name,
                        "count": count
                    })
                elif not entry.name.endswith(".py"):
                    try:
                        size = os.path.getsize(entry.path)
                    except Exception:
                        size = None
                    result["files"].append({
                        "name": entry.name,
                        "size": size
                    })
        # Only sort if there are entries
        if result["directories"]:
            result["directories"].sort(key=lambda d: d["name"])
        if result["files"]:
            result["files"].sort(key=lambda f: f["name"])
    except Exception as e:
        result["error"] = str(e)
    return result

# Restrict root_dir to the directory containing index.py
root_dir = os.path.dirname(os.path.abspath(__file__))

# Get requested path from query parameter
req_path = get_query_param('path')
if req_path:
    # Prevent traversal outside root
    safe_path = os.path.normpath(os.path.join(root_dir, req_path.lstrip('/')))
    if not safe_path.startswith(root_dir):
        print("Status: 400 Bad Request\nContent-Type: application/json\n")
        print(json.dumps({"error": "Invalid path"}))
        sys.exit(0)
else:
    safe_path = root_dir

# List contents of the requested directory
result = list_directory(safe_path)

print("Content-Type: application/json\n")
print(json.dumps(result, indent=2))

