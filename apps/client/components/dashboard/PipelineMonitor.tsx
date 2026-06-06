// components/dashboard/PipelineMonitor.tsx
// Refactored: imports pipelineStages from hook (no duplication) and uses shared pipeline-utils.
"use client";

import {
  Check, CheckCircle2, Clock, Layers, Maximize, Loader2, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { pipelineStages } from "@/hooks/dashboard/usePipeline";
import { isStageProcessing } from "@/lib/pipeline-utils";
import type { Scene, StepStates } from "@/types/pipeline";

interface PipelineMonitorProps {
  isGenerating: boolean;
  isFinished: boolean;
  pipelineType: string;
  stepStates: Record<string, string>;
  currentStep: number;
  setFocusedStep: (v: any) => void;
  handleStageApprove: (stageId: string, idx: number) => void;
  handleStageReject: (stageId: string) => void;
  generatedScript: Scene[];
  className?: string;
}

export const PipelineMonitor = ({
  isGenerating, isFinished, pipelineType, stepStates, currentStep,
  setFocusedStep, handleStageApprove, handleStageReject,
  generatedScript, className,
}: PipelineMonitorProps) => {
  return (
    <section className={className}>
      <div className="border border-border bg-card text-card-foreground rounded-2xl p-5 h-[680px] flex flex-col shadow-xs min-w-0 relative w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-base sm:text-3xl font-black tracking-wider text-foreground font-headline flex items-center gap-2">
            <Layers className="size-8 text-primary animate-pulse mt-1" />
            Live Asset Stream Pipeline
          </h3>
          {isGenerating && (
            <div className={`flex items-center gap-2 border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isFinished ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-primary/5 border-primary/10 text-primary animate-pulse"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isFinished ? "bg-emerald-500" : "bg-primary animate-ping"}`} />
              {isFinished ? "Render Complete" : "Live Running"}
            </div>
          )}
        </div>

        {/* Idle State */}
        {!isGenerating ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-sidebar text-center p-6 animate-in fade-in duration-300 overflow-y-auto">
            <div className="flex items-center gap-5 mb-8 relative justify-center select-none opacity-40">
              <div className="w-11 h-11 border border-dashed border-border bg-sidebar rounded-full flex items-center justify-center text-sm font-mono font-bold text-foreground">01</div>
              <div className="w-10 border-t border-dashed border-border" />
              <div className="w-11 h-11 border border-dashed border-border bg-sidebar rounded-full flex items-center justify-center text-sm font-mono font-bold text-foreground">02</div>
              <div className="w-10 border-t border-dashed border-border" />
              <div className="w-16 h-16 border-2 border-primary/40 bg-sidebar rounded-2xl flex items-center justify-center text-primary shadow-xs">
                <Layers className="w-7 h-7 animate-pulse text-primary" />
              </div>
              <div className="w-10 border-t border-dashed border-border" />
              <div className="w-11 h-11 border border-dashed border-border bg-sidebar rounded-full flex items-center justify-center text-sm font-mono font-bold text-foreground">03</div>
            </div>
            <div className="space-y-1.5 max-w-sm">
              <p className="text-sm font-black text-foreground uppercase tracking-tight font-headline">Automated Video Track Generator</p>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">The automated content generation pipeline is currently idle.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-7 w-full flex-1 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
            {pipelineStages.map((stage, idx) => {
              const status = stepStates[stage.id as keyof StepStates];
              const isActive = (idx + 1) === currentStep && !isFinished;
              const currentlyProcessing = isStageProcessing(stage.id, generatedScript);

              return (
                <div
                  key={stage.id}
                  className={`flex gap-7 items-center p-2 sm:px-6 sm:py-5 rounded-2xl border bg-background transition-all
                    ${isActive ? "border-primary shadow-xs ring-4 ring-primary/5" : "border-border/60 opacity-65"}
                    ${isFinished ? "border-emerald-500 opacity-100" : ""}`}
                >
                  <div className={`size-12 rounded-full flex items-center justify-center text-sm font-bold border mt-1 shadow ${status === "completed" || isFinished ? "bg-primary text-primary-foreground border-primary" : "bg-sidebar border-border"}`}>
                    {status === "completed" || isFinished ? <Check className="size-6" /> : stage.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-sm sm:text-xl underline underline-offset-2 font-black text-foreground font-headline tracking-wider">{stage.name}</h4>
                        <p className="text-sm text-muted-foreground">{stage.desc}</p>

                        {status === "completed" && (
                          <div className="text-[11px] text-primary font-bold tracking-wide uppercase my-3 flex items-center gap-1.5 select-none animate-in fade-in duration-200">
                            <CheckCircle2 className="size-5 text-primary" />
                            {pipelineType === "direct" ? "Auto-Approve" : "Manual Approve"}
                          </div>
                        )}
                        {status === "pending" && (
                          <div className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase my-3 flex items-center gap-1.5 select-none">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </div>
                        )}
                        {pipelineType === "direct" && status === "processing" && (
                          <div className="text-[11px] text-amber-500 font-bold tracking-wide uppercase my-3 flex items-center gap-1.5 select-none animate-pulse">
                            <Clock className="w-3.5 h-3.5" /> Processing...
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFocusedStep(stage.id)}
                        className="h-8 w-8 rounded-full hover:bg-sidebar cursor-pointer"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>

                    {pipelineType === "interactive" && status === "review" && (
                      <div className="mt-4 flex gap-3 animate-in fade-in zoom-in duration-300">
                        {currentlyProcessing ? (
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 py-2 sm:py-2.5 rounded-xl border border-amber-500/20 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating Content...
                          </div>
                        ) : (
                          <>
                            <Button size="lg" onClick={() => handleStageApprove(stage.id, idx)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer">
                              <Check className="w-4 h-4 mr-2" /> Approve
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => handleStageReject(stage.id)} className="rounded-xl border-border bg-background hover:bg-muted shadow-sm transition-transform active:scale-95 cursor-pointer">
                              <RefreshCw className="w-4 h-4 mr-2" /> Retake
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
