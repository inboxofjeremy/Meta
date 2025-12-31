export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/manifest.json") {
    res.status(200).json({
      id: "tvmaze.tmdb.fixed",
      version: "1.0.0",
      name: "TVMaze + TMDB Fixed",
      resources: ["catalog", "meta", "stream"],
      types: ["series"],
      catalogs: [
        { type: "series", id: "search", name: "Search", extra: [{ name: "search", isRequired: false }] }
      ]
    });
    return;
  }

  if (req.url === "/catalog.json") {
    res.status(200).json({ metas: [] });
    return;
  }

  if (req.url === "/meta.json") {
    res.status(200).json({ meta: null });
    return;
  }

  if (req.url === "/stream.json") {
    res.status(200).json({ streams: [] });
    return;
  }

  res.status(404).send("Not Found");
}
