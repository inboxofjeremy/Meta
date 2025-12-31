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
   REQUIRED HANDLERS
========================= */
builder.defineCatalogHandler(async () => ({ metas: [] }));
builder.defineMetaHandler(async () => ({ meta: null }));
builder.defineStreamHandler(async () => ({ streams: [] }));

/* =========================
   VERCEL HANDLER
========================= */
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // SAFELY call getInterface
  const interfaceHandler = builder.getInterface;
  if (typeof interfaceHandler !== "function") {
    console.error("getInterface is not a function", interfaceHandler);
    res.status(500).send("Internal Server Error");
    return;
  }

  return interfaceHandler(req, res);
}
