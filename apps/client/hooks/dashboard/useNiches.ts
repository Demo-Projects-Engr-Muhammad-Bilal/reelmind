// hooks/dashboard/useNiches.ts
// Fetches the niche list from the AI service once on mount.
"use client";

import { useState, useEffect } from "react";
import { aiServiceFetch } from "@/lib/api-clients";
import { toast } from "sonner";
import type { NicheData } from "@/types/pipeline";

export function useNiches() {
  const [niches, setNiches] = useState<NicheData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await aiServiceFetch("/api/v1/niches/all");
        const data = await res.json();
        setNiches(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Database Connection Offline");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { niches, isLoading };
}
