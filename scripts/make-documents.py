from docx import Document
from docx.shared import Inches,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.table import WD_TABLE_ALIGNMENT,WD_CELL_VERTICAL_ALIGNMENT
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent/'docs'
ROOT.mkdir(exist_ok=True)
def base():
 d=Document();s=d.sections[0];s.top_margin=Inches(.68);s.bottom_margin=Inches(.65);s.left_margin=Inches(.78);s.right_margin=Inches(.78)
 for name in ['Normal','Title','Subtitle','Heading 1','Heading 2']:
  st=d.styles[name];st.font.name='Calibri';st.font.color.rgb=RGBColor(0,0,0)
 d.styles['Normal'].font.size=Pt(10.5);d.styles['Normal'].paragraph_format.space_after=Pt(7);d.styles['Normal'].paragraph_format.line_spacing=1.12
 d.styles['Title'].font.size=Pt(28);d.styles['Title'].paragraph_format.space_after=Pt(10)
 d.styles['Heading 1'].font.size=Pt(17);d.styles['Heading 1'].paragraph_format.space_before=Pt(14);d.styles['Heading 1'].paragraph_format.space_after=Pt(7)
 d.styles['Heading 2'].font.size=Pt(12);d.styles['Heading 2'].paragraph_format.space_before=Pt(10)
 
 for tree in [d.element,d.styles.element]:
  for border in tree.xpath('.//w:pBdr'):border.getparent().remove(border)
 d.core_properties.author='';d.core_properties.title='Frame Movie Rating System';return d
def p(d,t):d.add_paragraph(t)
def h(d,t):d.add_heading(t,level=1)
def table(d,headers,rows,widths):
 t=d.add_table(rows=1,cols=len(headers));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.autofit=False
 for c,w in zip(t.columns,widths):c.width=Inches(w)
 for i,x in enumerate(headers):t.rows[0].cells[i].text=x
 for row in rows:
  c=t.add_row().cells
  for i,x in enumerate(row):c[i].text=x
 for ri,row in enumerate(t.rows):
  for ci,c in enumerate(row.cells):
   c.width=Inches(widths[ci]);c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
   tcpr=c._tc.get_or_add_tcPr();b=OxmlElement('w:tcBorders')
   for edge in ['top','left','bottom','right']:
    e=OxmlElement('w:'+edge);e.set(qn('w:val'),'single');e.set(qn('w:sz'),'4');e.set(qn('w:color'),'D9D9D9');b.append(e)
   tcpr.append(b);mar=OxmlElement('w:tcMar')
   for edge in ['top','left','bottom','right']:
    e=OxmlElement('w:'+edge);e.set(qn('w:w'),'90');e.set(qn('w:type'),'dxa');mar.append(e)
   tcpr.append(mar);sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'283D36' if ri==0 else ('F1F4F1' if ri%2==0 else 'FFFFFF'));tcpr.append(sh)
   for par in c.paragraphs:
    par.paragraph_format.space_after=Pt(2);par.paragraph_format.line_spacing=1.05
    for run in par.runs:
     run.font.size=Pt(9);run.bold=ri==0;run.font.color.rgb=RGBColor(255,255,255) if ri==0 else RGBColor(0,0,0)
  if ri==0:
   repeat=OxmlElement('w:tblHeader');row._tr.get_or_add_trPr().append(repeat)
 d.add_paragraph().paragraph_format.space_after=Pt(1)
 return t

d=base();d.add_paragraph('Frame Movie Rating System',style='Title');p(d,'C++ Project Report')
p(d,'Student 1: ____________________    Student 2: ____________________\nCourse and section: ____________________\nTeacher: ____________________    Submission date: ____________________')
h(d,'Project goal')
p(d,'Frame helps a user keep a personal movie collection, record ratings and reviews, identify recommended films, and maintain a watchlist. The application meets the movie rating theme through a C++ Movie class and a Catalog containing multiple Movie objects. A browser interface presents the collection, while a separate console program demonstrates the required cin and cout input and output.')
h(d,'What the application does')
p(d,'The collection begins with nine sample movies. Users can add, edit, delete, and inspect films; search titles, years, and reviews; filter by genre; and sort the results. Each movie stores a title, genre, release year, rating, and optional review. The interface offers grid and list views, a highest-rated spotlight, an average rating, recommendation counts, a rating distribution, and genre totals.')
p(d,'A rating from 1.0 to 10.0 is accepted in increments of 0.1. A score of 7.0 or higher is Recommended; a lower rated score is Not recommended. Rating 0 represents an unrated watchlist movie. Watchlist movies are excluded from averages and recommendations. These are personal ratings and a fixed rule, not critic scores or a machine learning model.')
h(d,'Architecture')
table(d,['Layer','Responsibility'],[
 ('Shared C++17 core','Movie objects, validation, catalog operations, queries, recommendations, statistics, and JSON output.'),
 ('WebAssembly bindings','Emscripten Embind exposes Catalog methods so the browser can call the compiled C++ core.'),
 ('Browser interface','HTML and CSS present the interface. JavaScript connects events, renders results, and uses browser storage.'),
 ('Native console','The same C++ header is used by a terminal program with actual cin and cout.')],[1.45,5.3])
