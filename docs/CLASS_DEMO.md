# In-class demonstration

## Before class

- Fill names, course, teacher, date, and actual contributions in the report.
- Open the web app and check that its C++ engine loads. Export any personal catalog before resetting samples.
- Have a C++17 compiler available; compile build/frame-console ahead of time.
- Keep cpp/movie.hpp, cpp/console.cpp, and cpp/wasm_bindings.cpp open in the editor.
- To run the prebuilt website locally: python3 -m http.server 8000 --directory dist.
- Keep a backup copy of dist and the full submission ZIP. If school internet fails, use the local HTTP server.

## Demonstration sequence

1. Show the nine sample movies. Explain that every record is a Movie object initialized through its parameterized constructor.
2. Open a movie. Identify title, genre, year, rating, recommendation status, and review.
3. Add Class Demo with genre Drama, year 2026, and rating 6.9. Show Not recommended.
4. Edit it to 7.0. Show Recommended and the changed average/counts. Explain the >= comparison.
5. Add another movie to the watchlist. Explain why it has no rating and does not affect the average.
6. Search Class Demo, filter Drama, change sorting, and switch grid/list. Clear filters afterward.
7. Open Your insights and explain rated-only averages and the distribution. A score of 8.3 belongs to the bar labelled 9 (above 8, up to 9).
8. Export JSON. Delete Class Demo. Import the backup and confirm replacement, then show it is restored. Refresh to demonstrate browser persistence.
9. Run the console. Show its object output, enter menu 2, and add a movie using actual cin. Show formatted cout output with menu 1.
10. In cpp/movie.hpp, point to private fields, the parameterized constructor, public methods, the status if/else, the vector, and a for loop. Show the while loop in the console.
11. Demonstrate development: modify one sample rating in seed; rebuild the console with g++ and rerun. Explain the changed average. Restore the sample value afterward. If time permits, rebuild WebAssembly using an activated Emscripten SDK and restore browser samples to observe the change there.

## Quick oral answers

- Why C++? It stores the objects and implements validation, queries, recommendation rules, and calculations in one reusable core.
- Why JavaScript? It connects the C++ engine to browser controls and browser storage.
- Is WebAssembly a server? No. It is compiled code executing locally in the browser.
- Why have a console app? The assignment explicitly requires cin/cout; the console uses them directly and shares the core classes.
- What does private mean? Other code cannot directly access the class's state; public methods provide access.
- What if there are no rated movies? No division by zero occurs. The interface displays a dash for the average.
- What if import fails? A separate Catalog is discarded and the current collection remains in place.
- What would you add later? Shared accounts, a real database, optional movie metadata search, and full Unicode-aware search.
