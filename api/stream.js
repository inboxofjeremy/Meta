export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

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
