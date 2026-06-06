"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueUsageChart({ chartData }: { chartData: any[] }) {
          // Optional: You can use next-themes here to detect if the user is in dark mode
          // But relying on Tailwind's CSS variables correctly applied usually handles it.

          return (
                    <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm flex flex-col h-96">
                              <div className="mb-6">
                                        <h3 className="text-base font-semibold text-foreground tracking-tight">Usage Trend</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">Tracking digital asset utilization over 7 days.</p>
                              </div>

                              <div className="flex-1 w-full text-xs">
                                        {chartData && chartData.length > 0 ? (
                                                  <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                                      <defs>
                                                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                                                          {/* FIX: Adjusted stop opacity to ensure it stays visible on dark backgrounds without blending into black */}
                                                                                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                                                                                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                                                                                </linearGradient>
                                                                      </defs>

                                                                      {/* FIX: Increased grid opacity slightly for better dark mode visibility */}
                                                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />

                                                                      <XAxis
                                                                                dataKey="day"
                                                                                tickLine={false}
                                                                                axisLine={false}
                                                                                stroke="hsl(var(--foreground) / 0.6)"
                                                                                tick={{ fill: 'hsl(var(--foreground) / 0.6)' }}
                                                                                dy={10}
                                                                      />

                                                                      <YAxis
                                                                                tickLine={false}
                                                                                axisLine={false}
                                                                                stroke="hsl(var(--foreground) / 0.6)"
                                                                                tick={{ fill: 'hsl(var(--foreground) / 0.6)' }}
                                                                                dx={-10}
                                                                      />

                                                                      <Tooltip
                                                                                contentStyle={{
                                                                                          backgroundColor: "hsl(var(--card))",
                                                                                          borderColor: "hsl(var(--border))",
                                                                                          borderRadius: "12px",
                                                                                          color: "hsl(var(--foreground))",
                                                                                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                                                                                }}
                                                                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                                                      />

                                                                      <Area
                                                                                type="monotone"
                                                                                dataKey="revenue"
                                                                                stroke="hsl(var(--primary))"
                                                                                strokeWidth={3} // Made the line slightly thicker so it pops out more
                                                                                fillOpacity={1}
                                                                                fill="url(#colorRevenue)"
                                                                      />
                                                            </AreaChart>
                                                  </ResponsiveContainer>
                                        ) : (
                                                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No chart data available.</div>
                                        )}
                              </div>
                    </div>
          );
}