// context/gallery/GalleryContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { aiServiceFetch } from "@/lib/api-clients";
import { toast } from "sonner";
import type { ReelData } from "@/types/pipeline";

interface GalleryContextType {
  reels: ReelData[];
  isLoading: boolean;
  error: string | null; // ✅ TS Error yahan fix ho gaya
  fetchGallery: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: React.ReactNode }) => {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ Error state add ki

  const fetchGallery = useCallback(async () => {
    if (isFetched) return;
    setIsLoading(true);
    setError(null); // ✅ Fetch se pehle purana error clear kiya
    try {
      const res = await aiServiceFetch("/api/v1/reels/gallery");
      if (res.ok) {
        const data = await res.json();
        setReels(data.data ?? []);
        setIsFetched(true);
      } else {
        setError("Failed to fetch gallery."); // API fail hone pe error
      }
    } catch {
      setError("Failed to load gallery."); // Catch block mein error
      toast.error("Failed to load gallery.");
    } finally {
      setIsLoading(false);
    }
  }, [isFetched]);

  return (
    <GalleryContext.Provider value={{ reels, isLoading, error, fetchGallery }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) throw new Error("useGallery must be used inside GalleryProvider");
  return context;
};