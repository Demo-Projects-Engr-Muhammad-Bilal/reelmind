// components/dashboard/WorkbenchStatusBadge.tsx
// Single-responsibility: render the correct status pill for a workbench.
import { CheckCircle2, Loader2 } from "lucide-react";

interface WorkbenchStatusBadgeProps {
  isNewDraft: boolean;
  needsApproval: boolean;
  isGenerating: boolean;
  isFinished: boolean;
}

export function WorkbenchStatusBadge({
  isNewDraft,
  needsApproval,
  isGenerating,
  isFinished,
}: WorkbenchStatusBadgeProps) {
  if (isNewDraft) {
    return (
      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-sidebar px-2.5 py-1 rounded-md border border-border/60">
        Idle Workbench
      </span>
    );
  }

  if (needsApproval) {
    return (
      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Action Required
      </span>
    );
  }

  if (isGenerating) {
    return (
      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-primary animate-pulse bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
        <Loader2 className="w-3 h-3 animate-spin" /> Processing
      </span>
    );
  }

  if (isFinished) {
    return (
      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
        <CheckCircle2 className="w-3 h-3" /> Render Complete
      </span>
    );
  }

  return (
    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-sidebar px-2.5 py-1 rounded-md border border-border/60">
      Idle Workbench
    </span>
  );
}
