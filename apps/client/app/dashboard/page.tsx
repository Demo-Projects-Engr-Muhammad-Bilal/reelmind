"use client";

import { PipelineHeader } from "@/components/dashboard/PipelineHeader";
import { WorkbenchNode } from "@/components/dashboard/WorkbenchNode";
import { useWorkspaceStore } from "@/hooks/dashboard/useWorkspaceStore";

export default function DashboardPage() {
  const { workbenches, instances, activeWorkbenchId, setActiveWorkbench, addWorkbench } =
    useWorkspaceStore();

  const hasIdleForm = workbenches.some((wbId) => {
    const wbData = instances[wbId];
    if (!wbData) return true;
    return !wbData.isGenerating && !wbData.isFinished && (wbData.prompt ?? "").trim() === "";
  });

  const canAddNew = workbenches.length < 3 && !hasIdleForm;

  return (
    <div className="w-full flex flex-col max-w-full relative pt-0 px-0 pb-20">
      <PipelineHeader
        onNewReel={canAddNew ? addWorkbench : undefined}
        isIdle={!canAddNew}
      />

      <div className="flex flex-col w-full mt-6">
        {workbenches.map((wbId, index) => (
          <WorkbenchNode
            key={wbId}
            instanceId={wbId}
            index={index}
            isActive={activeWorkbenchId === wbId}
            onActivate={() => setActiveWorkbench(wbId)}
            onCollapse={() => setActiveWorkbench(null)}
            totalWorkbenches={workbenches.length}
          />
        ))}
      </div>
    </div>
  );
}