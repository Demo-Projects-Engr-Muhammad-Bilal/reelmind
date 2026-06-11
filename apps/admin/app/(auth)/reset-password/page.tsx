"use client";

import { resetPasswordAction } from "@/app/actions/auth/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { toast } from "sonner";

// Form component extracted to wrap in Suspense safely
function ResetPasswordForm() {
          const searchParams = useSearchParams();
          const router = useRouter();
          const token = searchParams.get("token");

          const [isLoading, setIsLoading] = useState(false);
          const [isSuccess, setIsSuccess] = useState(false);

          // Alag alag states dono passwords ki visibility handle karne ke liye
          const [showPassword, setShowPassword] = useState(false);
          const [showConfirmPassword, setShowConfirmPassword] = useState(false);

          const [formData, setFormData] = useState({
                    password: "",
                    confirmPassword: ""
          });

          const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();

                    if (!token) {
                              toast.error("Invalid or missing recovery token.");
                              return;
                    }

                    if (formData.password.length < 8) {
                              toast.error("Password must be at least 8 characters long.");
                              return;
                    }

                    if (formData.password !== formData.confirmPassword) {
                              toast.error("Passwords do not match!");
                              return;
                    }

                    setIsLoading(true);
                    const toastId = toast.loading("Updating secure credentials...");

                    const res = await resetPasswordAction(token, formData.password);

                    if (res.success) {
                              toast.success("Password reset successfully! You can now log in.", { id: toastId });
                              setIsSuccess(true);
                              // Optional: Auto redirect after 3 seconds
                              setTimeout(() => router.push("/"), 3000);
                    } else {
                              toast.error(res.error || "Failed to reset password. The link might be expired.", { id: toastId });
                    }

                    setIsLoading(false);
          };

          const inputClass = "rounded-2xl border-border/60 bg-background/50 h-14 text-base outline-none ring-0 ring-offset-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pl-12 pr-12";

          // ⚡ USER FINALIZED UI FOR INVALID TOKEN
          if (!token) {
                    return (
                              <div className="text-center animate-in fade-in zoom-in duration-500">
                                        <div className="flex flex-col items-center justify-center">
                                                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                            <ShieldAlert className="w-7 h-7 text-primary" />
                                                  </div>
                                        </div>
                                        <div className="flex flex-col space-y-4">
                                                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Link Expired or Invalid</h2>
                                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                                            Your secure recovery token is missing or has expired. Please request a new authorization link to continue.
                                                  </p>
                                        </div>
                                        <Button asChild variant="link" className="mt-4 h-12 w-full text-base flex items-center justify-center gap-2 group">
                                                  <Link href="/auth/forgot-password">
                                                            Request New Link
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                  </Link>
                                        </Button>
                              </div>
                    );
          }

          // ⚡ USER FINALIZED UI FOR SUCCESS
          if (isSuccess) {
                    return (
                              <div className="text-center animate-in fade-in zoom-in duration-500">
                                        <div className="flex flex-col items-center justify-center">
                                                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                            <ShieldCheck className="w-7 h-7 text-primary" />
                                                  </div>
                                        </div>
                                        <div className="flex flex-col space-y-4">
                                                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Access Secured!</h2>
                                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                                            Your commander profile has been successfully updated. You can now access the gateway with your new credentials.
                                                  </p>
                                        </div>
                                        <Button asChild variant="link" className="mt-4 h-12 w-full text-base flex items-center justify-center gap-2 group">
                                                  <Link href="/">
                                                            Return to Login Gateway
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                  </Link>
                                        </Button>
                              </div>
                    );
          }

          return (
                    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                              {/* ⚡ NEW: Circular Icon above the heading */}
                              <div className="flex justify-center mb-6">
                                        <div className="flex justify-center mb-0">
                                                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                                            <UserCog className="w-8 h-8 text-primary stroke-[1.5]" />
                                                  </div>
                                        </div>
                              </div>

                              <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Create New Password</h1>
                                        <p className="text-sm text-muted-foreground mt-2">
                                                  Please enter your new secure password below.<br />Make it strong.
                                        </p>
                              </div>

                              <div className="space-y-6 mb-8"> {/* ⚡ NEW: Spacing container for inputs */}

                                        {/* Input 1: New Password */}
                                        <div className="relative flex items-center">
                                                  <Lock className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
                                                  <Input
                                                            type={showPassword ? "text" : "password"}
                                                            required
                                                            placeholder="New Password"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            className={`${inputClass} text-sm placeholder:text-xs placeholder:text-muted-foreground`}
                                                  />

                                                  <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
                                                  >
                                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                  </button>
                                        </div>

                                        {/* Input 2: Confirm New Password */}
                                        <div className="relative flex items-center">
                                                  <Lock className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
                                                  <Input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            required
                                                            placeholder="Confirm New Password"
                                                            value={formData.confirmPassword}
                                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                            className={`${inputClass} text-sm placeholder:text-xs placeholder:text-muted-foreground`}
                                                  />
                                                  {/* ⚡ NEW: Eye icon for confirm password */}
                                                  <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
                                                  >
                                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                  </button>
                                        </div>
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
                                                            <span>Updating...</span>
                                                  </>
                                        ) : (
                                                  <>
                                                            <Lock className="w-5 h-5" />
                                                            <span>Reset Password</span>
                                                  </>
                                        )}
                              </Button>
                    </form>
          );
}

export default function ResetPasswordPage() {
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
                                                  <Suspense fallback={
                                                            <div className="flex flex-col items-center justify-center py-10">
                                                                      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                                                                      <p className="text-muted-foreground">Verifying secure link...</p>
                                                            </div>
                                                  }>
                                                            <ResetPasswordForm />
                                                  </Suspense>

                                                  <div className="mt-8 flex justify-center border-t border-border/50 pt-6">
                                                            <Link
                                                                      href="/"
                                                                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                                            >
                                                                      <ArrowLeft className="w-4 h-4" />
                                                                      Back to Login Gateway
                                                            </Link>
                                                  </div>
                                        </div>
                              </div>
                    </div>
          );
}