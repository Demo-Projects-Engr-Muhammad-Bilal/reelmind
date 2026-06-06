"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";
import { UserRecord } from "@/lib/types/sharedtypes";

export async function toggleUserStatusAction(
  userId: string,
  currentStatus: boolean
): Promise<ActionResponse<UserRecord>> {
  try {
    const newStatus = !currentStatus;

    const updatedUser: UserRecord = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: newStatus },
      include: { telegramCreds: true, _count: { select: { reels: true } } },
    });

    if (!newStatus && updatedUser.email) {
      console.log(`[toggleUserStatus] Freeze email queued for: ${updatedUser.email}`);
    }

    revalidatePath("/dashboard");
    return { success: true, data: updatedUser };
  } catch {
    return { success: false, error: "Failed to update user status." };
  }
}
