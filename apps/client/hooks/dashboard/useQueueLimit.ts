// hooks/dashboard/useQueueLimit.ts
// Polls the active job count for the current user against the AI service.
"use client";

import { useState, useEffect } from "react";
import { aiServiceFetch } from "@/lib/api-clients";
import { useAuth } from "@/context/auth/AuthContext";
import { MAX_ACTIVE_JOBS, QUEUE_LIMIT_POLL_MS } from "@/lib/constants";
import type { ReelData } from "@/types/pipeline";

export function useQueueLimit() {
  const { user } = useAuth();
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const userId = (user?.id ?? user?._id ?? user?.userId) as string | undefined;
    if (!userId) {
      setIsChecking(false);
      return;
    }

    const check = async () => {
      try {
        const res = await aiServiceFetch(`/api/v1/reels/history/${userId}?filter=queue`);
        if (res.ok) {
          const data = await res.json();
          const active = (data.data ?? []).filter(
            (r: ReelData) =>
              r.status !== "COMPLETED" && r.status !== "FAILED" && r.status !== "CANCELLED"
          );
          setActiveJobsCount(active.length);
        }
      } catch {
        console.error("Queue limit check failed");
      } finally {
        setIsChecking(false);
      }
    };

    check();
    const interval = setInterval(check, QUEUE_LIMIT_POLL_MS);
    return () => clearInterval(interval);
  }, [user]);

  return {
    activeJobsCount,
    isChecking,
    isQueueFull: activeJobsCount >= MAX_ACTIVE_JOBS,
  };
}
