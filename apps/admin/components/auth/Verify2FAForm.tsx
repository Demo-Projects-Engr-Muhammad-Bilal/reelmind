import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, KeyRound, Loader2, ShieldCheck } from "lucide-react";

export default function Verify2FAForm({ formData, setFormData, onSubmit, isLoading, onBack }: any) {
          return (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                              <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Two-Step Verification</h1>
                                        <p className="text-sm text-muted-foreground mt-2">Open your authenticator app and enter the 6-digit code to sign in.</p>
                              </div>

                              <form onSubmit={onSubmit} className="space-y-6">
                                        <div className="space-y-3">
                                                  <Input
                                                            type="text"
                                                            required
                                                            maxLength={6}
                                                            placeholder="000000"
                                                            autoFocus
                                                            value={formData.code}
                                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
                                                            className="rounded-2xl border-border/60 bg-background/50 h-14 text-center text-2xl tracking-[0.4em] font-mono focus:ring-2 focus:ring-primary transition-all duration-200"
                                                  />
                                        </div>

                                        <div className="space-y-4">
                                                  <Button
                                                            type="submit"
                                                            disabled={isLoading || formData.code.length !== 6}
                                                            className="w-full h-14 rounded-2xl text-base font-medium shadow-md flex items-center justify-center gap-2"
                                                  >
                                                            {isLoading ? (
                                                                      <>
                                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                                <span>Verifying...</span>
                                                                      </>
                                                            ) : (
                                                                      <>
                                                                                <KeyRound className="w-5 h-5" />
                                                                                <span>Confirm Code</span>
                                                                      </>
                                                            )}
                                                  </Button>

                                                  <Button
                                                            type="button"
                                                            onClick={onBack}
                                                            variant="ghost"
                                                            className="w-full text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
                                                  >
                                                            <ArrowLeft className="w-4 h-4" />
                                                            <span>Back to Login</span>
                                                  </Button>
                                        </div>
                              </form>
                    </div>
          );
}