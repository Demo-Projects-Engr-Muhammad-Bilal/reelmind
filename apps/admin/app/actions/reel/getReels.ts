"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse } from "@/lib/types";
import { ReelRecord } from "@/lib/types/sharedtypes";

export async function getReelsAction(): Promise<ActionResponse<ReelRecord[]>> {
  try {
    const reels: ReelRecord[] = await prisma.reel.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        user: { select: { name: true, email: true } },
        scenes: { orderBy: { order: "asc" } },
      },
    });

    return { success: true, data: reels };
  } catch (error) {
    console.error("Failed to fetch reels:", error);
    return { success: false, error: "Failed to load reels data." };
  }
}
