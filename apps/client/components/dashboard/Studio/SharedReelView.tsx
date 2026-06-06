// components/dashboard/Studio/SharedReelView.tsx
// Refactored: thin orchestrator delegating to ReelDesktopCard, ReelMobileThumbnail, ReelMobileFeed.
"use client";

import { useState, useEffect } from "react";
import { Loader2, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryDetailsModal } from "@/components/dashboard/Modal/HistoryDetailsModal";
import { ReelDesktopCard } from "./ReelDesktopCard";
import { ReelMobileThumbnail } from "./ReelMobileThumbnail";
import { ReelMobileFeed } from "./ReelMobileFeed";
import { useDashboard } from "@/context/dashboard/DashboardContext";
import type { ReelData, PageType } from "@/types/pipeline";

const ITEMS_PER_PAGE = 12;

interface SharedReelViewProps {
  title: string;
  description: string;
  pageType: PageType;
}

export const SharedReelView = ({ title, description, pageType }: SharedReelViewProps) => {
  const [currentPage, setCurrentPage]         = useState(1);
  const [selectedReel, setSelectedReel]       = useState<ReelData | null>(null);
  const [mobileFullscreenIdx, setMobileFullscreenIdx] = useState<number | null>(null);

  const {
    history, isHistoryLoading, fetchHistory,
    gallery, isGalleryLoading, fetchGallery,
    queue, isQueueLoading, fetchQueue,
  } = useDashboard();

  const isHistory = pageType === "history";
  const isQueue   = pageType === "queue";
  const isGallery = pageType === "gallery";

  const reels   = isHistory ? history : isQueue ? queue : gallery;
  const loading = isHistory ? isHistoryLoading : isQueue ? isQueueLoading : isGalleryLoading;

  useEffect(() => {
    if (isHistory)      fetchHistory();
    else if (isQueue)   fetchQueue();
    else if (isGallery) fetchGallery();
  }, [pageType, fetchHistory, fetchQueue, fetchGallery, isHistory, isQueue, isGallery]);

  const handleMediaPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    document.querySelectorAll("video").forEach((v) => {
      if (v !== e.target) (v as HTMLVideoElement).pause();
    });
  };

  const indexOfLast  = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentDesktopReels = reels.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reels.length / ITEMS_PER_PAGE);

  return (
    <div className="h-full flex flex-col relative w-full bg-background z-0">

      {/* Header */}
      <div className="shrink-0 pt-0 pb-5 px-3 md:px-0 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1 font-medium pb-4">
          {pageType === "history" ? "Your successfully generated reels." : description}
        </p>
        <div className="w-full h-[1px] bg-border/60" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {loading ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary/50" />
            <p className="text-sm font-medium">Loading {title.toLowerCase()}...</p>
          </div>
        ) : reels.length === 0 ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center text-muted-foreground bg-sidebar/30 rounded-3xl border border-dashed border-border/60 m-6">
            <PlayCircle className="w-12 h-12 mb-4 text-muted-foreground/30" />
            <p className="text-sm font-medium">No reels found in this section.</p>
          </div>
        ) : (
          <>
            {/* ── Desktop Grid ─────────────────────────────────────────── */}
            <div className="hidden md:flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto py-6 px-0">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
                  {currentDesktopReels.map((reel) => (
                    <ReelDesktopCard
                      key={reel.id ?? reel._id}
                      reel={reel}
                      pageType={pageType}
                      onViewDetails={setSelectedReel}
                      onMediaPlay={handleMediaPlay}
                    />
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="shrink-0 border-t border-border/50 bg-background p-4 flex justify-center items-center gap-4">
                  <Button
                    variant="outline" size="icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-bold text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline" size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* ── Mobile Grid ──────────────────────────────────────────── */}
            <div className="md:hidden px-2 py-3 md:p-3 bg-background w-full pb-20 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {reels.map((reel, idx) => (
                  <ReelMobileThumbnail
                    key={reel.id ?? reel._id}
                    reel={reel}
                    onClick={() => setMobileFullscreenIdx(idx)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {selectedReel && (
        <HistoryDetailsModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
      )}

      {mobileFullscreenIdx !== null && (
        <ReelMobileFeed
          reels={reels}
          initialIndex={mobileFullscreenIdx}
          pageType={pageType}
          onClose={() => setMobileFullscreenIdx(null)}
          onViewDetails={(reel) => { setSelectedReel(reel); setMobileFullscreenIdx(null); }}
        />
      )}
    </div>
  );
};
