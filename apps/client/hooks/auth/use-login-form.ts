"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/auth-validations";
import { authService } from "@/services/auth/auth-services";
import { useAuth } from "@/context/auth/AuthContext";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation"; // ⚡ 1. Router hooks import kiye

export const useLoginForm = (onForgotPassword: () => void) => {
          const [isSubmitting, setIsSubmitting] = useState(false);
          const [showResend, setShowResend] = useState(false);
          const { setUser } = useAuth();

          // ⚡ 2. Router aur Search Params initialize kiye
          const router = useRouter();
          const searchParams = useSearchParams();

          const form = useForm({
                    resolver: zodResolver(loginSchema),
                    mode: "onChange",
          });

          const handleGoogleLogin = () => {
                    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
                    const options = {
                              redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
                              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                              access_type: "offline",
                              response_type: "code",
                              prompt: "consent",
                              scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
                    };
                    window.location.href = `${rootUrl}?${new URLSearchParams(options).toString()}`;
          };

          const onSubmit = async (data: any) => {
                    setIsSubmitting(true);
                    setShowResend(false);

                    toast.promise(
                              authService.login(data).then(({ ok, status, data: result }) => {
                                        if (status === 403) {
                                                  setShowResend(true);
                                                  throw new Error(result.error);
                                        }
                                        if (!ok) throw new Error(result.error);

                                        // ✅ STEP 1: Context update karo
                                        setUser(result.user);

                                        // ✅ STEP 2: Extract callbackUrl from URL, fallback to "/dashboard"
                                        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

                                        // ✅ STEP 3: Redirect dynamically
                                        setTimeout(() => {
                                                  // SPA experience maintain rakhne ke liye router.push behtar hai
                                                  router.push(callbackUrl);
                                        }, 1000);

                                        return `Welcome back, ${result.user.name}!`;
                              }),
                              {
                                        loading: "Verifying...",
                                        success: (m) => m,
                                        error: (e) => {
                                                  setIsSubmitting(false);
                                                  return e.message;
                                        },
                              }
                    );
          };

          return {
                    form,
                    isSubmitting,
                    showResend,
                    handleGoogleLogin,
                    onSubmit: form.handleSubmit(onSubmit),
                    resendVerification: () => authService.resendVerification(form.getValues("email")),
          };
};