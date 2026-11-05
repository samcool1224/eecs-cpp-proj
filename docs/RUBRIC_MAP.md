# Assignment requirement map

Movie title and rating replace the student name and grade fields in the example framework. The selected theme is Movie Rating System.

| Requirement | Implementation | Show in class |
| --- | --- | --- |
| At least 3 objects | Catalog::seed creates 9 Movie objects through add/restore | Launch the console and GUI |
| Assign information with a constructor | Movie::Movie(int, string, string, int, double, string) in cpp/movie.hpp | Show the initialization list |
| Display each object's information | display in cpp/console.cpp; renderCard and showDetails in dist/app.js | Show titles, ratings, and status |
| Determine parameters/status | Movie::status uses if/else for Not rated, Recommended, Not recommended | Change a rating from 6.9 to 7.0 |
| Extra calculation | Catalog::stats computes average, counts, maximum, distribution, genre totals; console display computes mean | Explain sum / rated count |
| Loop | Catalog::stats and query iterate over Movie objects; console menu uses while | Point to for and while loops |
| Clean output and comments | Terminal headings, spacing, formatted decimals; responsive cards; source comments | Show terminal output and core header |
| Variables and data types | int IDs/years/counts, double rating/average, string text, bool success, vector<Movie> | Explain why a rating uses double |
| cin / cout | readText/readNumber use getline(cin,...); display/main write to cout | Add a movie in the native console |
| if / else | Movie::status and validation/menu branches | Explain the >= 7 condition |
| Loops | for loops for movies and while loop for menu | Explain repeated input |
| Classes and objects | Movie and Catalog, nine sample Movie instances | Distinguish class from object |
| public and private | Both classes have private state and public methods | Explain controlled access |
| Methods | Movie::status, Catalog::add/update/remove/query/stats | Trace a GUI action to a method |
| Parameterized constructor | Movie constructor assigns all movie fields; Catalog(bool) controls seeding | Explain each parameter |
| Multiple objects | vector<Movie> holds separate movies with unique IDs | Edit one movie and show others stay unchanged |
| Basic calculations | Sum, rated count, mean, max and counts | Sample average = 59.7 / 7 = 8.528571... |
| Teams of two | Team member fields and contribution table in report | Fill with actual names and contributions |
| Three-minute video | docs/Three_Minute_Video_Script.docx and .md | Rehearse to exactly 3 minutes |
| Project report | docs/Frame_Project_Report.docx | Fill identity/contribution fields |
| Class development demonstration | docs/CLASS_DEMO.md | Modify threshold, rebuild, rerun, then restore |

The GUI does not claim to use cin; the accompanying native console uses actual C++ stream input/output. Both targets include the same cpp/movie.hpp, making the required C++ behavior straightforward to inspect.
