// components/dashboard/Modal/PipelineModal.tsx
// Refactored: uses aiServiceFetch, shared pipeline-utils, typed props.
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, RefreshCw, Ban, Terminal } from "lucide-react";
import { pipelineStages } from "@/hooks/dashboard/usePipeline";
import { isStageProcessing, getSceneCredits, formatCreditCost, formatStopwatch } from "@/lib/pipeline-utils";
import { CREDITS_PER_DOLLAR } from "@/lib/constants";
import { aiServiceFetch } from "@/lib/api-clients";
import { toast } from "sonner";
import { useAuth } from "@/context/auth/AuthContext";

import { BaseModalWrapper } from "./BaseModalWrapper";
import { StageHooks } from "./StageHooks";
import { StageScript } from "./StageScript";
import { StageAssets } from "./StageAssets";
import { StageVideo } from "./StageVideo";
import { StageComposition } from "./StageComposition";
import type { Scene, HookItem, VisualStyle } from "@/types/pipeline";

interface PipelineModalProps {
  focusedStep: string | null;
  setFocusedStep: (v: any) => void;
  stepStates: Record<string, string>;
  handleStageApprove: (stageId: string, idx: number) => void;
  handleStageReject: (stageId: string) => void;
  pipelineType: string;
  generatedHooks: HookItem[];
  generatedScript: Scene[];
  finalVideoUrl: string | null;
  elapsedTime: number;
  stageTime: number;
  reelId: string;
  selectedNiche: string;
  selectedStyle: VisualStyle | null;
}

