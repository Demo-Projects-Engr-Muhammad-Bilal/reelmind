// hooks/dashboard/useReelCancel.ts
// Shared reel-cancel logic — eliminates duplication between PipelineForm & QueuePage.
"use client";

import { useState, useCallback } from "react";
import { aiServiceFetch } from "@/lib/api-clients";
import { toast } from "sonner";

interface UseReelCancelOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useReelCancel(options: UseReelCancelOptions = {}) {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelReel = useCallback(
    async (reelId: string | undefined) => {
      if (!reelId) {
        options.onSuccess?.();
        return true;
      }

      setIsCancelling(true);
      try {
        const res = await aiServiceFetch(`/api/v1/reels/${reelId}/cancel`, { method: "POST" });
        if (res.ok) {
          toast.success("Process stopped safely. Saved to History.");
          options.onSuccess?.();
          return true;
        } else {
          toast.error("Failed to cancel on server.");
          options.onError?.();
          return false;
        }
      } catch {
        toast.error("Network error while cancelling.");
        options.onError?.();
        return false;
      } finally {
        setIsCancelling(false);
      }
    },
    [options]
  );

  return { cancelReel, isCancelling };
}
