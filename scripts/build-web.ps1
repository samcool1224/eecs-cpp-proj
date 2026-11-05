$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
if (-not (Get-Command em++ -ErrorAction SilentlyContinue)) { throw "Activate Emscripten with emsdk_env.bat or emsdk_env.ps1 first." }
em++ cpp/wasm_bindings.cpp -std=c++17 -O2 --bind -sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=web,node -sALLOW_MEMORY_GROWTH=1 -sFILESYSTEM=0 -o dist/movie-core.js
if ($LASTEXITCODE -ne 0) { throw "WebAssembly build failed." }
Write-Output "Built dist/movie-core.js and dist/movie-core.wasm"
