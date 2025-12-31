export default function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.setHeader("Content-Type", "application/json");

  res.json({
    id: "tvmaze-tmdb-addon",
    version: "1.0.0",
    name: "TVMaze + TMDb",
    description: "Search and metadata addon using TVMaze + TMDb with IMDb IDs",
    resources: ["catalog", "meta", "stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt", "tvmaze", "tmdb"],
    catalogs: [
      { id: "default_movies", type: "movie", name: "Movies" },
      { id: "default_series", type: "series", name: "Series" }
    ]
  });
}
