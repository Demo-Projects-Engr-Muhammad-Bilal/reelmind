// types/pipeline.ts
// Shared TypeScript types for the pipeline domain.

export type StepStatus = "pending" | "processing" | "review" | "completed" | "failed";

export type PipelineMode = "direct" | "interactive";

export type MobileTab = "form" | "pipeline";

export type VisualStyle = "ai-video" | "ken-burns";

export type PageType = "history" | "queue" | "gallery";

// ─── Scene / Script ───────────────────────────────────────────────────────────
export interface Scene {
  reelId?: string;
  sceneOrder?: number;
  audioText?: string;
  voiceoverUrl?: string;
  imagePath?: string;
  videoPath?: string;
  creditsSpent?: number;
  credits?: number;
  cost?: number;
  reel?: { totalCreditsSpent?: number };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export interface HookItem {
  hook: string;
  score?: number;
}

// ─── Niche ────────────────────────────────────────────────────────────────────
export interface NicheData {
  key: string;
  name: string;
}

// ─── Reel ─────────────────────────────────────────────────────────────────────
export interface ReelData {
  id?: string;
  _id?: string;
  topic?: string;
  status: string;
  nicheKey?: string;
  style?: string;
  videoUrl?: string;
  scenes?: Scene[];
  createdAt: string;
  totalCreditsSpent?: number;
  isPublic?: boolean;
}

// ─── Step States Map ──────────────────────────────────────────────────────────
export interface StepStates {
  hooks: StepStatus;
  script: StepStatus;
  assets: StepStatus;
  video: StepStatus;
  composition: StepStatus;
}

// ─── Pipeline Instance Data (mirrors WorkspaceStore) ──────────────────────────
export interface PipelineInstanceData {
  prompt: string;
  selectedNiche: string;
  selectedStyle: VisualStyle | null;
  pipelineType: PipelineMode;
  isGenerating: boolean;
  isFinished: boolean;
  elapsedTime: number;
  stageTime: number;
  currentStep: number;
  focusedStep: string | null;
  reelId: string;
  winnerHook: string;
  generatedHooks: HookItem[];
  generatedScript: Scene[];
  finalVideoUrl: string | null;
  stepStates: StepStates;
  mobileTab: MobileTab;
  isIdle: boolean;
}

// ─── Queue Status Config ──────────────────────────────────────────────────────
export interface QueueStatusConfig {
  percent: number;
  text: string;
  color: string;
  textCol: string;
}
