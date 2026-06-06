"use client";

import React from "react";

export default function PricingCardSkeleton() {
          return (
                    <div className="relative flex flex-col p-8 rounded-3xl bg-card border border-border/40 shadow-sm h-full w-full">
                              {/* ⚡ Dynamic Title Skeleton */}
                              <div className="h-7 w-3/5 bg-sidebar/80 rounded-md animate-pulse mb-6"></div>

                              {/* ⚡ Dynamic Price & Credits Skeleton */}
                              <div className="flex items-baseline gap-2 mb-8">
                                        <div className="h-14 w-24 bg-sidebar/80 rounded-lg animate-pulse"></div>
                                        <div className="h-4 w-28 bg-sidebar/80 rounded-md animate-pulse"></div>
                              </div>

                              {/* ⚡ Features List Skeleton (Simulating 4 items) */}
                              <div className="grow mb-10 space-y-5">
                                        {[1, 2, 3, 4].map((i) => (
                                                  <div key={i} className="flex items-center gap-3">
                                                            <div className="w-5 h-5 rounded-full bg-sidebar/80 animate-pulse shrink-0"></div>
                                                            <div className={`h-4 bg-sidebar/80 rounded-md animate-pulse ${i % 2 === 0 ? 'w-4/5' : 'w-full'}`}></div>
                                                  </div>
                                        ))}
                              </div>

                              {/* ⚡ Static Button Box Skeleton */}
                              <div className="mt-auto h-12 w-full bg-sidebar/80 rounded-xl animate-pulse"></div>
                    </div>
          );
}