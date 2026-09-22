#!/usr/bin/env bash
# scripts/start.sh - Run phase: loads .env and starts the server (Factor V)
set -euo pipefail

ENV_FILE="$(dirname "$0")/../.env"

if [ -f "$ENV_FILE" ]; then
  echo "[start.sh] Loading environment from .env..."
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

echo "[start.sh] Starting ${APP_NAME:-twelve-factor-api} on port ${PORT:-3000}..."
node "$(dirname "$0")/../src/app.js"
