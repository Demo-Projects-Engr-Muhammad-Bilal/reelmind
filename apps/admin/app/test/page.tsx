"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function UITestPage() {
          return (
                    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 p-4 sm:p-8 relative overflow-hidden">

                              {/* Theme Toggle */}
                              <div className="absolute top-3 right-4 z-50">
                                        <ThemeToggle />
                              </div>

                              {/* Background Decorative Elements */}
                              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
                              <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

                              <div className="mb-10 text-center relative z-10">
                                        <h1 className="text-3xl font-bold text-foreground">UI State Testing</h1>
                                        <p className="text-muted-foreground mt-2">Previewing Invalid Token and Success states</p>
                              </div>

                              <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

                                        {/* ========================================= */}
                                        {/* STATE 1: INVALID / EXPIRED TOKEN UI       */}
                                        {/* ========================================= */}
                                        <div className="w-full bg-card/95 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                                                  <div className="h-1.5 w-full bg-gradient-to-r from-destructive/40 via-destructive to-destructive/40"></div>
                                                  <div className="p-8 sm:p-10">

                                                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                                                      {/* Icon with Glow & More Inner Space */}
                                                                      <div className="flex  flex-col items-center justify-center">
                                                                                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                                                          <ShieldAlert className="w-7 h-7 text-primary" />
                                                                                </div>
                                                                      </div>
                                                                      <div className="flex flex-col space-y-4">
                                                                                <h2 className="text-2xl font-bold text-foreground tracking-tight">Link Expired or Invalid</h2>
                                                                      <p className="text-sm text-muted-foreground  leading-relaxed">
                                                                                          Your secure recovery token is missing or has expired. Please request a new authorization link to continue.
                                                                      </p>
                                                            </div>

                                                                      {/* ⚡ BUTTON VARIANT CHANGED TO "link" */}
                                                                      <Button asChild variant="link" className="mt-4 h-12 w-full text-base flex items-center justify-center gap-2 group">
                                                                                <Link href="//forgot-password">
                                                                                          Request New Link
                                                                                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                                                </Link>
                                                                      </Button>
                                                            </div>

                                                  </div>
                                        </div>

                                        {/* ========================================= */}
                                        {/* STATE 2: SUCCESS UI                       */}
                                        {/* ========================================= */}
                                        <div className="w-full bg-card/95 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                                                  <div className="h-1.5 w-full bg-gradient-to-r from-green-500/40 via-green-500 to-green-500/40"></div>
                                                  <div className="p-8 sm:p-10">

                                                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                                                      {/* Icon with Glow & More Inner Space */}
                                                                      <div className="flex  flex-col items-center justify-center">
                                                                                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                                                          <ShieldCheck className="w-7 h-7 text-primary" />
                                                                                </div>
                                                                      </div>

                                                                      <div className="flex flex-col space-y-4">
                                                                                <h2 className="text-2xl font-bold text-foreground tracking-tight">Access Secured!</h2>
                                                                                <p className="text-sm text-muted-foreground  leading-relaxed">
                                                                                          Your commander profile has been successfully updated. You can now access the gateway with your new credentials.
                                                                                </p>
                                                                      </div>

                                                                      {/* ⚡ BUTTON VARIANT CHANGED TO "link" */}
                                                                      <Button asChild variant="link" className="mt-4 h-12 w-full text-base flex items-center justify-center gap-2 group">
                                                                                <Link href="/">
                                                                                          Return to Login Gateway
                                                                                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                                                </Link>
                                                                      </Button>
                                                            </div>

                                                  </div>
                                        </div>

                              </div>
                    </div>
          );
}