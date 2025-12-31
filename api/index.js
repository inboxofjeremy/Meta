import fetch from "node-fetch";
import { addonBuilder } from "stremio-addon-sdk";

/* =========================
   CONFIG
========================= */
const TMDB_KEY = process.env.TMDB_KEY;

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
   HELPERS
========================= */

// TVMaze → IMDb mapping
async function getTvMazeImdb(tvmazeId) {
  try {
    const res = await fetch(
      `https://api.tvmaze.com/lookup/shows?tvmaze=${tvmazeId}`
    );
    const data = await res.json();
    return data?.externals?.imdb || null;
  } catch {
    return null;
  }
}

/* =========================
   CATALOG (SEARCH)
========================= */
builder.defineCatalogHandler(async ({ extra }) => {
  const query = extra?.search;
  if (!query) return { metas: [] };

  // --- TVMaze search
  const tvmazeRes = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
  );
  const tvmazeData = await tvmazeRes.json();

  if (tvmazeData?.length) {
    return {
      metas: tvmazeData.map(({ show }) => ({
        id: `tvmaze:${show.id}`,
        type: "series",
        name: show.name,
        poster: show.image?.medium || null
      }))
    };
  }

  // --- TMDB fallback
  const tmdbRes = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
  );
  const tmdbData = await tmdbRes.json();

  return {
    metas: (tmdbData.results || []).map(show => ({
      id: `tmdb:tv:${show.id}`,
      type: "series",
      name: show.name,
      poster: show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : null
    }))
  };
});

/* =========================
   META (SHOW + EPISODES)
========================= */
builder.defineMetaHandler(async ({ id }) => {
  /* ---------- TVMAZE ---------- */
  if (id.startsWith("tvmaze:")) {
    const tvmazeId = id.split(":")[1];

    const showRes = await fetch(`https://api.tvmaze.com/shows/${tvmazeId}`);
    const show = await showRes.json();

    const epRes = await fetch(
      `https://api.tvmaze.com/shows/${tvmazeId}/episodes`
    );
    const episodes = await epRes.json();

    const imdbId = await getTvMazeImdb(tvmazeId);

    return {
      meta: {
        id,
        type: "series",
        name: show.name,
        poster: show.image?.original || null,
        imdb_id: imdbId || undefined,
        videos: episodes.map(ep => ({
          id: imdbId
            ? `imdb:${imdbId}:${ep.season}:${ep.number}`
            : `tvmaze:${tvmazeId}:${ep.season}:${ep.number}`,
          title: ep.name,
          season: ep.season,
          episode: ep.number
        }))
      }
    };
  }

  /* ---------- TMDB ---------- */
  if (id.startsWith("tmdb:tv:")) {
    const tmdbId = id.split(":")[2];

    const showRes = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}`
    );
    const show = await showRes.json();

    const videos = [];

    for (let s = 1; s <= show.number_of_seasons; s++) {
      const seasonRes = await fetch(
        `https://api.themoviedb.org/3/tv/${tmdbId}/season/${s}?api_key=${TMDB_KEY}`
      );
      const season = await seasonRes.json();

      for (const ep of season.episodes || []) {
        videos.push({
          id: show.external_ids?.imdb_id
            ? `imdb:${show.external_ids.imdb_id}:${s}:${ep.episode_number}`
            : `tmdb:tv:${tmdbId}:${s}:${ep.episode_number}`,
          title: ep.name,
          season: s,
          episode: ep.episode_number
        });
      }
    }

    return {
      meta: {
        id,
        type: "series",
        name: show.name,
        poster: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : null,
        videos
      }
    };
  }
});

/* =========================
   STREAM (SCRAPER ENTRY)
========================= */
builder.defineStreamHandler(async ({ id }) => {
  // id examples:
  // imdb:tt0944947:1:1
  // tvmaze:123:1:1

  // This is where Torbox / Easynews / Usenet / Torrent logic goes
  return {
    streams: []
  };
});

/* =========================
   VERCEL EXPORT + CORS
========================= */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return builder.getInterface()(req, res);
}
