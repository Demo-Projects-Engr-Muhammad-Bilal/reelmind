// Role: Fetches niche configurations from the database.
// Imported In: src / routes / niche.route.ts

import { prisma } from "@aireelgen/database";
import { Request, Response } from "express";

/**
 * 🎯 Get All Niches
 * Path: src/controllers/niche/niche.controller.ts
 */
export const getAllNiches = async (req: Request, res: Response) => {
          try {
                    const niches = await prisma.niche.findMany({
                              select: { key: true, name: true }
                    });
                    return res.status(200).json(niches);
          } catch (error: any) {
                    console.error("❌ Niche Fetch Error:", error.message);
                    return res.status(500).json({ error: "Failed to fetch niches." });
          }
};