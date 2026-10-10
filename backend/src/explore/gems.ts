import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const gems = await prisma.gem.findMany({
      where: category && category !== "All Gems" ? { category } : {},
      orderBy: { createdAt: "desc" },
    });
    res.json(gems);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not load gems" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, category, description, latitude, longitude } = req.body;
    if (
      !name?.trim() ||
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "name, latitude and longitude are required" });
    }
    const gem = await prisma.gem.create({
      data: {
        name: name.trim(),
        category: category || "Other",
        description,
        latitude,
        longitude,
      },
    });
    res.status(201).json(gem);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not save gem" });
  }
});

export default router;
