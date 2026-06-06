import { z } from "zod";

export const packageSchema = z.object({
          priceUSD: z.number().min(0, "Price cannot be negative."),
          credits: z.number().min(1, "Credits must be greater than 0."),
});

export type PackageFormValues = z.infer<typeof packageSchema>;