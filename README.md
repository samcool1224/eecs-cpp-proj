# Movie Rating System

Grade 11 C++ project by Amogh Sheth and Samaksh Bhargav.

Add, rate, review, search, edit, and remove movies. Ratings of **7.0 or higher** are recommended. Unrated movies stay on the watchlist and are excluded from the average. Nine sample movies are included.

## Run the browser app

From this folder, with Python installed:

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open **http://localhost:8000**. Serve the folder over HTTP; opening index.html directly will prevent WebAssembly from loading. No npm installation is needed.

The browser saves changes on this device. Export a JSON backup to keep a separate copy. The console app keeps changes for the current session.

## Files

- **cpp/movie.hpp** — Movie and Catalog classes, validation, recommendations, search, sorting, and statistics.
- **cpp/console.cpp** — console menu using cin and cout.
- **cpp/wasm_bindings.cpp** — connects the same C++ core to the browser.
- **dist/** — browser interface, real film posters, and the compiled C++ WebAssembly engine.
- **tests/** — checks for the C++ core and included WebAssembly build.
- **Project Report.pdf** — finalized report supplied by the authors.

## Build the console

With a C++17 compiler, create a build folder and run:

```sh
g++ -std=c++17 -Wall -Wextra -Wpedantic cpp/console.cpp -o build/movie-rating
./build/movie-rating
```

On Windows, use build/movie-rating.exe. CMake is also supported:

```sh
cmake -S . -B build
cmake --build build
ctest --test-dir build --output-on-failure
```

## Rebuild the browser engine

The compiled engine is included. After changing the C++ core, activate the Emscripten SDK and run:

```sh
em++ cpp/wasm_bindings.cpp -std=c++17 -O2 --bind -sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=web,node -sALLOW_MEMORY_GROWTH=1 -sFILESYSTEM=0 -o dist/movie-core.js
```

HTML, CSS, and app.js changes need only a browser refresh.

## Check the included engine

With Node.js 18 or later:

```sh
npm test
```

The tests cover the 6.9/7.0 recommendation boundary, averages, watchlists, edits, filtering, invalid inputs, Unicode, backup round trips, and the chart's half-point ranges. Chart ranges group scores for display; saved ratings stay unchanged.

Poster images identify the nine sample films. Original image URLs and source pages are listed in [posters/sources.json](dist/posters/sources.json).
