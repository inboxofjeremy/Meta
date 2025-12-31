import fetch from "node-fetch";

const META_CACHE = {};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const searchQuery = req.query?.search || "game";

  try {
    const results = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`
    ).then(r => r.json());

    const metas = [];

    for (const r of results) {
      const show = r.show;
      if (!show?.id) continue;

      // Fetch episodes for meta
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

      // Cache meta
      META_CACHE[`tvmaze:${show.id}`] = { meta: { ...show, videos } };

      metas.push({
        id: `tvmaze:${show.id}`,
        type: "series",
        name: show.name,
        description: show.summary ? show.summary.replace(/<[^>]+>/g, "") : "",
        poster: show.image?.medium || show.image?.original || null,
        background: show.image?.original || null,
      });
    }

    res.status(200).json({ metas });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