export const PipelineModal = ({
  focusedStep, setFocusedStep, stepStates, handleStageApprove, handleStageReject,
  pipelineType, generatedHooks, generatedScript, finalVideoUrl, elapsedTime, stageTime,
  reelId, selectedNiche, selectedStyle,
}: PipelineModalProps) => {
  const [retakingIdx,   setRetakingIdx]   = useState<Record<number, boolean>>({});
  const [unapprovedIdx, setUnapprovedIdx] = useState<Record<number, boolean>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const { user } = useAuth();
  const currentUserId = (user?.id ?? user?.userId ?? "69efb8bb613ab55c3bf94d3a") as string;

  const totalReelCredits = generatedScript?.[0]?.reel?.totalCreditsSpent
    ? Number(generatedScript[0].reel.totalCreditsSpent)
    : (generatedScript?.reduce((acc, raw) => acc + getSceneCredits(typeof raw === "string" ? JSON.parse(raw) : raw), 0) ?? 0);
  const avgSceneCredits = generatedScript?.length
    ? Math.round(totalReelCredits / generatedScript.length)
    : 0;

  useEffect(() => { setRetakingIdx({}); setUnapprovedIdx({}); }, [focusedStep]);

  const currentIndex = pipelineStages.findIndex((s) => s.id === focusedStep);
  const currentStage = pipelineStages[currentIndex];
  const status = stepStates?.[focusedStep ?? ""] ?? "pending";
  const currentlyProcessing = isStageProcessing(focusedStep ?? "", generatedScript);
  const disableApproveAll = Object.values(retakingIdx).some(Boolean) || Object.keys(unapprovedIdx).length > 0 || currentlyProcessing;

  const handleMediaPlay = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    document.querySelectorAll("audio, video").forEach((m) => {
      if (m !== e.target) (m as HTMLMediaElement).pause();
    });
  };

  const getSeparatorClasses = (idx: number, total: number) => {
    if (idx === total - 1) return "hidden";
    if ((idx + 1) % 4 === 0) return "block";
    if ((idx + 1) % 2 === 0) return "block lg:hidden";
    return "block sm:hidden";
  };

  const triggerSingleRetake = async (idx: number) => {
    const safeReelId = reelId || generatedScript?.[0]?.reelId;
    if (!safeReelId) { toast.error("Reel context missing."); return; }

    setRetakingIdx((prev) => ({ ...prev, [idx]: true }));
    toast.info(`Generating fresh variation for Scene 0${idx + 1}...`);

    try {
      const endpointMap: Record<string, string> = {
        script: "/api/v1/generate/script",
        assets: "/api/v1/generate/assets",
        video:  "/api/v1/generate/video",
      };
      const endpoint = endpointMap[focusedStep ?? ""] ?? "/api/v1/generate/assets";

      const res = await aiServiceFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          reelId: safeReelId, sceneOrder: idx + 1, isRetake: true,
          winnerHook: generatedHooks?.[0]?.hook ?? "",
          nicheKey: selectedNiche || "business-storytelling",
          videoType: selectedStyle ?? "ai-video",
          userId: currentUserId, selectedBgmIndex: 0,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      setTimeout(() => {
        setRetakingIdx((prev) => ({ ...prev, [idx]: false }));
        setUnapprovedIdx((prev) => ({ ...prev, [idx]: true }));
        toast.success(`Scene 0${idx + 1} regenerated successfully!`);
      }, 6000);
    } catch {
      toast.error(`Failed to regenerate Scene 0${idx + 1}.`);
      setRetakingIdx((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const approveSingleItem = (idx: number) => {
    setUnapprovedIdx((prev) => { const n = { ...prev }; delete n[idx]; return n; });
  };

  const handleDownload = async () => {
    if (!finalVideoUrl) return;
    setIsDownloading(true);
    toast.info("Preparing high-res master file...");
    try {
      const res = await fetch(finalVideoUrl);
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `AI_Reel_${Date.now()}.mp4`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download directly.");
    } finally {
      setIsDownloading(false);
    }
  };

  const stageProps = {
    reelId, generatedHooks, generatedScript, status, retakingIdx, unapprovedIdx,
    pipelineType, currentlyProcessing, approveSingleItem, triggerSingleRetake,
    handleMediaPlay, getSceneCredits, formatCost: (c: number) => formatCreditCost(c, CREDITS_PER_DOLLAR),
    totalReelCredits, avgSceneCredits, finalVideoUrl, isDownloading, handleDownload, getSeparatorClasses,
  };

  const formatTime = (s: number) =>
    `${Math.floor((s ?? 0) / 60).toString().padStart(2, "0")}:${((s ?? 0) % 60).toString().padStart(2, "0")}`;

  return (
    <BaseModalWrapper
      isOpen={!!focusedStep}
      onClose={() => setFocusedStep(null)}
      title={`Diagnostic: ${currentStage?.name ?? ""}`}
      subtitle={currentStage?.desc ?? ""}
      icon={Terminal}
      leftNav={
        <Button variant="outline" size="icon"
          onClick={() => setFocusedStep(pipelineStages[currentIndex - 1].id)}
          disabled={currentIndex === 0}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg bg-background border-border hover:bg-muted disabled:opacity-30 hidden sm:flex cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 pointer-events-none" />
        </Button>
      }
      rightNav={
        <Button variant="outline" size="icon"
          onClick={() => setFocusedStep(pipelineStages[currentIndex + 1].id)}
          disabled={currentIndex === pipelineStages.length - 1}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg bg-background border-border hover:bg-muted disabled:opacity-30 hidden sm:flex cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 pointer-events-none" />
        </Button>
      }
      headerRight={
        status !== "completed" && (
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-background border border-border rounded-lg shadow-sm">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
              <span>Stage: {formatTime(stageTime)}</span>
              <span className="text-border/80">|</span>
              <span className="text-primary">Total: {formatTime(elapsedTime)}</span>
            </div>
          </div>
        )
      }
      footer={
        <>
          <div className="flex-1 flex justify-start">
            <Button size="default" onClick={() => setFocusedStep(null)} variant="ghost"
              className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 font-bold rounded-xl px-2.5 md:px-4 h-9 text-xs transition-colors cursor-pointer"
            >
              <Ban className="w-4 h-4 md:mr-2 pointer-events-none" />
              <span className="hidden md:inline pointer-events-none">Cancel</span>
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest bg-background border border-border px-4 py-2 rounded-lg shadow-sm whitespace-nowrap">
              Step {currentIndex + 1} / {pipelineStages.length}
            </span>
          </div>
          <div className="flex-1 flex justify-end gap-3 md:gap-4">
            {pipelineType === "interactive" && status === "review" && (
              <>
                <Button disabled={currentlyProcessing} size="default" onClick={() => handleStageReject(currentStage.id)} variant="outline"
                  className="border-border bg-sidebar hover:bg-muted font-bold text-foreground rounded-xl px-4 h-9 text-xs hidden md:flex cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-4 h-4 mr-2 pointer-events-none" />
                  <span className="pointer-events-none">Retake Stage</span>
                </Button>
                <Button size="default"
                  onClick={() => { handleStageApprove(currentStage.id, currentIndex); setFocusedStep(null); }}
                  disabled={disableApproveAll}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-3 md:px-6 h-9 text-xs shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4 md:mr-2 pointer-events-none" />
                  <span className="hidden md:inline pointer-events-none">Approve All</span>
                </Button>
              </>
            )}
          </div>
        </>
      }
    >
      <div className={`w-full flex-1 flex flex-col ${focusedStep !== "composition" ? "px-0 md:pl-[72px] md:pr-[72px] pb-4" : ""}`}>
        {focusedStep === "hooks"       && <StageHooks       {...stageProps} />}
        {focusedStep === "script"      && <StageScript      {...stageProps} />}
        {focusedStep === "assets"      && <StageAssets      {...stageProps} />}
        {focusedStep === "video"       && <StageVideo       {...stageProps} />}
        {focusedStep === "composition" && <StageComposition {...stageProps} />}
      </div>
    </BaseModalWrapper>
  );
};
