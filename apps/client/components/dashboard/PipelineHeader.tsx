// components/dashboard/PipelineHeader.tsx
"use client"; // ⚡ Context use karne ke liye zaroori hai

import { Maximize2, Minimize2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayoutState } from "@/context/dashboard/LayoutContext"; // ⚡ Import kiya

interface PipelineHeaderProps {
  onNewReel?: () => void;
  isIdle: boolean;
  // ⚡ isFullscreen aur setIsFullscreen ab props mein nahi aayenge
}

export const PipelineHeader = ({
  onNewReel, isIdle,
}: PipelineHeaderProps) => {
  // ⚡ Ab global state use ho rahi hai
  const { isFullscreen, setIsFullscreen } = useLayoutState();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-border pb-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-headline">
          Workflow Orchestrator
        </h1>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
          Design, synthesize, and control automated faceless video tracks.
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button
          onClick={onNewReel}
          disabled={isIdle}
          className={`rounded-full gap-2 text-sm font-bold flex-1 sm:flex-none shadow-sm transition-all
            ${isIdle
              ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
              : "bg-primary text-primary-foreground active:scale-95 cursor-pointer"}`}
        >
          <Plus className="w-4 h-4" />
          New Reel
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="rounded-full gap-2 text-sm font-medium border-border flex-1 sm:flex-none hover:bg-muted cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isFullscreen ? "Exit Zen Mode" : "Zen Mode"}
        </Button>
      </div>
    </div>
  );
};