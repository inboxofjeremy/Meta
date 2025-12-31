export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  res.status(200).json({
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
