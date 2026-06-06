"use client";

import React, { useState } from "react";
import { sendPasswordResetLinkAction } from "@/app/actions/auth/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, ShieldAlert, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function ForgotPasswordPage() {
          const [isLoading, setIsLoading] = useState(false);
          const [email, setEmail] = useState("");
          const [isSent, setIsSent] = useState(false);

          const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!email) return;

                    setIsLoading(true);
                    const toastId = toast.loading("Dispatching secure recovery link...");

                    const res = await sendPasswordResetLinkAction(email);

                    if (res.success) {
                              toast.success("Recovery link sent! Please check your inbox.", { id: toastId });
                              setIsSent(true);
                    } else {
                              toast.error(res.error || "Failed to send recovery link.", { id: toastId });
                    }

                    setIsLoading(false);
          };

          const inputClass = "rounded-2xl border-border/60 bg-background/50 h-14 text-base outline-none ring-0 ring-offset-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pl-12";

          return (
                    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4 sm:p-8 relative overflow-hidden">

                              {/* Theme Toggle */}
                              <div className="absolute top-3 right-4 z-50">
                                      <ThemeToggle />
                                    </div>

                              {/* Background Decorative Elements */}
                              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
                              <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

                              {/* Main Card */}
                              <div className="w-full max-w-md mx-auto bg-card/95 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl relative z-10">

                                        {/* Top Accent Line */}
                                        <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-t-[2.5rem]"></div>

                                        <div className="p-8 sm:p-10">

                                                  <div className="flex justify-center mb-8">
                                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                                                      <ShieldAlert className="w-8 h-8 text-primary stroke-[1.5]" />
                                                            </div>
                                                  </div>

                                                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                            <div className="text-center mb-8">
                                                                      <h1 className="text-2xl font-bold text-foreground tracking-tight">Account Recovery</h1>
                                                                      <p className="text-sm text-muted-foreground mt-2">
                                                                                {isSent
                                                                                          ? "If an account exists, a recovery link has been dispatched to your email."
                                                                                          : "Enter your registered email address and we'll send you a secure link to reset your password."}
                                                                      </p>
                                                            </div>

                                                            {!isSent ? (
                                                                      <form onSubmit={handleSubmit} className="space-y-6">
                                                                                <div className="relative flex items-center">
                                                                                          <Mail className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
                                                                                          <Input
                                                                                                    type="email"
                                                                                                    required
                                                                                                    placeholder="Email address"
                                                                                                    value={email}
                                                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                                                    className={inputClass}
                                                                                          />
                                                                                </div>

                                                                                <Button
                                                                                          variant="default"
                                                                                          size="lg"
                                                                                          type="submit"
                                                                                          disabled={isLoading}
                                                                                          className="w-full h-12 rounded-2xl text-base font-medium shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                                                                >
                                                                                          {isLoading ? (
                                                                                                    <>
                                                                                                              <Loader2 className="w-5 h-5 animate-spin" />
                                                                                                              <span>Dispatching...</span>
                                                                                                    </>
                                                                                          ) : (
                                                                                                    <>
                                                                                                              <Send className="w-4 h-4" />
                                                                                                              <span>Send Recovery Link</span>
                                                                                                    </>
                                                                                          )}
                                                                                </Button>
                                                                      </form>
                                                            ) : (
                                                                      <div className="space-y-6">
                                                                                <Button
                                                                                          variant="outline"
                                                                                          size="lg"
                                                                                          onClick={() => setIsSent(false)}
                                                                                          className="w-full h-12 rounded-2xl text-base font-medium flex items-center justify-center gap-2 cursor-pointer"
                                                                                >
                                                                                          Try another email
                                                                                </Button>
                                                                      </div>
                                                            )}

                                                            <div className="mt-8 flex justify-center">
                                                                      <Link
                                                                                href="/"
                                                                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                                                      >
                                                                                <ArrowLeft className="w-4 h-4" />
                                                                                Return to Login
                                                                      </Link>
                                                            </div>

                                                  </div>
                                        </div>
                              </div>
                    </div>
          );
}