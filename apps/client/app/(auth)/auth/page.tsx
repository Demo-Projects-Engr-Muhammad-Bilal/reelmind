"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BrandingPanel from "@/components/layout/BrandingPanel";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPassword";
import { ThemeToggle } from "@/components/theme/ThemeToggle";


const fadeConfig = {
          initial: { opacity: 0, x: 20, filter: "blur(10px)" },
          animate: { opacity: 1, x: 0, filter: "blur(0px)" },
          exit: { opacity: 0, x: -20, filter: "blur(10px)" },
          transition: { duration: 0.4, ease: "circOut" as const }
};

function AuthContent() {
          const [authMode, setAuthMode] = useState<"signup" | "login" | "forgot-password">("signup");
          const searchParams = useSearchParams();

          useEffect(() => {
                    const mode = searchParams.get("mode");
                    if (mode === "login") setAuthMode("login");
          }, [searchParams]);

          return (
                    <div className="bg-background text-foreground min-h-screen font-body selection:bg-primary/30 overflow-hidden">
                              
                              {/* Top Animated Line */}
                              <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-50 opacity-50" />

                              <main className="flex flex-col md:flex-row min-h-screen w-full relative">
                                        {/* 1. Left Branding Section */}
                                        <section className="hidden md:flex md:w-[42%] relative flex-col justify-between p-12 bg-background border-r border-border/10">
                                                  <BrandingPanel mode={authMode} />

                                                  {/* Liquid Curve Separator with Primary Glow */}
                                                  <div className="absolute top-0 right-[-2px] h-full w-12 z-20 pointer-events-none">
                                                            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
                                                                      <path
                                                                                d="M0 0 Q 80 250, 20 500 T 0 1000"
                                                                                fill="none"
                                                                                stroke="var(--primary)"
                                                                                strokeWidth="2"
                                                                                strokeOpacity="0.3"
                                                                                className="drop-shadow-[0_0_8px_var(--primary)]"
                                                                      />
                                                            </svg>
                                                  </div>
                                        </section>

                                        {/* 2. Right Form Section */}
                                        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-24 relative z-10 bg-background">
                                                  {/* Subtle Ambience Glow behind forms */}
                                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

                                                  <div className="w-full max-w-md relative">
                                                            <div className="absolute -top-16 right-0 md:-right-2">
                                                                      <ThemeToggle />
                                                            </div>
                                                            <AnimatePresence mode="wait">
                                                                      {authMode === "signup" && (
                                                                                <motion.div key="signup" {...fadeConfig}>
                                                                                          <SignUpForm onSwitch={() => setAuthMode("login")} />
                                                                                </motion.div>
                                                                      )}
                                                                      {authMode === "login" && (
                                                                                <motion.div key="login" {...fadeConfig}>
                                                                                          <LoginForm
                                                                                                    onSwitch={() => setAuthMode("signup")}
                                                                                                    onForgotPassword={() => setAuthMode("forgot-password")}
                                                                                          />
                                                                                </motion.div>
                                                                      )}
                                                                      {authMode === "forgot-password" && (
                                                                                <motion.div key="forgot" {...fadeConfig}>
                                                                                          <ForgotPasswordForm onBack={() => setAuthMode("login")} />
                                                                                </motion.div>
                                                                      )}
                                                            </AnimatePresence>
                                                  </div>
                                        </section>
                              </main>
                    </div>
          );
}

// ✅ Wrapping in Suspense because of useSearchParams
export default function AuthPage() {
          return (
                    <Suspense fallback={<div className="min-h-screen bg-background" />}>
                              <AuthContent />
                    </Suspense>
          );
}