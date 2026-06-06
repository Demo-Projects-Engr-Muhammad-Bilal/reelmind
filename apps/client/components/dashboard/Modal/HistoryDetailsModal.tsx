"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { pipelineStages } from "@/hooks/dashboard/usePipeline";
import { toast } from "sonner";

import { BaseModalWrapper } from "./BaseModalWrapper";
import { StageScript } from "./StageScript";
import { StageAssets } from "./StageAssets";
import { StageVideo } from "./StageVideo";
import { StageComposition } from "./StageComposition";

export const HistoryDetailsModal = ({ reel, onClose }: { reel: any, onClose: () => void }) => {
          // ⚡ Remove Hooks Stage completely for Viewer
          const viewerStages = pipelineStages.filter(s => s.id !== "hooks");

          // ⚡ FIX: Hamesha Modal 1st step (Script) se hi open hoga
          const [focusedStep, setFocusedStep] = useState("script");
          const [isDownloading, setIsDownloading] = useState(false);

          if (!reel) return null;

          const currentIndex = viewerStages.findIndex((s) => s.id === focusedStep);
          const currentStage = viewerStages[currentIndex];

          const CREDITS_PER_DOLLAR = Number(process.env.NEXT_PUBLIC_CREDITS_PER_DOLLAR || 1000);
          const formatCost = (credits: number) => `$${(credits / CREDITS_PER_DOLLAR).toFixed(3)}`;

          const getSceneCredits = (scene: any) => scene.creditsSpent || scene.credits || scene.cost || 0;
          const avgSceneCredits = reel.scenes?.length ? Math.round(reel.totalCreditsSpent / reel.scenes.length) : 0;

          const handleMediaPlay = (e: React.SyntheticEvent<HTMLMediaElement>) => {
                    document.querySelectorAll('audio, video').forEach((media) => { if (media !== e.target) (media as HTMLMediaElement).pause(); });
          };

          const handleDownload = async () => {
                    if (!reel.videoUrl) return;
                    setIsDownloading(true);
                    toast.info("Preparing download...");
                    try {
                              const response = await fetch(reel.videoUrl);
                              const blob = await response.blob();
                              const blobUrl = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = blobUrl;
                              link.download = `${reel.topic.replace(/\s+/g, '_')}_${new Date().getTime()}.mp4`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(blobUrl);
                    } catch (error) {
                              toast.error("Failed to download.");
                    } finally {
                              setIsDownloading(false);
                    }
          };

          const stageProps = {
                    reelId: reel.id,
                    generatedScript: reel.scenes || [],
                    finalVideoUrl: reel.videoUrl,
                    status: reel.status === "COMPLETED" ? "completed" : "processing",
                    pipelineType: "view",
                    initialIsPublic: reel.isPublic, // ⚡ Pass Public status down
                    retakingIdx: {},
                    unapprovedIdx: {},
                    currentlyProcessing: reel.status !== "COMPLETED",
                    approveSingleItem: () => { },
                    triggerSingleRetake: () => { },
                    handleMediaPlay, getSceneCredits, formatCost,
                    totalReelCredits: reel.totalCreditsSpent,
                    avgSceneCredits, isDownloading, handleDownload,
                    getSeparatorClasses: (idx: number, total: number) => {
                              if (idx === total - 1) return "hidden";
                              if ((idx + 1) % 4 === 0) return "block";
                              if ((idx + 1) % 2 === 0) return "block lg:hidden";
                              return "block sm:hidden";
                    }
          };

          return (
                    <BaseModalWrapper
                              isOpen={!!reel}
                              onClose={onClose}
                              title={`Reel Details: ${currentStage?.name || ""}`}
                              subtitle={`ID: ${reel.id}`}
                              icon={History}
                              leftNav={
                                        <Button variant="outline" size="icon" onClick={() => setFocusedStep(viewerStages[currentIndex - 1].id)} disabled={currentIndex === 0} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg bg-background border-border hover:bg-muted disabled:opacity-30 hidden sm:flex cursor-pointer">
                                                  <ChevronLeft className="w-5 h-5 pointer-events-none" />
                                        </Button>
                              }
                              rightNav={
                                        <Button variant="outline" size="icon" onClick={() => setFocusedStep(viewerStages[currentIndex + 1].id)} disabled={currentIndex === viewerStages.length - 1} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg bg-background border-border hover:bg-muted disabled:opacity-30 hidden sm:flex cursor-pointer">
                                                  <ChevronRight className="w-5 h-5 pointer-events-none" />
                                        </Button>
                              }
                              headerRight={
                                        <span className={`text-[10px] backdrop-blur-md text-white px-2.5 py-1 rounded-md font-black tracking-wider shadow-sm ${reel.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                                                  {reel.status}
                                        </span>
                              }
                              footer={
                                        <div className="w-full flex justify-center">
                                                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest bg-background border border-border px-4 py-2 rounded-lg shadow-sm">
                                                            Step {currentIndex + 1} / {viewerStages.length}
                                                  </span>
                                        </div>
                              }
                    >
                              <div className={`w-full flex-1 flex flex-col ${focusedStep !== "composition" ? "px-0 md:pl-[72px] md:pr-[72px] pb-4" : ""}`}>
                                        {focusedStep === "script" && <StageScript {...stageProps} />}
                                        {focusedStep === "assets" && <StageAssets {...stageProps} />}
                                        {focusedStep === "video" && <StageVideo {...stageProps} />}
                                        {focusedStep === "composition" && <StageComposition {...stageProps} />}
                              </div>
                    </BaseModalWrapper>
          );
};