#!/usr/bin/env bash
set -euo pipefail

npm run preview -- --host 127.0.0.1 --port 4173 &
server_pid=$!

cleanup() {
  kill "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

until curl --fail --silent --show-error http://127.0.0.1:4173/ >/dev/null; do
  sleep 0.2
done

echo "LHCI_READY"
wait "$server_pid"
