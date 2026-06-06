"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";
import BrandingPanel from "@/components/layout/BrandingPanel";
import StatusCard from "@/components/auth/StatusCard";
import { useVerifyEmail } from "@/hooks/auth/use-verify-email";

function VerifyEmailContent() {
          const searchParams = useSearchParams();
          const token = searchParams.get("token");
          const { status } = useVerifyEmail(token);

          return (
                    <div className="bg-background text-foreground min-h-screen flex flex-col md:flex-row font-body overflow-hidden">
                              {/* 1. Left Branding Section - Matching Main Auth */}
                              <section className="hidden md:flex md:w-[42%] relative p-12 bg-background border-r border-border/10">
                                        <BrandingPanel mode="login" />

                                        {/* Signature Curve */}
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

                              {/* 2. Right Content Section */}
                              <section className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-background">
                                        {/* Ambience Glow */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

                                        <div className="w-full max-w-[500px] relative z-10">
                                                  {status === "loading" && (
                                                            <StatusCard
                                                                      status="loading"
                                                                      icon={Loader2}
                                                                      title="Authenticating..."
                                                                      description="Connecting your account to the AIreelgen pipeline. Please wait while we verify your credentials."
                                                            />
                                                  )}

                                                  {status === "success" && (
                                                            <StatusCard
                                                                      status="success"
                                                                      icon={CheckCircle2}
                                                                      title="ACCESS GRANTED"
                                                                      description="Verification successful. Your workspace is now fully synchronized and ready for deployment."
                                                                      actionLabel="Sign In to Dashboard"
                                                                      onAction={() => window.location.href = "/auth?mode=login"}
                                                            />
                                                  )}

                                                  {status === "error" && (
                                                            <StatusCard
                                                                      status="error"
                                                                      icon={ShieldAlert}
                                                                      title="LINK EXPIRED"
                                                                      description="The verification token has timed out or is invalid. For security, please restart the signup process."
                                                                      actionLabel="Restart Signup"
                                                                      onAction={() => window.location.href = "/auth?mode=signup"}
                                                            />
                                                  )}
                                        </div>
                              </section>
                    </div>
          );
}

// ✅ Suspense is required for useSearchParams in Next.js
export default function VerifyEmailPage() {
          return (
                    <Suspense fallback={<div className="min-h-screen bg-background" />}>
                              <VerifyEmailContent />
                    </Suspense>
          );
}