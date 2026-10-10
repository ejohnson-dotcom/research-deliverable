import { Router } from "express";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) return res.status(400).json({ error: "q is required" });

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Localfye-class-project" },
    });
    if (!r.ok) return res.status(502).json({ error: "Place search failed" });

    const data = (await r.json()) as any[];
    res.json(
      data.map((p) => ({
        name: p.display_name as string,
        latitude: parseFloat(p.lat),
        longitude: parseFloat(p.lon),
      })),
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Place search failed" });
  }
});

router.get("/nearby", async (req, res) => {
  try {
    const { south, west, north, east } = req.query;
    if (!south || !west || !north || !east) {
      return res
        .status(400)
        .json({ error: "south, west, north, east are required" });
    }
    const query = `
      [out:json][timeout:15];
      node["amenity"~"bar|cafe|restaurant|pub"]["name"](${south},${west},${north},${east});
      out 40;`;

    const r = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "User-Agent": "Localfye-class-project" },
      body: new URLSearchParams({ data: query }),
    });
    if (!r.ok) return res.status(502).json({ error: "Nearby search failed" });

    const data = (await r.json()) as any;
    res.json(
      data.elements.map((e: any) => ({
        id: e.id,
        name: e.tags.name as string,
        type: e.tags.amenity as string,
        latitude: e.lat as number,
        longitude: e.lon as number,
      })),
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Nearby search failed" });
  }
});

export default router;
