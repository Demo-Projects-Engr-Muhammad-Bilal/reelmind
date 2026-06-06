import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, LockKeyhole, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";

export default function CredentialsForm({ formData, setFormData, onSubmit, isLoading }: any) {
          const [showPassword, setShowPassword] = useState(false);
          const inputClass = "rounded-2xl border-border/60 bg-background/50 h-14 text-base outline-none ring-0 ring-offset-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pl-12";

          return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ">
                              <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome Back</h1>
                                        <p className="text-sm text-muted-foreground mt-2">Please enter your details to sign in to your dashboard.</p>
                              </div>

                              <form onSubmit={onSubmit} className="space-y-6">

                                        <div className="space-y-4">
                                                  <div className="relative flex items-center">
                                                            <Mail className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
                                                            <Input
                                                                      type="email"
                                                                      required
                                                                      placeholder="Email address"
                                                                      value={formData.email}
                                                                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                                      className={inputClass}
                                                            />
                                                  </div>

                                                  <div className="relative flex items-center">
                                                            <LockKeyhole className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
                                                            <Input
                                                                      type={showPassword ? "text" : "password"}
                                                                      required
                                                                      placeholder="Password"
                                                                      value={formData.password}
                                                                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                                      className={`${inputClass} pr-12`} // Extra padding right for the eye icon
                                                            />
                                                            <button
                                                                      type="button"
                                                                      onClick={() => setShowPassword(!showPassword)}
                                                                      className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors outline-none"
                                                            >
                                                                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                  </div>
                                        </div>

                                        <div className="flex justify-end mt-2 mb-2">
                                                  <Link href="/forgot-password" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                                            Forgot password?
                                                  </Link>
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
                                                                      <span>Signing in...</span>
                                                            </>
                                                  ) : (
                                                            <>
                                                                      <LogIn className="w-5 h-5" />
                                                                      <span>Sign In</span>
                                                            </>
                                                  )}
                                        </Button>
                              </form>
                    </div>

          );
}