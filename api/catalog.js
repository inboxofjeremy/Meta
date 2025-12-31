import fetch from "node-fetch";

const TMDB_API_KEY = "944017b839d3c040bdd2574083e4c1bc";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const query = searchParams.get("q") || "a";
  const type = searchParams.get("type") || "all";

  let results = [];

  // TVMaze search (series)
  if (type === "series" || type === "all") {
    try {
      const tvResp = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
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

  // TMDb search (movies)
  if (type === "movie" || type === "all") {
    try {
      const tmdbResp = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const tmdbData = await tmdbResp.json();
      for (const item of tmdbData.results) {
        if (results.some(r => r.name === item.title)) continue;
        results.push({
          id: `tmdb:${item.id}`,
          type: "movie",
          name: item.title,
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          genres: item.genre_ids || [],
          released: item.release_date || "",
          imdb_id: null
        });
      }
    } catch (err) {
      console.error("TMDb error:", err.message);
    }
  }

  res.json(results);
}
