"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Search, Download, Activity, Zap, Music, Video, Image as ImageIcon, Wrench, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUsageLogsAction } from "@/app/actions/usagelog";
import { toast } from "sonner";

export default function UsageLogsList() {
          const [logs, setLogs] = useState<any[]>([]);
          const [isLoading, setIsLoading] = useState(true);

          // ⚡ FIX: Direct initialization from sessionStorage to prevent race conditions
          const [searchQuery, setSearchQuery] = useState(() => {
                    if (typeof window !== "undefined") {
                              return sessionStorage.getItem("audit_search") || "";
                    }
                    return "";
          });

          const [stageFilter, setStageFilter] = useState("ALL");
          const [currentPage, setCurrentPage] = useState(1);
          const ITEMS_PER_PAGE = 8;

          const fetchLogs = async () => {
                    setIsLoading(true);
                    const res = await getUsageLogsAction();
                    if (!res.success) {
                              toast.error(res.error || "Failed to load usage logs.");
                    } else {
                              setLogs(res.data);
                    }
                    setIsLoading(false);
          };

          // ⚡ EFFECTS
          useEffect(() => {
                    fetchLogs();

                    // Cleanup sessionStorage after initial load so refresh works normally
                    if (typeof window !== "undefined") {
                              sessionStorage.removeItem("audit_search");
                    }
          }, []);

          useEffect(() => { setCurrentPage(1); }, [searchQuery, stageFilter]);

          // ⚡ FILTERING LOGIC
          const filteredLogs = logs.filter((log) => {
                    const searchLower = searchQuery.toLowerCase();
                    const matchesSearch =
                              log.provider?.toLowerCase().includes(searchLower) ||
                              log.user?.email?.toLowerCase().includes(searchLower) ||
                              log.user?.name?.toLowerCase().includes(searchLower) ||
                              log.reelId?.toLowerCase().includes(searchLower);

                    const matchesStage = stageFilter === "ALL" || log.stage === stageFilter;

                    return matchesSearch && matchesStage;
          });

          // ⚡ PAGINATION LOGIC
          const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
          const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          // Metrics
          const totalCreditsSpent = filteredLogs.reduce((acc, log) => acc + (log.cost || 0), 0);

          // ⚡ GLOBAL CSV EXPORT LOGIC (Exports currently filtered data)
          const exportToCSV = () => {
                    const headers = ["Log ID", "User Email", "Reel ID", "Pipeline Stage", "Provider", "Cost (Credits)", "Timestamp"];
                    const rows = filteredLogs.map(log => [
                              log.id,
                              log.user?.email || "Unknown User",
                              log.reelId || "N/A",
                              log.stage,
                              log.provider,
                              log.cost,
                              new Date(log.createdAt).toISOString()
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                    const link = document.createElement("a");
                    link.setAttribute("href", encodeURI(csvContent));
                    link.setAttribute("download", `aethelgard_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link); link.click(); document.body.removeChild(link);
                    toast.success("Global logs exported successfully.");
          };

          // ⚡ PER-USER CSV EXPORT LOGIC (Exports ALL data for a specific user)
          const exportUserCSV = (userId: string, userEmail: string) => {
                    const userLogs = logs.filter(l => l.userId === userId);
                    const headers = ["Log ID", "User Email", "Reel ID", "Pipeline Stage", "Provider", "Cost (Credits)", "Timestamp"];
                    const rows = userLogs.map(log => [
                              log.id,
                              log.user?.email || "Unknown User",
                              log.reelId || "N/A",
                              log.stage,
                              log.provider,
                              log.cost,
                              new Date(log.createdAt).toISOString()
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                    const link = document.createElement("a");
                    link.setAttribute("href", encodeURI(csvContent));

                    // Format email for filename
                    const cleanEmail = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
                    link.setAttribute("download", `aethelgard_${cleanEmail}_logs_${new Date().toISOString().split('T')[0]}.csv`);

                    document.body.appendChild(link); link.click(); document.body.removeChild(link);
                    toast.success(`Exported ${userLogs.length} logs for ${userEmail}`);
          };

          // Helper for Stage Icons/Colors
          const getStageConfig = (stage: string) => {
                    switch (stage) {
                              case "AUDIO": return { icon: Music, color: "text-blue-500", bg: "bg-blue-500/10" };
                              case "VIDEO": return { icon: Video, color: "text-purple-500", bg: "bg-purple-500/10" };
                              case "IMAGE": return { icon: ImageIcon, color: "text-rose-500", bg: "bg-rose-500/10" };
                              case "UTILITY": return { icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10" };
                              default: return { icon: Activity, color: "text-muted-foreground", bg: "bg-muted" };
                    }
          };

          return (
                    <div className="w-full max-w-7xl mx-auto space-y-6">

                              {/* Header & Export */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                                  <h2 className="text-3xl font-semibold text-foreground tracking-tight">Global Audit Logs</h2>
                                                  <p className="text-sm text-muted-foreground mt-1">Read-only ledger of API usage and credit deductions.</p>
                                        </div>
                                        <Button onClick={exportToCSV} variant="outline" className="rounded-full px-6 shadow-sm cursor-pointer">
                                                  <Download className="w-4 h-4 mr-2" /> Export View
                                        </Button>
                              </div>

                              {/* Metrics Cards */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-card border border-border/50 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                            <Activity className="w-6 h-6" />
                                                  </div>
                                                  <div>
                                                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Total Tracked Actions</p>
                                                            <h3 className="text-2xl font-bold text-foreground mt-0.5">{filteredLogs.length}</h3>
                                                  </div>
                                        </div>
                                        <div className="bg-card border border-border/50 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                                                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                                                            <Zap className="w-6 h-6" />
                                                  </div>
                                                  <div>
                                                            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Total Credits Consumed</p>
                                                            <h3 className="text-2xl font-bold text-foreground mt-0.5">{totalCreditsSpent.toLocaleString()}</h3>
                                                  </div>
                                        </div>
                              </div>

                              {/* Main Logs Container */}
                              <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[550px]">

                                        {/* TOP CONTROLS: SEARCH & FILTER TABS */}
                                        <div className="p-4 border-b border-border/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-muted/5 shrink-0">
                                                  <div className="flex items-center gap-3 w-full lg:w-[350px] bg-background border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
                                                            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                                                            <Input
                                                                      placeholder="Search by user, provider, or reel ID..."
                                                                      value={searchQuery}
                                                                      onChange={(e) => setSearchQuery(e.target.value)}
                                                                      className="border-none bg-transparent shadow-none focus-visible:ring-0 h-8 px-2 text-sm w-full placeholder:text-xs placeholder:text-muted-foreground"
                                                            />
                                                  </div>


                                                  <div className="flex bg-muted/50 p-2 rounded-xl w-full lg:w-auto overflow-x-auto custom-scrollbar shrink-0">
                                                            {['ALL', 'AUDIO', 'VIDEO', 'IMAGE', 'UTILITY'].map((stage) => (
                                                                      <Button
                                                                      variant="ghost"
                                                                      size="lg"
                                                                                key={stage}
                                                                                onClick={() => setStageFilter(stage)}
                                                                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${stageFilter === stage ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                                                                                          }`}
                                                                      >
                                                                                {stage}
                                                                      </Button>
                                                            ))}
                                                  </div>
                                        </div>

                                        {/* DATA LIST */}
                                        <div className="flex-grow flex flex-col bg-background">
                                                  {isLoading ? (
                                                            <div className="flex-grow flex justify-center items-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin" /></div>
                                                  ) : filteredLogs.length === 0 ? (
                                                            <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground text-center p-8">
                                                                      <Activity className="w-12 h-12 mb-4 opacity-20" />
                                                                      <p>No usage logs found matching your criteria.</p>
                                                            </div>
                                                  ) : (
                                                            <>
                                                                      {/* 💻 DESKTOP TABLE VIEW */}
                                                                      <div className="hidden lg:block w-full overflow-x-auto flex-grow">
                                                                                <table className="w-full text-sm text-left">
                                                                                          <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                                                                                                    <tr>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">User Details</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Provider & Stage</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Reel Reference</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Timestamp</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider text-right">Cost & Actions</th>
                                                                                                    </tr>
                                                                                          </thead>
                                                                                          <tbody className="divide-y divide-border/50">
                                                                                                    {paginatedLogs.map((log) => {
                                                                                                              const stageConf = getStageConfig(log.stage);
                                                                                                              const StageIcon = stageConf.icon;

                                                                                                              return (
                                                                                                                        <tr key={log.id} className="hover:bg-muted/5 transition-colors bg-background">
                                                                                                                                  <td className="px-6 py-4 align-middle whitespace-nowrap">
                                                                                                                                            <p className="font-semibold text-foreground truncate max-w-[200px]">{log.user?.name || "Unknown User"}</p>
                                                                                                                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{log.user?.email || "No Email"}</p>
                                                                                                                                  </td>
                                                                                                                                  <td className="px-6 py-4 align-middle whitespace-nowrap">
                                                                                                                                            <div className="flex items-center gap-3">
                                                                                                                                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stageConf.bg} ${stageConf.color} shrink-0`}>
                                                                                                                                                                <StageIcon className="w-4 h-4" />
                                                                                                                                                      </div>
                                                                                                                                                      <div>
                                                                                                                                                                <p className="font-semibold text-foreground">{log.provider}</p>
                                                                                                                                                                <p className={`text-[10px] uppercase font-bold tracking-wider ${stageConf.color}`}>{log.stage}</p>
                                                                                                                                                      </div>
                                                                                                                                            </div>
                                                                                                                                  </td>
                                                                                                                                  <td className="px-6 py-4 align-middle font-mono text-xs text-muted-foreground">
                                                                                                                                            {log.reelId ? (
                                                                                                                                                      <span className="bg-muted/50 px-2 py-1 rounded">{log.reelId.substring(0, 8)}...{log.reelId.substring(log.reelId.length - 4)}</span>
                                                                                                                                            ) : "N/A"}
                                                                                                                                  </td>
                                                                                                                                  <td className="px-6 py-4 align-middle whitespace-nowrap">
                                                                                                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                                                                                                      <Clock className="w-3.5 h-3.5" />
                                                                                                                                                      <span>{new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                                                                                                                            </div>
                                                                                                                                  </td>
                                                                                                                                  <td className="px-6 py-4 align-middle text-right">
                                                                                                                                            {/* ⚡ COST AND DOWNLOAD ACTION */}
                                                                                                                                            <div className="flex items-center justify-end gap-3">
                                                                                                                                                      <span className="inline-flex items-center gap-1.5 font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md">
                                                                                                                                                                <Zap className="w-3.5 h-3.5" /> -{log.cost}
                                                                                                                                                      </span>
                                                                                                                                                      <Button
                                                                                                                                                                variant="ghost"
                                                                                                                                                                size="icon"
                                                                                                                                                                onClick={() => exportUserCSV(log.userId, log.user?.email || 'user')}
                                                                                                                                                                className="rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer w-8 h-8 shrink-0"
                                                                                                                                                                title={`Download all logs for ${log.user?.email}`}
                                                                                                                                                      >
                                                                                                                                                                <Download className="w-4 h-4" />
                                                                                                                                                      </Button>
                                                                                                                                            </div>
                                                                                                                                  </td>
                                                                                                                        </tr>
                                                                                                              );
                                                                                                    })}
                                                                                          </tbody>
                                                                                </table>
                                                                      </div>

                                                                                          {/* 📱 MOBILE VIEW (Fixed Alignment & Overlap) */}
                                                                                          <div className="grid grid-cols-1 gap-3 p-4 lg:hidden">
                                                                                                    {paginatedLogs.map((log) => {
                                                                                                              const stageConf = getStageConfig(log.stage);
                                                                                                              const StageIcon = stageConf.icon;

                                                                                                              return (
                                                                                                                        <div key={log.id} className="p-4 border border-border/50 rounded-xl bg-background flex flex-col gap-3 shadow-sm">

                                                                                                                                  {/* ⚡ Top Row: Icon + Title + Actions (Flex layout prevents overlap) */}
                                                                                                                                  <div className="flex justify-between items-center gap-3">

                                                                                                                                            {/* Left: Icon & Provider Info */}
                                                                                                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                                                                                                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${stageConf.bg} ${stageConf.color} shrink-0`}>
                                                                                                                                                                <StageIcon className="w-4 h-4" />
                                                                                                                                                      </div>
                                                                                                                                                      <div className="flex-1 min-w-0">
                                                                                                                                                                <p className="font-semibold text-foreground text-sm truncate">{log.provider}</p>
                                                                                                                                                                <p className={`text-[10px] uppercase font-bold tracking-wider ${stageConf.color} truncate`}>{log.stage}</p>
                                                                                                                                                      </div>
                                                                                                                                            </div>

                                                                                                                                            {/* Right: Cost & Download Action */}
                                                                                                                                            <div className="flex items-center gap-2 shrink-0">
                                                                                                                                                      <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-xs">
                                                                                                                                                                <Zap className="w-3 h-3" /> -{log.cost}
                                                                                                                                                      </span>
                                                                                                                                                      <button
                                                                                                                                                                onClick={() => exportUserCSV(log.userId, log.user?.email || 'user')}
                                                                                                                                                                className="text-primary hover:opacity-70 p-1.5 bg-primary/5 rounded-md cursor-pointer shrink-0"
                                                                                                                                                                title={`Download all logs for ${log.user?.email}`}
                                                                                                                                                      >
                                                                                                                                                                <Download className="w-3.5 h-3.5" />
                                                                                                                                                      </button>
                                                                                                                                            </div>

                                                                                                                                  </div>

                                                                                                                                  {/* ⚡ Bottom Row: User & Reel Info */}
                                                                                                                                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 space-y-1.5 mt-1">
                                                                                                                                            <p className="text-xs text-muted-foreground truncate"><span className="font-semibold text-foreground">User:</span> {log.user?.email || "Unknown"}</p>
                                                                                                                                            <p className="text-[10px] text-muted-foreground font-mono truncate"><span className="font-semibold font-sans text-foreground">Reel:</span> {log.reelId || "N/A"}</p>
                                                                                                                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString()}</p>
                                                                                                                                  </div>

                                                                                                                        </div>
                                                                                                              );
                                                                                                    })}
                                                                                          </div>
                                                            </>
                                                  )}
                                        </div>

                                        {/* ⚡ PAGINATION CONTROLS */}
                                        <div className="mt-auto p-4 border-t border-border/50 bg-muted/5 flex items-center justify-between shrink-0">
                                                  <p className="text-xs text-muted-foreground font-medium">
                                                            Showing <span className="text-foreground">{filteredLogs.length === 0 ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)}</span> of <span className="text-foreground">{filteredLogs.length}</span>
                                                  </p>
                                                  {totalPages > 1 && (
                                                            <div className="flex items-center gap-2">
                                                                      <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full cursor-pointer">
                                                                                <ChevronLeft className="w-4 h-4" />
                                                                      </Button>
                                                                      <div className="text-xs font-semibold px-2">{currentPage} / {totalPages}</div>
                                                                      <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full cursor-pointer">
                                                                                <ChevronRight className="w-4 h-4" />
                                                                      </Button>
                                                            </div>
                                                  )}
                                        </div>
                              </div>
                    </div>
          );
}