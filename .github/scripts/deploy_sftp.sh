#!/usr/bin/env bash

set -euo pipefail

local_dir="${1:?local directory required}"
remote_dir="${2:?remote directory required}"
dry_run="${3:-true}"
dry_option=""

if [ "$dry_run" = "true" ]; then
  dry_option="--dry-run"
fi

for attempt in 1 2 3 4; do
  if lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$FTP_PORT" "sftp://$FTP_SERVER" <<EOF
set cmd:fail-exit yes
set net:timeout 120
set net:max-retries 3
set net:reconnect-interval-base 5
set net:reconnect-interval-max 30
set sftp:auto-confirm yes
mirror --reverse --continue --verbose --no-perms $dry_option \
  --exclude-glob .git* \
  --exclude-glob .github/** \
  --exclude-glob node_modules/** \
  --exclude-glob README.md \
  --exclude-glob CHANGELOG.md \
  --exclude-glob VERSION \
  "$local_dir" "$remote_dir"
bye
EOF
  then
    exit 0
  fi

  if [ "$attempt" -eq 4 ]; then
    exit 1
  fi

  sleep $((attempt * 10))
done
