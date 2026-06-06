"use client";

/**
 * @file components/dashboard/views/overview/Overview.tsx
 * @description Overview dashboard view. Data is read from DashboardDataContext cache.
 * On first mount, the hook triggers a fetch; on subsequent visits it reads from cache
 * instantly — zero redundant DB calls.
 */

import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import SystemLoader from "@/components/dashboard/shared/SystemLoader";
import DataErrorState from "@/components/dashboard/shared/DataErrorState";
import StatCards from "./StatCards";
import RevenueUsageChart from "./RevenueUsageChart";
import RecentPurchases from "./RecentPurchases";
import RenderQueue from "./RenderQueue";
import TopNiches from "./TopNiches";

export default function Overview() {
  const { data, isLoading, error, invalidate } = useDashboardData("overview");

  if (isLoading) return <SystemLoader message="Orchestrating system data..." />;
  if (error) return <DataErrorState message={error} onRetry={invalidate} />;
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
