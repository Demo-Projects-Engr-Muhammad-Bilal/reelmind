"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth/auth-services";

export const useSessionGuard = (intervalMs: number = 30000) => {
          useEffect(() => {
                    const checkSession = async () => {
                              try {
                                        const { ok, status, data } = await authService.validateSession();

                                        // Agar 401 (Unauthorized) ya valid: false aye
                                        if (status === 401 || (ok && data && !data.valid)) {
                                                  console.warn("⚠️ Session expired or logged in elsewhere.");
                                                  window.location.href = "/auth?mode=login";
                                        }
                              } catch (error) {
                                        console.error("Heartbeat Sniper Error:", error);
                              }
                    };

                    const interval = setInterval(checkSession, intervalMs);
                    return () => clearInterval(interval);
          }, [intervalMs]);
};