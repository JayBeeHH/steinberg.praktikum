#!/bin/zsh

cd "$(dirname "$0")"

PORT=3000
LOG_FILE="/tmp/praktikumsportal-local.log"

if curl -s "http://127.0.0.1:${PORT}" >/dev/null 2>&1; then
  open "http://127.0.0.1:${PORT}"
  exit 0
fi

nohup env PORT="${PORT}" npm start >"${LOG_FILE}" 2>&1 &

for _ in {1..30}; do
  if curl -s "http://127.0.0.1:${PORT}" >/dev/null 2>&1; then
    open "http://127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 1
done

echo ""
echo "Der lokale Server konnte nicht gestartet werden."
echo "Logdatei: ${LOG_FILE}"
read -k 1 "?Zum Beenden eine Taste druecken ..."
exit 1
