"use client";

import React from "react";

export default function ReelCardSkeleton() {
          return (
                    // ⚡ bg-[#0a0a0a] ko 'bg-card' aur white/10 ko 'border-border/50' kar diya
                    <div className="relative aspect-[9/16] overflow-hidden border border-border/50 bg-card shadow-lg rounded-3xl">

                              {/* ⚡ 1. Main Video Shimmer Background (white/50 ki jagah bg-muted/40) */}
                              <div className="absolute inset-0 bg-muted/40 animate-pulse"></div>

                              {/* ⚡ 2. Bottom Dark Gradient Overlay (black ki jagah background variables) */}
                              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent pointer-events-none"></div>

                              {/* ⚡ 3. Top-Right Play Button Placeholder (bg-muted) */}
                              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-muted animate-pulse backdrop-blur-md"></div>

                              {/* ⚡ 4. Bottom Content Skeleton */}
                              <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 flex flex-col justify-end z-10">

                                        {/* Badges Row (Left Badge & Right Views) */}
                                        <div className="flex items-center justify-between w-full mb-3">
                                                  {/* Tag/Niche Badge Placeholder */}
                                                  <div className="h-6 w-28 rounded-full bg-muted animate-pulse"></div>

                                                  {/* Views Placeholder */}
                                                  <div className="h-5 w-16 rounded-full bg-muted animate-pulse"></div>
                                        </div>

                                        {/* Title Placeholder */}
                                        <div className="h-6 w-3/4 rounded-lg bg-muted animate-pulse"></div>
                              </div>

                    </div>
          );
}