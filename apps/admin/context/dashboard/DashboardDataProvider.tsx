"use client";

/**
 * @file context/dashboard/DashboardDataProvider.tsx
 * @description Central data cache layer for the entire admin dashboard.
 *
 * ARCHITECTURE:
 * - On first visit to any view, fetchView(key) is called → fetches from DB → stores in cache.
 * - On subsequent visits, data is read from cache instantly — zero DB calls.
 * - After any mutating action (create/update/delete), call invalidateCache(key) to
 *   clear that view's cache and force a fresh fetch on next mount.
 *
 * This context is consumed exclusively via the useDashboardData() hook.
 * Do not consume this context directly in view components.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { getOverviewAnalyticsAction } from "@/app/actions/overview";
import { getNichesAction } from "@/app/actions/niche";
import { getPricingRatesAction } from "@/app/actions/pricing";
import { getPackagesAction } from "@/app/actions/package";
import { getUsersAction } from "@/app/actions/user";
import { getUsageLogsAction } from "@/app/actions/usagelog";
import { getReelsAction } from "@/app/actions/reel";
import { getAdminProfileAction } from "@/app/actions/admin";
import type { ViewKey } from "./DashboardProvider";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CacheEntry = { data: any; fetchedAt: number };
type DataCache = Partial<Record<ViewKey, CacheEntry>>;
type ErrorMap = Partial<Record<ViewKey, string>>;

interface DashboardDataContextType {
  cache: DataCache;
  loadingKey: ViewKey | null;
  errorMap: ErrorMap;
  fetchView: (key: ViewKey) => Promise<void>;
  invalidateCache: (key: ViewKey) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Action dispatcher map — maps each ViewKey to its fetcher function
// ─────────────────────────────────────────────────────────────────────────────
const ACTION_MAP: Record<ViewKey, () => Promise<{ success: boolean; data?: unknown; error?: string }>> = {
  overview: getOverviewAnalyticsAction,
  niches: getNichesAction,
  rates: getPricingRatesAction,
  packages: getPackagesAction,
  users: getUsersAction,
  audit: getUsageLogsAction,
  reels: getReelsAction,
  settings: getAdminProfileAction,
};

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<DataCache>({});
  const [loadingKey, setLoadingKey] = useState<ViewKey | null>(null);
  const [errorMap, setErrorMap] = useState<ErrorMap>({});

  // Tracks in-flight requests to prevent duplicate fetches
  const inFlightRef = useRef<Partial<Record<ViewKey, boolean>>>({});

  const fetchView = useCallback(
    async (key: ViewKey) => {
      // Cache HIT — return instantly
      if (cache[key]) return;

      // Already fetching this key — prevent duplicate in-flight request
      if (inFlightRef.current[key]) return;

      inFlightRef.current[key] = true;
      setLoadingKey(key);

      // Clear any previous error for this key
      setErrorMap((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      try {
        const result = await ACTION_MAP[key]();

        if (result.success) {
          setCache((prev) => ({
            ...prev,
            [key]: { data: result.data, fetchedAt: Date.now() },
          }));
        } else {
          setErrorMap((prev) => ({
            ...prev,
            [key]: result.error ?? "An unexpected error occurred.",
          }));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setErrorMap((prev) => ({ ...prev, [key]: message }));
      } finally {
        setLoadingKey(null);
        inFlightRef.current[key] = false;
      }
    },
    [cache]
  );

  /**
   * Purges the cached data for a given view key.
   * Call this after a successful mutating action (create, update, delete)
   * to ensure the view re-fetches fresh data on next mount.
   */
  const invalidateCache = useCallback((key: ViewKey) => {
    setCache((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return (
    <DashboardDataContext.Provider
      value={{ cache, loadingKey, errorMap, fetchView, invalidateCache }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardDataContext(): DashboardDataContextType {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardDataContext must be used within DashboardDataProvider");
  }
  return context;
}
