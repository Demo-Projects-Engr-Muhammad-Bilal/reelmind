import { z } from "zod";

export const nicheSchema = z.object({
          key: z
                    .string()
                    .min(1, "Unique Key is required")
                    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores allowed"),
          name: z.string().min(2, "Display Name must be at least 2 characters"),
          systemPrompt: z.string().min(10, "System Prompt must be at least 10 characters"),
          hooksInstruction: z.string().min(10, "Hooks Instruction is required"),
          expansionInstruction: z.string().min(10, "Expansion Instruction is required"),
          imageInstruction: z.string().optional(),
          audioInstruction: z.string().optional(),
          videoInstruction: z.string().optional(),
          bgmUrls: z.array(z.string().url("Must be a valid URL")).default([]),
          bgmVolume: z.number().min(0).max(1).default(0.2),
          fallbackUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type NicheFormValues = z.infer<typeof nicheSchema>;