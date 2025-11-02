#!/usr/bin/env zsh
set -euo pipefail

# cd to this script's folder (project root)
cd -- "$(dirname "$0")"

# Config via args (optional)
MODE="${1:-preview}"     # "dev" or "preview"
PORT="${2:-5173}"

URL="http://localhost:${PORT}"

# Start server in background; keep stdout clean for Shortcuts
if [[ "$MODE" == "dev" ]]; then
  npm run dev -- --port "$PORT" > /tmp/wodspark.log 2>&1 &
else
  if [[ ! -d "dist" ]]; then
    echo "Building app…" >&2
    npm run build >> /tmp/wodspark.log 2>&1
  fi
  npm run preview -- --port "$PORT" >> /tmp/wodspark.log 2>&1 &
fi
SERVER_PID=$!

cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT INT TERM

# Wait until server responds
until curl -fsS "$URL" >/dev/null 2>&1; do sleep 0.2; done

# 👉 Emit the URL for Shortcuts to use (ONLY stdout output)
echo "$URL"

# Launch a separate Chrome instance in app mode and block until it closes
#open -W -na "Google Chrome" --args \
#  --user-data-dir="/tmp/WODSparkChromeProfile" \
#  --app="$URL"

# When that window closes, we return here; trap will stop the server
exit 0
