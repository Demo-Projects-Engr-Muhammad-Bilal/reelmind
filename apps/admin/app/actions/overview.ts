"use server";

import prisma from "@/lib/prisma/prisma"; // Adjust path if needed

export async function getOverviewAnalyticsAction() {
          try {
                    const now = new Date();
                    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

                    // KPI Metrics
                    const todayNewUsersCount = await prisma.user.count({
                              where: { createdAt: { gte: startOfToday } }
                    });

                    const todayUsageRaw = await prisma.usageLog.aggregate({
                              where: { createdAt: { gte: startOfToday } },
                              _sum: { cost: true }
                    });

                    const monthlyUsage = await prisma.usageLog.aggregate({
                              where: { createdAt: { gte: startOfMonth } },
                              _sum: { cost: true }
                    });

                    const totalVideos24h = await prisma.reel.count({
                              where: { createdAt: { gte: last24h } } // Included all statuses for accurate volume
                    });

                    // Recent Activity
                    const recentActivityLogs = await prisma.usageLog.findMany({
                              take: 5,
                              orderBy: { createdAt: "desc" },
                              select: { id: true, cost: true, provider: true, createdAt: true, userId: true }
                    });

                    const userIdsForLogs = recentActivityLogs.map(log => log.userId);
                    const usersForLogs = await prisma.user.findMany({
                              where: { id: { in: userIdsForLogs } },
                              select: { id: true, name: true, email: true }
                    });

                    const recentActivity = recentActivityLogs.map(log => {
                              const user = usersForLogs.find(u => u.id === log.userId);
                              return {
                                        id: log.id,
                                        name: user?.name || "System User",
                                        email: user?.email || "",
                                        pack: log.provider,
                                        amount: "Deduction",
                                        credits: `-${log.cost}` // Properly formatted for UI
                              };
                    });

                    // Active Queue (Included all statuses to populate the UI table properly)
                    const activeQueueRaw = await prisma.reel.findMany({
                              take: 5,
                              orderBy: { createdAt: "desc" },
                              include: { user: { select: { name: true } } }
                    });

                    const uniqueNicheKeys = [...new Set(activeQueueRaw.map(q => q.style))];
                    const nichesInfo = await prisma.niche.findMany({
                              where: { key: { in: uniqueNicheKeys } },
                              select: { key: true, name: true }
                    });

                    const activeQueue = activeQueueRaw.map(q => {
                              const nicheName = nichesInfo.find(n => n.key === q.style)?.name || q.style;
                              return {
                                        id: `RND-${q.id.toString().slice(-4)}`,
                                        user: q.user?.name || "System",
                                        niche: nicheName,
                                        status: q.status.toLowerCase(), // queued, generating, completed, failed
                                        time: formatTimeAgo(q.createdAt)
                              };
                    });

                    const topNichesRaw = await prisma.reel.groupBy({
                              by: ["style"],
                              _sum: { totalCreditsSpent: true },
                              orderBy: { _sum: { totalCreditsSpent: "desc" } },
                              take: 5
                    });

                    // ⚡ NEW: Find the maximum credits spent among the top niches to perfectly scale the progress bars
                    const maxNicheCredits = Math.max(...topNichesRaw.map(item => item._sum.totalCreditsSpent || 0), 1);

                    const topNiches = topNichesRaw.map(item => {
                              const nicheName = nichesInfo.find(n => n.key === item.style)?.name || item.style;
                              const credits = item._sum.totalCreditsSpent || 0;
                              return {
                                        name: nicheName,
                                        credits: credits > 1000 ? `${(credits / 1000).toFixed(1)}k` : credits.toString(),
                                        usage: (credits / maxNicheCredits) * 100 // Scale relative to the highest niche value
                              };
                    });

                    // Chart Data (Last 7 Days)
                    const chartData = [];
                    for (let i = 6; i >= 0; i--) {
                              const d = new Date();
                              d.setDate(d.getDate() - i);
                              const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                              const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

                              const dayStats = await prisma.usageLog.aggregate({
                                        where: { createdAt: { gte: dayStart, lte: dayEnd } },
                                        _sum: { cost: true }
                              });

                              const dayReels = await prisma.reel.count({
                                        where: { createdAt: { gte: dayStart, lte: dayEnd } }
                              });

                              chartData.push({
                                        day: d.toLocaleDateString("en-US", { weekday: "short" }),
                                        revenue: dayStats._sum.cost || 0,
                                        credits: dayReels * 10 // Dummy multiplier to show visual difference on the chart
                              });
                    }

                    return {
                              success: true,
                              data: {
                                        kpis: {
                                                  todayCredits: todayUsageRaw._sum.cost || 0,
                                                  todayAgenciesCount: todayNewUsersCount,
                                                  monthlyCredits: monthlyUsage._sum.cost || 0,
                                                  videosRendered24h: totalVideos24h,
                                        },
                                        recentPurchases: recentActivity,
                                        activeQueue,
                                        topNiches,
                                        chartData
                              }
                    };

          } catch (error: any) {
                    console.error("Overview Action Error:", error);
                    return { success: false, error: error.message || "Failed to compile overview metrics." };
          }
}

// Helper: format timestamp
function formatTimeAgo(date: Date) {
          const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
          if (seconds < 60) return "Just now";
          const minutes = Math.floor(seconds / 60);
          if (minutes < 60) return `${minutes}m ago`;
          const hours = Math.floor(minutes / 60);
          return `${hours}h ago`;
}