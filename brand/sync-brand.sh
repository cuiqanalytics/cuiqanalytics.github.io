#!/usr/bin/env bash
# Copy the shared brand files into each product site (their own brand/ folder), so every site works
# on its own origin. Edit the files here, then run this. --check only reports copies that drifted.
#   brand/sync-brand.sh [--check]     product folders default to siblings of this repo:
#   RGEN_SITE=../rgen-cli QDATA_SITE=../qdata-cli ASQL_SITE=../asql-cli
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)
SITES=("${RGEN_SITE:-$ROOT/rgen-cli}" "${QDATA_SITE:-$ROOT/qdata-cli}" "${ASQL_SITE:-$ROOT/asql-cli}")
FILES=(brand.css brand.js icon-cuiq.svg icon-rgen.svg icon-qdata.svg icon-asql.svg)
drift=0
for site in "${SITES[@]}"; do
  [[ -f $site/index.html ]] || { echo "skip: no site at $site" >&2; continue; }
  for f in "${FILES[@]}"; do
    if [[ ${1:-} == --check ]]; then
      cmp -s "$HERE/$f" "$site/brand/$f" || { echo "drift: $site/brand/$f"; drift=1; }
    else
      mkdir -p "$site/brand"; cp "$HERE/$f" "$site/brand/$f"
    fi
  done
  [[ ${1:-} == --check ]] || echo "synced: $site/brand"
done
exit $drift
