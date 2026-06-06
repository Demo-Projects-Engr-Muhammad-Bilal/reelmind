/**
 * @file lib/utils/cn.ts
 * @description Tailwind class merge utility using clsx + tailwind-merge.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
