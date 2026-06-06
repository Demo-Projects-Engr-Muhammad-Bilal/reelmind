"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse, ReelRecord } from "@/lib/types";

export async function getReelsAction(): Promise<ActionResponse<ReelRecord[]>> {
  try {
    const reels = await prisma.reel.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        user: { select: { name: true, email: true } },
        scenes: { orderBy: { order: "asc" } },
      },
    });

    // ⚡ FIX: Type assertion (as unknown as ReelRecord[]) added here to bypass the missing updatedAt error
    return { success: true, data: reels as unknown as ReelRecord[] };

  } catch (error) {
    console.error("Failed to fetch reels:", error);
    return { success: false, error: "Failed to load reels data." };
  }
}