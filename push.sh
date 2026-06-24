#!/usr/bin/env bash
# One-time: create an empty repo on GitHub first (e.g. shiv-nova/novagentica), then:
set -euo pipefail
REMOTE="${1:?Usage: ./push.sh git@github.com:shiv-nova/novagentica.git}"
git init
git add -A
git commit -m "Consolidate skills + generator service + workflow design (single source of truth)"
git branch -M main
git remote add origin "$REMOTE"
git push -u origin main
echo "Pushed to $REMOTE"