p(d,'The C++ core executes locally in the browser as WebAssembly. It is not a remote server. Static hosting on GitHub Pages or Vercel serves the prebuilt files without an API key or database.')
d.add_page_break();h(d,'Core design and implementation')
p(d,'Movie uses private fields to protect its state and public methods to expose information. Its parameterized constructor assigns the ID, title, genre, year, rating, and review through an initialization list. The status method applies the recommendation rule with if and else. Catalog owns a vector of Movie objects and provides add, restore, update, remove, query, stats, and snapshot methods.')
p(d,'Adding a movie validates its fields and constructs a new object. Updating validates all replacement values before changing the existing object. Stable numeric IDs identify movies across searches and sorts. The catalog accepts at most 500 movies. It checks allowed genres, year limits, finite ratings, decimal increments, and text length. Failed edits leave the existing movie unchanged.')
h(d,'Loops and calculations')
p(d,'A for loop scans rated movies to calculate their sum, count, and highest rating. The average is sum divided by rated count; a zero count is handled before division. Further loops count recommendations, distribution buckets, and genres. The sample rated scores total 59.7 across seven films, giving 8.528571... out of 10, displayed as 8.5 in the web dashboard and 8.53 in the console. Six sample movies are recommended and two are unrated.')
p(d,'The query method scans the collection and copies matching movies into a result vector. std::sort orders the results, keeping the original collection intact. Search is linear in the catalog size apart from string work; sorting is O(n log n). Search and title sorting use ASCII case folding. UTF-8 text is supported for storage and display, but full Unicode case normalization is not implemented.')
h(d,'Saving and importing')
p(d,'C++ emits a versioned JSON snapshot. JavaScript saves it in localStorage and restores it through C++ validation at startup. Export downloads a backup. Import constructs a separate C++ Catalog and validates every record before requesting replacement confirmation. A failed import discards that temporary object and preserves the current collection. Duplicate IDs and invalid fields are rejected.')
p(d,'If browser storage is unavailable, the app warns the user and remains usable for the current session. Export provides a backup path. Text is escaped separately for JSON serialization and HTML rendering. The console keeps changes only for its current session and does not share the browser catalog.')
h(d,'Main source files')
table(d,['File','Purpose'],[('cpp/movie.hpp','Shared classes and movie behavior.'),('cpp/console.cpp','Interactive console using cin and cout.'),('cpp/wasm_bindings.cpp','Embind definitions for Catalog.'),('dist/app.js and styles.css','Browser events, rendering, storage, and styling.'),('tests/core_tests.cpp and wasm_tests.mjs','Native C++ checks and compiled WebAssembly checks.')],[2.65,4.1])
d.add_page_break();h(d,'Assignment requirement coverage')
table(d,['Requirement','Evidence'],[
 ('At least three objects','Catalog::seed constructs nine separate Movie objects.'),
 ('Parameterized constructor','Movie constructor initializes all movie fields.'),
 ('Display required information','Console output and browser cards show title, rating, and status.'),
 ('Determine status','Movie::status uses if and else for all three outcomes.'),
 ('Extra calculation','Average rating, counts, maximum, and distributions.'),
 ('Variables and data types','int IDs and years, double ratings, string text, bool results.'),
 ('cin and cout','getline(std::cin, ...) and std::cout in console.cpp.'),
 ('Loops','for loops in the core and while loop in the console menu.'),
 ('Classes and objects','Movie and Catalog classes; vector<Movie> collection.'),
 ('public and private','Private state and public constructor and methods.'),
 ('Methods','add, update, remove, query, stats, status, and getters.'),
 ('Multiple objects','Independent film records with unique IDs.'),
 ('Basic calculations','Sum, count, average, comparisons, and maxima.'),
 ('Clean output and comments','Formatted console output, GUI labels, source comments.'),
 ('Video and class demo','Two-speaker script and CLASS_DEMO.md in the submission kit.')],[2.2,4.55])
