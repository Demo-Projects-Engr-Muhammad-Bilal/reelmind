"use client";

import React, { useEffect, useRef } from "react";
import { validateSessionPollingAction } from "@/app/actions/session/session";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
          const pathname = usePathname();
          const isCheckingRef = useRef(false);

          useEffect(() => {
                    // Sirf dashboard routes par polling chalegi
                    if (!pathname.startsWith("/dashboard")) return;

                    const checkSession = async () => {
                              if (isCheckingRef.current) return;
                              isCheckingRef.current = true;

                              try {
                                        const res = await validateSessionPollingAction();

                                        if (!res.isValid) {
                                                  if (res.reason === "CONCURRENT_LOGIN") {
                                                            toast.error("Session Terminated: Logged in from another device.", { duration: 5000 });
                                                  } else if (res.reason === "EXPIRED" || res.reason === "NO_COOKIE") {
                                                            toast.info("Session expired. Please log in again.");
                                                  }

                                                  // Force hard reload to root login page
                                                  window.location.href = "/";
                                                  return;
                                        }
                              } catch (err) {
                                        console.error("Guard polling error:", err);
                              } finally {
                                        isCheckingRef.current = false;
                              }
                    };

                    // ⚡ FIX: Initial immediate check skip kar diya hai kyunke entry gate 'proxy.ts' handle kar raha hai.
                    // Yeh background polling har 5 seconds baad automatic cross-verify karegi.
                    const intervalId = setInterval(checkSession, 5000);

                    return () => clearInterval(intervalId);
          }, [pathname]);

          return <>{children}</>;
}