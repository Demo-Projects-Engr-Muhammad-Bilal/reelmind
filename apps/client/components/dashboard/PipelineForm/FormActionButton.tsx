// components/dashboard/PipelineForm/FormActionButton.tsx
// Single-responsibility: the start / cancel / reset CTA button area.
import { Sparkles, X, RotateCcw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatStopwatch } from "@/lib/pipeline-utils";

interface FormActionButtonProps {
  isFinished: boolean;
  isGenerating: boolean;
  isQueueFull: boolean;
  isCheckingLimit: boolean;
  isCancelling: boolean;
  elapsedTime: number;
  canGenerate: boolean;
  onStart: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export function FormActionButton({
  isFinished, isGenerating, isQueueFull, isCheckingLimit,
  isCancelling, elapsedTime, canGenerate, onStart, onCancel, onReset,
}: FormActionButtonProps) {
  if (isFinished) {
    return (
      <Button
        size="lg"
        onClick={onReset}
        className="w-full py-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-95 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 mr-2" /> Reset Deck
      </Button>
    );
  }

  const buttonColorClass =
    isQueueFull && !isGenerating
      ? "bg-muted text-muted-foreground"
      : isGenerating
        ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground border border-destructive/50"
        : "bg-primary text-primary-foreground";

  const isDisabled =
    ((!canGenerate) && !isGenerating) || isCancelling || (isQueueFull && !isGenerating);

  const label = isCheckingLimit
    ? "Checking Workspace..."
    : isQueueFull && !isGenerating
      ? "Queue Full (3/3)"
      : isCancelling
        ? "Cancelling..."
        : isGenerating
          ? `Cancel Process [${formatStopwatch(elapsedTime)}]`
          : "Start Generation";

  const Icon = isCheckingLimit || isCancelling
    ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
    : isGenerating
      ? <X className="w-5 h-5 mr-2" />
      : isQueueFull
        ? <AlertCircle className="w-5 h-5 mr-2" />
        : <Sparkles className="w-5 h-5 mr-2" />;

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="lg"
        disabled={isDisabled}
        onClick={isGenerating ? onCancel : onStart}
        className={`w-full py-6 rounded-xl font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${buttonColorClass}`}
      >
        {Icon}
        {label}
      </Button>
      {isQueueFull && !isGenerating && !isCheckingLimit && (
        <p className="text-[11px] text-amber-500 font-bold flex items-center justify-center mt-1 text-center animate-pulse">
          You have 3 active jobs. Wait for a reel to finish or check My Queue.
        </p>
      )}
    </div>
  );
}
