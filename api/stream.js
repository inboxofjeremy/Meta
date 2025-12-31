export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing id" });

  // Example: return a dummy HTTP stream
  res.json([
    {
      title: "HD Stream",
      infoHash: "",
      url: "https://example.com/stream.mp4",
      type: "direct"
    }
  ]);
}
