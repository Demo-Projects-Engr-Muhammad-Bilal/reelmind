"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth/auth-services";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      handleGoogleAuth(code);
    } else {
      router.push("/auth?mode=login");
    }
  }, [code]);

  const handleGoogleAuth = async (authCode: string) => {
    try {
      const { ok, data } = await authService.verifyGoogle(authCode);
      if (!ok) throw new Error(data.error || "Google Auth Failed");

      document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`, {
        description: "Your creative session has been synchronized.",
      });
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } catch (error: unknown) {
      toast.error("Authentication Failed", {
        description: (error as Error).message || "Could not verify Google credentials.",
      });
      router.push("/auth?mode=login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, backgroundSize: "32px 32px" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          <div className="relative w-16 h-16 bg-secondary/50 border border-primary/30 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl">
            <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={2} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-foreground uppercase italic font-headline tracking-tighter flex items-center gap-2 justify-center">
            Verifying Identity <ShieldCheck className="w-5 h-5 text-primary" />
          </h2>
          <p className="text-muted-foreground text-sm font-medium tracking-tight">Syncing with Google Secure Gate...</p>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="px-4 py-1.5 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 italic">
            Aireelgen Security Protocol v4.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
