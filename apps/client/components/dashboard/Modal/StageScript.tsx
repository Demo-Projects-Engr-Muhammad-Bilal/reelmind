import React from "react";
import { Loader2, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StageScript = ({ generatedScript, status, retakingIdx, pipelineType, unapprovedIdx, approveSingleItem, triggerSingleRetake, currentlyProcessing }: any) => {
          return (
                    <div className="flex-1 w-full max-w-6xl flex flex-col h-full">
                              {generatedScript && generatedScript.length > 0 && status !== "processing" ? (
                                        <div className="space-y-5 w-full">
                                                  {generatedScript.map((sceneRaw: any, idx: number) => {
                                                            let scene = typeof sceneRaw === 'string' ? JSON.parse(sceneRaw) : sceneRaw;
                                                            return (
                                                                      <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
                                                                                {retakingIdx[idx] && (
                                                                                          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm">
                                                                                                    <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                                                                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Regenerating...</span>
                                                                                          </div>
                                                                                )}
                                                                                <div className="flex justify-between items-center mb-4 relative z-10">
                                                                                          <div className="text-[11px] font-mono font-bold text-primary bg-primary/5 px-2.5 py-1 rounded border border-primary/10">
                                                                                                    [SCENE 0{idx + 1}]
                                                                                          </div>
                                                                                          {pipelineType === "interactive" && !retakingIdx[idx] && (
                                                                                                    unapprovedIdx[idx] ? (
                                                                                                              <Button disabled={currentlyProcessing} variant="default" size="sm" className="h-7 text-[10px] px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => approveSingleItem(idx)}>
                                                                                                                        <Check className="w-3 h-3 mr-1.5 pointer-events-none" /> <span className="pointer-events-none">Approve</span>
                                                                                                              </Button>
                                                                                                    ) : (
                                                                                                              <Button disabled={currentlyProcessing} variant="outline" size="sm" className="h-7 text-[10px] px-2.5 rounded-lg border-border hover:bg-muted cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => triggerSingleRetake(idx)}>
                                                                                                                        <RefreshCw className="w-3 h-3 mr-1.5 pointer-events-none" /> <span className="pointer-events-none">Retake</span>
                                                                                                              </Button>
                                                                                                    )
                                                                                          )}
                                                                                </div>
                                                                                <div className="mb-4">
                                                                                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Voiceover Narration</span>
                                                                                          <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-normal break-words font-medium">
                                                                                                    "{scene.audioText || "Processing..."}"
                                                                                          </p>
                                                                                </div>
                                                                                <div className="bg-sidebar border border-border/50 rounded-lg p-3 relative z-10">
                                                                                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Visual Context</span>
                                                                                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed whitespace-normal break-words">
                                                                                                    {scene.visualPrompt || "Processing..."}
                                                                                          </p>
                                                                                </div>
                                                                      </div>
                                                            );
                                                  })}
                                        </div>
                              ) : (
                                        <div className="flex-1 w-full flex flex-col items-center justify-center h-full min-h-[55vh] text-muted-foreground">
                                                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary/50 pointer-events-none" />
                                                  <p className="text-xs md:text-sm font-medium">Awaiting Engine Output...</p>
                                        </div>
                              )}
                    </div>
          );
};