#!/usr/bin/env bash
# scripts/stop.sh - Sends SIGTERM to trigger graceful shutdown (Factor IX)
set -euo pipefail

PORT="${PORT:-3000}"
PID=$(lsof -t -i:"$PORT" 2>/dev/null || true)

if [ -n "$PID" ]; then
  echo "[stop.sh] Sending SIGTERM to PID $PID (port $PORT)..."
  kill -SIGTERM "$PID"
  echo "[stop.sh] Server is shutting down gracefully."
else
  echo "[stop.sh] No process found on port $PORT."
fi
