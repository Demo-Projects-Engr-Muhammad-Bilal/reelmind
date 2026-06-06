/**
 * @file lib/types/actions.ts
 * @description Single source of truth for the universal Server Action response envelope.
 * Previously duplicated in niche.ts, reel.ts, and admin.ts — now centralized here.
 * All server actions across every domain import ActionResponse from this file.
 */

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
