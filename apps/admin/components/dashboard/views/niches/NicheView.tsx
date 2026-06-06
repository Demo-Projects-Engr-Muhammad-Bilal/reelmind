"use client";

import { X, Terminal, FileText, Image as ImageIcon, Music, Video, Fingerprint, Settings, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileFramePreview, CustomAudioPlayer } from "@/components/dashboard/ui/MediaPreviews";

interface NicheViewProps {
          niche: any;
          onClose: () => void;
}

export default function NicheView({ niche, onClose }: NicheViewProps) {
          if (!niche) return null;

          return (
                    <div className="w-full max-w-full mx-auto p-4 sm:p-6 relative overflow-x-hidden flex flex-col h-full max-h-[90vh]">
                              {/* Sticky Header */}
                              <div className="flex justify-between items-start border-b border-border/50 pb-4 sm:pb-6 shrink-0 sticky top-0 bg-background/95 backdrop-blur-xl z-10 -mx-4 px-4 sm:-mx-6 sm:px-6">
                                        <div>
                                                  <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                                                            {niche.name}
                                                  </h2>
                                                  <div className="flex items-center gap-2 mt-2">
                                                            <Fingerprint className="w-4 h-4 text-primary" />
                                                            <span className="text-xs sm:text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md tracking-wider">
                                                                      {niche.key}
                                                            </span>
                                                  </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={onClose} className="cursor-pointer hover:bg-muted/50 transition-colors border border-primary rounded-full z-100">
                                                  <X className="w-5 h-5" />
                                        </Button>
                              </div>

                              {/* Scrollable Content */}
                              <div className="space-y-6 sm:space-y-8 py-6 overflow-y-auto flex-grow custom-scrollbar">

                                        {/* Core AI Instructions */}
                                        <div className="space-y-6">
                                                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                                            <Terminal className="w-5 h-5 text-muted-foreground" />
                                                            <h3 className="text-lg font-medium">Core Intelligence</h3>
                                                  </div>
                                                  <div className="space-y-2">
                                                            <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">System Prompt</label>
                                                            <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                                      {niche.systemPrompt}
                                                            </div>
                                                  </div>
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                            <div className="space-y-2">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">Hooks Instruction</label>
                                                                      <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                                                {niche.hooksInstruction}
                                                                      </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">Expansion Instruction</label>
                                                                      <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                                                {niche.expansionInstruction}
                                                                      </div>
                                                            </div>
                                                  </div>
                                        </div>

                                        {/* Media Generation Logic */}
                                        <div className="space-y-6 pt-4">
                                                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                                            <h3 className="text-lg font-medium">Media Instructions</h3>
                                                  </div>
                                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                                            <div className="space-y-2">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image Logic</label>
                                                                      <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground min-h-[80px]">
                                                                                {niche.imageInstruction || <span className="italic opacity-50">Not specified</span>}
                                                                      </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1"><Music className="w-3 h-3" /> Audio Tone</label>
                                                                      <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground min-h-[80px]">
                                                                                {niche.audioInstruction || <span className="italic opacity-50">Not specified</span>}
                                                                      </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1"><Video className="w-3 h-3" /> Video Style</label>
                                                                      <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground min-h-[80px]">
                                                                                {niche.videoInstruction || <span className="italic opacity-50">Not specified</span>}
                                                                      </div>
                                                            </div>
                                                  </div>
                                        </div>

                                        {/* ⚡ UPDATED: Environmental Settings with Beautiful Media Previews */}
                                        <div className="space-y-6 pt-4">
                                                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                                            <Settings className="w-5 h-5 text-muted-foreground" />
                                                            <h3 className="text-lg font-medium">Environmental Configuration</h3>
                                                  </div>

                                                  <div className="flex flex-col gap-6 lg:gap-10">
                                                            {/* Left: Audio Tracks */}
                                                            <div className="flex-1 space-y-4">
                                                                      <div className="flex items-center justify-between">
                                                                                <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">BGM Tracks ({niche.bgmUrls?.length || 0})</label>
                                                                                <div className="flex items-center gap-2 bg-muted/30 px-2 py-1 rounded-md border border-border/50">
                                                                                          <Volume2 className="w-3 h-3 text-muted-foreground" />
                                                                                          <span className="text-xs font-mono text-primary font-bold">{niche.bgmVolume?.toFixed(2) || "0.20"}</span>
                                                                                </div>
                                                                      </div>

                                                                      {niche.bgmUrls?.length > 0 ? (
                                                                                <div className="space-y-3">
                                                                                          {niche.bgmUrls.map((url: string, i: number) => (
                                                                                                    <CustomAudioPlayer key={i} url={url} readOnly={true} />
                                                                                          ))}
                                                                                </div>
                                                                      ) : (
                                                                                <p className="text-sm text-muted-foreground italic opacity-50 p-4 border border-dashed border-border/50 rounded-xl text-center">No audio tracks configured.</p>
                                                                      )}
                                                            </div>

                                                            {/* Right: Mobile Image Preview */}
                                                            <div className="flex flex-col gap-3">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ">Visual Fallback Preview</label>
                                                                      <MobileFramePreview url={niche.fallbackUrl} alt="Fallback Preview" />
                                                            </div>
                                                  </div>
                                        </div>

                              </div>
                    </div>
          );
}