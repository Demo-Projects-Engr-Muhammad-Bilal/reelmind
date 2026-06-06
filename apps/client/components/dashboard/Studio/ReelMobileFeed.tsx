// components/dashboard/Studio/ReelMobileFeed.tsx
// The full-screen TikTok-style snap-scroll portal for mobile.
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { optimizeCloudinaryVideo } from "@/lib/pipeline-utils";
import type { ReelData, PageType } from "@/types/pipeline";

interface ReelMobileFeedProps {
  reels: ReelData[];
  initialIndex: number;
  pageType: PageType;
  onClose: () => void;
  onViewDetails: (reel: ReelData) => void;
}

export function ReelMobileFeed({ reels, initialIndex, pageType, onClose, onViewDetails }: ReelMobileFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!feedRef.current) return;

    const target = feedRef.current.children[initialIndex];
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (!video) return;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root: feedRef.current, threshold: 0.6 }
    );

    feedRef.current.querySelectorAll(".snap-center").forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [initialIndex]);

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black animate-in slide-in-from-bottom-full duration-300">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-10 left-4 z-50 w-12 h-12 text-white bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md cursor-pointer"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <div
        ref={feedRef}
        className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {reels.map((reel) => {
          const firstScene = reel.scenes && reel.scenes.length > 0 ? reel.scenes[0] : null;
          const thumbnail = firstScene?.imagePath ?? null;
          const optimizedVideoUrl = optimizeCloudinaryVideo(reel.videoUrl ?? "");

          return (
            <div
              key={reel.id ?? reel._id}
              className="h-[100dvh] w-full snap-center relative bg-zinc-950 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
            >
              {optimizedVideoUrl ? (
                <video
                  src={optimizedVideoUrl}
                  poster={thumbnail ?? undefined}
                  className="absolute inset-0 object-cover w-full h-full"
                  playsInline preload="none" crossOrigin="anonymous" loop
                />
              ) : thumbnail ? (
                <img src={thumbnail} alt="Thumbnail" className="absolute inset-0 object-cover w-full h-full opacity-50" />
              ) : (
                <div className="text-zinc-600 font-bold uppercase tracking-wider text-xs">Processing...</div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              <div className="absolute bottom-8 left-4 right-16 z-10 pointer-events-none flex flex-col gap-1.5">
                <p className="text-white/80 font-bold text-sm tracking-wide uppercase">
                  {reel.nicheKey?.replace(/-/g, " ") ?? "AI Generated"}
                </p>
                <h3 className="text-white font-black text-xl leading-tight mb-2 drop-shadow-md">{reel.topic}</h3>
              </div>

              {pageType !== "gallery" && (
                <div className="absolute bottom-8 right-4 z-20 flex flex-col gap-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onViewDetails(reel); }}
                    className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
