#!/bin/bash
# ==========================
# Auto Deploy Script
# ==========================

# Start SSH agent
eval "$(ssh-agent -s)" >/dev/null

# Add SSH key (ignore if already added)
ssh-add /Users/ahmedalshahab/Documents/keys/datacenter-actions 2>/dev/null

# Check for commit message
if [ -z "$1" ]; then
  echo "❌ Please provide a commit message."
  echo "Usage: ./deploy.sh \"Your commit message\""
  exit 1
fi

# Stage all changes
git add .

# Commit only if there are changes
if git diff --cached --quiet; then
  echo "✅ No changes to commit."
else
  git commit -m "$1"
fi

# Force push to GitHub
echo "🚀 Force pushing to GitHub..."
if git push --force origin main; then
  echo "✅ Successfully pushed to main!"
else
  echo "❌ Push failed. Check your SSH key or GitHub permissions."
  exit 1
fi
