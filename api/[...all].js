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

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return builder.getInterface()(req, res);
}
