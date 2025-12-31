export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // If path is exactly manifest.json, return JSON
  if (req.url === "/api/manifest.json") {
    res.status(200).json({
      id: "test-addon",
      version: "1.0.0",
      name: "Test Addon",
      resources: [],
      types: []
    });
    return;
  }

  res.status(404).send("Not Found");
}
