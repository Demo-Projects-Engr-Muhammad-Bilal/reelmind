import { z } from "zod";

export const pricingSchema = z.object({
          stage: z.enum(["AUDIO", "IMAGE", "VIDEO", "UTILITY"], {
                    message: "Please select a valid generation stage.",
          }),
          provider: z.string().min(2, "Provider name must be at least 2 characters."),
          rate: z.number().min(0, "Rate cannot be negative."),
});

export type PricingFormValues = z.infer<typeof pricingSchema>;