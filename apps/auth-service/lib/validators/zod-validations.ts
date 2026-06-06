import { z } from "zod";


export const signupSchema = z.object({
          name: z.string().min(2, "Name is too short"),
          email: z.string().email("Invalid email format"),
          password: z.string().min(8, "Password must be at least 8 characters"),
});


export const loginSchema = z.object({
          email: z.string().email("Invalid email format"),
          password: z.string().min(1, "Password is required"),
});

export const resetSchema = z.object({
          token: z.string().min(1, "Recovery token is missing"),
          password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resendSchema = z.object({
          email: z.string().email("Invalid email format"),
});

export const verifySchema = z.object({
          token: z.string().min(1, "Verification token is required"),
});


export const forgotSchema = z.object({
          email: z.string().email("Invalid email format"),
});

export const googleAuthSchema = z.object({
          code: z.string().min(1, "OAuth code is required"),
});