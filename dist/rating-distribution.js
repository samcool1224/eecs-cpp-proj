// Group the C++-validated ratings for display without changing saved scores.
export function ratingDistribution(movies) {
  const bins = Array.from({ length: 19 }, (_, index) => {
    const start = 10 + index * 5;
    const low = (start / 10).toFixed(1);
    const high = ((start + 4) / 10).toFixed(1);
    return { low, high: start === 100 ? low : high, count: 0 };
  });
  for (const movie of movies) {
    if (movie.rating === 0) continue; // Unrated watchlist entries do not count.
    const tenths = Math.round(movie.rating * 10);
    bins[Math.floor((tenths - 10) / 5)].count++;
  }
  return bins;
}
