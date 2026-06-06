import React from "react";
import { Loader2 } from "lucide-react";

export const StageHooks = ({ generatedHooks, status }: any) => {
          return (
                    <div className="space-y-4 w-full flex flex-col h-full">
                              {generatedHooks && generatedHooks.length > 0 && status !== "processing" ? (
                                        <div className="space-y-12 w-full">
                                                  <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                                                            <div className="flex justify-between items-center mb-3 pl-2">
                                                                      <span className="text-[10px] font-bold text-primary bg-primary/10 uppercase tracking-wider px-2.5 py-1 rounded-md">Selected Version</span>
                                                                      {generatedHooks[0].score && <span className="text-[11px] font-mono font-medium text-muted-foreground">Score: {generatedHooks[0].score}</span>}
                                                            </div>
                                                            <p className="text-sm md:text-base font-medium text-foreground leading-relaxed pl-2 whitespace-normal break-words">
                                                                      "{generatedHooks[0].hook}"
                                                            </p>
                                                  </div>
                                                  {generatedHooks.slice(1).map((hookObj: any, idx: number) => (
                                                            <div key={idx} className="bg-sidebar border border-border/50 rounded-xl p-5 opacity-70 hover:opacity-100 transition-opacity">
                                                                      <div className="mb-2 flex justify-between items-center">
                                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Discarded Variant</span>
                                                                      </div>
                                                                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed whitespace-normal break-words">
                                                                                "{hookObj.hook}"
                                                                      </p>
                                                            </div>
                                                  ))}
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