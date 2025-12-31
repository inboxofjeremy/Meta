import fetch from "node-fetch";

const TMDB_API_KEY = "944017b839d3c040bdd2574083e4c1bc"; // Replace with your TMDb key

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const query = req.query.q;
  const type = req.query.type || "all";

  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  let results = [];

  // 1️⃣ TVMaze search (series only)
  try {
    const tvResp = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
    const tvData = await tvResp.json();
    results = tvData.map(item => ({
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
  try {
    const tmdbType = type === "movie" ? "movie" : "tv";
    const tmdbResp = await fetch(
      `https://api.themoviedb.org/3/search/${tmdbType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const tmdbData = await tmdbResp.json();

    for (const item of tmdbData.results) {
      if (results.some(r => r.name === (item.title || item.name))) continue;
      results.push({
        id: `tmdb:${item.id}`,
        type: tmdbType,
        name: item.title || item.name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        imdb_id: null // Meta endpoint will fetch IMDb ID
      });
    }
  } catch (err) {
    console.error("TMDb search error:", err.message);
  }

  res.json(results);
}
