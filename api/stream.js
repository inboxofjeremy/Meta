export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  res.setHeader("Content-Type", "application/json");

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const id = searchParams.get("id");
  if (!id) return res.status(400).json({ error: "Missing id" });

  // Example dummy stream
  res.json([
    {
      title: "HD Stream",
      infoHash: "",
      url: "https://example.com/stream.mp4",
      type: "direct"
    }
  ]);
}
