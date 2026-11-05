# Explain the code in class

## The two classes

Movie describes one film. Its private fields store an ID, year, title, genre, review, and rating. The parameterized constructor initializes those fields in its initialization list. Getters expose values without letting interface code directly change the private fields. The status method returns Not rated when rating is 0, Recommended at 7 or higher, and Not recommended otherwise.

Catalog owns a vector<Movie>. The vector can grow as users add films. add forwards to restore with the next ID; restore validates fields and creates the object with emplace_back. update first validates a complete replacement and then assigns a new Movie value to the existing slot. remove erases an object by ID. IDs, rather than card positions, identify movies even after sorting.

Catalog::valid checks title/review limits, the allowed genres, the year range, finite numeric values, the rating range, and increments of 0.1. The browser also uses form controls for helpful immediate feedback, but C++ validates records regardless of that interface. Ratings use double and integer fields use int. The small tolerance on the decimal-step check accounts for binary floating-point rounding.

## Recommendations and averages

The rule is rating >= 7.0. This is a simple personal-rating rule, not an AI recommendation algorithm. A watchlist entry has rating 0. In stats, a for loop sums only rated movies and counts them. average = sum / count. When count is zero, the JSON value is 0 and the UI shows a dash instead of claiming a zero rating. A scan also finds the highest-rated movie; equal ratings choose the lower ID for a stable result.

The sample rated values are 9.2, 8.6, 9.4, 9.0, 8.3, 8.8, and 6.4. Their sum is 59.7; their mean is approximately 8.53, shown as 8.5 on the web dashboard and 8.53 in the console. Six of these seven are recommended. Two more movies are unrated watchlist entries.

## Search and sorting

query loops over the vector, applies the search text, genre, and collection filters, and copies matching objects into a result vector. std::sort orders that result by title, rating, year, or ID. Sorting the copy keeps the original collection intact. Text search includes the title, year, and review; ASCII letters are matched without regard to case. UTF-8 titles/reviews can be stored, displayed, and round-tripped, but Unicode case folding is not implemented.

For n movies, searching is O(n) apart from string lengths; sorting is O(n log n). Statistics scan the small catalog a fixed number of times for the rating buckets and genres. With the 500-record cap, these operations are comfortably small for a class project.

## Browser boundary

wasm_bindings.cpp uses Embind to make the Catalog constructor and methods callable from JavaScript. Emscripten produces a JavaScript loader and a WebAssembly binary. The loader gives app.js a Core object; new Core.Catalog(true) creates a real C++ object in WebAssembly memory. Browser events call add/update/remove/query/stats. Returned JSON strings are parsed and displayed as escaped text in HTML.

There is no remote C++ server. JavaScript handles DOM events, HTML rendering, dialogs, download/upload controls, and localStorage because these are browser APIs. Movie storage in memory, numeric statistics, validation, recommendations, and query behavior execute in C++. A temporary C++ Catalog validates all imported records; only then is it swapped into use. Failed imports destroy the temporary object and preserve the live catalog. Explicit .delete() calls release the C++ objects when replaced.

The quote helper safely escapes double quotes, backslashes, and control characters in JSON strings. The UI escape helper separately escapes markup characters before placing movie text in HTML; JSON escaping and HTML escaping solve different problems.

## Console boundary

The native program includes the same header but not the WebAssembly bindings. getline(cin, line) reads user input and cout displays information. A stream parses numeric lines without allowing trailing garbage. EOF exits gracefully. The menu repeats with a while loop. Console data is session-only and is independent of the browser's saved collection.

## Suggested division of work

One teammate can study and demonstrate Movie, Catalog, validation, and the console. The other can study and demonstrate the bindings, interface, saving, deployment, and import/export. Both should understand the shared C++ behavior and the rubric. Record actual contributions in the report rather than treating this suggestion as completed work.

## Useful change to demonstrate development

In Movie::status, find rating_ >= 7.0 and explain the branch. The recommendation threshold also appears in query and stats, so changing the policy requires updating all three places plus the interface help text and tests. For a safer small live demonstration, change one sample rating in seed, rebuild the native console, and show the changed average. Rebuild WebAssembly if demonstrating the changed sample in a fresh browser catalog; existing localStorage preserves saved movies until Restore samples is selected.
