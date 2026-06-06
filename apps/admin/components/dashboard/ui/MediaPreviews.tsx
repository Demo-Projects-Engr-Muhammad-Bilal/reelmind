"use client";

import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Maximize2, Music, Pause, Play, Trash2, Volume2, X } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

// 📱 1. MOBILE FRAME PREVIEW (For Images with Expand/Collapse Lightbox)
export function MobileFramePreview({ url, alt = "Preview" }: { url: string; alt?: string }) {
          const [hasError, setHasError] = useState(false);
          const [isExpanded, setIsExpanded] = useState(false);

          // Reset error state if URL changes
          useEffect(() => setHasError(false), [url]);

          return (
                    <>
                              {/* 🖼️ Original Thumbnail Frame */}
                              <div className="relative w-24 sm:w-32 aspect-[9/16] bg-black/90 rounded-2xl sm:rounded-3xl border-[4px] sm:border-[6px] border-muted shadow-xl overflow-hidden flex-shrink-0 group">
                                        {url && !hasError && url.startsWith("http") ? (
                                                  <>
                                                            <img
                                                                      src={url}
                                                                      alt={alt}
                                                                      onError={() => setHasError(true)}
                                                                      className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity duration-300"
                                                            />
                                                            {/* Expand Action Button (Shows on Hover) */}
                                                            <button
                                                                      type="button"
                                                                      onClick={() => setIsExpanded(true)}
                                                                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
                                                            >
                                                                      <div className="bg-background/80 backdrop-blur-md p-2.5 rounded-full text-foreground shadow-xl hover:scale-110 transition-transform">
                                                                                <Maximize2 className="w-5 h-5" />
                                                                      </div>
                                                            </button>
                                                  </>
                                        ) : (
                                                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-2 p-2 text-center">
                                                            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                                                            <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider">No Media</span>
                                                  </div>
                                        )}
                                        {/* Screen Glare Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                              </div>

                              {/* 🔍 Expanded Lightbox Overlay */}
                              {isExpanded && url && !hasError && (
                                        <div
                                                  className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-3xl animate-in fade-in duration-200 p-4 sm:p-8"
                                                  onClick={() => setIsExpanded(false)}
                                        >
                                                  {/* ⚡ FIX: Added max-w-content for LG to prevent stretching, kept mobile styles intact */}
                                                  <div
                                                            className="relative flex justify-center items-center h-[70vh] w-[80vw] lg:h-[70vh] lg:w-auto animate-in zoom-in-95 duration-200"
                                                            onClick={(e) => e.stopPropagation()}
                                                  >
                                                            <img
                                                                      src={url}
                                                                      alt={alt}
                                                                      // ⚡ FIX: Object-contain on both mobile and LG to keep ratio perfect
                                                                      className="h-full w-full lg:w-auto object-cover lg:max-w-[90vw] 
                                                                      lg:object-contain rounded-2xl border border-border/50 shadow-2xl"
                                                            />
                                                            <Button
                                                            size="icon-sm"
                                                                      variant="ghost"
                                                                      onClick={() => setIsExpanded(false)}
                                                                      className="absolute -top-3 -right-2 sm:-top-2 sm:-right-2  p-2 shadow-lg text-foreground cursor-pointer  border border-primary rounded-full z-100"
                                                            >
                                                                      <X className="size-4" />
                                                            </Button>
                                                  </div>
                                        </div>
                              )}
                    </>
          );
}

// 🎵 2. CUSTOM AUDIO PLAYER (For BGM)
export function CustomAudioPlayer({ url, onRemove, readOnly = false }: { url: string, onRemove?: () => void, readOnly?: boolean }) {
          const [isPlaying, setIsPlaying] = useState(false);
          const audioRef = useRef<HTMLAudioElement>(null);

          // Extract filename from URL for display
          const fileName = url.split('/').pop()?.split('?')[0] || "Audio Track";

          const togglePlay = () => {
                    if (audioRef.current) {
                              if (isPlaying) {
                                        audioRef.current.pause();
                              } else {
                                        // Pause all other audio elements on the screen before playing this one
                                        const allAudios = document.querySelectorAll('audio');
                                        allAudios.forEach((audioEl) => {
                                                  if (audioEl !== audioRef.current) {
                                                            audioEl.pause();
                                                  }
                                        });

                                        audioRef.current.play();
                              }
                    }
          };

          return (
                    <div className="flex items-center justify-between bg-muted/20 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-border/40 transition-all hover:bg-muted/30">
                              <div className="flex items-center gap-3 overflow-hidden pr-2">
                                        <button
                                                  type="button"
                                                  onClick={togglePlay}
                                                  className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                                        >
                                                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                        </button>
                                        <div className="flex flex-col overflow-hidden">
                                                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">{fileName}</span>
                                                  <div className="flex items-center gap-1.5 mt-0.5">
                                                            <Music className="w-3 h-3 text-muted-foreground" />
                                                            <span className="text-[10px] sm:text-xs text-muted-foreground">Audio Asset</span>
                                                  </div>
                                        </div>
                              </div>

                              <audio
                                        ref={audioRef}
                                        src={url}
                                        onEnded={() => setIsPlaying(false)}
                                        onPause={() => setIsPlaying(false)}
                                        onPlay={() => setIsPlaying(true)}
                                        className="hidden"
                              />

                              {!readOnly && onRemove && (
                                        <button
                                                  type="button"
                                                  onClick={onRemove}
                                                  className="text-destructive/70 hover:text-destructive cursor-pointer hover:bg-destructive/10 p-2 rounded-lg transition-colors shrink-0"
                                        >
                                                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                              )}
                    </div>
          );
}

