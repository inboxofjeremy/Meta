import fetch from "node-fetch";

const TMDB_API_KEY = "YOUR_TMDB_API_KEY";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { type, id } = req.query;
  if (!type || !id) return res.status(400).json({ error: "Missing type or id" });

  let meta = null;

  try {
    if (id.startsWith("tvmaze:")) {
      const tvId = id.split(":")[1];
      const resp = await fetch(`https://api.tvmaze.com/shows/${tvId}`);
      const data = await resp.json();
      meta = {
        id,
        type: "series",
        name: data.name,
        poster: data.image?.medium || null,
        background: data.image?.original || null,
        description: data.summary?.replace(/<[^>]+>/g, "") || "",
        released: data.premiered || ""
      };
    } else if (id.startsWith("tmdb:")) {
      const tmdbId = id.split(":")[1];
      const tmdbType = type === "movie" ? "movie" : "tv";
      const resp = await fetch(`https://api.themoviedb.org/3/${tmdbType}/${tmdbId}?api_key=${TMDB_API_KEY}`);
      const data = await resp.json();
      meta = {
        id,
        type,
        name: data.title || data.name,
        poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        background: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : null,
        description: data.overview || "",
        released: data.release_date || data.first_air_date || ""
      };
    }
  } catch (err) {
    console.error("Meta fetch error:", err.message);
  }

  if (!meta) return res.status(404).json({ error: "Meta not found" });

  res.json(meta);
}
