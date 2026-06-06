"use client";

import React from "react";
import { CreditCard, TrendingUp, Clapperboard, Activity } from "lucide-react";

export default function StatCards({ kpis }: { kpis: any }) {
          const stats = [
                    {
                              title: "Credits Used (Today)",
                              value: kpis?.todayCredits?.toLocaleString() || "0",
                              trend: "Daily Volume",
                              trendUp: true,
                              icon: CreditCard,
                              description: "Tokens consumed in 24h",
                    },
                    {
                              title: "Monthly Credit Volume",
                              value: kpis?.monthlyCredits?.toLocaleString() || "0",
                              trend: "Monthly Volume",
                              trendUp: true,
                              icon: TrendingUp,
                              description: "Total consumed this month",
                    },
                    {
                              title: "Videos Synthesized",
                              value: kpis?.videosRendered24h?.toLocaleString() || "0",
                              trend: "Last 24h",
                              trendUp: kpis?.videosRendered24h > 0,
                              icon: Clapperboard,
                              description: "Active processing tasks",
                    },
                    {
                              title: "New Agencies Today",
                              value: kpis?.todayAgenciesCount?.toLocaleString() || "0",
                              trend: "Acquisitions",
                              trendUp: kpis?.todayAgenciesCount > 0,
                              icon: Activity,
                              description: "New users registered",
                    },
          ];

          return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              {stats.map((stat, index) => {
                                        const Icon = stat.icon;
                                        return (
                                                  <div
                                                            key={index}
                                                            className="p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm transition-all hover:bg-card/60 hover:shadow-md"
                                                  >
                                                            <div className="flex items-center justify-between mb-4">
                                                                      <h3 className="text-sm font-medium text-muted-foreground tracking-wide">
                                                                                {stat.title}
                                                                      </h3>
                                                                      <div className={`p-2 rounded-xl ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                                                <Icon className="w-5 h-5 stroke-[1.5]" />
                                                                      </div>
                                                            </div>

                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                      <h2 className="text-3xl font-bold text-foreground tracking-tight">
                                                                                {stat.value}
                                                                      </h2>
                                                                      <span className={`text-xs font-semibold ${stat.trendUp ? 'text-emerald-500' : 'text-blue-500'}`}>
                                                                                {stat.trend}
                                                                      </span>
                                                            </div>

                                                            <p className="text-xs text-muted-foreground">
                                                                      {stat.description}
                                                            </p>
                                                  </div>
                                        );
                              })}
                    </div>
          );
}