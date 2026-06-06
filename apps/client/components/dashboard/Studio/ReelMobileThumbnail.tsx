// components/dashboard/Studio/ReelMobileThumbnail.tsx
// A single grid-item thumbnail for the mobile 3-column reel grid.
import { Play } from "lucide-react";
import type { ReelData } from "@/types/pipeline";

interface ReelMobileThumbnailProps {
  reel: ReelData;
  onClick: () => void;
}

export function ReelMobileThumbnail({ reel, onClick }: ReelMobileThumbnailProps) {
  const firstScene = reel.scenes && reel.scenes.length > 0 ? reel.scenes[0] : null;
  const thumbnail = firstScene?.imagePath ?? null;

  return (
    <div
      onClick={onClick}
      className="aspect-[9/16] relative bg-zinc-900 rounded-lg cursor-pointer overflow-hidden group shadow-sm border border-border/20"
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          className="object-cover w-full h-full opacity-90 group-active:scale-105 transition-transform"
          alt="thumb"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-[10px] text-muted-foreground">
          Processing
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white flex items-center gap-1 font-bold drop-shadow-md">
        <Play className="w-2.5 h-2.5 fill-white" /> {reel.totalCreditsSpent}
      </div>
    </div>
  );
}
