import React from "react";
import { Loader2, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StageVideo = ({
          generatedScript,
          status,
          retakingIdx,
          pipelineType,
          unapprovedIdx,
          approveSingleItem,
          triggerSingleRetake,
          handleMediaPlay,
          getSceneCredits,
          formatCost,
          currentlyProcessing,
          getSeparatorClasses
}: any) => {
          return (
                    <div className="flex-1 w-full flex flex-col h-full">
                              {generatedScript && generatedScript.some((s: any) => {
                                        let scene = typeof s === 'string' ? JSON.parse(s) : s;
                                        return scene.videoPath;
                              }) && status !== "processing" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 w-full justify-items-center sm:justify-items-start">
                                                  {generatedScript.map((sceneRaw: any, idx: number) => {
                                                            let scene = typeof sceneRaw === 'string' ? JSON.parse(sceneRaw) : sceneRaw;
                                                            const sceneCredits = getSceneCredits ? getSceneCredits(scene) : 0;

                                                            return (
                                                                      <React.Fragment key={idx}>
                                                                                <div className="w-full max-w-[280px] relative group rounded-[2rem] border-4 border-border/40 shadow-xl bg-black p-1 flex flex-col overflow-hidden">

                                                                                          {retakingIdx[idx] && (
                                                                                                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-[1.7rem]">
                                                                                                              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                                                                                                              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Rendering...</span>
                                                                                                    </div>
                                                                                          )}

                                                                                          <div className="absolute top-3 left-3 z-30">
                                                                                                    <span className="text-[10px] bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md font-bold tracking-wider border border-white/10">
                                                                                                              [SEQ_0{idx + 1}]
                                                                                                    </span>
                                                                                          </div>

                                                                                          {pipelineType === "interactive" && !retakingIdx[idx] && (
                                                                                                    <div className="absolute top-3 right-3 z-40">
                                                                                                              {unapprovedIdx[idx] ? (
                                                                                                                        <Button disabled={currentlyProcessing} variant="default" size="sm" className="h-7 text-[10px] px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => approveSingleItem(idx)}>
                                                                                                                                  <Check className="w-3 h-3 mr-1 pointer-events-none" /> <span className="pointer-events-none">Approve</span>
                                                                                                                        </Button>
                                                                                                              ) : (
                                                                                                                        <Button disabled={currentlyProcessing} variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-black/60 backdrop-blur-md hover:bg-primary border border-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => triggerSingleRetake(idx)}>
                                                                                                                                  <RefreshCw className="w-3 h-3 text-white pointer-events-none" />
                                                                                                                        </Button>
                                                                                                              )}
                                                                                                    </div>
                                                                                          )}

                                                                                          <div className="aspect-[9/16] rounded-[1.7rem] bg-zinc-900 overflow-hidden relative">
                                                                                                    {scene.videoPath ? (
                                                                                                              <video controls controlsList="nodownload" className="absolute inset-0 object-cover w-full h-full custom-video" onPlay={handleMediaPlay}>
                                                                                                                        <source src={scene.videoPath} type="video/mp4" />
                                                                                                              </video>
                                                                                                    ) : (
                                                                                                              <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500 bg-zinc-900">
                                                                                                                        <Loader2 className="w-5 h-5 animate-spin mb-2 pointer-events-none" />
                                                                                                                        <span className="text-[10px] font-medium uppercase tracking-widest">Rendering Video...</span>
                                                                                                              </div>
                                                                                                    )}
                                                                                          </div>

                                                                                          <div className="mt-2 bg-zinc-900/80 rounded-xl p-2.5 border border-white/10 flex justify-between items-center px-4 mx-1 mb-1">
                                                                                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Scene Cost</span>
                                                                                                    <div className="flex items-center gap-2">
                                                                                                              <span className="text-xs font-black text-white">{sceneCredits} <span className="text-[8px] text-white/50">CR</span></span>
                                                                                                              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-1.5 py-0.5 rounded">{formatCost ? formatCost(sceneCredits) : "$0.000"}</span>
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                                <div className={`${getSeparatorClasses ? getSeparatorClasses(idx, generatedScript.length) : 'hidden'} col-span-full w-full h-[1px] bg-border/60 my-2 hidden lg:hidden`} />
                                                                      </React.Fragment>
                                                            );
                                                  })}
                                        </div>
                              ) : (
                                        <div className="flex-1 w-full flex flex-col items-center justify-center h-full min-h-[55vh] text-muted-foreground">
                                                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary/50 pointer-events-none" />
                                                  <p className="text-xs md:text-sm font-medium">Worker is animating and stitching video tracks...</p>
                                        </div>
                              )}
                    </div>
          );
};