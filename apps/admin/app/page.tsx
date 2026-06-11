"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginCredentialsAction, verify2FALoginAction } from "@/app/actions/auth/auth";
import { toast } from "sonner";
import { UserCircle, UserKey } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Import Split Components
import CredentialsForm from "@/components/auth/CredentialsForm";
import Setup2FAForm from "@/components/auth/Setup2FAForm";
import Verify2FAForm from "@/components/auth/Verify2FAForm";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // States
  const [step, setStep] = useState<"CREDENTIALS" | "SETUP_2FA" | "VERIFY_2FA">("CREDENTIALS");
  const [formData, setFormData] = useState({ email: "", password: "", code: "" });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // ⚡ HANDLER 1: Verify Email & Password
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await loginCredentialsAction({ email: formData.email, password: formData.password });

    if (!res.success) {
      toast.error(res.error || "Incorrect email or password.");
      setIsLoading(false);
      return;
    }

    if (res.status === "REQUIRES_SETUP") {
      setQrCodeUrl(res.qrCodeUrl || null);
      setStep("SETUP_2FA");
    } else if (res.status === "REQUIRES_2FA") {
      setStep("VERIFY_2FA");
    }

    setIsLoading(false);
  };

  // ⚡ HANDLER 2: Core 2FA Verification Logic
  const execute2FAVerification = async () => {
    if (formData.code.length !== 6 || isLoading) return;

    setIsLoading(true);
    const isFirstTimeSetup = step === "SETUP_2FA";

    const res = await verify2FALoginAction({
      email: formData.email,
      code: formData.code,
      isFirstTimeSetup
    });

    if (res.success) {
      toast.success("Welcome back!");
      router.push("/dashboard");
    } else {
      toast.error(res.error || "Incorrect security code. Try again.");
      setFormData(prev => ({ ...prev, code: "" }));
      setIsLoading(false);
    }
  };

  // ⚡ AUTO-SUBMIT: Watch the code input and trigger when it hits 6 digits
  useEffect(() => {
    if (formData.code.length === 6 && (step === "SETUP_2FA" || step === "VERIFY_2FA")) {
      execute2FAVerification();
    }
  }, [formData.code]);

  // Form submit wrapper
  const handle2FAFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute2FAVerification();
  };

  const handleBackToLogin = () => {
    setStep("CREDENTIALS");
    setFormData(p => ({ ...p, code: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-3 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto bg-card/95 backdrop-blur-2xl border border-border rounded-3xl shadow-xl relative z-10 max-h-[calc(100vh-2rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 sticky top-0 z-20"></div>

        <div className="px-3 py-3 sm:p-10">

          {/* Logo Icon */}
          <div className="flex justify-center items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary shadow-inner">
              <UserKey className="w-8 h-8 text-primary stroke-[1.5]" />
            </div>
          </div>

          {/* Render Step Components */}
          {step === "CREDENTIALS" && (
            <CredentialsForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCredentialsSubmit}
              isLoading={isLoading}
            />
          )}

          {step === "SETUP_2FA" && (
            <Setup2FAForm
              qrCodeUrl={qrCodeUrl}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handle2FAFormSubmit}
              isLoading={isLoading}
            />
          )}

          {step === "VERIFY_2FA" && (
            <Verify2FAForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handle2FAFormSubmit}
              isLoading={isLoading}
              onBack={handleBackToLogin}
            />
          )}

        </div>
      </div>
    </div>
  );
}