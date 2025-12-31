export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/api/manifest.json") {
    res.status(200).json({
      id: "tvmaze.tmdb.search",
      version: "1.0.0",
      name: "TVMaze + TMDB Search",
      resources: ["catalog", "meta", "stream"],
      types: ["series"],
    });
    return;
  }

  res.status(404).send("Not Found");
}
