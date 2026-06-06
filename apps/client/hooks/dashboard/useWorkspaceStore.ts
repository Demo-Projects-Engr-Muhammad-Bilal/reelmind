import { create } from 'zustand';

export interface PipelineData {
          prompt: string;
          selectedNiche: string;
          selectedStyle: "ai-video" | "ken-burns" | null;
          pipelineType: "direct" | "interactive";
          isGenerating: boolean;
          isFinished: boolean;
          elapsedTime: number;
          stageTime: number;
          currentStep: number;
          focusedStep: string | null;
          reelId: string;
          winnerHook: string;
          generatedHooks: any[];
          generatedScript: any[];
          finalVideoUrl: string | null;
          stepStates: Record<string, string>;
          mobileTab: "form" | "pipeline";
          isIdle: boolean;
}

const defaultPipelineData: PipelineData = {
          prompt: "", selectedNiche: "", selectedStyle: null, pipelineType: "direct",
          isGenerating: false, isFinished: false, elapsedTime: 0, stageTime: 0,
          currentStep: 1, focusedStep: null, reelId: "", winnerHook: "",
          generatedHooks: [], generatedScript: [], finalVideoUrl: null,
          stepStates: { hooks: "pending", script: "pending", assets: "pending", video: "pending", composition: "pending" },
          mobileTab: "form", isIdle: true
};

interface WorkspaceState {
          workbenches: string[];
          activeWorkbenchId: string | null;
          instances: Record<string, PipelineData>;
          addWorkbench: () => void;
          setActiveWorkbench: (id: string | null) => void;
          updateInstance: (id: string, data: Partial<PipelineData> | ((prev: PipelineData) => Partial<PipelineData>)) => void;
          updateWorkbenchStatus: (id: string, isIdle: boolean) => void;
          removeWorkbench: (id: string) => void;
          openReelInWorkspace: (reelData: any) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
          workbenches: ["default-draft"],
          activeWorkbenchId: "default-draft",
          instances: { "default-draft": { ...defaultPipelineData } },

          addWorkbench: () => {
                    const { workbenches, instances } = get();
                    if (workbenches.length >= 3) return;
                    const newId = crypto.randomUUID();
                    set({
                              workbenches: [...workbenches, newId],
                              activeWorkbenchId: newId,
                              instances: { ...instances, [newId]: { ...defaultPipelineData } }
                    });
          },

          // YEH FUNCTION APNE ZUSTAND STORE MEIN ADD KARO
          removeWorkbench: (id: string) =>
                    set((state: any) => {
                              const updatedWorkbenches = state.workbenches.filter((wbId: string) => wbId !== id);
                              const updatedInstances = { ...state.instances };
                              delete updatedInstances[id];

                              return {
                                        workbenches: updatedWorkbenches,
                                        instances: updatedInstances,
                                        activeWorkbenchId: state.activeWorkbenchId === id ? null : state.activeWorkbenchId,
                              };
                    }),

          setActiveWorkbench: (id) => set({ activeWorkbenchId: id }),

          updateInstance: (id, data) => set((state) => {
                    const prev = state.instances[id];
                    if (!prev) return state;
                    const updates = typeof data === 'function' ? data(prev) : data;
                    const nextData = { ...prev, ...updates };
                    nextData.isIdle = !nextData.isGenerating && !nextData.isFinished && nextData.prompt.trim() === "";
                    return { instances: { ...state.instances, [id]: nextData } };
          }),

          updateWorkbenchStatus: (id, isIdle) => set((state) => {
                    const prev = state.instances[id];
                    if (!prev) return state;
                    return { instances: { ...state.instances, [id]: { ...prev, isIdle } } };
          }),

          // ⚡ TRACKING LOGIC: Find existing form or inject a new one
          openReelInWorkspace: (reelData: any) => {
                    const state = get();
                    const targetReelId = reelData.id || reelData._id;

                    // 1. Agar form pehle se memory mein hai tou sirf usey active kar do
                    const existingWorkbenchId = Object.keys(state.instances).find(
                              id => state.instances[id].reelId === targetReelId
                    );

                    if (existingWorkbenchId) {
                              set({ activeWorkbenchId: existingWorkbenchId });
                              return;
                    }

                    // 2. Agar memory mein nahi hai (eg: hard refresh), tou khali form mein data daal do
                    let targetId = state.workbenches.find(id => state.instances[id]?.isIdle);

                    if (!targetId && state.workbenches.length < 3) {
                              targetId = crypto.randomUUID();
                              set({ workbenches: [...state.workbenches, targetId] });
                    }

                    if (targetId) {
                              set(s => ({
                                        activeWorkbenchId: targetId,
                                        instances: {
                                                  ...s.instances,
                                                  [targetId!]: {
                                                            ...s.instances[targetId!],
                                                            reelId: targetReelId,
                                                            prompt: reelData.topic || "Recovered Draft",
                                                            selectedNiche: reelData.nicheKey || "",
                                                            isGenerating: reelData.status !== 'FAILED' && reelData.status !== 'CANCELLED',
                                                            isIdle: false
                                                  }
                                        }
                              }));
                    }
          }
}));