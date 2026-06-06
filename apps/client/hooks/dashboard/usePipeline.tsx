// hooks/dashboard/usePipeline.tsx
"use client";

import { useState, useEffect } from "react";
import { Sparkles, FileText, Music, Tv, Clapperboard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth/AuthContext";
import { io, Socket } from "socket.io-client";
import { useWorkspaceStore } from "@/hooks/dashboard/useWorkspaceStore";
import { aiServiceFetch } from "@/lib/api-clients";
import { AI_SERVICE_URL } from "@/lib/constants";

// ─── Pipeline Stage Definitions ───────────────────────────────────────────────
// Single source of truth — imported by PipelineMonitor, PipelineModal, etc.
export const pipelineStages = [
  { id: "hooks", name: "1. Retention Hooks Generation", desc: "Crafting the first 5-second attention anchors.", icon: <Sparkles className="w-4 h-4" /> },
  { id: "script", name: "2. Full Script Writing", desc: "Expanding logic into multi-block text arrays.", icon: <FileText className="w-4 h-4" /> },
  { id: "assets", name: "3. Voice & B-Roll Harvesting", desc: "Mining AI voice tracks and contextual media assets.", icon: <Music className="w-4 h-4" /> },
  { id: "video", name: "4. Video Sequencing Layout", desc: "Aligning clips chronologically on timeline tracks.", icon: <Tv className="w-4 h-4" /> },
  { id: "composition", name: "5. FFmpeg Dynamic Composition", desc: "Hard-coding subtitles and rendering final reel compile.", icon: <Clapperboard className="w-4 h-4" /> },
];

export function usePipeline(instanceId: string) {
  const { user } = useAuth();
  const currentUserId = (user?.id ?? user?.userId ?? "69efb8bb613ab55c3bf94d3a") as string;

  // ─── Global State (persists across navigation) ────────────────────────────
  const store = useWorkspaceStore();
  const data = store.instances[instanceId] ?? {};
  const update = store.updateInstance;

  const {
    mobileTab = "form",
    prompt = "",
    selectedNiche = "",
    selectedStyle = null,
    pipelineType = "direct",
    isGenerating = false,
    isFinished = false,
    currentStep = 1,
    focusedStep = null,
    reelId = "",
    winnerHook = "",
    generatedHooks = [],
    generatedScript = [],
    finalVideoUrl = null,
    stepStates = { hooks: "pending", script: "pending", assets: "pending", video: "pending", composition: "pending" },
  } = data;

  // ─── Typed setters ────────────────────────────────────────────────────────
  const makeUpdater = <T,>(key: string, fallback: T) =>
    (val: T | ((prev: T) => T)) =>
      update(instanceId, (p: any) => ({
        [key]: typeof val === "function" ? (val as any)(p?.[key] ?? fallback) : val,
      }));

  const setMobileTab = makeUpdater("mobileTab", "form");
  const setPrompt = makeUpdater("prompt", "");
  const setSelectedNiche = makeUpdater("selectedNiche", "");
 
  const setPipelineType = makeUpdater("pipelineType", "direct");
  const setIsGenerating = makeUpdater("isGenerating", false);
  const setIsFinished = makeUpdater("isFinished", false);
  const setCurrentStep = makeUpdater("currentStep", 1);
  
  const setReelId = makeUpdater("reelId", "");
  const setWinnerHook = makeUpdater("winnerHook", "");
  
  const setStepStates = makeUpdater("stepStates", { hooks: "pending", script: "pending", assets: "pending", video: "pending", composition: "pending" });

  const setSelectedStyle = makeUpdater("selectedStyle", null as any);
  const setFocusedStep = makeUpdater("focusedStep", null as string | null);
  const setGeneratedHooks = makeUpdater("generatedHooks", [] as any[]);
  const setGeneratedScript = makeUpdater("generatedScript", [] as any[]);
  const setFinalVideoUrl = makeUpdater("finalVideoUrl", null as string | null);

  // ─── Local State (timers / socket — not persisted) ────────────────────────
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stageTime, setStageTime] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  // ⏱️ Timers
  useEffect(() => {
    if (!isGenerating || isFinished) return;
    const interval = setInterval(() => {
      setElapsedTime((p) => p + 1);
      setStageTime((p) => p + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGenerating, isFinished]);

  useEffect(() => { setStageTime(0); }, [currentStep, focusedStep]);

  // 🔌 Socket setup
  useEffect(() => {
    const s = io(AI_SERVICE_URL, { transports: ["websocket"], reconnectionAttempts: 10, reconnectionDelay: 2000 });
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  useEffect(() => {
    if (!socket || !reelId) return;
    if (socket.connected) socket.emit("join-reel-room", reelId);
    const onConnect = () => socket.emit("join-reel-room", reelId);
    socket.on("connect", onConnect);
    return () => { socket.off("connect", onConnect); };
  }, [socket, reelId]);

  // 📡 Socket event handler
  useEffect(() => {
    if (!socket) return;

    const handleStepUpdate = (payload: { step: string; status: string; data: unknown }) => {
      const { step, status, data: eventData } = payload;

      if (step === "script" && eventData) {
        setGeneratedScript(eventData as any[]);
      } else if (step === "assets") {
        if (eventData) setGeneratedScript(eventData as any[]);
        if (status === "completed") {
          if (pipelineType === "direct") {
            setStepStates((prev: any) => ({ ...prev, assets: "completed", video: "processing" }));
            setCurrentStep(4);
          } else {
            setStepStates((prev: any) => ({ ...prev, assets: "review" }));
          }
          toast.success("Assets synthesized successfully.");
        }
      } else if (step === "video") {
        if (eventData) setGeneratedScript(eventData as any[]);
        if (status === "completed") {
          if (pipelineType === "direct") {
            setStepStates((prev: any) => ({ ...prev, video: "completed", composition: "processing" }));
            setCurrentStep(5);
          } else {
            setStepStates((prev: any) => ({ ...prev, video: "review" }));
          }
          toast.success("Video clips sequenced.");
        }
      } else if (step === "composition" && status === "completed") {
        const d = eventData as Record<string, unknown> | null;
        if (d?.finalVideoUrl) setFinalVideoUrl(d.finalVideoUrl as string);
        if (pipelineType === "direct") {
          setStepStates((prev: any) => ({ ...prev, composition: "completed" }));
          setIsFinished(true);
        } else {
          setStepStates((prev: any) => ({ ...prev, composition: "review" }));
        }
        toast.success("Master reel rendering complete!");
      }
    };

    socket.on("step_update", handleStepUpdate);
    return () => { socket.off("step_update", handleStepUpdate); };
  }, [socket, pipelineType]);

  // 🚀 Direct pipeline execution
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!isGenerating || pipelineType !== "direct" || isFinished) return;
      setMobileTab("pipeline");

      try {
        setStepStates((prev: any) => ({ ...prev, hooks: "processing" }));
        setCurrentStep(1);

        const hooksRes = await aiServiceFetch("/api/v1/generate/hooks", {
          method: "POST",
          body: JSON.stringify({ topic: prompt, nicheKey: selectedNiche, userId: currentUserId }),
        });
        if (!hooksRes.ok) throw new Error("Hooks generation failed");
        const hooksData = await hooksRes.json();

        if (mounted) {
          setReelId(hooksData.reelId);
          setWinnerHook(hooksData.hooksAnalysedWithScores[0].hook);
          setGeneratedHooks(hooksData.hooksAnalysedWithScores ?? []);
          setStepStates((prev: any) => ({ ...prev, hooks: "completed", script: "processing" }));
          setCurrentStep(2);
        }

        const scriptRes = await aiServiceFetch("/api/v1/generate/script", {
          method: "POST",
          body: JSON.stringify({ reelId: hooksData.reelId, winnerHook: hooksData.hooksAnalysedWithScores[0].hook, nicheKey: selectedNiche }),
        });
        if (!scriptRes.ok) throw new Error("Script generation failed");
        const scriptData = await scriptRes.json();

        if (mounted) {
          setGeneratedScript(scriptData.scenes ?? []);
          setStepStates((prev: any) => ({ ...prev, script: "completed", assets: "processing" }));
          setCurrentStep(3);
        }

        const prodRes = await aiServiceFetch("/api/v1/generate/full-production", {
          method: "POST",
          body: JSON.stringify({ reelId: hooksData.reelId, nicheKey: selectedNiche, videoType: selectedStyle ?? "ken-burns", selectedBgmIndex: 0, userId: currentUserId }),
        });
        if (!prodRes.ok) throw new Error("Production dispatch failed");
        if (mounted) toast.success("Job dispatched to AI Factory.");
      } catch (error: unknown) {
        if (mounted) {
          toast.error((error as Error).message ?? "Pipeline crashed.");
          setIsGenerating(false);
        }
      }
    };

    run();
    return () => { mounted = false; };
  }, [isGenerating, pipelineType]);

  // ─── Interactive pipeline start ───────────────────────────────────────────
  const initInteractivePipeline = async () => {
    update(instanceId, {
      isGenerating: true, isFinished: false, currentStep: 1, mobileTab: "pipeline",
      stepStates: { hooks: "processing", script: "pending", assets: "pending", video: "pending", composition: "pending" },
    });
    setElapsedTime(0);
    setStageTime(0);

    try {
      const hooksRes = await aiServiceFetch("/api/v1/generate/hooks", {
        method: "POST",
        body: JSON.stringify({ topic: prompt, nicheKey: selectedNiche, userId: currentUserId }),
      });
      if (!hooksRes.ok) throw new Error();
      const hooksData = await hooksRes.json();

      update(instanceId, (prev: any) => ({
        reelId: hooksData.reelId,
        winnerHook: hooksData.hooksAnalysedWithScores[0].hook,
        generatedHooks: hooksData.hooksAnalysedWithScores ?? [],
        stepStates: { ...(prev?.stepStates as object ?? {}), hooks: "review" },
      }));
      toast.success("Hooks generated! Ready for your review.");
    } catch {
      setStepStates((prev: any) => ({ ...prev, hooks: "failed" }));
      toast.error("Failed to generate Hooks.");
    }
  };

  // ─── Stage Approve ────────────────────────────────────────────────────────
  const handleStageApprove = async (stageId: string, index: number) => {
    setStepStates((prev: any) => ({ ...prev, [stageId]: "completed" }));
    const nextStage = pipelineStages[index + 1];

    if (!nextStage) {
      setIsFinished(true);
      toast.success("All pipelines approved!");
      return;
    }

    setCurrentStep(index + 2);
    setStepStates((prev: any) => ({ ...prev, [nextStage.id]: "processing" }));

    try {
      const productionBody = { reelId, nicheKey: selectedNiche, videoType: selectedStyle ?? "ken-burns", selectedBgmIndex: 0, userId: currentUserId };

      if (nextStage.id === "script") {
        const res = await aiServiceFetch("/api/v1/generate/script", { method: "POST", body: JSON.stringify({ reelId, winnerHook, nicheKey: selectedNiche }) });
        const data = await res.json();
        setGeneratedScript(data.scenes ?? []);
        setStepStates((prev: any) => ({ ...prev, script: "review" }));
      } else if (nextStage.id === "assets") {
        await aiServiceFetch("/api/v1/generate/assets", { method: "POST", body: JSON.stringify(productionBody) });
      } else if (nextStage.id === "video") {
        await aiServiceFetch("/api/v1/generate/video", { method: "POST", body: JSON.stringify(productionBody) });
      } else if (nextStage.id === "composition") {
        await aiServiceFetch("/api/v1/generate/composition", { method: "POST", body: JSON.stringify(productionBody) });
      }
    } catch {
      setStepStates((prev: any) => ({ ...prev, [nextStage.id]: "failed" }));
      toast.error(`${nextStage.name} failed to process.`);
    }
  };

  // ─── Stage Reject / Retake ────────────────────────────────────────────────
  const handleStageReject = async (stageId: string) => {
    setStepStates((prev: any) => ({ ...prev, [stageId]: "processing" }));
    toast.info(`Regenerating variations for ${stageId}...`);

    const productionBody = { reelId, nicheKey: selectedNiche, videoType: selectedStyle ?? "ken-burns", selectedBgmIndex: 0, userId: currentUserId };

    try {
      if (stageId === "hooks") {
        const res = await aiServiceFetch("/api/v1/generate/hooks", { method: "POST", body: JSON.stringify({ topic: prompt, nicheKey: selectedNiche, userId: currentUserId, isRetake: true, reelId }) });
        const data = await res.json();
        update(instanceId, (prev: any) => ({
          reelId: data.reelId, winnerHook: data.hooksAnalysedWithScores[0].hook,
          generatedHooks: data.hooksAnalysedWithScores ?? [],
          stepStates: { ...(prev?.stepStates as object ?? {}), [stageId]: "review" },
        }));
        toast.success(`${stageId} regenerated successfully.`);
      } else if (stageId === "script") {
        const res = await aiServiceFetch("/api/v1/generate/script", { method: "POST", body: JSON.stringify({ reelId, winnerHook, nicheKey: selectedNiche, isRetake: true }) });
        const data = await res.json();
        setGeneratedScript(data.scenes ?? []);
        setStepStates((prev: any) => ({ ...prev, [stageId]: "review" }));
        toast.success(`${stageId} regenerated successfully.`);
      } else if (stageId === "assets") {
        await aiServiceFetch("/api/v1/generate/assets", { method: "POST", body: JSON.stringify(productionBody) });
      } else if (stageId === "video") {
        await aiServiceFetch("/api/v1/generate/video", { method: "POST", body: JSON.stringify(productionBody) });
      } else if (stageId === "composition") {
        await aiServiceFetch("/api/v1/generate/composition", { method: "POST", body: JSON.stringify(productionBody) });
      }
    } catch {
      setStepStates((prev: any) => ({ ...prev, [stageId]: "failed" }));
      toast.error(`Regeneration failed for ${stageId}.`);
    }
  };

  // ─── Reset ────────────────────────────────────────────────────────────────
  const handleResetEngine = () => {
    update(instanceId, {
      isGenerating: false, isFinished: false, prompt: "", selectedNiche: "", selectedStyle: null,
      reelId: "", winnerHook: "", finalVideoUrl: null, generatedHooks: [], generatedScript: [],
      mobileTab: "form",
      stepStates: { hooks: "pending", script: "pending", assets: "pending", video: "pending", composition: "pending" },
    });
    setElapsedTime(0);
    setStageTime(0);
    toast.info("Workspace tracking reset.");
  };

  return {
    mobileTab, setMobileTab, prompt, setPrompt, selectedNiche, setSelectedNiche,
    selectedStyle, setSelectedStyle, pipelineType, setPipelineType, isGenerating,
    initInteractivePipeline, setIsGenerating, isFinished, elapsedTime, stageTime,
    currentStep, setCurrentStep, focusedStep, setFocusedStep, stepStates, setStepStates,
    handleResetEngine, handleStageReject, handleStageApprove,
    generatedHooks, generatedScript, finalVideoUrl, reelId,
  };
}