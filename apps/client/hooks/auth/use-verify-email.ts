import { useState, useEffect } from "react";
import { authService } from "@/services/auth/auth-services";

export const useVerifyEmail = (token: string | null) => {
          const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

          useEffect(() => {
                    if (!token) { setStatus("error"); return; }
                    authService.verifyEmail(token)
                              .then(ok => setStatus(ok ? "success" : "error"))
                              .catch(() => setStatus("error"));
          }, [token]);

          return { status };
};