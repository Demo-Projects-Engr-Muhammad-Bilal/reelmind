// components/dashboard/Modal/StageComposition.tsx
// Refactored: uses aiServiceFetch instead of inline process.env fetch.
import React, { useState } from "react";
import { Loader2, Check, Download, Sparkles, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { aiServiceFetch } from "@/lib/api-clients";

export const StageComposition = ({
  finalVideoUrl, status, handleMediaPlay, generatedScript,
  avgSceneCredits, totalReelCredits, formatCost,
  handleDownload, isDownloading, reelId, initialIsPublic,
}: any) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublic, setIsPublic] = useState(initialIsPublic || false);

  const toggleVisibility = async () => {
    setIsPublishing(true);
    try {
      const res = await aiServiceFetch(`/api/v1/reels/${reelId}/toggle-public`, {
        method: "PATCH",
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (!res.ok) throw new Error();
      setIsPublic(!isPublic);
      if (!isPublic) {
        toast.success("Awesome! Your reel is now live in the Community Gallery 🌍");
      } else {
        toast.info("Reel made private. Removed from Gallery 🔒");
      }
    } catch {
      toast.error("Failed to update visibility status.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col h-full min-h-[55vh] justify-start sm:justify-center pt-4 sm:pt-0 pb-4 max-w-7xl mx-auto overflow-y-auto sm:overflow-visible">
      {finalVideoUrl && status !== "processing" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_360px_360px] gap-6 lg:gap-8 items-center lg:items-stretch justify-center w-full">

          {/* VIDEO COLUMN */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-full lg:h-[65vh] aspect-[9/16] relative group rounded-[2rem] shadow-xl flex flex-col shrink-0">
              <div className="absolute top-3 left-3 z-30 flex gap-2">
                <span className="text-[10px] bg-emerald-500/80 backdrop-blur-md text-white px-2 py-1 rounded-md font-bold tracking-wider border border-white/10">
                  MASTER FILE
                </span>
                {isPublic && (
                  <span className="text-[10px] bg-blue-500/80 backdrop-blur-md text-white px-2 py-1 rounded-md font-bold tracking-wider border border-white/10 flex items-center gap-1 animate-in zoom-in">
                    <Globe className="w-3 h-3" /> PUBLIC
                  </span>
                )}
              </div>
              <div className="w-full h-full rounded-[1.7rem] bg-zinc-900 overflow-hidden relative shadow-inner">
                <video controls controlsList="nodownload" className="absolute inset-0 object-cover w-full h-full" autoPlay onPlay={handleMediaPlay}>
                  <source src={finalVideoUrl} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* COST BREAKDOWN */}
          <div className="h-auto lg:h-[65vh] bg-sidebar border-2 border-dashed border-primary/20 rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-black text-foreground tracking-tight">Cost Breakdown</h4>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Total Scenes</span>
                <span className="text-sm font-bold text-foreground">{generatedScript?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Avg. Cost Per Scene</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{avgSceneCredits} CR</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-border/50">
                <span className="text-lg font-black text-foreground">Total Reel Cost</span>
                <div className="text-right flex flex-col items-end">
                  <div className="text-2xl font-black text-primary">{totalReelCredits} CR</div>
                  <div className="text-xs text-emerald-500 font-mono bg-emerald-500/10 px-2 py-1 rounded-md mt-1">
                    {formatCost(totalReelCredits)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONGRATULATIONS & ACTIONS */}
          <div className="h-auto lg:h-[65vh] bg-sidebar border-2 border-dashed border-primary/20 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
              <Check className="w-10 h-10 text-emerald-500 bg-emerald-500/10 rounded-full p-2 shrink-0 pointer-events-none" />
              <h4 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Congratulations!</h4>
            </div>
            <p className="text-base text-muted-foreground mb-8 max-w-sm text-center lg:text-left">
              Your viral AI reel is fully composed, mastered, and ready to dominate the algorithm.
            </p>
            <div className="w-full flex flex-col gap-3">
              <Button onClick={handleDownload} disabled={isDownloading}
                className="bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-xl h-14 px-10 shadow-lg text-base cursor-pointer disabled:opacity-70 transition-all w-full">
                {isDownloading
                  ? <><Loader2 className="w-5 h-5 mr-2 animate-spin pointer-events-none" /> Downloading File...</>
                  : <><Download className="w-5 h-5 mr-2 pointer-events-none" /> Download High-Res Reel</>}
              </Button>
              <div className="flex flex-col gap-1.5 mt-1 w-full">
                <Button variant={isPublic ? "outline" : "secondary"} onClick={toggleVisibility} disabled={isPublishing}
                  className={`rounded-xl h-14 px-10 font-bold text-base transition-all w-full cursor-pointer disabled:opacity-70 ${isPublic ? "border-border text-foreground hover:bg-muted" : "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20"}`}>
                  {isPublishing
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : isPublic
                      ? <><Lock className="w-5 h-5 mr-2" /> Make Private</>
                      : <><Globe className="w-5 h-5 mr-2" /> Publish to Gallery</>}
                </Button>
                <p className="text-[11px] font-medium text-muted-foreground text-center px-2">
                  {isPublic
                    ? "Your reel is currently visible to everyone in the public Gallery."
                    : "Publishing will feature your reel in the Community Gallery for others to discover."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col items-center justify-center h-full min-h-[55vh] text-muted-foreground">
          <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin mb-4 text-primary/50 pointer-events-none" />
          <div className="text-primary font-bold animate-pulse mb-2 tracking-widest uppercase text-xs md:text-sm">
            [FFMPEG ENGINE RUNNING]
          </div>
          <p className="text-xs md:text-sm font-medium">
            Fusing tracks, burning captions, and rendering final output...
          </p>
        </div>
      )}
    </div>
  );
};
