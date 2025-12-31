export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url === "/api/manifest.json") {
    res.status(200).json({ test: "ok" });
    return;
  }
  res.status(404).send("Not Found");
}
