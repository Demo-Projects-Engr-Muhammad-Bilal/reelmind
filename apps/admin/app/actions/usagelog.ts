"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse } from "./niche";

export async function getUsageLogsAction(): Promise<ActionResponse<any[]>> {
          try {
                    // 1. Pehle sirf logs fetch karo (without include)
                    const logs = await prisma.usageLog.findMany({
                              orderBy: { createdAt: "desc" },
                              take: 1000,
                    });

                    // 2. Un logs mein jitne bhi unique userIds hain, unko nikal lo
                    const userIds = [...new Set(logs.map((log: any) => log.userId))];

                    // 3. Un specific users ka data fetch karo
                    const users = await prisma.user.findMany({
                              where: { id: { in: userIds } },
                              select: { id: true, name: true, email: true }
                    });

                    // 4. Users ka ek map (dictionary) bana lo taake lookup fast ho
                    const userMap = users.reduce((acc: any, user: any) => {
                              acc[user.id] = user;
                              return acc;
                    }, {});

                    // 5. Logs aur Users ko merge kar do
                    const logsWithUsers = logs.map((log: any) => ({
                              ...log,
                              user: userMap[log.userId] || null
                    }));

                    return { success: true, data: logsWithUsers };
          } catch (error) {
                    console.error("Failed to fetch usage logs:", error);
                    return { success: false, error: "Failed to fetch usage logs." };
          }
}