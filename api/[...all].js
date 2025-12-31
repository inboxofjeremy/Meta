// /api/[...all].js
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.url === "/api/manifest.json") {
    res.status(200).json({ test: "ok" });
    return;
  }

  res.status(404).send("Not Found");
}
