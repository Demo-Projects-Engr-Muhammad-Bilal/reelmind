import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/auth/auth-services";
import { toast } from "sonner";

const forgotSchema = z.object({ email: z.string().email("Invalid email address") });

export const useForgotPassword = (onBack: () => void) => {
          const [isSubmitting, setIsSubmitting] = useState(false);
          const form = useForm({ resolver: zodResolver(forgotSchema), mode: "onChange" });

          const onSubmit = async (data: any) => {
                    setIsSubmitting(true);
                    toast.promise(
                              authService.forgotPassword(data.email).then(({ ok, data: res }) => {
                                        if (!ok) throw new Error(res.error || "Failed");
                                        setTimeout(() => { onBack(); setIsSubmitting(false); }, 1500);
                                        return "Recovery link dispatched!";
                              }),
                              { loading: 'Locating access...', success: (s) => s, error: (e) => { setIsSubmitting(false); return e.message; } }
                    );
          };

          return { form, isSubmitting, onSubmit: form.handleSubmit(onSubmit) };
};