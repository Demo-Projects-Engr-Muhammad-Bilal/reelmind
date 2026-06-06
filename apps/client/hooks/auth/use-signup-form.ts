"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/validations/auth-validations";
import { authService } from "@/services/auth/auth-services";
import { toast } from "sonner";

export const useSignUpForm = (onSwitch: () => void) => {
          const [isSubmitting, setIsSubmitting] = useState(false);

          const form = useForm({
                    resolver: zodResolver(signupSchema),
                    mode: "onChange",
          });

          const onSubmit = async (data: any) => {
                    setIsSubmitting(true);

                    toast.promise(
                              authService.signup(data).then(({ ok, data: result }) => {
                                        if (!ok) throw new Error(result.error || "Signup failed");

                                        // Success par login form par switch kar dena
                                        onSwitch();
                                        return `Verification link dispatched to your inbox!`;
                              }),
                              {
                                        loading: "Initializing your creative engine...",
                                        success: (s) => {
                                                  setIsSubmitting(false);
                                                  return s;
                                        },
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