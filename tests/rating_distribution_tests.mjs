import assert from "node:assert/strict";
import { ratingDistribution } from "../dist/rating-distribution.js";

const ratings = [
  0, 1, 1.4, 1.5, 6.9, 7, 8.2, 8.4, 8.5, 8.9, 9, 9.4, 9.5, 9.9, 10,
];
const bins = ratingDistribution(ratings.map((rating) => ({ rating })));
const count = (low) => bins.find((bin) => bin.low === low).count;
assert.equal(count("1.0"), 2);
assert.equal(count("1.5"), 1);
assert.equal(count("6.5"), 1);
assert.equal(count("7.0"), 1);
assert.equal(count("8.0"), 2);
assert.equal(count("8.5"), 2);
assert.equal(count("9.0"), 2);
assert.equal(count("9.5"), 2);
assert.deepEqual(bins.at(-1), { low: "10.0", high: "10.0", count: 1 });
assert.equal(
  bins.reduce((total, bin) => total + bin.count, 0),
  ratings.length - 1,
);
assert.ok(ratingDistribution([]).every((bin) => bin.count === 0));
assert.equal(ratings[6], 8.2);
console.log(
  "PASS: half-point chart ranges, decimal boundaries, exact 10, and unrated exclusion.",
);
