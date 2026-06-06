"use client";

import { LoaderCircle } from "lucide-react";

interface SystemLoaderProps {
  message?: string;
}

export default function SystemLoader({
  message = "Orchestrating system data...",
}: SystemLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}
