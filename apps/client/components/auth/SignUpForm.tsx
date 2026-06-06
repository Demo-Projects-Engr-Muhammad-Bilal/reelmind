"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSignUpForm } from "@/hooks/auth/use-signup-form";
import { Lock, Mail, Rocket, ShieldCheck, User } from "lucide-react";

export default function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
          // 🚀 Logic intact from your Hook
          const { form, isSubmitting, onSubmit } = useSignUpForm(onSwitch);
          const { register, formState: { errors, isValid } } = form;

          return (
                    <div className="w-full space-y-8 cursor-pointer">
                              {/* Header Section */}
                              <div className="text-center md:text-left space-y-1 cursor-pointer">
                                        <h1 className="text-3xl font-black text-foreground tracking-tighter font-headline italic uppercase cursor-pointer">
                                                  Deploy Agent
                                        </h1>
                                        <p className="text-muted-foreground text-sm font-medium cursor-pointer">
                                                  Setup your content automation pipeline
                                        </p>
                              </div>

                              {/* Form Section */}
                              <form className="space-y-4 cursor-pointer" onSubmit={onSubmit}>

                                        {/* Full Name */}
                                        <div className="space-y-2 cursor-pointer">
                                                  <Label htmlFor="name" className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground ml-1 cursor-pointer">
                                                            Full Name
                                                  </Label>
                                                  <div className="relative cursor-pointer">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 cursor-pointer" />
                                                            <Input
                                                                      id="name"
                                                                      placeholder="M Bilal Khalid"
                                                                      className={`pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.name ? 'border-destructive' : ''}`}
                                                                      {...register("name")}
                                                                      disabled={isSubmitting}
                                                            />
                                                  </div>
                                                  {errors.name && <p className="text-[10px] font-bold text-destructive ml-1 uppercase cursor-pointer">{errors.name.message as string}</p>}
                                        </div>

                                        {/* Email Address */}
                                        <div className="space-y-2 cursor-pointer">
                                                  <Label htmlFor="email" className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground ml-1 cursor-pointer">
                                                            Email Address
                                                  </Label>
                                                  <div className="relative cursor-pointer">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 cursor-pointer" />
                                                            <Input
                                                                      id="email"
                                                                      type="email"
                                                                      placeholder="muhammadbilalkhalid@gmail.com"
                                                                      className={`pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.email ? 'border-destructive' : ''}`}
                                                                      {...register("email")}
                                                                      disabled={isSubmitting}
                                                            />
                                                  </div>
                                                  {errors.email && <p className="text-[10px] font-bold text-destructive ml-1 uppercase cursor-pointer">{errors.email.message as string}</p>}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2 cursor-pointer">
                                                  <Label htmlFor="password" className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground ml-1 cursor-pointer">
                                                            Password
                                                  </Label>
                                                  <div className="relative cursor-pointer">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 cursor-pointer" />
                                                            <Input
                                                                      id="password"
                                                                      type="password"
                                                                      placeholder="8 Chars (A, a, 1, #)"
                                                                      className={`pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.password ? 'border-destructive' : ''}`}
                                                                      {...register("password")}
                                                                      disabled={isSubmitting}
                                                            />
                                                  </div>
                                                  {errors.password && <p className="text-[10px] font-bold text-destructive ml-1 uppercase cursor-pointer">{errors.password.message as string}</p>}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2 cursor-pointer">
                                                  <Label htmlFor="confirmPass" className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground ml-1 cursor-pointer">
                                                            Confirm Password
                                                  </Label>
                                                  <div className="relative cursor-pointer">
                                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 cursor-pointer" />
                                                            <Input
                                                                      id="confirmPass"
                                                                      type="password"
                                                                      placeholder="Confirm password"
                                                                      className={`pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/50 transition-all ${errors.confirmPass ? 'border-destructive' : ''}`}
                                                                      {...register("confirmPass")}
                                                                      disabled={isSubmitting}
                                                            />
                                                  </div>
                                                  {errors.confirmPass && <p className="text-[10px] font-bold text-destructive ml-1 uppercase cursor-pointer">{errors.confirmPass.message as string}</p>}
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                                  type="submit"
                                                  disabled={isSubmitting || !isValid}
                                                  className="w-full h-12 mt-4 font-headline font-black uppercase italic tracking-widest purple-glow group transition-all cursor-pointer"
                                        >
                                                  {isSubmitting ? "Syncing..." : (
                                                            <span className="flex items-center gap-2 cursor-pointer">
                                                                      Create Account <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform cursor-pointer" />
                                                            </span>
                                                  )}
                                        </Button>
                              </form>

                              {/* Footer Switch Link */}
                              <div className="mt-8 text-center border-t border-border/10 pt-6 cursor-pointer">
                                        <p className="text-muted-foreground text-xs font-medium cursor-pointer">
                                                  Already in the system?
                                                  <button
                                                            type="button"
                                                            onClick={onSwitch}
                                                            className="text-primary font-bold ml-2 hover:underline uppercase tracking-tighter cursor-pointer"
                                                  >
                                                            Log In
                                                  </button>
                                        </p>
                              </div>
                    </div>
          );
}