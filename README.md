# Frame Movie Rating System

A polished movie journal with a C++17 application core compiled to WebAssembly, a responsive browser interface, and a console app that shares the same core. No API keys, database, npm installation, or C++ compiler is required to run the included web build.

## Start here

1. Open the deployed app, or run a local HTTP server from the project directory:
   ```sh
   python3 -m http.server 8000 --directory dist
   ```
   Windows: `py -m http.server 8000 --directory dist`.
2. Visit `http://localhost:8000` in a modern browser. Do not double-click index.html: browsers restrict loading WebAssembly/modules from file URLs.
3. Nine sample movies are created on first launch. Add, edit, or delete any movie. Your browser saves changes automatically. The sample ratings are illustrative personal ratings.
4. Export a JSON backup before changing devices, clearing browser data, or importing a replacement catalog.

## Features

- Add, edit, delete, and view movies and personal reviews.
- Rate from 1.0 to 10.0 in increments of 0.1; 7.0 or higher means Recommended.
- Save unrated movies to the watchlist. Internally, rating 0 means unrated and does not count toward the average or recommendations.
- Search title, release year, and review; filter by genre; sort by recently added, rating, title, or release year.
- Grid/list views, highest-rated spotlight, collection statistics, rating distribution, and genre counts.
- Per-browser saving, JSON export/import with replacement confirmation, and sample restore with confirmation.
- Native dialogs, keyboard operation, visible focus states, responsive layouts, and local artwork with no external asset requests.
- Limit: 500 movies; title 160 UTF-8 bytes; review 2000 UTF-8 bytes; year 1888–2100; imported file under 2 MB.

## How C++ and the UI work together

`cpp/movie.hpp` defines `Movie` and `Catalog`. `cpp/wasm_bindings.cpp` uses Emscripten Embind to expose Catalog methods. The built `dist/movie-core.js` loader loads `dist/movie-core.wasm`. JavaScript creates a C++ Catalog and calls its methods when buttons are pressed. C++ validates records, stores Movie objects, filters/sorts the collection, classifies ratings, calculates every numeric statistic, and emits JSON. JavaScript renders those results and moves snapshots into/out of localStorage.

This is browser-executed C++, not a remote server. There is no shared account system or database. HTML/CSS make the interface and JavaScript handles browser events/storage. `cpp/console.cpp` uses the same header and demonstrates actual `std::cin`/`std::cout` in a terminal. Console edits last for the current session; browser edits are saved locally. Search/title sorting use ASCII case folding; non-ASCII text is supported but its case equivalence is not normalized.

## Build the console

With a C++17 compiler, run from the project root:

```sh
mkdir -p build
g++ -std=c++17 -Wall -Wextra -Wpedantic cpp/console.cpp -o build/frame-console
./build/frame-console
```

Windows with a g++ installation: create the build folder, then run `g++ -std=c++17 cpp/console.cpp -o build/frame-console.exe` and `./build/frame-console.exe`. On macOS, `clang++` may replace `g++`. Optional CMake: `cmake -S . -B build` then `cmake --build build` and `ctest --test-dir build --output-on-failure`.

## Rebuild WebAssembly after C++ edits

The compiled web files are included. Rebuilding is necessary only after changing the C++ core or bindings.

Install and activate the official [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html). Then run:

```sh
bash scripts/build-web.sh
```

On Windows in an activated Emscripten PowerShell: `powershell -ExecutionPolicy Bypass -File scripts/build-web.ps1` (the policy flag applies only to this invocation; alternatively paste the em++ command from the script into the activated shell). No other front-end build step is required.

The shipped binary was compiled with Emscripten 3.1.6 and Clang 15. Rebuilding with a newer SDK may change generated loader files; rerun the tests and browser checks. The optional Node test requires Node 18+; the Emscripten 3.1.6 ES module loader expects the compatibility setup already included in tests/wasm_tests.mjs.

## Tests

```sh
g++ -std=c++17 -Wall -Wextra -Wpedantic tests/core_tests.cpp -o build/core-tests
./build/core-tests
node tests/wasm_tests.mjs
```

`tests/core_tests.cpp` checks recommendation thresholds 6.9/7.0, unrated behavior, empty averages, invalid inputs, search/filter combinations, failed edit preservation, IDs, sample reset, and the catalog capacity. The WebAssembly test executes the actual shipped binary and checks sample statistics, C++ filtering/edits, Unicode, JSON round trips, and object cleanup. See docs/TEST_RESULTS.md for the completed validation and manual browser checks.

## Deploy to GitHub Pages

1. Create a GitHub repository and upload the entire project, including dist and .github/workflows/pages.yml. Keep the .wasm binary and generated movie-core.js together.
2. Make `main` the default branch, or update the branch in the workflow.
3. Repository Settings → Pages → Build and deployment → Source: GitHub Actions.
4. Push to main or run the workflow manually. It deploys the prebuilt dist folder; Emscripten is not needed in CI.
5. Open the URL reported by the workflow. Relative asset paths support project sites such as username.github.io/repository/.

## Deploy to Vercel

1. Import the repository into Vercel and select the Other framework preset.
2. Leave the Build Command empty and use dist as the Output Directory. The included vercel.json specifies these settings.
3. Deploy. This is a static deployment, with no API endpoints or server process.

If you edit C++, rebuild and commit both generated web files before redeploying. Browser storage belongs to each origin, so moving from one URL to another does not migrate data; use export/import.

## Submission kit

- docs/Frame_Project_Report.docx — editable project report with student/class placeholders.
- docs/Three_Minute_Video_Script.docx and .md — two-speaker script with six timed segments.
- docs/RUBRIC_MAP.md — exact source locations and demonstration steps for every requirement.
- docs/CLASS_DEMO.md — preparation and an in-class demonstration sequence.
- docs/CODE_GUIDE.md — explanation of the shared C++ design and browser boundary.
- docs/TEST_RESULTS.md — checks performed and their results.

Fill in names and actual contributions, rehearse the script, and be ready to explain the constructor, private fields, recommendation condition, loops, and average calculation. The video script is a script only; no video is included.

## Source layout

| Path | Purpose |
| --- | --- |
| cpp/movie.hpp | Shared classes, validation, search, sorting, JSON, and statistics |
| cpp/console.cpp | Interactive terminal program using cin/cout |
| cpp/wasm_bindings.cpp | C++ to JavaScript binding definitions |
| dist/ | Complete runnable static web build |
| dist/app.js | UI events, rendering, and browser storage |
| dist/styles.css | Responsive interface styling |
| dist/art/ | Original geometric film-inspired SVG artwork |
| scripts/ | Web build scripts and artwork generator |
| tests/ | Native core and real WebAssembly tests |
| docs/ | Report, script, rubric mapping, and demonstration guides |

The geometric artwork is original and decorative; it is not official movie poster art. Movie titles are used only to identify catalog entries. The generated Emscripten loader retains its toolchain notices. No external movie API, live ratings, analytics, or server uploads are used.
