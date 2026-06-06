"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse, UserRecord } from "@/lib/types";

export async function updateUserCreditsAction(
  userId: string,
  newCredits: number
): Promise<ActionResponse<UserRecord>> {
  try {
    if (newCredits < 0) {
      return { success: false, error: "Credits cannot be negative." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { credits: newCredits },
      include: { telegramCreds: true, _count: { select: { reels: true } } },
    });

    revalidatePath("/dashboard");

    // ⚡ FIX: Type assertion (as unknown as UserRecord) added here
    return { success: true, data: updatedUser as unknown as UserRecord };

  } catch {
    return { success: false, error: "Failed to update credits." };
  }
}