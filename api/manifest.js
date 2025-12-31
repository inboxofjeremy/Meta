export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.json({
    id: "tvmaze-tmdb-catalog",
    version: "1.0.0",
    name: "TVMaze + TMDb Catalog",
    description: "Search addon using TVMaze + TMDb with IMDb IDs",
    resources: ["catalog", "meta", "stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt", "tvmaze", "tmdb"],
    catalogs: [
      { id: "default_movies", type: "movie", name: "Movies" },
      { id: "default_series", type: "series", name: "Series" }
    ]
  });
}
