"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Search, Clapperboard, Eye, EyeOff, Trash2, Video, Image as ImageIcon, Music, CheckCircle2, Clock, PlayCircle, X, Zap, AlertTriangle, ChevronLeft, ChevronRight, Play, Pause, Globe, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getReelsAction, toggleReelVisibilityAction, deleteReelAction } from "@/app/actions/reel";
import { toast } from "sonner";
import { ReelCard } from "../../ui/MediaPreviews";

export default function ReelsObserver() {
          const [reels, setReels] = useState<any[]>([]);
          const [isLoading, setIsLoading] = useState(true);

          const [searchQuery, setSearchQuery] = useState("");
          const [statusFilter, setStatusFilter] = useState("COMPLETED");
          const [currentPage, setCurrentPage] = useState(1);
          const ITEMS_PER_PAGE = 6;

          // Modals States
          const [isViewModalOpen, setIsViewModalOpen] = useState(false);
          const [selectedReel, setSelectedReel] = useState<any | null>(null);

          const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
          const [reelToDelete, setReelToDelete] = useState<any | null>(null);
          const [isDeleting, setIsDeleting] = useState(false);

          const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
          const [reelToToggle, setReelToToggle] = useState<any | null>(null);
          const [isToggling, setIsToggling] = useState(false);

          const fetchReels = async () => {
                    setIsLoading(true);
                    const res = await getReelsAction();
                    if (res.success && res.data) setReels(res.data);
                    else toast.error(res.error || "Failed to load reels.");
                    setIsLoading(false);
          };

          useEffect(() => { fetchReels(); }, []);
          useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

          useEffect(() => {
                    const savedSearch = sessionStorage.getItem("reels_search");
                    if (savedSearch) {
                              setSearchQuery(savedSearch);
                              sessionStorage.removeItem("reels_search"); // Clean up after using
                    }
          }, []);

          // ⚡ UPDATED FILTERING LOGIC: Public/Private strictly requires "COMPLETED" status
          const filteredReels = reels.filter((reel) => {
                    const searchLower = searchQuery.toLowerCase();
                    const matchesSearch =
                              reel.topic?.toLowerCase().includes(searchLower) ||
                              reel.user?.email?.toLowerCase().includes(searchLower) ||
                              reel.id.toLowerCase().includes(searchLower);

                    let matchesStatus = true;
                    if (statusFilter !== "ALL") {
                              if (statusFilter === "PUBLIC") {
                                        matchesStatus = reel.isPublic === true && reel.status === "COMPLETED";
                              } else if (statusFilter === "PRIVATE") {
                                        matchesStatus = reel.isPublic === false && reel.status === "COMPLETED";
                              } else {
                                        matchesStatus = reel.status === statusFilter;
                              }
                    }

                    return matchesSearch && matchesStatus;
          });

          const totalPages = Math.ceil(filteredReels.length / ITEMS_PER_PAGE);
          const paginatedReels = filteredReels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          // Actions
          const confirmToggleVisibility = async () => {
                    if (!reelToToggle) return;
                    setIsToggling(true);
                    const toastId = toast.loading("Updating visibility...");
                    const res = await toggleReelVisibilityAction(reelToToggle.id, reelToToggle.isPublic);

                    if (res.success) {
                              toast.success(reelToToggle.isPublic ? "Reel is now Private." : "Reel is now Public.", { id: toastId });
                              setIsVisibilityModalOpen(false);
                              fetchReels();
                    } else {
                              toast.error(res.error || "Update failed.", { id: toastId });
                    }
                    setIsToggling(false);
          };

          const confirmDelete = async () => {
                    if (!reelToDelete) return;
                    setIsDeleting(true);
                    const toastId = toast.loading("Deleting reel and scenes...");
                    const res = await deleteReelAction(reelToDelete.id);
                    if (res.success) {
                              toast.success("Reel deleted permanently.", { id: toastId });
                              setIsDeleteModalOpen(false);
                              fetchReels();
                    } else {
                              toast.error(res.error || "Delete failed.", { id: toastId });
                    }
                    setIsDeleting(false);
          };

          // Status Badge Helper
          const getStatusBadge = (status: string) => {
                    switch (status) {
                              case "COMPLETED": return <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> {status}</span>;
                              case "GENERATING": return <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Loader2 className="w-3 h-3 animate-spin" /> {status}</span>;
                              default: return <span className="bg-destructive/10 text-destructive px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> {status}</span>;
                    }
          };

          return (
                    <div className="w-full max-w-7xl mx-auto space-y-6">

                              {/* Header */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                                  <h2 className="text-3xl font-semibold text-foreground tracking-tight">Observer Dashboard</h2>
                                                  <p className="text-sm text-muted-foreground mt-1">Monitor, moderate, and manage all generated reels and scenes.</p>
                                        </div>
                              </div>

                              <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">

                                        {/* TOP CONTROLS */}
                                        <div className="p-4 border-b border-border/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-muted/5 shrink-0">
                                                  <div className="flex items-center gap-3 w-full lg:w-[350px] bg-background border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
                                                            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                                                            <Input
                                                                      placeholder="Search topic, user, or reel ID..."
                                                                      value={searchQuery}
                                                                      onChange={(e) => setSearchQuery(e.target.value)}
                                                                      className="border-none bg-transparent shadow-none focus-visible:ring-0 h-8 px-2 text-sm w-full placeholder:text-xs placeholder:text-muted-foreground"
                                                            />
                                                  </div>


                                                  <div className="flex bg-muted/50 p-1 rounded-xl w-full lg:w-auto overflow-x-auto custom-scrollbar shrink-0">
                                                            {['COMPLETED', 'PUBLIC', 'PRIVATE', 'GENERATING', 'FAILED','ALL'].map((status) => (
                                                                      <Button
                                                                                variant="ghost"
                                                                                size="lg"
                                                                                key={status}
                                                                                onClick={() => setStatusFilter(status)}
                                                                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${statusFilter === status ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                                                                                          }`}
                                                                      >
                                                                                {status}
                                                                      </Button>
                                                            ))}
                                                  </div>
                                        </div>

                                        {/* DATA LIST */}
                                        <div className="flex-grow flex flex-col bg-background min-h-[450px]">
                                                  {isLoading ? (
                                                            <div className="flex-grow flex justify-center items-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin" /></div>
                                                  ) : filteredReels.length === 0 ? (
                                                            <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground text-center p-8">
                                                                      <Clapperboard className="w-12 h-12 mb-4 opacity-20" />
                                                                      <p>No reels found matching your criteria.</p>
                                                            </div>
                                                  ) : (
                                                            <>
                                                                      {/* 💻 DESKTOP VIEW: TABLE */}
                                                                      <div className="hidden lg:block w-full overflow-x-auto flex-grow">
                                                                                <table className="w-full text-sm text-left">
                                                                                          <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                                                                                                    <tr>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Reel Details</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Stats</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                                                                                                    </tr>
                                                                                          </thead>
                                                                                          <tbody className="divide-y divide-border/50">
                                                                                                    {paginatedReels.map((reel) => (
                                                                                                              <tr key={reel.id} className="hover:bg-muted/5 transition-colors bg-background">
                                                                                                                        <td className="px-6 py-4 align-middle">
                                                                                                                                  <div className="flex items-center gap-3">
                                                                                                                                            <div className="w-12 h-16 bg-black/5 rounded-md overflow-hidden shrink-0 border border-border/50 flex items-center justify-center relative">
                                                                                                                                                      {reel.scenes?.[0]?.imagePath ? (
                                                                                                                                                                <img src={reel.scenes[0].imagePath} className="w-full h-full object-cover" alt="thumbnail" />
                                                                                                                                                      ) : (
                                                                                                                                                                <Video className="w-5 h-5 text-muted-foreground/30" />
                                                                                                                                                      )}
                                                                                                                                                      {reel.isPublic && reel.status === "COMPLETED" && (
                                                                                                                                                                <div className="absolute top-1 right-1 bg-background/80 p-0.5 rounded-sm"><Globe className="w-2.5 h-2.5 text-primary" /></div>
                                                                                                                                                      )}
                                                                                                                                            </div>
                                                                                                                                            <div className="max-w-[300px]">
                                                                                                                                                      <p className="font-semibold text-foreground line-clamp-1">{reel.topic}</p>
                                                                                                                                                      <p className="text-xs text-muted-foreground truncate">{reel.user?.email || "Unknown User"}</p>
                                                                                                                                                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1">{reel.style}</p>
                                                                                                                                            </div>
                                                                                                                                  </div>
                                                                                                                        </td>
                                                                                                                        <td className="px-4 py-4 align-middle">
                                                                                                                                  <div className="flex flex-col gap-2">
                                                                                                                                            {getStatusBadge(reel.status)}
                                                                                                                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 px-3"><Clock className="w-3 h-3" /> {new Date(reel.createdAt).toLocaleDateString()}</p>
                                                                                                                                  </div>
                                                                                                                        </td>
                                                                                                                        <td className="px-6 py-4 align-middle">
                                                                                                                                  <div className="flex flex-col gap-1.5">
                                                                                                                                            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md w-fit">
                                                                                                                                                      <Zap className="w-3.5 h-3.5" /> {reel.totalCreditsSpent}
                                                                                                                                            </span>
                                                                                                                                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md w-fit">
                                                                                                                                                      <ImageIcon className="w-3.5 h-3.5" /> {reel.scenes?.length || 0} Scenes
                                                                                                                                            </span>
                                                                                                                                  </div>
                                                                                                                        </td>
                                                                                                                        <td className="px-6 py-4 align-middle text-right">
                                                                                                                                  <div className="flex items-center justify-end gap-2">

                                                                                                                                            {/* ⚡ Toggle Button only shows for COMPLETED reels */}
                                                                                                                                            {reel.status === "COMPLETED" && (
                                                                                                                                                      <Button
                                                                                                                                                                variant="ghost"
                                                                                                                                                                size="icon"
                                                                                                                                                                onClick={() => { setReelToToggle(reel); setIsVisibilityModalOpen(true); }}
                                                                                                                                                                className={`rounded-full h-8 w-8 cursor-pointer ${reel.isPublic ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground'}`}
                                                                                                                                                                title={reel.isPublic ? "Currently Public" : "Currently Private"}
                                                                                                                                                      >
                                                                                                                                                                {reel.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                                                                                                      </Button>
                                                                                                                                            )}

                                                                                                                                            <Button variant="ghost" size="icon" onClick={() => { setReelToDelete(reel); setIsDeleteModalOpen(true); }} className="rounded-full h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer">
                                                                                                                                                      <Trash2 className="w-4 h-4" />
                                                                                                                                            </Button>

                                                                                                                                            {reel.status === "COMPLETED" && (
                                                                                                                                                      <Button variant="default" size="sm" onClick={() => { setSelectedReel(reel); setIsViewModalOpen(true); }} className="h-8 rounded-full px-4 text-xs cursor-pointer shadow-sm">
                                                                                                                                                                <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Deep Dive
                                                                                                                                                      </Button>
                                                                                                                                            )}
                                                                                                                                  </div>
                                                                                                                        </td>
                                                                                                              </tr>
                                                                                                    ))}
                                                                                          </tbody>
                                                                                </table>
                                                                      </div>

                                                                      {/* 📱 MOBILE VIEW: CARDS */}
                                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden">
                                                                                {paginatedReels.map((reel) => (
                                                                                          <div key={reel.id} className="border border-border/50 rounded-2xl bg-card hover:bg-muted/10 transition-colors shadow-sm overflow-hidden flex flex-col">
                                                                                                    {/* Card Header */}
                                                                                                    <div className="p-4 border-b border-border/50 flex justify-between items-start bg-muted/20">
                                                                                                              <div>
                                                                                                                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">{reel.style}</p>
                                                                                                                        {getStatusBadge(reel.status)}
                                                                                                              </div>

                                                                                                              {/* ⚡ Toggle Button only shows for COMPLETED reels */}
                                                                                                              {reel.status === "COMPLETED" && (
                                                                                                                        <button
                                                                                                                                  onClick={() => { setReelToToggle(reel); setIsVisibilityModalOpen(true); }}
                                                                                                                                  className={`p-2 rounded-full transition-colors cursor-pointer ${reel.isPublic ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                                                                                                                                  title={reel.isPublic ? "Currently Public" : "Currently Private"}
                                                                                                                        >
                                                                                                                                  {reel.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                                                                        </button>
                                                                                                              )}
                                                                                                    </div>

                                                                                                    {/* Card Body */}
                                                                                                    <div className="p-4 flex-grow space-y-3">
                                                                                                              <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">{reel.topic}</h3>
                                                                                                              <div className="space-y-1.5 pt-2">
                                                                                                                        <p className="text-xs text-muted-foreground truncate"><span className="font-medium text-foreground">User:</span> {reel.user?.email || "Unknown"}</p>
                                                                                                                        <p className="text-[10px] text-muted-foreground font-mono"><span className="font-sans font-medium text-foreground">ID:</span> {reel.id.substring(0, 8)}...</p>
                                                                                                              </div>
                                                                                                              <div className="flex items-center gap-3 pt-2">
                                                                                                                        <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                                                                                                                  <Zap className="w-3.5 h-3.5" /> {reel.totalCreditsSpent}
                                                                                                                        </span>
                                                                                                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                                                                                                                  <ImageIcon className="w-3.5 h-3.5" /> {reel.scenes?.length || 0} Scenes
                                                                                                                        </span>
                                                                                                              </div>
                                                                                                    </div>

                                                                                                    {/* Card Footer Actions */}
                                                                                                    <div className="p-3 border-t border-border/50 bg-muted/5 flex items-center justify-between">
                                                                                                              <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(reel.createdAt).toLocaleDateString()}</p>
                                                                                                              <div className="flex gap-2">
                                                                                                                        <Button variant="ghost" size="sm" onClick={() => { setReelToDelete(reel); setIsDeleteModalOpen(true); }} className="h-8 w-8 p-0 rounded-full text-destructive hover:bg-destructive/10 cursor-pointer">
                                                                                                                                  <Trash2 className="w-4 h-4" />
                                                                                                                        </Button>
                                                                                                                        {reel.status === "COMPLETED" && (
                                                                                                                                  <Button variant="default" size="sm" onClick={() => { setSelectedReel(reel); setIsViewModalOpen(true); }} className="h-8 rounded-full px-4 text-xs cursor-pointer shadow-sm">
                                                                                                                                            <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Deep Dive
                                                                                                                                  </Button>
                                                                                                                        )}
                                                                                                              </div>
                                                                                                    </div>
                                                                                          </div>
                                                                                ))}
                                                                      </div>
                                                            </>
                                                  )}
                                        </div>

                                        {/* PAGINATION CONTROLS */}
                                        <div className="mt-auto p-4 border-t border-border/50 bg-muted/5 flex items-center justify-between shrink-0">
                                                  <p className="text-xs text-muted-foreground font-medium">
                                                            Showing <span className="text-foreground">{filteredReels.length === 0 ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredReels.length)}</span>
                                                  </p>
                                                  <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full cursor-pointer">
                                                                      <ChevronLeft className="w-4 h-4" />
                                                            </Button>
                                                            <div className="text-xs font-semibold px-2">{currentPage} / {totalPages || 1}</div>
                                                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="w-8 h-8 rounded-full cursor-pointer">
                                                                      <ChevronRight className="w-4 h-4" />
                                                            </Button>
                                                  </div>
                                        </div>
                              </div>

                              {/* ⚡ MODAL 1: REEL DEEP DIVE & VIDEO PLAYER */}
                              <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                                        <DialogContent className="w-[70vh] h-[80vh] p-0 overflow-hidden rounded-2xl bg-background border-border/50 flex flex-col">
                                                  <DialogTitle className="sr-only">Reel Overview</DialogTitle>
                                                  <DialogDescription className="sr-only">View video and scenes breakdown.</DialogDescription>

                                                  {selectedReel && (
                                                            <>
                                                                      {/* Header */}
                                                                      <div className="bg-muted/30 p-4 sm:p-6 border-b border-border/50 flex justify-between items-start shrink-0 relative  shadow-sm">
                                                                                <div className="pr-10">
                                                                                          <div className="flex items-center gap-2 mb-2">
                                                                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">{selectedReel.style}</span>
                                                                                                    {getStatusBadge(selectedReel.status)}
                                                                                          </div>
                                                                                </div>

                                                                      </div>

                                                                      {/* ⚡ Content: Flex Layout fixed with inline styles for reliable rendering */}
                                                                      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-background">
                                                                                <div className="flex flex-col gap-6 lg:gap-8">

                                                                                          {/* 📱 LEFT SIDE: Premium Mobile Frame & Custom Player */}
                                                                                          <div className="w-full lg:w-auto flex justify-center shrink-0">
                                                                                                    {selectedReel.videoUrl ? (
                                                                                                              <ReelCard selectedReel={selectedReel} />
                                                                                                    ) : (
                                                                                                              <div
                                                                                                                        className="relative bg-muted/20 rounded-[2.5rem] border-[12px] border-muted/40 border-dashed shadow-sm flex flex-col items-center justify-center text-muted-foreground"
                                                                                                                        style={{ width: '280px', height: '498px', flexShrink: 0 }}
                                                                                                              >
                                                                                                                        <Video className="w-12 h-12 mb-4 opacity-20" />
                                                                                                                        <p className="text-sm px-6 text-center">Final video is not available.</p>
                                                                                                              </div>
                                                                                                    )}
                                                                                          </div>

                                                                                          {/* 📜 RIGHT SIDE: Details & Scenes */}
                                                                                          <div className="flex-1 space-y-6 min-w-0">

                                                                                                    {/* Stats Blocks */}
                                                                                                    <div className="grid grid-cols-2 gap-4">
                                                                                                              <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
                                                                                                                        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Total Scenes</p>
                                                                                                                        <h3 className="text-2xl font-bold">{selectedReel.scenes?.length || 0}</h3>
                                                                                                              </div>
                                                                                                              <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
                                                                                                                        <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Cost</p>
                                                                                                                        <h3 className="text-2xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> {selectedReel.totalCreditsSpent}</h3>
                                                                                                              </div>
                                                                                                    </div>

                                                                                                    {/* Topic Box */}
                                                                                                    <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
                                                                                                              <p className="text-xs text-muted-foreground mb-2 uppercase font-bold tracking-wider">Topic / Subject</p>
                                                                                                              <p className="text-sm text-foreground leading-relaxed">{selectedReel.topic}</p>
                                                                                                    </div>

                                                                                                    {/* Scenes Breakdown */}
                                                                                                    <div className="pt-2">
                                                                                                              <h4 className="font-semibold text-foreground border-b border-border/50 pb-2 mb-4 flex items-center gap-2 sticky top-0 bg-background z-10 pt-2">
                                                                                                                        <Clapperboard className="w-4 h-4 text-primary" /> Scenes Breakdown
                                                                                                              </h4>
                                                                                                              <div className="space-y-4 pb-4">
                                                                                                                        {selectedReel.scenes?.map((scene: any, index: number) => (
                                                                                                                                  <div key={scene.id} className="bg-muted/10 border border-border/50 rounded-xl p-4 flex flex-col xl:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow">

                                                                                                                                            {/* Scene Image */}
                                                                                                                                            <div className="w-full xl:w-28 aspect-video xl:aspect-[9/16] bg-black/5 rounded-lg overflow-hidden shrink-0 border border-border/50 relative">
                                                                                                                                                      {scene.imagePath ? (
                                                                                                                                                                <img src={scene.imagePath} alt={`Scene ${index + 1}`} className="w-full h-full object-cover" />
                                                                                                                                                      ) : (
                                                                                                                                                                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground/30" /></div>
                                                                                                                                                      )}
                                                                                                                                                      <div className="absolute top-1.5 left-1.5 bg-background/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">#{scene.order}</div>
                                                                                                                                            </div>

                                                                                                                                            {/* Scene Details */}
                                                                                                                                            <div className="flex-1 space-y-3 min-w-0">
                                                                                                                                                      <div>
                                                                                                                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5"><ImageIcon className="w-3 h-3" /> Visual Prompt</p>
                                                                                                                                                                <p className="text-xs text-foreground bg-background p-2.5 rounded-lg border border-border/50 leading-relaxed line-clamp-3">{scene.visualPrompt || "No prompt available."}</p>
                                                                                                                                                      </div>
                                                                                                                                                      <div>
                                                                                                                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5"><Music className="w-3 h-3" /> Audio Script ({scene.audioDuration || 0}s)</p>
                                                                                                                                                                <p className="text-xs text-foreground bg-background p-2.5 rounded-lg border border-border/50 leading-relaxed italic border-l-2 border-l-primary">{scene.audioText || "No audio text."}</p>
                                                                                                                                                      </div>
                                                                                                                                            </div>
                                                                                                                                  </div>
                                                                                                                        ))}
                                                                                                              </div>
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                            </>
                                                  )}
                                        </DialogContent>
                              </Dialog>


                              {/* ⚡ MODAL 2: VISIBILITY TOGGLE CONFIRMATION */}
                              <Dialog open={isVisibilityModalOpen} onOpenChange={setIsVisibilityModalOpen}>
                                        <DialogContent className="w-[95vw] max-w-[400px] p-6 rounded-2xl bg-background border-border/50 [&>button]:hidden">
                                                  <DialogTitle className="text-xl font-semibold text-center mt-2 flex flex-col items-center gap-3">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${reelToToggle?.isPublic ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                                      {reelToToggle?.isPublic ? <Lock className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                                                            </div>
                                                            {reelToToggle?.isPublic ? "Make Reel Private?" : "Make Reel Public?"}
                                                  </DialogTitle>
                                                  <DialogDescription className="text-center text-sm text-muted-foreground mt-2">
                                                            {reelToToggle?.isPublic
                                                                      ? "This reel will be removed from the public gallery and will only be visible to its creator."
                                                                      : "This reel will be featured in the public gallery for everyone to see."}
                                                  </DialogDescription>

                                                  <div className="flex justify-center gap-3 mt-8 w-full">
                                                            <Button variant="outline" onClick={() => setIsVisibilityModalOpen(false)} className="rounded-full flex-1 cursor-pointer">Cancel</Button>
                                                            <Button onClick={confirmToggleVisibility} disabled={isToggling} className="rounded-full flex-1 cursor-pointer">
                                                                      {isToggling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Confirm
                                                            </Button>
                                                  </div>
                                        </DialogContent>
                              </Dialog>

                              {/* ⚡ MODAL 3: DELETE CONFIRMATION */}
                              <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                                        <DialogContent className="w-[95vw] max-w-[400px] p-6 rounded-2xl bg-background border-border/50 [&>button]:hidden">
                                                  <DialogTitle className="text-xl font-semibold text-center mt-2 flex flex-col items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                                                                      <Trash2 className="w-6 h-6" />
                                                            </div>
                                                            Delete Reel?
                                                  </DialogTitle>
                                                  <DialogDescription className="text-center text-sm text-muted-foreground mt-2">
                                                            This will permanently delete the reel <b>"{reelToDelete?.topic}"</b> and all its associated media (images/audio). This action cannot be undone.
                                                  </DialogDescription>

                                                  <div className="flex justify-center gap-3 mt-8 w-full">
                                                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded-full flex-1 cursor-pointer">Cancel</Button>
                                                            <Button onClick={confirmDelete} disabled={isDeleting} className="rounded-full flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer">
                                                                      {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Delete Permanently
                                                            </Button>
                                                  </div>
                                        </DialogContent>
                              </Dialog>

                    </div>
          );
}