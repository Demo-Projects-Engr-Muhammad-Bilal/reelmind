// context/dashboard/DashboardContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import { aiServiceFetch } from "@/lib/api-clients";
import { toast } from "sonner";
import type { ReelData } from "@/types/pipeline";

interface DashboardContextType {
  history: ReelData[];
  isHistoryLoading: boolean;
  fetchHistory: () => Promise<void>;

  gallery: ReelData[];
  isGalleryLoading: boolean;
  fetchGallery: () => Promise<void>;

  queue: ReelData[];
  isQueueLoading: boolean;
  fetchQueue: (silent?: boolean) => Promise<void>;
  cancelReelInQueue: (reelId: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const currentUserId = (user?.id ?? user?._id ?? user?.userId) as string | undefined;

  const [history, setHistory] = useState<ReelData[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isHistoryFetched, setIsHistoryFetched] = useState(false);

  const [gallery, setGallery] = useState<ReelData[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [isGalleryFetched, setIsGalleryFetched] = useState(false);

  const [queue, setQueue] = useState<ReelData[]>([]);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isQueueFetched, setIsQueueFetched] = useState(false);

  // 1️⃣ History Fetcher
  const fetchHistory = useCallback(async () => {
    if (!currentUserId || isHistoryFetched) return;
    setIsHistoryLoading(true);
    try {
      const res = await aiServiceFetch(`/api/v1/reels/history/${currentUserId}?filter=completed`);
      if (res.ok) {
        const data = await res.json();
        setHistory((data.data ?? []).filter((r: ReelData) => r.status === "COMPLETED"));
        setIsHistoryFetched(true);
      }
    } catch {
      toast.error("Failed to load history.");
    } finally {
      setIsHistoryLoading(false);
    }
  }, [currentUserId, isHistoryFetched]);

  // 2️⃣ Gallery Fetcher
  const fetchGallery = useCallback(async () => {
    if (isGalleryFetched) return;
    setIsGalleryLoading(true);
    try {
      const res = await aiServiceFetch("/api/v1/reels/gallery");
      if (res.ok) {
        const data = await res.json();
        setGallery(data.data ?? []);
        setIsGalleryFetched(true);
      }
    } catch {
      toast.error("Failed to load gallery.");
    } finally {
      setIsGalleryLoading(false);
    }
  }, [isGalleryFetched]);

  // 3️⃣ Queue Fetcher
  const fetchQueue = useCallback(
    async (silent = false) => {
      if (!currentUserId) return;
      if (!silent && isQueueFetched) return;
      if (!silent) setIsQueueLoading(true);
      try {
        const res = await aiServiceFetch(`/api/v1/reels/history/${currentUserId}?filter=queue`);
        if (res.ok) {
          const data = await res.json();
          setQueue(
            (data.data ?? []).filter(
              (r: ReelData) => r.status !== "COMPLETED" && r.status !== "CANCELLED"
            )
          );
          if (!silent) setIsQueueFetched(true);
        }
      } catch {
        if (!silent) toast.error("Failed to sync queue.");
      } finally {
        if (!silent) setIsQueueLoading(false);
      }
    },
    [currentUserId, isQueueFetched]
  );

  // ⚡ Optimistic cancel
  const cancelReelInQueue = useCallback((reelId: string) => {
    setQueue((prev) =>
      prev.map((r) =>
        r.id === reelId || r._id === reelId ? { ...r, status: "CANCELLED" } : r
      )
    );
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        history, isHistoryLoading, fetchHistory,
        gallery, isGalleryLoading, fetchGallery,
        queue, isQueueLoading, fetchQueue, cancelReelInQueue,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used inside DashboardProvider");
  return context;
};
