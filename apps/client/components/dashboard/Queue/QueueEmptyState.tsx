// components/dashboard/Queue/QueueEmptyState.tsx
import { Loader2, PlayCircle } from "lucide-react";

interface QueueEmptyStateProps {
  loading: boolean;
}

export function QueueEmptyState({ loading }: QueueEmptyStateProps) {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary/50" />
        <p className="text-sm font-medium">Syncing pipeline queue...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-16 text-muted-foreground">
      <PlayCircle className="w-12 h-12 mb-4 text-muted-foreground/30" />
      <p className="text-base font-bold text-foreground">Queue is empty</p>
      <p className="text-sm font-medium mt-1">You have no active renders processing right now.</p>
    </div>
  );
}
