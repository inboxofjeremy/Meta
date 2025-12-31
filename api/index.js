export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // req.url will be like '/manifest.json' or '/catalog.json' inside api/index.js
  const url = req.url;

  if (url === "/manifest.json") {
    res.status(200).json({
      id: "tvmaze.tmdb.fixed",
      version: "1.0.0",
      name: "TVMaze + TMDB Fixed",
      description: "Minimal Stremio addon",
      resources: ["catalog", "meta", "stream"],
      types: ["series"],
      catalogs: [
        {
          type: "series",
          id: "search",
          name: "Search",
          extra: [{ name: "search", isRequired: false }]
        }
      ]
    });
    return;
  }

  if (url === "/catalog.json") {
    res.status(200).json({ metas: [] });
    return;
  }

  if (url === "/meta.json") {
    res.status(200).json({ meta: null });
    return;
  }

  if (url === "/stream.json") {
    res.status(200).json({ streams: [] });
    return;
  }

  res.status(404).send("Not Found");
}
