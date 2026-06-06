"use client";

import { ArrowLeft, MailCheck, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
          // 🚀 Logic intact from your Hook
          const { form, isSubmitting, onSubmit } = useForgotPassword(onBack);
          const { register, formState: { errors, isValid } } = form;

          return (
                    <div className="w-full space-y-8 cursor-pointer">
                              {/* Header & Back Button */}
                              <div className="space-y-6 cursor-pointer">
                                        <button
                                                  onClick={onBack}
                                                  disabled={isSubmitting}
                                                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all group font-bold text-[11px] uppercase tracking-widest italic cursor-pointer"
                                        >
                                                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform cursor-pointer" />
                                                  Back to Login
                                        </button>

                                        <div className="text-center md:text-left space-y-1 cursor-pointer">
                                                  <h1 className="text-3xl font-black text-foreground tracking-tighter font-headline italic uppercase cursor-pointer">
                                                            Recover Access
                                                  </h1>
                                                  <p className="text-muted-foreground text-sm font-medium cursor-pointer">
                                                            Enter your email for a recovery link
                                                  </p>
                                        </div>
                              </div>

                              {/* Form Section */}
                              <form className="space-y-6 cursor-pointer" onSubmit={onSubmit}>
                                        <div className="space-y-2 cursor-pointer">
                                                  <Label htmlFor="email" className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground ml-1 cursor-pointer">
                                                            Registered Email
                                                  </Label>
                                                  <div className="relative cursor-pointer">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 cursor-pointer" />
                                                            <Input
                                                                      id="email"
                                                                      type="email"
                                                                      placeholder="name@company.com"
                                                                      className={`pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.email ? 'border-destructive' : ''}`}
                                                                      {...register("email")}
                                                                      disabled={isSubmitting}
                                                            />
                                                  </div>
                                                  {errors.email && (
                                                            <p className="text-[10px] font-bold text-destructive ml-1 uppercase tracking-tight cursor-pointer">
                                                                      {errors.email.message as string}
                                                            </p>
                                                  )}
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                                  type="submit"
                                                  disabled={isSubmitting || !isValid}
                                                  className="w-full h-11 font-headline font-black uppercase italic tracking-widest purple-glow group cursor-pointer"
                                        >
                                                  {isSubmitting ? "Processing..." : (
                                                            <span className="flex items-center gap-2 cursor-pointer">
                                                                      Send Reset Link <MailCheck className="w-4 h-4 group-hover:scale-110 transition-transform cursor-pointer" />
                                                            </span>
                                                  )}
                                        </Button>
                              </form>

                              {/* Security Note */}
                              <div className="pt-6 border-t border-border/10 cursor-pointer">
                                        <p className="text-center text-[10px] text-muted-foreground/60 font-medium leading-relaxed italic cursor-pointer">
                                                  If an account exists for this email, you will receive a password reset link shortly. Please check your spam folder.
                                        </p>
                              </div>
                    </div>
          );
}