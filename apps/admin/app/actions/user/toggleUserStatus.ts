"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse, UserRecord } from "@/lib/types";

export async function toggleUserStatusAction(
  userId: string,
  currentStatus: boolean
): Promise<ActionResponse<UserRecord>> {
  try {
    const newStatus = !currentStatus;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: newStatus },
      include: { telegramCreds: true, _count: { select: { reels: true } } },
    });

    if (!newStatus && updatedUser.email) {
      // Email sending hook — wire up your email provider here (e.g. Resend)
      // await sendAccountFrozenEmail(updatedUser.email, updatedUser.name);
      console.log(`[toggleUserStatus] Freeze email queued for: ${updatedUser.email}`);
    }

    revalidatePath("/dashboard");

    // ⚡ FIX: Type assertion (as unknown as UserRecord) added here
    return { success: true, data: updatedUser as unknown as UserRecord };

  } catch {
    return { success: false, error: "Failed to update user status." };
  }
}