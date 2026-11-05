# Validation results

Validated November 5, 2026.

| Check | Result |
| --- | --- |
| Compile native console and core tests with C++17, -Wall -Wextra -Wpedantic | Passed without compiler warnings |
| Native core test executable | Passed: recommendation boundaries, unrated/empty averages, validation, filters, failed-edit preservation, CRUD, IDs, seed and capacity |
| Scripted console session | Passed: add at 6.9, edit to 7.0, list object information, and recalculate the average |
| Emscripten compilation | Passed; supplied dist/movie-core.js and dist/movie-core.wasm compiled from the shared header |
| Actual compiled WebAssembly in Node | Passed: sample statistics, genre totals, distribution totals, filters, edits, invalid ratings, duplicate IDs, Unicode, JSON round trip, and cleanup |
| JavaScript syntax check | Passed for dist/app.js |
| Browser engine startup | Passed in Chrome: nine sample movies, average 8.5, six recommended, two on the watchlist |
| GUI add and edit | Passed: Class Demo at 6.9 was Not recommended; editing to 7.0 made it Recommended and increased the count |
| GUI search, genre filter, and list view | Passed: combined search for Class Demo with Drama returned one movie in list view |
| Browser persistence | Passed: refresh retained the added movie and its edited rating |
| GUI export, delete, and import | Passed: backup downloaded, test movie deleted with confirmation, imported backup confirmed and restored the ten-movie catalog |
| GUI watchlist | Passed: Future Watch was saved unrated, watchlist count increased, average remained unchanged |
| Insights | Passed: totals, average, distribution, and genre totals rendered from C++ statistics |
| Narrow layout | Passed: collection and movie detail dialog visually checked in a 390-pixel-wide iframe viewport |
| Report and video script rendering | Passed: all four report pages and both script pages inspected after final formatting |

Toolchain used here: g++ 13.3.0, Emscripten 3.1.6, Clang 15, Node 24, and Chrome. The prebuilt web app does not require these tools to run.

The browser export/import round trip used an actual downloaded JSON file. An invalid-rating import was also submitted; the subsequent catalog still contained the same eleven records. The short-lived error toast was not captured, so detailed invalid-import validation is covered by the C++/WebAssembly tests rather than claimed as a complete browser error-message test.

Limits of verification: GitHub Pages and Vercel configuration are supplied but have not been deployed into the student's accounts. Windows/macOS compiler setup and a physical phone were not available for testing. The narrow-screen check used a browser iframe, not a physical device. Storage-denial warnings are implemented, but a browser with denied/full localStorage was not simulated. The video narration has 323 words plus timed screen actions and must be rehearsed to fit exactly three minutes; no recorded video is included.
