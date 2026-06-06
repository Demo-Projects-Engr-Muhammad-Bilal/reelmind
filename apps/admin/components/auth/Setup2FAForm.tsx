import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, QrCode, ShieldCheck } from "lucide-react";

export default function Setup2FAForm({ qrCodeUrl, formData, setFormData, onSubmit, isLoading }: any) {
          return (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col space-y-4 px-3">
                              <div className="text-center">
                                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Enable 2FA</h1>
                                        <p className="text-sm text-muted-foreground mt-2">Scan this image using your authenticator app to enable two-step verification.</p>
                              </div>

                              <div className="flex justify-center">
                                        <div className="p-4 bg-background rounded-3xl shadow-sm border border-border/50">
                                                  {qrCodeUrl ? (
                                                            <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 dark:invert" />
                                                  ) : (
                                                            <div className="w-40 h-40 flex items-center justify-center rounded-2xl">
                                                                      <QrCode className="w-8 h-8 text-muted-foreground opacity-50" />
                                                            </div>
                                                  )}
                                        </div>
                              </div>

                              <form onSubmit={onSubmit} className="space-y-6">
                                        <div className="space-y-3">
                                                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center block">Enter 6-Digit Code</label>
                                                  <Input
                                                            type="text"
                                                            required
                                                            maxLength={6}
                                                            placeholder="******"
                                                            autoFocus
                                                            value={formData.code}
                                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
                                                            className="rounded-2xl border-border/60 bg-background/50 h-14 text-center text-2xl tracking-[0.4em] font-mono focus:ring-2 focus:ring-primary transition-all duration-200"
                                                  />
                                        </div>
                                        <Button
                                                  type="submit"
                                                  disabled={isLoading || formData.code.length !== 6}
                                                  className="w-full h-14 rounded-2xl text-base font-medium shadow-md flex items-center justify-center gap-2  cursor-pointer"
                                        >
                                                  {isLoading ? (
                                                            <>
                                                                      <Loader2 className="w-5 h-5 animate-spin" />
                                                                      <span>Verifying...</span>
                                                            </>
                                                  ) : (
                                                            <>
                                                                      <ShieldCheck className="w-5 h-5" />
                                                                      <span>Verify & Continue</span>
                                                            </>
                                                  )}
                                        </Button>
                              </form>
                    </div>
          );
}