import fetch from "node-fetch";

const TMDB_API_KEY = "944017b839d3c040bdd2574083e4c1bc";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  res.setHeader("Content-Type", "application/json");

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const id = searchParams.get("id");
  if (!id) return res.status(400).json({ error: "Missing id" });

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
        released: data.premiered || "",
        genres: data.genres || []
      };
    } else if (id.startsWith("tmdb:")) {
      const tmdbId = id.split(":")[1];
      const resp = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
      const data = await resp.json();
      meta = {
        id,
        type: "movie",
        name: data.title,
        poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        background: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : null,
        description: data.overview || "",
        released: data.release_date || "",
        genres: data.genres?.map(g => g.name) || []
      };
    }
  } catch (err) {
    console.error("Meta error:", err.message);
  }

  if (!meta) return res.status(404).json({ error: "Meta not found" });
  res.json(meta);
}
