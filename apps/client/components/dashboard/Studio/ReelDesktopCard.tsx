// components/dashboard/Studio/ReelDesktopCard.tsx
// Desktop 9:16 card with play/pause toggle — extracted from SharedReelView.
"use client";

import { useRef, useState } from "react";
import { Globe, Play, Pause, ArrowRight } from "lucide-react";
import { optimizeCloudinaryVideo } from "@/lib/pipeline-utils";
import type { ReelData, PageType } from "@/types/pipeline";

interface ReelDesktopCardProps {
  reel: ReelData;
  pageType: PageType;
  onViewDetails: (reel: ReelData) => void;
  onMediaPlay: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export function ReelDesktopCard({ reel, pageType, onViewDetails, onMediaPlay }: ReelDesktopCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const firstScene = reel.scenes && reel.scenes.length > 0 ? reel.scenes[0] : null;
  const thumbnail = firstScene?.imagePath ?? null;
  const optimizedVideoUrl = optimizeCloudinaryVideo(reel.videoUrl ?? "");

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };

  return (
    <div
      className="aspect-[9/16] relative group rounded-[2rem] shadow-xl flex flex-col bg-zinc-900 border-[3px] border-border/40 hover:border-border transition-colors overflow-hidden cursor-pointer"
      onClick={togglePlay}
    >
      {optimizedVideoUrl ? (
        <video
          ref={videoRef}
          src={optimizedVideoUrl}
          poster={thumbnail ?? undefined}
          className="absolute inset-0 object-cover w-full h-full"
          playsInline preload="none" crossOrigin="anonymous" loop
          onPlay={(e) => { setIsPlaying(true); onMediaPlay(e); }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      ) : thumbnail ? (
        <img src={thumbnail} alt="Thumbnail" className="absolute inset-0 object-cover w-full h-full" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-xs">
          No Preview
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none transition-opacity duration-300" />

      {/* Status badges */}
      <div className={`absolute top-4 left-4 z-10 flex gap-2 pointer-events-none transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-100"}`}>
        {pageType !== "history" && (
          <span className={`text-[10px] backdrop-blur-md text-white px-2.5 py-1 rounded-md font-black tracking-wider border border-white/10 shadow-sm ${reel.status === "COMPLETED" ? "bg-emerald-600/90" : "bg-amber-600/90"}`}>
            {reel.status}
          </span>
        )}
        {reel.isPublic && (
          <span className="text-[10px] bg-blue-600/90 backdrop-blur-md text-white px-2 py-1 rounded-md font-bold tracking-wider border border-white/10 flex items-center shadow-sm">
            <Globe className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Play/pause overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100 z-20">
        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full text-white/90 shadow-2xl border border-white/10 transform transition-transform group-active:scale-90">
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="text-white font-black text-lg leading-tight truncate mb-2 drop-shadow-md">{reel.topic}</h3>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1.5">
            <p className="text-white/60 text-[11px] font-medium tracking-wide">
              {new Date(reel.createdAt).toLocaleDateString()}
            </p>
            {pageType !== "gallery" && (
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(reel); }}
                className="cursor-pointer text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors group/btn relative z-30"
              >
                View Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="text-emerald-400 text-xs font-mono font-bold bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md backdrop-blur-sm">
              {reel.totalCreditsSpent} CR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
