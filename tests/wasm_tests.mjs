import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import createCore from "../dist/movie-core.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
// Compatibility for the Emscripten 3.1.x ES-module loader under Node.
globalThis.require = createRequire(import.meta.url);
globalThis.__dirname = fileURLToPath(new URL("../dist/", import.meta.url));
const wasmBinary = await readFile(
  new URL("../dist/movie-core.wasm", import.meta.url),
);
const Core = await createCore({ wasmBinary });
const db = new Core.Catalog(true);
let stats = JSON.parse(db.stats());
assert.equal(stats.total, 9);
assert.equal(stats.rated, 7);
assert.equal(stats.watchlist, 2);
assert.equal(stats.recommended, 6);
assert.ok(Math.abs(stats.average - 59.7 / 7) < 0.0001);
assert.equal(
  stats.genres.reduce((n, g) => n + g.count, 0),
  9,
);
assert.equal(
  stats.distribution.reduce((a, b) => a + b, 0),
  7,
);
assert.equal(
  JSON.parse(db.query("INTERSTELLAR", "All genres", "all", "title")).length,
  1,
);
assert.equal(
  JSON.parse(db.query("", "Sci-Fi", "watchlist", "title"))[0].title,
  "Dune Part Two",
);
assert.equal(
  db.add("Boundary", "Drama", 2026, 6.9, '<script>alert("x")</script>'),
  true,
);
let movies = JSON.parse(db.snapshot()).movies;
const id = movies[0].id;
assert.equal(movies[0].status, "Not recommended");
assert.equal(
  db.update(
    id,
    "Boundary",
    "Drama",
    2026,
    7.0,
    'A review\nwith "quotes" and \\slashes',
  ),
  true,
);
assert.equal(
  JSON.parse(db.query("Boundary", "All genres", "recommended", "title")).length,
  1,
);
assert.equal(db.add("Bad", "Drama", 2026, 11, ""), false);
assert.equal(db.add("Bad", "Drama", 2026, NaN, ""), false);
assert.equal(db.restore(id, "Duplicate", "Drama", 2026, 8, ""), false);
assert.equal(
  db.add("Unicode 🎬 日本語", "Other", 2026, 8.5, "A Unicode review ✓"),
  true,
);
const exported = JSON.parse(db.snapshot());
const restored = new Core.Catalog(false);
for (const m of exported.movies)
  assert.equal(
    restored.restore(m.id, m.title, m.genre, m.year, m.rating, m.review),
    true,
  );
assert.deepEqual(JSON.parse(restored.stats()), JSON.parse(db.stats()));
assert.equal(db.remove(id), true);
assert.equal(db.remove(id), false);
restored.delete();
db.delete();
console.log(
  "PASS: compiled WebAssembly, C++ statistics, filters, edits, validation, Unicode, JSON round trip and cleanup.",
);
