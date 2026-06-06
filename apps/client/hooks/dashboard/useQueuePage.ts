"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDashboard } from "@/context/dashboard/DashboardContext";
import { useWorkspaceStore } from "@/hooks/dashboard/useWorkspaceStore";
import { useReelCancel } from "@/hooks/dashboard/useReelCancel";
import { aiServiceFetch } from "@/lib/api-clients";
import { QUEUE_POLL_INTERVAL_MS } from "@/lib/constants";
import type { ReelData } from "@/types/pipeline";

const ITEMS_PER_PAGE = 6;

export function useQueuePage() {
  const router = useRouter();
  const openReelInWorkspace = useWorkspaceStore((s) => s.openReelInWorkspace);
  const { queue: reels, isQueueLoading: loading, fetchQueue, cancelReelInQueue } = useDashboard();

  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-polling
  useEffect(() => {
    fetchQueue();
    const interval = setInterval(() => fetchQueue(true), QUEUE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchQueue(true);
    setIsRefreshing(false);
  };

  const { cancelReel, isCancelling } = useReelCancel({
    onError: () => fetchQueue(true),
  });

  const handleCancelReel = useCallback(
    async (e: React.MouseEvent, reel: ReelData) => {
      e.stopPropagation();
      const reelId = (reel.id ?? reel._id) as string;
      cancelReelInQueue(reelId); // optimistic
      const ok = await cancelReel(reelId);
      if (ok) {
        toast.success("Reel cancelled successfully.");
      }
    },
    [cancelReel, cancelReelInQueue]
  );

  const handleRowClick = useCallback(
    (reel: ReelData) => {
      if (reel.status === "CANCELLED" || reel.status === "FAILED") return;
      openReelInWorkspace(reel);
      router.push("/dashboard");
    },
    [openReelInWorkspace, router]
  );

  // Pagination
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentReels = reels.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reels.length / ITEMS_PER_PAGE);
  const activeNodesCount = reels.filter(
    (r) => r.status !== "FAILED" && r.status !== "CANCELLED"
  ).length;

  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return {
    reels,
    loading,
    currentReels,
    currentPage,
    totalPages,
    activeNodesCount,
    isRefreshing,
    isCancelling,
    handleManualRefresh,
    handleCancelReel,
    handleRowClick,
    goToPrevPage,
    goToNextPage,
  };
}
