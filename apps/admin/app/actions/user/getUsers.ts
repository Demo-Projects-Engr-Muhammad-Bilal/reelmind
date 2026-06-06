"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse } from "@/lib/types";
import { UserRecord } from "@/lib/types/sharedtypes";

export async function getUsersAction(): Promise<ActionResponse<UserRecord[]>> {
  try {
    const users: UserRecord[] = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        telegramCreds: true,
        _count: { select: { reels: true } },
      },
    });

    return { success: true, data: users };
  } catch {
    return { success: false, error: "Failed to fetch users." };
  }
}
