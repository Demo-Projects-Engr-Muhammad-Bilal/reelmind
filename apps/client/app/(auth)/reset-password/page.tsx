"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import BrandingPanel from "@/components/layout/BrandingPanel";

function ResetPasswordContent() {
          const searchParams = useSearchParams();
          const email = searchParams.get("email") || "";

          return (
                    <div className="bg-background text-foreground min-h-screen selection:bg-primary/30 overflow-hidden font-body">
                              <main className="flex flex-col md:flex-row min-h-screen w-full relative">

                                        {/* 1. Left Branding Section */}
                                        <section className="hidden md:flex md:w-[42%] relative flex-col justify-between p-12 overflow-hidden bg-background border-r border-border/10">
                                                  <BrandingPanel mode="forgot-password" />

                                                  {/* Signature Curve with Primary Glow */}
                                                  <div className="absolute top-0 right-[-2px] h-full w-12 z-20 pointer-events-none text-primary/30">
                                                            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
                                                                      <path
                                                                                d="M0 0 Q 80 250, 20 500 T 0 1000"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                className="drop-shadow-[0_0_8px_currentColor]"
                                                                      />
                                                            </svg>
                                                  </div>
                                        </section>

                                        {/* 2. Right Form Section */}
                                        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-24 relative bg-background">
                                                  {/* Ambient Background Glow */}
                                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

                                                  <div className="w-full max-w-md relative z-10">
                                                            <ResetPasswordForm email={email} />
                                                  </div>
                                        </section>
                              </main>
                    </div>
          );
}

// ✅ Suspense is required for build stability with useSearchParams
export default function ResetPasswordPage() {
          return (
                    <Suspense fallback={<div className="min-h-screen bg-background" />}>
                              <ResetPasswordContent />
                    </Suspense>
          );
}