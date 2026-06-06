// lib/pipeline-utils.ts
// Pure utility functions shared across pipeline components and hooks.
// No React imports — these are framework-agnostic.

import type { QueueStatusConfig, Scene } from "@/types/pipeline";

// ─── Stage Processing Check ───────────────────────────────────────────────────
// Previously duplicated in PipelineMonitor.tsx AND PipelineModal.tsx
export function isStageProcessing(stageId: string, scenes: Scene[]): boolean {
  if (!scenes || scenes.length === 0) return false;

  const parsed = scenes.map((s) =>
    typeof s === "string" ? (JSON.parse(s) as Scene) : s
  );

  if (stageId === "assets") {
    return parsed.some((scene) => !scene.imagePath || !scene.voiceoverUrl);
  }
  if (stageId === "video") {
    return parsed.some((scene) => !scene.videoPath);
  }
  return false;
}

// ─── Time Formatters ──────────────────────────────────────────────────────────
export function formatStopwatch(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatElapsedTime(createdAt: string): string {
  const diff = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / 1000
  );
  const m = Math.floor(diff / 60).toString().padStart(2, "0");
  const s = (diff % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Queue Status Config ──────────────────────────────────────────────────────
export function getQueueStatusConfig(status: string): QueueStatusConfig {
  switch (status) {
    case "QUEUED":
      return { percent: 10, text: "In Queue", color: "bg-muted-foreground", textCol: "text-muted-foreground" };
    case "GENERATING_HOOKS":
    case "SCRIPT_GENERATED":
      return { percent: 35, text: "Writing Script & Hooks", color: "bg-blue-500", textCol: "text-blue-500" };
    case "GENERATING_ASSETS":
      return { percent: 65, text: "Synthesizing Visual Assets", color: "bg-purple-500", textCol: "text-purple-500" };
    case "RENDERING_VIDEO":
      return { percent: 90, text: "Rendering Final Frames", color: "bg-emerald-500", textCol: "text-emerald-500" };
    case "CANCELLED":
      return { percent: 100, text: "Process Cancelled", color: "bg-destructive", textCol: "text-destructive" };
    case "FAILED":
      return { percent: 100, text: "Process Failed", color: "bg-destructive", textCol: "text-destructive" };
    default:
      return { percent: 50, text: "Processing", color: "bg-primary", textCol: "text-primary" };
  }
}

// ─── Credits ──────────────────────────────────────────────────────────────────
export function getSceneCredits(scene: Scene): number {
  const dbCost = scene.creditsSpent ?? scene.credits ?? scene.cost ?? 0;
  if (dbCost > 0) return Number(dbCost);
  let calculatedCost = 0;
  if (scene.audioText) calculatedCost += 1;
  if (scene.voiceoverUrl) calculatedCost += 2;
  if (scene.imagePath) calculatedCost += 5;
  if (scene.videoPath) calculatedCost += 15;
  return calculatedCost;
}

export function formatCreditCost(credits: number, creditsPerDollar: number): string {
  return `$${(credits / creditsPerDollar).toFixed(3)}`;
}

// ─── Cloudinary ───────────────────────────────────────────────────────────────
export function optimizeCloudinaryVideo(url: string): string {
  if (!url || url.includes("f_auto") || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,vc_h265,w_720/");
}
