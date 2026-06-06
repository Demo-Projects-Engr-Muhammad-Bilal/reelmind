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
    return { success: true, data: updatedReel };
  } catch {
    return { success: false, error: "Failed to update visibility." };
  }
}
