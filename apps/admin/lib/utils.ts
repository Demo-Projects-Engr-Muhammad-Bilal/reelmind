/**
 * @file lib/utils.ts
 * @description Backward-compatibility re-export.
 * The cn() utility now lives in lib/utils/cn.ts.
 * This file re-exports it so any existing imports of "@/lib/utils" continue to work.
 */
export { cn } from "./utils/cn";
