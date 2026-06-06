/**
 * @file lib/utils/time.ts
 * @description Shared time/date formatting utilities.
 * Previously defined as a private function inside app/actions/overview.ts —
 * now centralized so any module can use it.
 */

/**
 * Converts a Date object into a human-readable relative time string.
 * e.g. "Just now", "5m ago", "3h ago"
 */
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
