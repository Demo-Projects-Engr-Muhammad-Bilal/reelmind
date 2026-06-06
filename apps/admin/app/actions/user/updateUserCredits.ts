"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";
import { UserRecord } from "@/lib/types/sharedtypes";

export async function updateUserCreditsAction(
  userId: string,
  newCredits: number
): Promise<ActionResponse<UserRecord>> {
  try {
    if (newCredits < 0) {
      return { success: false, error: "Credits cannot be negative." };
    }

    const updatedUser: UserRecord = await prisma.user.update({
      where: { id: userId },
      data: { credits: newCredits },
      include: { telegramCreds: true, _count: { select: { reels: true } } },
    });

    revalidatePath("/dashboard");
    return { success: true, data: updatedUser };
  } catch {
    return { success: false, error: "Failed to update credits." };
  }
}
