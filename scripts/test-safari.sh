#!/bin/bash

# Get the current application bundle identifier (more reliable than name)
CURRENT_APP=$(osascript -e 'tell application "System Events" to get bundle identifier of first application process whose frontmost is true')

# Run the tests
npm run test

# Return focus to the original application
if [ -n "$CURRENT_APP" ]; then
	osascript -e "tell application id \"$CURRENT_APP\" to activate" 2>/dev/null || true
fi
