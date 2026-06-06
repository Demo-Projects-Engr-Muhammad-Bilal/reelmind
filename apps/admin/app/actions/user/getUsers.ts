"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse, UserRecord } from "@/lib/types";

export async function getUsersAction(): Promise<ActionResponse<UserRecord[]>> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        telegramCreds: true,
        _count: {
          select: { reels: true },
        },
      },
    });
    return { success: true, data: users };
  } catch {
    return { success: false, error: "Failed to fetch users." };
  }
}
