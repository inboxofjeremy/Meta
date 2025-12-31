const META_CACHE = {};

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = req.query?.id;
  if (!id || !META_CACHE[id]) return res.status(404).json({ meta: null });

  res.status(200).json(META_CACHE[id]);
}
