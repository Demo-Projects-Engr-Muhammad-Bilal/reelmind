"use client";

/**
 * @file hooks/dashboard/useDashboardData.ts
 * @description The single hook all view components use to read from the data cache.
 *
 * USAGE:
 *   const { data, isLoading, error, invalidate } = useDashboardData("niches");
 *
 * - `data`       → The typed payload from the cache, or null if not yet loaded.
 * - `isLoading`  → True only while THIS view's data is being fetched.
 * - `error`      → Error string if the fetch failed, otherwise null.
 * - `invalidate` → Call after a mutation to purge cache and force re-fetch on next mount.
 *
 * The hook automatically triggers fetchView(key) on mount.
 * If the data is already cached, fetchView is a no-op — zero additional DB calls.
 */

import { useEffect } from "react";
import { useDashboardDataContext } from "@/context/dashboard/DashboardDataProvider";
import type { ViewKey } from "@/context/dashboard/DashboardProvider";

// ─────────────────────────────────────────────────────────────────────────────
// Per-key typed return map so callers get typed data if they want it
// ─────────────────────────────────────────────────────────────────────────────
import type {
  OverviewData,
  NicheRecord,
  PricingRateRecord,
  CreditPackageRecord,
  UserRecord,
  UsageLogRecord,
  ReelRecord,
  AdminRecord,
} from "@/lib/types";

type ViewDataMap = {
  overview: OverviewData;
  niches: NicheRecord[];
  rates: PricingRateRecord[];
  packages: CreditPackageRecord[];
  users: UserRecord[];
  audit: UsageLogRecord[];
  reels: ReelRecord[];
  settings: AdminRecord;
};

interface UseDashboardDataReturn<K extends ViewKey> {
  data: ViewDataMap[K] | null;
  isLoading: boolean;
  error: string | null;
  invalidate: () => void;
}

export function useDashboardData<K extends ViewKey>(
  key: K
): UseDashboardDataReturn<K> {
  const { cache, loadingKey, errorMap, fetchView, invalidateCache } =
    useDashboardDataContext();

  useEffect(() => {
    fetchView(key);
  }, [key, fetchView]);

  return {
    data: (cache[key]?.data as ViewDataMap[K]) ?? null,
    isLoading: loadingKey === key,
    error: errorMap[key] ?? null,
    invalidate: () => invalidateCache(key),
  };
}
