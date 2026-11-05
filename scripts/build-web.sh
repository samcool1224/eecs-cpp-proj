#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v em++ >/dev/null || { echo 'Install Emscripten and activate emsdk_env first.'; exit 1; }
em++ cpp/wasm_bindings.cpp -std=c++17 -O2 --bind -sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=web,node -sALLOW_MEMORY_GROWTH=1 -sFILESYSTEM=0 -o dist/movie-core.js
printf 'Built dist/movie-core.js and dist/movie-core.wasm\n'
