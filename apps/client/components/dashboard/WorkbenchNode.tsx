"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { PipelineModal } from "@/components/dashboard/Modal/PipelineModal";
import PipelineForm from "@/components/dashboard/PipelineForm";
import { PipelineMonitor } from "@/components/dashboard/PipelineMonitor";
import { PipelineTabs } from "@/components/dashboard/PipelineTabs";
import { WorkbenchStatusBadge } from "@/components/dashboard/WorkbenchStatusBadge";
import { usePipeline } from "@/hooks/dashboard/usePipeline";
import { useWorkspaceStore } from "@/hooks/dashboard/useWorkspaceStore";

interface WorkbenchNodeProps {
  instanceId: string;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onCollapse: () => void;
  totalWorkbenches: number;
}

export function WorkbenchNode({
  instanceId,
  index,
  isActive,
  onActivate,
  onCollapse,
  totalWorkbenches,
}: WorkbenchNodeProps) {
  const pipeline = usePipeline(instanceId);
  const removeWorkbench = useWorkspaceStore((s) => s.removeWorkbench);

  const isNewDraft  = !pipeline.prompt || pipeline.prompt.trim() === "";
  const needsApproval = !isNewDraft && Object.values(pipeline.stepStates ?? {}).includes("review");
  const isLocked    = pipeline.isGenerating || pipeline.isFinished;
  const canClose    = (isNewDraft || !pipeline.isGenerating || needsApproval) && totalWorkbenches > 1;

  const formGridCols    = isLocked ? "lg:col-span-4" : "lg:col-span-5";
  const monitorGridCols = isLocked ? "lg:col-span-8" : "lg:col-span-7";

  const badge = (
    <WorkbenchStatusBadge
      isNewDraft={isNewDraft}
      needsApproval={needsApproval}
      isGenerating={pipeline.isGenerating}
      isFinished={pipeline.isFinished}
    />
  );

  const CloseButton = () =>
    canClose && removeWorkbench ? (
      <div
        onClick={(e) => { e.stopPropagation(); (removeWorkbench as (id: string) => void)(instanceId); }}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors z-10 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </div>
    ) : null;

  return (
    <div className="w-full bg-transparent">
      {/* ─── Collapsed State ─────────────────────────────────────────────── */}
      <div
        onClick={onActivate}
        className={`${isActive ? "hidden" : "flex"} relative w-full bg-sidebar/50 border border-border/60 hover:border-primary/50 cursor-pointer rounded-2xl p-4 items-center justify-between transition-all group mb-4 shadow-sm`}
      >
        <CloseButton />
        <div className="flex items-center gap-4 pr-6">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-black font-mono shadow-xs">
            0{index + 1}
          </div>
          <div>
            <h4 className="font-bold text-foreground font-headline tracking-wide">
              {pipeline.prompt
                ? pipeline.prompt.length > 50
                  ? `${pipeline.prompt.substring(0, 50)}...`
                  : pipeline.prompt
                : "Draft: New Reel Production"}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">{badge}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* ─── Expanded State ───────────────────────────────────────────────── */}
      <div className={`${isActive ? "flex" : "hidden"} flex-col w-full animate-in slide-in-from-top-2 fade-in duration-300 mb-6 bg-sidebar/20 border border-border/50 rounded-3xl p-2 sm:p-4`}>
        <div
          onClick={onCollapse}
          className="relative w-full bg-sidebar border border-border/80 rounded-2xl p-4 flex items-center justify-between mb-4 shadow-sm transition-all group cursor-pointer hover:border-primary/50"
        >
          <CloseButton />
          <div className="flex items-center gap-4 pr-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black font-mono">
              0{index + 1}
            </div>
            <div>
              <h4 className="font-bold text-foreground font-headline tracking-wide">
                {pipeline.prompt ? pipeline.prompt : "New Draft"}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">{badge}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <PipelineTabs activeTab={pipeline.mobileTab} setTab={pipeline.setMobileTab} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start mt-2 sm:mt-4">
          <PipelineForm
            {...pipeline}
            className={`${pipeline.mobileTab === "form" ? "flex" : "hidden"} lg:flex ${formGridCols} transition-all duration-500 ease-in-out`}
          />
          <PipelineMonitor
            {...pipeline}
            className={`w-full ${pipeline.mobileTab === "pipeline" ? "flex" : "hidden"} lg:flex ${monitorGridCols} flex-col transition-all duration-500 ease-in-out`}
          />
        </div>
        <PipelineModal {...pipeline} />
      </div>
    </div>
  );
}
