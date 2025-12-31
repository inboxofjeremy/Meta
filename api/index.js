export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const url = req.url;

  // ----------------------
  // Manifest endpoint
  // ----------------------
  if (url === "/api/manifest.json") {
    res.status(200).json({
      id: "tvmaze.tmdb.fixed",
      version: "1.0.0",
      name: "TVMaze + TMDB Fixed",
      description: "Minimal Stremio addon with fixed endpoints",
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

  // ----------------------
  // Catalog endpoint
  // ----------------------
  if (url === "/api/catalog.json") {
    // Return empty catalog for now
    res.status(200).json({ metas: [] });
    return;
  }

  // ----------------------
  // Meta endpoint
  // ----------------------
  if (url === "/api/meta.json") {
    // Return empty meta for now
    res.status(200).json({ meta: null });
    return;
  }

  // ----------------------
  // Stream endpoint
  // ----------------------
  if (url === "/api/stream.json") {
    // Return empty streams
    res.status(200).json({ streams: [] });
    return;
  }

  // All other routes
  res.status(404).send("Not Found");
}
