// components/dashboard/PipelineForm/index.tsx
// Orchestrator — composes FormInputMode, FormSummaryMode, FormActionButton.
// Data-fetching delegated to useNiches and useQueueLimit hooks.
"use client";

import { useNiches } from "@/hooks/dashboard/useNiches";
import { useQueueLimit } from "@/hooks/dashboard/useQueueLimit";
import { useReelCancel } from "@/hooks/dashboard/useReelCancel";
import { FormInputMode } from "./FormInputMode";
import { FormSummaryMode } from "./FormSummaryMode";
import { FormActionButton } from "./FormActionButton";
import type { VisualStyle, PipelineMode } from "@/types/pipeline";

interface PipelineFormProps {
  className?: string;
  prompt: string;
  setPrompt: (v: string | ((p: string) => string)) => void;
  selectedNiche: string;
  setSelectedNiche: (v: string) => void;
  selectedStyle: VisualStyle | null;
  setSelectedStyle: (v: any) => void;
  pipelineType: PipelineMode;
  setPipelineType: (v: PipelineMode) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean | ((p: boolean) => boolean)) => void;
  isFinished: boolean;
  elapsedTime: number;
  handleResetEngine: () => void;
  initInteractivePipeline: () => void;
  reelId: string;
}

export default function PipelineForm({
  className, prompt, setPrompt, selectedNiche, setSelectedNiche,
  selectedStyle, setSelectedStyle, pipelineType, setPipelineType,
  isGenerating, setIsGenerating, isFinished, elapsedTime,
  handleResetEngine, initInteractivePipeline, reelId,
}: PipelineFormProps) {
  const { niches } = useNiches();
  const { isQueueFull, isChecking: isCheckingLimit } = useQueueLimit();

  const { cancelReel, isCancelling } = useReelCancel({
    onSuccess: () => {
      setIsGenerating(false);
      handleResetEngine();
    },
    onError: () => {},
  });

  const isLocked   = isGenerating || isFinished;
  const canGenerate = !!(prompt.trim() && selectedNiche && selectedStyle);

  const handleStart = () => {
    if (pipelineType === "direct") {
      setIsGenerating(true);
    } else {
      initInteractivePipeline();
    }
  };

  const handleCancel = () => cancelReel(reelId || undefined);

  return (
    <section className={`w-full flex-col ${className}`}>
      <div className="border border-border bg-card text-card-foreground rounded-2xl p-5 flex flex-col h-[680px] shadow-xs min-w-0 relative">
        <div className="w-full flex flex-col gap-6 flex-1 overflow-y-auto pr-1">
          {!isLocked ? (
            <FormInputMode
              prompt={prompt}
              setPrompt={setPrompt as (v: string) => void}
              selectedNiche={selectedNiche}
              setSelectedNiche={setSelectedNiche}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle as (v: VisualStyle) => void}
              pipelineType={pipelineType}
              setPipelineType={setPipelineType}
              niches={niches}
              isQueueFull={isQueueFull}
            />
          ) : (
            <FormSummaryMode
              prompt={prompt}
              selectedNiche={selectedNiche}
              selectedStyle={selectedStyle}
              pipelineType={pipelineType}
              isFinished={isFinished}
              niches={niches}
            />
          )}
        </div>

        <div className="mt-auto pt-4 shrink-0 bg-card">
          <FormActionButton
            isFinished={isFinished}
            isGenerating={isGenerating}
            isQueueFull={isQueueFull}
            isCheckingLimit={isCheckingLimit}
            isCancelling={isCancelling}
            elapsedTime={elapsedTime}
            canGenerate={canGenerate}
            onStart={handleStart}
            onCancel={handleCancel}
            onReset={handleResetEngine}
          />
        </div>
      </div>
    </section>
  );
}
