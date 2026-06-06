"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
          const [email, setEmail] = useState("");
          const [password, setPassword] = useState("");
          const [isLoading, setIsLoading] = useState(false);

          const handleLogin = async (e: React.FormEvent) => {
                    e.preventDefault();
                    setIsLoading(true);

                    // Auth API logic will go here
                    setTimeout(() => {
                              setIsLoading(false);
                              toast.error("Auth API integration pending");
                    }, 1500);
          };

          return (
                    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
                              {/* Subtle Background Glow */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                              <div className="w-full max-w-md bg-sidebar/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
                                        <div className="flex flex-col items-center mb-10">
                                                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                                            <ShieldCheck className="w-7 h-7 text-primary" />
                                                  </div>
                                                  <h1 className="text-2xl font-bold font-headline tracking-wide text-foreground">
                                                            System Control
                                                  </h1>
                                                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                                                            Restricted access portal.
                                                  </p>
                                        </div>

                                        <form onSubmit={handleLogin} className="space-y-6">
                                                  <div className="space-y-1.5">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                                      Admin Email
                                                            </label>
                                                            <input
                                                                      type="email"
                                                                      value={email}
                                                                      onChange={(e) => setEmail(e.target.value)}
                                                                      required
                                                                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                                                      placeholder="commander@aireelgen.com"
                                                            />
                                                  </div>

                                                  <div className="space-y-1.5">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                                                      Access Key
                                                            </label>
                                                            <input
                                                                      type="password"
                                                                      value={password}
                                                                      onChange={(e) => setPassword(e.target.value)}
                                                                      required
                                                                      className="w-full bg-background border border-border/60 rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                                                      placeholder="••••••••••••"
                                                            />
                                                  </div>

                                                  <button
                                                            type="submit"
                                                            disabled={isLoading}
                                                            className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20"
                                                  >
                                                            {isLoading ? (
                                                                      <>
                                                                                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                                                                      </>
                                                            ) : (
                                                                      "Initialize Session"
                                                            )}
                                                  </button>
                                        </form>
                              </div>
                    </div>
          );
}