/**
 * @file lib/types/domains.ts
 * @description Typed interfaces for every domain data payload.
 * Replaces the pervasive use of `any` in action return types and component state.
 */

// ─────────────────────────────────────────────
// NICHE
// ─────────────────────────────────────────────
export interface NicheRecord {
  id: string;
  key: string;
  name: string;
  systemPrompt: string;
  hooksInstruction: string;
  expansionInstruction: string;
  imageInstruction?: string | null;
  audioInstruction?: string | null;
  videoInstruction?: string | null;
  bgmUrls: string[];
  bgmVolume: number;
  fallbackUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// PRICING RATE
// ─────────────────────────────────────────────
export interface PricingRateRecord {
  id: string;
  stage: "AUDIO" | "IMAGE" | "VIDEO" | "UTILITY";
  provider: string;
  rate: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// CREDIT PACKAGE
// ─────────────────────────────────────────────
export interface CreditPackageRecord {
  id: string;
  planId: string;
  name: string;
  priceUSD: number;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────
export interface TelegramCredsRecord {
  id: string;
  userId: string;
  chatId: string;
  username?: string | null;
}

export interface UserRecord {
  id: string;
  name?: string | null;
  email: string;
  credits: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  telegramCreds?: TelegramCredsRecord | null;
  _count: {
    reels: number;
  };
}

// ─────────────────────────────────────────────
// USAGE LOG
// ─────────────────────────────────────────────
export interface UsageLogRecord {
  id: string;
  userId: string;
  reelId?: string | null;
  provider: string;
  stage: string;
  cost: number;
  createdAt: Date;
  user?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;
}

// ─────────────────────────────────────────────
// REEL & SCENE
// ─────────────────────────────────────────────
export interface SceneRecord {
  id: string;
  reelId: string;
  order: number;
  imageUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  script?: string | null;
  createdAt: Date;
}

export interface ReelRecord {
  id: string;
  userId: string;
  topic?: string | null;
  style: string;
  status: "QUEUED" | "GENERATING" | "COMPLETED" | "FAILED";
  isPublic: boolean;
  totalCreditsSpent: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name?: string | null;
    email: string;
  } | null;
  scenes: SceneRecord[];
}

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────
export interface AdminRecord {
  id: string;
  name?: string | null;
  email: string;
  isTwoFactorEnabled: boolean;
  lastLoginAt?: Date | null;
  lastPasswordChange?: Date | null;
  currentSessionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// OVERVIEW (Composed analytics payload)
// ─────────────────────────────────────────────
export interface OverviewKPIs {
  todayCredits: number;
  todayAgenciesCount: number;
  monthlyCredits: number;
  videosRendered24h: number;
}

export interface RecentPurchaseItem {
  id: string;
  name: string;
  email: string;
  pack: string;
  amount: string;
  credits: string;
}

export interface ActiveQueueItem {
  id: string;
  user: string;
  niche: string;
  status: string;
  time: string;
}

export interface TopNicheItem {
  name: string;
  credits: string;
  usage: number;
}

export interface ChartDataPoint {
  day: string;
  revenue: number;
  credits: number;
}

export interface OverviewData {
  kpis: OverviewKPIs;
  recentPurchases: RecentPurchaseItem[];
  activeQueue: ActiveQueueItem[];
  topNiches: TopNicheItem[];
  chartData: ChartDataPoint[];
}
