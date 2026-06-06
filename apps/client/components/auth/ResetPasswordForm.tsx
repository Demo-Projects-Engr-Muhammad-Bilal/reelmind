// apps/web/src/components/auth/ResetPasswordForm.tsx
"use client";

import { ShieldCheck, Lock, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/auth/use-reset-password";

// ✅ Prop Interface define ki
interface ResetPasswordFormProps {
          email: string;
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
          // 🚀 Logic pulled from your Hook
          // Note: Agar aapka hook email use karta hai toh yahan pass kar sakte hain
          const { form, isSubmitting, onSubmit } = useResetPassword();
          const { register, formState: { errors, isValid } } = form;

          return (
                    <div className="w-full space-y-8">
                              {/* Header Section */}
                              <div className="text-center md:text-left space-y-1">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] group">
                                                  <ShieldCheck className="text-primary w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <h1 className="text-3xl font-black text-foreground tracking-tighter font-headline italic uppercase">
                                                  New Password
                                        </h1>
                                        <p className="text-muted-foreground text-sm font-medium">
                                                  Set a secure access key for <span className="text-primary font-bold">{email}</span>
                                        </p>
                              </div>

                              {/* Form Section */}
                              <form className="space-y-4" onSubmit={onSubmit}>

                                        {/* New Password */}
                                        <div className="space-y-2">
                                                  <Label htmlFor="password" className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground ml-1">
                                                            New Secure Password
                                                  </Label>
                                                  <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                            <Input
                                                                      id="password"
                                                                      type="password"
                                                                      placeholder="8+ Chars (A, a, 1, #)"
                                                                      className={`pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.password ? 'border-destructive' : ''}`}
                                                                      {...register("password")}
                                                                      disabled={isSubmitting}
                                                            />
                                                  </div>
                                                  {errors.password && <p className="text-[10px] font-bold text-destructive ml-1 uppercase tracking-tight">{errors.password.message as string}</p>}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                                  <Label htmlFor="confirmPass" className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground ml-1">
                                                            Confirm New Password
                                                  </Label>
                                                  <div className="relative">
                                                            <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                            <Input
                                                                      id="confirmPass"
                                                                      type="password"
                                                                      placeholder="Re-type your password"
                                                                      className={`pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.confirmPass ? 'border-destructive' : ''}`}
                                                                      {...register("confirmPass")}
                                                                      disabled={isSubmitting}
                                                            />
                                                  </div>
                                                  {errors.confirmPass && <p className="text-[10px] font-bold text-destructive ml-1 uppercase tracking-tight">{errors.confirmPass.message as string}</p>}
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                                  type="submit"
                                                  disabled={isSubmitting || !isValid}
                                                  className="w-full h-11 mt-4 font-headline font-black uppercase italic tracking-widest purple-glow group transition-all"
                                        >
                                                  {isSubmitting ? "Updating System..." : (
                                                            <span className="flex items-center gap-2">
                                                                      Update Password <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                            </span>
                                                  )}
                                        </Button>
                              </form>

                              {/* Security Tip */}
                              <div className="pt-6 border-t border-border/10 text-center">
                                        <p className="text-[10px] text-muted-foreground/60 font-medium italic">
                                                  Tip: Use a mix of symbols and numbers for maximum account security.
                                        </p>
                              </div>
                    </div>
          );
}