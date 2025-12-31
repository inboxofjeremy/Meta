import { addonBuilder } from "stremio-addon-sdk";

/* =========================
   MANIFEST
========================= */
const manifest = {
  id: "tvmaze.tmdb.search",
  version: "1.0.0",
  name: "TVMaze + TMDB Search",
  description: "Search shows via TVMaze with TMDB fallback",
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
};

const builder = new addonBuilder(manifest);

/* =========================
   HANDLER
========================= */
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // IMPORTANT: explicitly expose manifest.json
  if (req.url === "/api/manifest.json") {
    res.status(200).json(manifest);
    return;
  }

  return builder.getInterface()(req, res);
}
