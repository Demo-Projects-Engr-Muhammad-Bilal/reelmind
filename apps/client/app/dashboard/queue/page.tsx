"use client";

import { Filter, SlidersHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QueueTableRow } from "@/components/dashboard/Queue/QueueTableRow";
import { QueueTableFooter } from "@/components/dashboard/Queue/QueueTableFooter";
import { QueueEmptyState } from "@/components/dashboard/Queue/QueueEmptyState";
import { useQueuePage } from "@/hooks/dashboard/useQueuePage";

export default function QueuePage() {
  const {
    loading, currentReels, currentPage, totalPages, activeNodesCount,
    isRefreshing, handleManualRefresh, handleCancelReel, handleRowClick,
    goToPrevPage, goToNextPage,
  } = useQueuePage();

  return (
    <div className="h-full flex flex-col relative w-full bg-background z-0">

      {/* ─── Sticky Header ──────────────────────────────────────────────── */}
      <div className="shrink-0 pt-0 pb-6 px-0 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-foreground">
            Active Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Manage and monitor your ongoing production renders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 font-bold bg-background text-muted-foreground hover:text-foreground cursor-pointer">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9 font-bold bg-background text-muted-foreground hover:text-foreground cursor-pointer">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleManualRefresh}
            className={`h-9 w-9 ml-2 cursor-pointer ${isRefreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ─── Table Body ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-6 bg-muted/20">
        <div className="max-w-[1200px] mx-auto bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">

          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">
            <div className="col-span-6 md:col-span-5">Reel Title</div>
            <div className="col-span-6 md:col-span-4">Status &amp; Progress</div>
            <div className="hidden md:block col-span-2 text-right">Elapsed</div>
            <div className="hidden md:block col-span-1 text-center">Action</div>
          </div>

          {loading || currentReels.length === 0 ? (
            <QueueEmptyState loading={loading} />
          ) : (
            <div className="flex flex-col flex-1">
              {currentReels.map((reel, idx) => (
                <QueueTableRow
                  key={reel.id ?? reel._id}
                  reel={reel}
                  idx={idx}
                  isLast={idx === currentReels.length - 1}
                  onRowClick={handleRowClick}
                  onCancel={handleCancelReel}
                />
              ))}
            </div>
          )}

          <QueueTableFooter
            activeNodesCount={activeNodesCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={goToPrevPage}
            onNext={goToNextPage}
          />
        </div>
      </div>
    </div>
  );
}
