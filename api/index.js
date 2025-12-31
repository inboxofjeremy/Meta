// api/index.js
import fetch from "node-fetch";

const META_DIR = {}; // in-memory storage for demo

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = req.url || "/";
  const [path, queryString] = url.split("?");
  const params = new URLSearchParams(queryString || "");

  // --- manifest.json ---
  if (path === "/manifest.json") {
    return res.status(200).json({
      id: "tvmaze_search_addon",
      version: "1.0.0",
      name: "TVMaze Search",
      description: "Search TVMaze shows dynamically",
      types: ["series"],
      resources: ["catalog", "meta"],
      catalogs: [
        {
          type: "series",
          id: "search",
          name: "Search",
          extra: [{ name: "search", isRequired: false }]
        }
      ],
      idPrefixes: ["tvmaze"]
    });
  }

  // --- catalog.json?search=QUERY ---
  if (path === "/catalog.json") {
    const searchQuery = params.get("search") || "game";
    try {
      const results = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`
      ).then(r => r.json());

      const metas = [];
      for (const r of results) {
        const show = r.show;
        if (!show?.id) continue;

        // Prepare meta for episodes
        const epsData = await fetch(
          `https://api.tvmaze.com/shows/${show.id}?embed=episodes`
        ).then(r => r.json());
        const videos = (epsData._embedded?.episodes || []).map(ep => ({
          id: `tvmaze:${ep.id}`,
          title: ep.name,
          season: ep.season,
          episode: ep.number,
          released: ep.airdate,
          overview: ep.summary ? ep.summary.replace(/<[^>]+>/g, "") : "",
        }));

        // Store in memory
        META_DIR[`tvmaze:${show.id}`] = { meta: { ...show, videos } };

        metas.push({
          id: `tvmaze:${show.id}`,
          type: "series",
          name: show.name,
          description: show.summary ? show.summary.replace(/<[^>]+>/g, "") : "",
          poster: show.image?.medium || show.image?.original || null,
          background: show.image?.original || null,
        });
      }

      return res.status(200).json({ metas });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // --- meta.json?id=tvmaze:{id} ---
  if (path === "/meta.json") {
    const id = params.get("id");
    if (!id || !META_DIR[id]) return res.status(404).json({ meta: null });
    return res.status(200).json(META_DIR[id]);
  }

  return res.status(404).send("Not Found");
}