h(d,'Validation plan')
p(d,'Native tests exercise the 6.9 and 7.0 recommendation boundary, unrated records, empty averages, invalid text and numeric values, search and filter combinations, failed updates, ID uniqueness, deletion, sample reset, and the 500-record limit. The WebAssembly test executes the compiled browser core and checks sample statistics, filtering, edits, Unicode text, JSON round trips, and object cleanup.')
p(d,'Browser checks cover loading the engine, creating and editing a record, recommendations, the watchlist, filtering, list view, insights, persistence after refresh, dialogs, and narrow layouts. The completed checks and any verification limits are recorded in TEST_RESULTS.md.')
d.add_page_break();h(d,'Running and demonstrating the project')
p(d,'The prebuilt web application needs a modern browser and HTTP hosting. From the project root, run python3 -m http.server 8000 --directory dist, then open http://localhost:8000. On Windows, py can replace python3. The dist folder is also ready for static hosting. Opening index.html directly as a local file is not supported because the app loads JavaScript modules and WebAssembly.')
p(d,'Compile the console using g++ -std=c++17 cpp/console.cpp -o frame-console and run the resulting program. A C++17 compiler is required for this step. The web files do not require compilation to run. To rebuild them after C++ edits, activate an Emscripten SDK and run scripts/build-web.sh or the supplied PowerShell equivalent.')
p(d,'For the class demonstration, show the sample objects and constructor, add a movie at 6.9, change it to 7.0, and explain the status change. Add an unrated watchlist entry and show that the average excludes it. Demonstrate a console input using cin and the resulting cout output. Modify a sample rating in the source, rebuild the console, and explain how its average changes. CLASS_DEMO.md contains the detailed sequence.')
h(d,'Team contributions')
p(d,'Complete this table with the work each student actually performed, reviewed, tested, and can explain.')
table(d,['Team member','Actual contributions'],[('Student 1 name: __________________','________________________________________________\n________________________________________________\n________________________________________________'),('Student 2 name: __________________','________________________________________________\n________________________________________________\n________________________________________________')],[2.2,4.55])
h(d,'Limits and future improvements')
p(d,'Data belongs to one browser and origin; clearing browser data or moving to another URL requires an exported backup to retain it. There are no accounts, shared catalogs, or live movie metadata. The decorative artwork is original geometric artwork rather than official posters. Search does not implement full Unicode case folding. Browser and console collections are independent.')
p(d,'Possible extensions include shared accounts backed by a database, optional external movie search, richer review history, and centralized configuration for the recommendation threshold. The current app keeps the required object model and calculations visible for classroom explanation.')
h(d,'References')
p(d,'Emscripten documentation: https://emscripten.org/docs/\nEmbind reference: https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html\nThe project source and accompanying README explain the implementation and deployment steps.')
d.save(ROOT/'Frame_Project_Report.docx')

segments=[
('0:00 to 0:30','Student 1','Show the collection and open one movie.',"Our project is Frame, a personal movie rating system. The goal is to keep movies, reviews, and a watchlist in one place. Each film has a title, genre, release year, and rating. We used C++ for the application core, then built a browser interface so the collection is easy to explore."),
('0:30 to 1:00','Student 2','Show Movie in movie.hpp, then point to seed and the movie cards.',"The main class is Movie. Its fields are private, and public methods provide controlled access. A parameterized constructor initializes each movie's information. Our Catalog class stores a vector of Movie objects. It starts with nine sample movies, exceeding the three-object requirement. The same C++ classes are used in both the browser and console versions."),
('1:00 to 1:30','Student 1','Add Class Demo at 6.9, then edit it to 7.0.',"Here we are adding a movie with a rating of six point nine. C++ marks it Not recommended. When we edit the score to seven, the status becomes Recommended. That decision uses if and else. Validation rejects ratings outside one to ten. Unrated movies go on the watchlist and do not affect our average."),
('1:30 to 2:00','Student 2','Show the average, insights, a search, and the calculation loop.',"A for loop visits the rated movies, adds their scores, and counts them. Dividing that sum by the count gives the average. We handle an empty collection before dividing. C++ also calculates counts and rating distributions. Search, genre filters, and sorting run in C++ too. JavaScript displays the returned results and handles browser controls."),
('2:00 to 2:30','Student 1','Show bindings, briefly refresh the GUI, then run the console and enter a menu choice.',"Emscripten compiles our C++ into WebAssembly, which runs inside the browser. There is no remote server. JavaScript connects buttons to C++ methods and saves snapshots in browser storage. Export and import provide backups. We also included this native console, which uses actual cin and cout and a repeating menu to demonstrate the input and output requirements."),
('2:30 to 3:00','Student 2','Show tests, change a sample rating in seed, rebuild the console, and show the changed output.',"Our tests check invalid input, recommendation boundaries, averages, searching, edits, and JSON restoration. To show development, we can change a sample rating, rebuild the console, and observe the new average. The project demonstrates classes, objects, constructors, methods, access control, loops, and calculations. It also shows how one C++ core can support two different interfaces.")]
s=base();s.add_paragraph('Frame Three Minute Video Script',style='Title');p(s,'Two speakers with six 30 second segments')
p(s,'Replace Student 1 and Student 2 with your names. Read naturally and use each segment for narration plus the indicated screen action. Rehearse and trim pauses to finish at exactly 3 minutes. This is a script and shot plan, not a video file.')
for i,(time,speaker,screen,text) in enumerate(segments):
 if i==3:s.add_page_break()
 s.add_heading(time+' '+speaker,level=1);p(s,'On screen: '+screen);p(s,text)
s.save(ROOT/'Three_Minute_Video_Script.docx')
md='# Frame Three Minute Video Script\n\nTwo speakers. Six 30-second segments. Replace speaker labels with your names. Rehearse narration plus screen actions to exactly three minutes.\n\n'
for time,speaker,screen,text in segments:md+=f'## {time} — {speaker}\n\nOn screen: {screen}\n\n{text}\n\n'
(ROOT/'Three_Minute_Video_Script.md').write_text(md)
print('Created report and video script. Narration words:',sum(len(x[3].split()) for x in segments))
