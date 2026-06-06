"use client";

import React, { useEffect, useState } from "react";
import { getOverviewAnalyticsAction } from "@/app/actions/overview";
import { AlertCircle, Loader2 } from "lucide-react";
import StatCards from "./StatCards";
import RevenueUsageChart from "./RevenueUsageChart";
import RecentPurchases from "./RecentPurchases";
import RenderQueue from "./RenderQueue";
import TopNiches from "./TopNiches";

export default function Overview() {
          const [data, setData] = useState<any>(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
                    const fetchData = async () => {
                              try {
                                        const res = await getOverviewAnalyticsAction();
                                        if (res.success) {
                                                  setData(res.data);
                                        } else {
                                                  setError(res.error || "Failed to load dashboard data.");
                                        }
                              } catch (err: any) {
                                        setError(err.message || "An unexpected error occurred.");
                              } finally {
                                        setLoading(false);
                              }
                    };

                    fetchData();
          }, []);

          if (loading) {
                    return (
                              <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground animate-pulse">Orchestrating system data...</p>
                              </div>
                    );
          }

          if (error) {
                    return (
                              <div className="flex flex-col items-center justify-center h-[60vh] space-y-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 p-8 max-w-md mx-auto mt-10 text-center">
                                        <AlertCircle className="w-10 h-10 text-rose-500" />
                                        <h2 className="text-lg font-semibold text-rose-500">System Error</h2>
                                        <p className="text-sm text-muted-foreground">{error}</p>
                                        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition">
                                                  Retry Connection
                                        </button>
                              </div>
                    );
          }

          // Fallback Empty State if data object is somehow empty but no error occurred
          if (!data) return null;

          return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                              {/* Page Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                        <div>
                                                  <h1 className="text-3xl font-bold text-foreground tracking-tight">System Pulse</h1>
                                                  <p className="text-sm text-muted-foreground mt-1">
                                                            Real-time overview of AI orchestration, credit usage, and system health.
                                                  </p>
                                        </div>
                              </div>

                              {/* Level 1: Top KPI Cards */}
                              <StatCards kpis={data.kpis} />

                              {/* Level 2: Analytics Trend & Recent Logs */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2">
                                                  <RevenueUsageChart chartData={data.chartData} />
                                        </div>
                                        <div>
                                                  <RecentPurchases logs={data.recentPurchases} />
                                        </div>
                              </div>

                              {/* Level 3: Orchestration Queue & Resource Distribution */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2">
                                                  <RenderQueue queue={data.activeQueue} />
                                        </div>
                                        <div>
                                                  <TopNiches niches={data.topNiches} />
                                        </div>
                              </div>
                    </div>
          );
}