type Props = {
          url: string;
          alt?: string;
          poster?: string;
          className?: string;
          muted?: boolean; // allow parent to decide
};

export const MobileFrameVideoPreview = forwardRef<HTMLVideoElement, Props>(
          ({ url, alt = "Preview", poster, className = "", muted = false }, ref) => {
                    const localRef = useRef<HTMLVideoElement | null>(null);
                    const [hasError, setHasError] = useState(false);

                    useEffect(() => setHasError(false), [url]);

                    useImperativeHandle(
                              ref,
                              () => localRef.current as HTMLVideoElement,
                              [localRef.current]
                    );

                    const isValidUrl = Boolean(url && url.startsWith("http"));

                    if (!isValidUrl || hasError) {
                              return (
                                        <div className={`relative overflow-hidden bg-black ${className}`}>
                                                  <div className="flex items-center justify-center w-full h-full text-muted-foreground/40">
                                                            <ImageIcon className="w-8 h-8" />
                                                  </div>
                                        </div>
                              );
                    }

                    return (
                              <div className={`relative overflow-hidden ${className}`}>
                                        <video
                                                  ref={localRef}
                                                  src={url}
                                                  poster={poster}
                                                  playsInline
                                                  loop
                                                  muted={muted}
                                                  controls={false}
                                                  onError={() => setHasError(true)}
                                                  aria-label={alt}
                                                  className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                                        />
                              </div>
                    );
          }
);

MobileFrameVideoPreview.displayName = "MobileFrameVideoPreview";
export default MobileFrameVideoPreview;

export function ReelCard({ selectedReel }: { selectedReel: any }) {
          const videoRef = useRef<HTMLVideoElement | null>(null);

          const handleToggle = (container: HTMLDivElement) => {
                    const video = videoRef.current ?? container.querySelector("video");
                    const overlay = container.querySelector<HTMLElement>(".video-overlay");
                    const playIcon = container.querySelector<HTMLElement>(".play-icon");
                    const pauseIcon = container.querySelector<HTMLElement>(".pause-icon");

                    if (!video) return;

                    if (video.paused) {
                              // Ensure audio is enabled when user explicitly plays
                              try {
                                        video.muted = false;
                                        // optional: set volume level
                                        if (typeof video.volume === "number") video.volume = 1.0;
                              } catch (e) {
                                        // ignore if browser blocks; user can unmute manually
                              }

                              video.play();
                              overlay?.classList.add("opacity-0");
                              playIcon?.classList.add("hidden");
                              pauseIcon?.classList.remove("hidden");
                    } else {
                              video.pause();
                              overlay?.classList.remove("opacity-0");
                              playIcon?.classList.remove("hidden");
                              pauseIcon?.classList.add("hidden");
                    }
          };

          // Optional small mute/unmute button inside the frame
          const toggleMuteButton = (e: React.MouseEvent, container: HTMLDivElement) => {
                    e.stopPropagation();
                    const video = videoRef.current ?? container.querySelector("video");
                    if (!video) return;
                    video.muted = !video.muted;
          };

          return (
                    <div className="flex flex-col gap-4">
                              <div
                                        className="relative rounded-3xl overflow-hidden bg-black border-[12px] border-primary shadow-2xl group cursor-pointer"
                                        style={{ width: "280px", height: "498px", flexShrink: 0 }}
                                        onClick={(e) => handleToggle(e.currentTarget as HTMLDivElement)}
                              >
                                        {/* notch */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-muted rounded-b-xl z-20 flex justify-center items-end pb-1 pointer-events-none">
                                                  <div className="w-8 h-1 bg-background/20 rounded-full" />
                                        </div>

                                        {/* Video fills frame, start muted false so audio can play on user click */}
                                        <MobileFrameVideoPreview
                                                  ref={videoRef}
                                                  url={selectedReel.videoUrl}
                                                  poster={selectedReel.scenes?.[0]?.imagePath}
                                                  className="absolute inset-0 w-full h-full"
                                                  muted={false}
                                        />

                                        {/* small mute/unmute control top-right */}
                                        <div
                                                  className="absolute top-3 right-3 z-40"
                                                  onClick={(e) => toggleMuteButton(e, e.currentTarget.parentElement as HTMLDivElement)}
                                        >
                                                  <div className="bg-background/70 p-2 rounded-full shadow">
                                                            {/* Icon will reflect current state if you read videoRef.current.muted in a stateful component.
                This is a simple static button; for dynamic icon, lift state and re-render on mute change. */}
                                                            <Volume2 className="w-5 h-5 text-foreground" />
                                                  </div>
                                        </div>

                                        {/* overlay */}
                                        <div className="video-overlay absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 group-hover:opacity-100 z-30">
                                                  <div className="w-14 h-14 flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-lg backdrop-blur-md transition-transform hover:scale-110">
                                                            <Play className="play-icon w-6 h-6 ml-1 fill-current" />
                                                            <Pause className="pause-icon w-6 h-6 hidden fill-current" />
                                                  </div>
                                        </div>
                              </div>

                              <div>
                                        <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                                                  {selectedReel.topic}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                                  Generated by: {selectedReel.user?.email}
                                        </p>
                              </div>
                    </div>
          );
}
