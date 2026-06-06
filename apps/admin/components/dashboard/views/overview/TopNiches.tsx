"use client";

import { PieChart } from "lucide-react";

export default function TopNiches({ niches }: { niches: any[] }) {
          return (
                    <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm flex flex-col h-full min-h-[350px]">
                              <div className="mb-6">
                                        <h3 className="text-base font-semibold text-foreground tracking-tight">Top Niches by Volume</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">Credit distribution across active profiles.</p>
                              </div>

                              <div className="space-y-5 flex-1">
                                        {niches && niches.length > 0 ? (
                                                  niches.map((niche, index) => (
                                                            <div key={index} className="space-y-2">
                                                                      <div className="flex items-center justify-between text-sm">
                                                                                <span className="font-medium text-foreground">{niche.name}</span>
                                                                                <span className="font-semibold text-muted-foreground text-xs">{niche.credits} crd</span>
                                                                      </div>
                                                                      <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                                                                <div
                                                                                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                                                          style={{ width: `${Math.min(niche.usage, 100)}%` }} // Ensures bar doesn't break UI if >100%
                                                                                />
                                                                      </div>
                                                            </div>
                                                  ))
                                        ) : (
                                                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
                                                            <PieChart className="w-8 h-8 opacity-20" />
                                                            <span className="text-sm">No niche data to display</span>
                                                  </div>
                                        )}
                              </div>
                    </div>
          );
}