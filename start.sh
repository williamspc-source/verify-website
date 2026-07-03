#!/usr/bin/env bash
# Start the VERIFY CMS local dev server (Next.js + Payload) in the background.
# Binds 0.0.0.0 (see package.json "dev") so the team can reach it over the LAN.
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-3000}"
PID_FILE=".dev.pid"
LOG_FILE=".dev.log"

# Already running?
if lsof -ti ":$PORT" >/dev/null 2>&1; then
  echo "✗ Something is already listening on port $PORT. Run ./stop.sh first."
  exit 1
fi

echo "→ Starting dev server (port $PORT)…"
# nohup + & so it survives this shell; all output goes to the log file.
nohup pnpm dev >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"

# Wait for it to come up (compiles on first boot).
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:$PORT/admin" 2>/dev/null || echo 000)
  case "$code" in
    200|301|302|307) break ;;
  esac
  sleep 2
done

LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "")
echo "✓ Dev server running (pid $(cat "$PID_FILE"))"
echo "   Local:   http://localhost:$PORT"
[ -n "$LAN_IP" ] && echo "   Network: http://$LAN_IP:$PORT   (team / other devices on the same Wi-Fi)"
echo "   Admin:   http://localhost:$PORT/admin"
echo "   Logs:    tail -f $LOG_FILE"
echo "   Stop:    ./stop.sh"
