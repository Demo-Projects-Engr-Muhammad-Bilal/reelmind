import React from "react";
import { Loader2, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StageAssets = ({ generatedScript, status, retakingIdx, pipelineType, unapprovedIdx, approveSingleItem, triggerSingleRetake, handleMediaPlay, currentlyProcessing }: any) => {
          return (
                    <div className="flex-1 w-full flex flex-col h-full">
                              {generatedScript && generatedScript.some((s: any) => {
                                        let scene = typeof s === 'string' ? JSON.parse(s) : s;
                                        return scene.voiceoverUrl || scene.imagePath;
                              }) && status !== "processing" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 w-full justify-items-center sm:justify-items-start">
                                                  {generatedScript.map((sceneRaw: any, idx: number) => {
                                                            let scene = typeof sceneRaw === 'string' ? JSON.parse(sceneRaw) : sceneRaw;
                                                            return (
                                                                      <React.Fragment key={idx}>
                                                                                <div className="w-full max-w-[280px] relative group rounded-[2rem] border-4 border-border/40 shadow-xl bg-black p-1 flex flex-col overflow-hidden">
                                                                                          {retakingIdx[idx] && (
                                                                                                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-[1.7rem]">
                                                                                                              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                                                                                                              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Regenerating...</span>
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

                                                                                          <div className="aspect-[9/16] rounded-[1.7rem] bg-zinc-900 overflow-hidden relative flex flex-col pb-3">
                                                                                                    <div className="flex-1 relative rounded-b-3xl overflow-hidden mb-3">
                                                                                                              {scene.imagePath ? (
                                                                                                                        <img src={scene.imagePath} alt={`Scene ${idx + 1}`} className="absolute inset-0 object-cover w-full h-full" />
                                                                                                              ) : (
                                                                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500 bg-zinc-900">
                                                                                                                                  <Loader2 className="w-5 h-5 animate-spin mb-2 pointer-events-none" />
                                                                                                                                  <span className="text-[10px] font-medium uppercase tracking-widest">Image...</span>
                                                                                                                        </div>
                                                                                                              )}
                                                                                                    </div>
                                                                                                    <div className="px-3 shrink-0">
                                                                                                              {scene.voiceoverUrl ? (
                                                                                                                        <div className="bg-[#f1f3f4] dark:bg-zinc-800 rounded-full overflow-hidden h-[40px] flex items-center w-full shadow-inner border border-transparent dark:border-white/5">
                                                                                                                                  <audio controls controlsList="nodownload" className="w-full h-full custom-audio" onPlay={handleMediaPlay}>
                                                                                                                                            <source src={scene.voiceoverUrl} type="audio/mpeg" />
                                                                                                                                  </audio>
                                                                                                                        </div>
                                                                                                              ) : (
                                                                                                                        <div className="h-[40px] w-full bg-black/50 rounded-full border border-white/10 flex items-center justify-center">
                                                                                                                                  <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Generating Audio...</span>
                                                                                                                        </div>
                                                                                                              )}
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                                <div className="col-span-full w-full h-[1px] bg-border/60 my-2 hidden lg:hidden" />
                                                                      </React.Fragment>
                                                            );
                                                  })}
                                        </div>
                              ) : (
                                        <div className="flex-1 w-full flex flex-col items-center justify-center h-full min-h-[55vh] text-muted-foreground">
                                                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary/50 pointer-events-none" />
                                                  <p className="text-xs md:text-sm font-medium">Worker is synthesizing Audio & Visuals...</p>
                                        </div>
                              )}
                    </div>
          );
};