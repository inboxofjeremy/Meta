export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.json({
    id: "tvmaze-tmdb-meta",
    version: "1.0.0",
    name: "TVMaze + TMDb Meta/Stream",
    description: "Search addon using TVMaze + TMDb returning IMDb IDs and streams",
    resources: ["meta", "stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt", "tvmaze"],
  });
}
