"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";

export async function deleteReelAction(reelId: string): Promise<ActionResponse<boolean>> {
  try {
    await prisma.reel.delete({ where: { id: reelId } });
    revalidatePath("/dashboard");
    return { success: true, data: true };
  } catch {
    return { success: false, error: "Failed to delete the reel." };
  }
}
