export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.json({
    id: "tvmaze-tmdb-catalog",
    version: "1.0.0",
    name: "TVMaze + TMDb Catalog",
    description: "Catalog addon using TVMaze + TMDb with IMDb IDs",
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    idPrefixes: ["tt", "tvmaze"],
    catalogs: [
      {
        type: "movie",
        id: "default_movies",
        name: "Movies"
      },
      {
        type: "series",
        id: "default_series",
        name: "Series"
      }
    ]
  });
}
