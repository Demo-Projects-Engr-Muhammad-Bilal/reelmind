import { z } from "zod";

// Base logic for Login
export const loginSchema = z.object({
          email: z.string().email("Invalid email address"),
          password: z.string()
                    .min(8, "Must be exactly 8 characters")
                    .max(8, "Must be exactly 8 characters")
                    .regex(/[a-z]/, "Small letter required")
                    .regex(/[A-Z]/, "Capital letter required")
                    .regex(/[0-9]/, "Number required")
                    .regex(/[^a-zA-Z0-9]/, "Special character required"),
});

// Extend for Signup
export const signupSchema = loginSchema.extend({
          name: z.string().min(2, "Name is required"),
          confirmPass: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPass, {
          message: "Passwords don't match",
          path: ["confirmPass"],
});