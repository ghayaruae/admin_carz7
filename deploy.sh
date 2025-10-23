#!/bin/bash
# Start SSH agent if not already running
eval "$(ssh-agent -s)"

# Add your key (ignore errors if already added)
ssh-add /Users/ahmedalshahab/Documents/keys/datacenter-actions 2>/dev/null

# Check for a commit message
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh \"Your commit message\""
  exit 1
fi

# Stage all changes
git add .

# Commit with the provided message
git commit -m "$1"

# Push to GitHub
git push origin main

