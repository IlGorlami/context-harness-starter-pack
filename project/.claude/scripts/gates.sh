#!/bin/sh
# Run every gate in order and stop at the first failure.
# Edit the list to match your project. The ship-pr skill calls this script.
set -e
npm run lint
npm run typecheck
npm test
