#!/bin/bash
# =============================================================================
#  build_astro.sh — Rebuild script for Astro SSG on o2switch
#  Triggered by webhook-payload.php after Payload CMS or Medusa fires a webhook.
#
#  Adjust these paths for your o2switch account:
#    REPO_DIR    — where this repo is cloned
#    WEB_ROOT    — public_html-style directory served by Apache
#    NODE_PATH   — alt-nodejs bin directory provided by CloudLinux
# =============================================================================
set -u
LOG_TS() { date +"%Y-%m-%d %H:%M:%S"; }
LOCK="/tmp/honey-astro-build.lock"

REPO_DIR="${REPO_DIR:-/home/USER/repositories/honey-selling-site-frontend}"
WEB_ROOT="${WEB_ROOT:-/home/USER/www}"
NODE_PATH="${NODE_PATH:-/opt/alt/alt-nodejs24/root/usr/bin}"

export PATH="$NODE_PATH:$PATH"
export NODE_TLS_REJECT_UNAUTHORIZED=0   # only if your o2switch SSL bundle misses a root CA

echo "========================================="
echo "[$(LOG_TS)] Astro rebuild starting"
echo "  REPO_DIR=$REPO_DIR"
echo "  WEB_ROOT=$WEB_ROOT"

# --- Single-flight lock ------------------------------------------------------
if [ -e "$LOCK" ] && kill -0 "$(cat "$LOCK")" 2>/dev/null; then
  echo "[$(LOG_TS)] another build is running (pid $(cat "$LOCK")); skipping."
  exit 0
fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

# --- 1/5 cd into repo --------------------------------------------------------
cd "$REPO_DIR" || { echo "ERROR: cannot cd to $REPO_DIR"; exit 1; }
echo "[$(LOG_TS)] [1/5] In repository"

# --- 2/5 pull latest sources -------------------------------------------------
if [ -d .git ]; then
  git fetch --quiet origin
  git reset --hard origin/main || git reset --hard origin/master
  echo "[$(LOG_TS)] [2/5] Pulled latest from origin"
else
  echo "[$(LOG_TS)] [2/5] Not a git checkout, skipping pull"
fi

# --- 3/5 install + build -----------------------------------------------------
echo "[$(LOG_TS)] [3/5] npm install + build"
npm install
if [ $? -ne 0 ]; then
  echo "[$(LOG_TS)] ERROR: npm install failed!"
  exit 1
fi
npm run build
if [ $? -ne 0 ]; then
  echo "[$(LOG_TS)] ERROR: npm run build failed!"
  exit 1
fi

# --- 4/5 deploy to web root, preserving .htaccess ----------------------------
echo "[$(LOG_TS)] [4/5] Deploying dist/ → $WEB_ROOT (keeping .htaccess)"
if command -v rsync >/dev/null 2>&1; then
  # rsync is the clean path: --delete but exclude .htaccess
  rsync -av --delete --exclude='.htaccess' dist/ "$WEB_ROOT/"
else
  # Fallback: wipe everything except .htaccess, then copy dist
  find "$WEB_ROOT/" -mindepth 1 -not -name '.htaccess' -delete
  cp -R dist/. "$WEB_ROOT/"
fi

# --- 5/5 done ----------------------------------------------------------------
echo "[$(LOG_TS)] [5/5] Deployment complete"
echo "========================================="
