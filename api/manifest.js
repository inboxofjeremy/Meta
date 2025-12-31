export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*"); // CORS

  res.json({
    id: "tvmaze-tmdb-search",
    version: "1.0.0",
    name: "TVMaze + TMDb Search",
    description: "Search addon using TVMaze + TMDb, returning IMDb IDs",
    resources: ["meta"],
    types: ["movie", "series"],
    idPrefixes: ["tt", "tvmaze"]
  });
}
