"use client";

/**
 * @file components/dashboard/shared/DataErrorState.tsx
 * @description Shared error state component for data-fetch failures.
 * Extracted from the one-off error block in Overview.tsx and standardized
 * for use across all dashboard views.
 *
 * Usage:
 *   <DataErrorState message={error} onRetry={invalidate} />
 */

import { AlertCircle } from "lucide-react";

interface DataErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function DataErrorState({ message, onRetry }: DataErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 p-8 max-w-md mx-auto mt-10 text-center">
      <AlertCircle className="w-10 h-10 text-rose-500" />
      <h2 className="text-lg font-semibold text-rose-500">System Error</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
