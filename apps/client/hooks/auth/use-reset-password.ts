"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { loginSchema } from "@/validations/auth-validations";
import { authService } from "@/services/auth/auth-services";
import { z } from "zod";
import { toast } from "sonner";

// Schema for reset logic
const resetSchema = z.object({
          password: loginSchema.shape.password,
          confirmPass: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPass, {
          message: "Passwords don't match",
          path: ["confirmPass"],
});

export const useResetPassword = () => {
          const [isSubmitting, setIsSubmitting] = useState(false);
          const searchParams = useSearchParams();
          const token = searchParams.get("token");

          const form = useForm({
                    resolver: zodResolver(resetSchema),
                    mode: "onChange",
          });

          const onSubmit = async (data: any) => {
                    if (!token) {
                              toast.error("Security token missing. Please use the link from your email.");
                              return;
                    }

                    setIsSubmitting(true);

                    toast.promise(
                              authService.resetPassword(token, data.password).then(({ ok, data: result }) => {
                                        if (!ok) throw new Error(result.error || "Update failed");

                                        setTimeout(() => {
                                                  window.location.href = "/auth?mode=login";
                                        }, 1500);

                                        return "Password updated! System is now secure.";
                              }),
                              {
                                        loading: 'Securing your new credentials...',
                                        success: (s) => s,
                                        error: (err) => {
                                                  setIsSubmitting(false);
                                                  return err.message;
                                        },
                              }
                    );
          };

          return {
                    form,
                    isSubmitting,
                    onSubmit: form.handleSubmit(onSubmit),
          };
};