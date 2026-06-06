"use client";

import React from "react";
import { ArrowUpRight, Activity } from "lucide-react";

export default function RecentPurchases({ logs }: { logs: any[] }) {
          return (
                    <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm flex flex-col h-96 overflow-hidden">
                              <div className="mb-4 flex items-center justify-between">
                                        <div>
                                                  <h3 className="text-base font-semibold text-foreground tracking-tight">Recent Activity</h3>
                                                  <p className="text-xs text-muted-foreground mt-0.5">Live transaction logging for system credits.</p>
                                        </div>
                                        <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                                                  View Logs <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                              </div>

                              <div className="flex-1 overflow-y-auto no-scrollbar">
                                        <div className="space-y-4 pt-2">
                                                  {logs && logs.length > 0 ? (
                                                            logs.map((item) => (
                                                                      <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/10 hover:border-border/40 transition-all">
                                                                                <div className="flex flex-col min-w-0 max-w-[60%]">
                                                                                          <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                                                                                          <span className="text-xs text-muted-foreground truncate">{item.pack}</span>
                                                                                </div>
                                                                                <div className="text-right flex flex-col">
                                                                                          <span className="text-sm font-bold text-foreground">{item.amount}</span>
                                                                                          <span className="text-[10px] font-medium text-rose-500">{item.credits} crd</span>
                                                                                </div>
                                                                      </div>
                                                            ))
                                                  ) : (
                                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                                                                      <Activity className="w-6 h-6 opacity-50" />
                                                                      <span className="text-sm">No recent activity</span>
                                                            </div>
                                                  )}
                                        </div>
                              </div>
                    </div>
          );
}