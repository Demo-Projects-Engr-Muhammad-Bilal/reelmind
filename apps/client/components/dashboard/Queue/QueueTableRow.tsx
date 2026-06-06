// components/dashboard/Queue/QueueTableRow.tsx
// Single-responsibility: renders one row in the queue table.
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQueueStatusConfig, formatElapsedTime } from "@/lib/pipeline-utils";
import type { ReelData } from "@/types/pipeline";

interface QueueTableRowProps {
  reel: ReelData;
  idx: number;
  isLast: boolean;
  onRowClick: (reel: ReelData) => void;
  onCancel: (e: React.MouseEvent, reel: ReelData) => void;
}

export function QueueTableRow({ reel, idx, isLast, onRowClick, onCancel }: QueueTableRowProps) {
  const config = getQueueStatusConfig(reel.status);
  const firstScene = reel.scenes && reel.scenes.length > 0 ? reel.scenes[0] : null;
  const thumbnail = firstScene?.imagePath ?? null;
  const isClickable = reel.status !== "CANCELLED" && reel.status !== "FAILED";
  const isTerminal  = reel.status === "FAILED" || reel.status === "CANCELLED";

  return (
    <div
      onClick={() => onRowClick(reel)}
      className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-border/40 transition-colors
        ${isLast ? "border-b-0" : ""}
        ${isClickable ? "cursor-pointer hover:bg-muted/40" : "opacity-80"}`}
    >
      {/* Title + Thumbnail */}
      <div className="col-span-12 md:col-span-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-zinc-900 border border-border/50 shrink-0 overflow-hidden relative">
          {thumbnail ? (
            <img src={thumbnail} alt="thumb" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-muted-foreground bg-sidebar">
              TBD
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-foreground truncate drop-shadow-sm">
            {reel.topic ?? "Untitled Project"}
          </p>
          <p className="text-[11px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider truncate">
            {reel.style ?? reel.nicheKey ?? "AI Generated"} • {reel.totalCreditsSpent ?? 0} CR
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="col-span-12 md:col-span-4 flex flex-col justify-center mt-3 md:mt-0">
        <div className="flex justify-between items-end mb-1.5 px-0.5">
          <span className={`text-xs font-bold ${config.textCol}`}>
            {isTerminal && <AlertCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
            {config.percent}% - {config.text}
          </span>
          <span className="text-[10px] font-mono font-bold text-muted-foreground">{reel.status}</span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full ${config.color} transition-all duration-1000 ease-in-out`}
            style={{ width: `${config.percent}%` }}
          />
        </div>
      </div>

      {/* Elapsed */}
      <div className="hidden md:flex col-span-2 justify-end items-center">
        <span className="font-mono text-xs font-bold text-muted-foreground">
          {isTerminal ? "--:--" : formatElapsedTime(reel.createdAt)}
        </span>
      </div>

      {/* Cancel Action */}
      <div className="hidden md:flex col-span-1 justify-center items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => onCancel(e, reel)}
          disabled={reel.status === "CANCELLED" || reel.status === "FAILED"}
          className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
