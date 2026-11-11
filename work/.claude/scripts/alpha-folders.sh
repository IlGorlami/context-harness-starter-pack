#!/bin/sh
# VS Code explorer.sortOrder=modified sorts folders by mtime, tie-breaking by name.
# Giving every folder the SAME mtime makes them fall back to alphabetical,
# while files keep their real mtime (still sorted by last modification).
# Scope: direct sub-folders of DIR only.
# Usage: sh alpha-folders.sh [DIR]   (DIR defaults to the current folder)
DIR="${1:-.}"
TS=202601010000
find "$DIR" -mindepth 1 -maxdepth 1 -type d -exec touch -t $TS {} +
