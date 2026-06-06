"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse } from "@/lib/types";
import { UsageLogRecord } from "@/lib/types/sharedtypes"

export async function getUsageLogsAction(): Promise<ActionResponse<UsageLogRecord[]>> {
  try {
    const logs = await prisma.usageLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    });

    const userIds = [...new Set(logs.map((log) => log.userId))];

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const logsWithUsers: UsageLogRecord[] = logs.map((log) => ({
      ...log,
      user: userMap.get(log.userId) ?? null,
    }));

    return { success: true, data: logsWithUsers };
  } catch (error) {
    console.error("Failed to fetch usage logs:", error);
    return { success: false, error: "Failed to fetch usage logs." };
  }
}
