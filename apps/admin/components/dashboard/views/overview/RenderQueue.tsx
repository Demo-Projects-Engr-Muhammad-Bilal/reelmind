"use client";

import React from "react";
import { Loader2, CheckCircle2, XCircle, Clock, Inbox } from "lucide-react";

export default function RenderQueue({ queue }: { queue: any[] }) {
          return (
                    <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm flex flex-col h-full min-h-[350px]">
                              <div className="mb-4">
                                        <h3 className="text-base font-semibold text-foreground tracking-tight">Active Orchestration Queue</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">Live monitoring of AI video synthesis tasks.</p>
                              </div>

                              <div className="flex-1 overflow-x-auto">
                                        {queue && queue.length > 0 ? (
                                                  <table className="w-full text-left text-sm whitespace-nowrap">
                                                            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                                                                      <tr>
                                                                                <th className="pb-3 font-medium">Job ID</th>
                                                                                <th className="pb-3 font-medium">Client / Agency</th>
                                                                                <th className="pb-3 font-medium">Target Niche</th>
                                                                                <th className="pb-3 font-medium">Status</th>
                                                                                <th className="pb-3 font-medium text-right">Started</th>
                                                                      </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-border/20">
                                                                      {queue.map((job) => (
                                                                                <tr key={job.id} className="hover:bg-muted/10 transition-colors">
                                                                                          <td className="py-3 font-mono text-xs text-muted-foreground">{job.id}</td>
                                                                                          <td className="py-3 font-medium text-foreground">{job.user}</td>
                                                                                          <td className="py-3 text-muted-foreground">{job.niche}</td>
                                                                                          <td className="py-3">
                                                                                                    {job.status === "generating" && (
                                                                                                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[11px] font-semibold tracking-wide">
                                                                                                                        <Loader2 className="w-3 h-3 animate-spin" /> Processing
                                                                                                              </span>
                                                                                                    )}
                                                                                                    {job.status === "queued" && (
                                                                                                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 text-[11px] font-semibold tracking-wide">
                                                                                                                        <Clock className="w-3 h-3" /> Queued
                                                                                                              </span>
                                                                                                    )}
                                                                                                    {job.status === "completed" && (
                                                                                                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[11px] font-semibold tracking-wide">
                                                                                                                        <CheckCircle2 className="w-3 h-3" /> Rendered
                                                                                                              </span>
                                                                                                    )}
                                                                                                    {job.status === "failed" && (
                                                                                                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 text-rose-500 text-[11px] font-semibold tracking-wide">
                                                                                                                        <XCircle className="w-3 h-3" /> Failed
                                                                                                              </span>
                                                                                                    )}
                                                                                          </td>
                                                                                          <td className="py-3 text-right text-xs text-muted-foreground">{job.time}</td>
                                                                                </tr>
                                                                      ))}
                                                            </tbody>
                                                  </table>
                                        ) : (
                                                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
                                                            <Inbox className="w-8 h-8 opacity-20" />
                                                            <span className="text-sm">Queue is empty</span>
                                                  </div>
                                        )}
                              </div>
                    </div>
          );
}