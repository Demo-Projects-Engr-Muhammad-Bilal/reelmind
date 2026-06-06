// Role: User ki pichli reels ka data fetch karna.i

import { prisma } from "@aireelgen/database";
import { Request, Response } from "express";

/**
 * 📜 User History Fetcher
 * Path: src/controllers/generate/history.controller.ts
 */
export const getUserHistory = async (req: Request, res: Response) => {
          const userId = req.params.userId as string;
          try {
                    const history = await prisma.reel.findMany({
                              where: { userId },
                              orderBy: { createdAt: "desc" },
                              include: { scenes: true },
                              take: 12
                    });
                    return res.status(200).json(history);
          } catch (error: any) {
                    return res.status(500).json({ error: "History fetch failed." });
          }
};