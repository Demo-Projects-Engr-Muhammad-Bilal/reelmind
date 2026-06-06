// lib/constants.ts
// Single source of truth for env-driven URLs and global constants.
// Never read process.env.NEXT_PUBLIC_* directly in components — import from here.

import { Sparkles, MonitorPlay, Tags } from "lucide-react";
import React from "react";

// ─── Microservice URLs ────────────────────────────────────────────────────────
// AI / Backend service (video generation, niches, reels)
export const AI_SERVICE_URL =
  (process.env.NEXT_PUBLIC_AI_SERVICE_URL ?? "http://localhost:5001").replace(/\/$/, "");

// Auth service (completely separate port / microservice)
export const AUTH_SERVICE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

// ─── Business Constants ───────────────────────────────────────────────────────
export const CREDITS_PER_DOLLAR = Number(process.env.NEXT_PUBLIC_CREDITS_PER_DOLLAR ?? 1000);
export const MAX_WORKBENCHES = 3;
export const MAX_ACTIVE_JOBS = 3;
export const QUEUE_POLL_INTERVAL_MS = 15_000;
export const QUEUE_LIMIT_POLL_MS = 10_000;

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { name: "Gallery", href: "/gallery", icon: React.createElement(MonitorPlay, { className: "w-5 h-5 text-[#8B5CF6]" }) },
  { name: "Pricing", href: "/pricing", icon: React.createElement(Tags, { className: "w-5 h-5 text-[#8B5CF6]" }) },
];
