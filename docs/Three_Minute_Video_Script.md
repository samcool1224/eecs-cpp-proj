# Frame Three Minute Video Script

Two speakers. Six 30-second segments. Replace speaker labels with your names. Rehearse narration plus screen actions to exactly three minutes.

## 0:00 to 0:30 — Student 1

On screen: Show the collection and open one movie.

Our project is Frame, a personal movie rating system. The goal is to keep movies, reviews, and a watchlist in one place. Each film has a title, genre, release year, and rating. We used C++ for the application core, then built a browser interface so the collection is easy to explore.

## 0:30 to 1:00 — Student 2

On screen: Show Movie in movie.hpp, then point to seed and the movie cards.

The main class is Movie. Its fields are private, and public methods provide controlled access. A parameterized constructor initializes each movie's information. Our Catalog class stores a vector of Movie objects. It starts with nine sample movies, exceeding the three-object requirement. The same C++ classes are used in both the browser and console versions.

## 1:00 to 1:30 — Student 1

On screen: Add Class Demo at 6.9, then edit it to 7.0.

Here we are adding a movie with a rating of six point nine. C++ marks it Not recommended. When we edit the score to seven, the status becomes Recommended. That decision uses if and else. Validation rejects ratings outside one to ten. Unrated movies go on the watchlist and do not affect our average.

## 1:30 to 2:00 — Student 2

On screen: Show the average, insights, a search, and the calculation loop.

A for loop visits the rated movies, adds their scores, and counts them. Dividing that sum by the count gives the average. We handle an empty collection before dividing. C++ also calculates counts and rating distributions. Search, genre filters, and sorting run in C++ too. JavaScript displays the returned results and handles browser controls.

## 2:00 to 2:30 — Student 1

On screen: Show bindings, briefly refresh the GUI, then run the console and enter a menu choice.

Emscripten compiles our C++ into WebAssembly, which runs inside the browser. There is no remote server. JavaScript connects buttons to C++ methods and saves snapshots in browser storage. Export and import provide backups. We also included this native console, which uses actual cin and cout and a repeating menu to demonstrate the input and output requirements.

## 2:30 to 3:00 — Student 2

On screen: Show tests, change a sample rating in seed, rebuild the console, and show the changed output.

Our tests check invalid input, recommendation boundaries, averages, searching, edits, and JSON restoration. To show development, we can change a sample rating, rebuild the console, and observe the new average. The project demonstrates classes, objects, constructors, methods, access control, loops, and calculations. It also shows how one C++ core can support two different interfaces.

