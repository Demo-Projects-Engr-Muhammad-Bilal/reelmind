"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse, ReelRecord } from "@/lib/types";

export async function toggleReelVisibilityAction(
  reelId: string,
  currentStatus: boolean
): Promise<ActionResponse<ReelRecord>> {
  try {
    const updatedReel = await prisma.reel.update({
      where: { id: reelId },
      data: { isPublic: !currentStatus },
      include: {
        user: { select: { name: true, email: true } },
        scenes: { orderBy: { order: "asc" } },
      },
    });

    revalidatePath("/dashboard");

    // ⚡ FIX: Type assertion (as unknown as ReelRecord) added here
    return { success: true, data: updatedReel as unknown as ReelRecord };

  } catch {
    return { success: false, error: "Failed to update visibility." };
  }
}