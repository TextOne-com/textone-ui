#!/bin/sh
# Visual regression with a Linux browser, like CI: Chromium runs in the Playwright image, the
# tests and the preview server on this machine. Pass --update-snapshots to accept changes.
set -e
cd "$(dirname "$0")/.."
NAME=tx-visual-browser
docker rm -f "$NAME" >/dev/null 2>&1 || true
docker run -d --rm --name "$NAME" --add-host=host.docker.internal:host-gateway -p 3910:3910 \
  mcr.microsoft.com/playwright:v1.64.1-noble \
  sh -c "npx -y playwright@1.64.1 run-server --port 3910 --host 0.0.0.0" >/dev/null
trap 'docker rm -f "$NAME" >/dev/null 2>&1 || true' EXIT
i=0
until curl -s -o /dev/null http://localhost:3910 || [ $i -gt 60 ]; do i=$((i + 1)); sleep 1; done
PW_REMOTE=ws://localhost:3910/ npx playwright test "$@"
