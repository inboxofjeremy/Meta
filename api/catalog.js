import fetch from "node-fetch";

const TMDB_API_KEY = "944017b839d3c040bdd2574083e4c1bc";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const query = req.query.q || ""; // Empty string = default catalog
  const type = req.query.type || "all";

  let results = [];

  // TVMaze search (series)
  if (type === "series" || type === "all") {
    try {
      const tvResp = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query || "a")}`);
      const tvData = await tvResp.json();
      results.push(...tvData.map(item => ({
        id: `tvmaze:${item.show.id}`,
        type: "series",
        name: item.show.name,
        poster: item.show.image?.medium || null,
        genres: item.show.genres || [],
        released: item.show.premiered || "",
        imdb_id: item.show.externals?.imdb || null
      })));
    } catch (err) {
      console.error("TVMaze error:", err.message);
    }
  }

  // TMDb fallback
  if (type === "movie" || type === "all") {
    try {
      const tmdbType = type === "movie" ? "movie" : "tv";
      const tmdbResp = await fetch(
        `https://api.themoviedb.org/3/search/${tmdbType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query || "a")}`
      );
      const tmdbData = await tmdbResp.json();
      for (const item of tmdbData.results) {
        if (results.some(r => r.name === (item.title || item.name))) continue;
        results.push({
          id: `tmdb:${item.id}`,
          type: tmdbType,
          name: item.title || item.name,
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          genres: item.genre_ids || [],
          released: item.release_date || item.first_air_date || "",
          imdb_id: null
        });
      }
    } catch (err) {
      console.error("TMDb error:", err.message);
    }
  }

  res.json(results);
}
