import fetch from "node-fetch";

const TMDB_API_KEY = "YOUR_TMDB_API_KEY"; // replace with your TMDb API key

export default async function handler(req, res) {
  const query = req.query.q;
  const type = req.query.type || "all"; // movie or series

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  let results = [];

  // 1️⃣ TVMaze search (series only)
  try {
    const tvmazeResp = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
    const tvmazeData = await tvmazeResp.json();

    results = tvmazeData.map(item => ({
      id: `tvmaze:${item.show.id}`,
      type: "series",
      name: item.show.name,
      poster: item.show.image?.medium || null,
      imdb_id: item.show.externals?.imdb || null
    }));
  } catch (err) {
    console.error("TVMaze error:", err.message);
  }

  // 2️⃣ TMDb fallback
  if (!results.length || results.some(r => !r.imdb_id)) {
    try {
      const tmdbType = type === "movie" ? "movie" : "tv";
      const tmdbResp = await fetch(
        `https://api.themoviedb.org/3/search/${tmdbType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const tmdbData = await tmdbResp.json();

      const fallbackResults = tmdbData.results.map(item => ({
        id: `tmdb:${item.id}`,
        type: tmdbType,
        name: item.title || item.name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        imdb_id: null // TMDb search results do not provide IMDb ID directly
      }));

      // Merge with TVMaze results, avoiding duplicates
      const existingIds = new Set(results.map(r => r.id));
      fallbackResults.forEach(r => {
        if (!existingIds.has(r.id)) results.push(r);
      });
    } catch (err) {
      console.error("TMDb error:", err.message);
    }
  }

  res.setHeader("Content-Type", "application/json");
  res.json(results);
}
