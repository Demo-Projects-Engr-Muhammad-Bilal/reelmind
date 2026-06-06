"use server";

import prisma from "@/lib/prisma/prisma";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy"; // ⚡ NEW: 100% Next.js/Turbopack Friendly
import qrcode from "qrcode";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import { Resend } from "resend";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_key_32_chars_long");
const COOKIE_NAME = "admin_session";

export type AuthResponse = {
          success: boolean;
          status?: "REQUIRES_2FA" | "REQUIRES_SETUP" | "SUCCESS";
          qrCodeUrl?: string;
          secret?: string;
          error?: string;
};

// ⚡ VERIFY CREDENTIALS & CHECK 2FA STATUS
export async function loginCredentialsAction(formData: any): Promise<AuthResponse> {
          try {
                    const { email, password } = formData;

                    const admin = await prisma.admin.findUnique({ where: { email } });
                    if (!admin) return { success: false, error: "Invalid email or password." };

                    const isPasswordMatch = await bcrypt.compare(password, admin.password);
                    if (!isPasswordMatch) return { success: false, error: "Invalid email or password." };

                    // First time login - Setup 2FA
                    if (!admin.isTwoFactorEnabled || !admin.twoFactorSecret) {

                              // ⚡ SPEAKEASY: Generate Secret & Microsoft Auth URI
                              const secretData = speakeasy.generateSecret({
                                        name: "Reelmind Admin",
                                        user: admin.email
                              });

                              const secret = secretData.base32;
                              const otpAuthUri = secretData.otpauth_url || `otpauth://totp/ReelMind%20Admin:${encodeURIComponent(admin.email)}?secret=${secret}&issuer=ReelMind%20Admin`;

                              const qrCodeUrl = await qrcode.toDataURL(otpAuthUri);

                              await prisma.admin.update({
                                        where: { id: admin.id },
                                        data: { twoFactorSecret: secret }
                              });

                              return { success: true, status: "REQUIRES_SETUP", qrCodeUrl, secret };
                    }

                    return { success: true, status: "REQUIRES_2FA" };

          } catch (error: any) {
                    console.error("Auth Error:", error);
                    return { success: false, error: error.message || "Authentication critical system failure." };
          }
}

// ⚡ VERIFY 2FA CODE & CREATE ENCRYPTED SESSION

export async function verify2FALoginAction(formData: any): Promise<AuthResponse> {
  try {
    const { email, code, isFirstTimeSetup } = formData;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.twoFactorSecret) {
      return { success: false, error: "Authentication lookup failed." };
    }

    // ⚡ SPEAKEASY: Verify 6-digit code
    const isValidToken = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1 // Gives a 30-second buffer before/after to handle slight clock delays
    });

    if (!isValidToken) {
      return { success: false, error: "Invalid authorization token code." };
    }

    // ⚡ 1. Generate Unique Session ID (Concurrent Login Protection)
    const newSessionId = crypto.randomUUID();

    const updateData: any = {
      lastLoginAt: new Date(),
      currentSessionId: newSessionId // ⚡ 2. Database mein naya ID save karo
    };

    if (isFirstTimeSetup) {
      updateData.isTwoFactorEnabled = true;
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: updateData
    });

    // ⚡ 3. Inject sessionId into JWT Payload
    const sessionToken = await new SignJWT({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      sessionId: newSessionId // <--- YEH LINE MISSING THI
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 Hours
      path: "/"
    });

    return { success: true, status: "SUCCESS" };

  } catch (error: any) {
    console.error("2FA Error:", error);
    return { success: false, error: error.message || "Token verification gateway failure." };
  }
}


export async function sendPasswordResetLinkAction(email: string): Promise<AuthResponse> {
          try {
                    const admin = await prisma.admin.findUnique({ where: { email } });

                    // Security Best Practice: Return success even if email doesn't exist
                    if (!admin) {
                              console.log("Email not found in DB. Returning silent success.");
                              return { success: true, status: "SUCCESS" };
                    }

                    // 1. Generate Secure Token & Expiry (1 Hour)
                    const resetToken = crypto.randomBytes(32).toString("hex");
                    const resetTokenExpiry = new Date(Date.now() + 3600000);

                    // 2. Save Token to Database
                    await prisma.admin.update({
                              where: { id: admin.id },
                              data: { resetToken, resetTokenExpiry }
                    });

                    // 3. Create Magic Link
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

                    // 4. Send Email via Resend
                    const resend = new Resend(process.env.RESEND_API_KEY);

                    // ⚡ FIX: Extract 'error' and 'data' from the Resend response
                    const { data, error } = await resend.emails.send({
                              // ⚡ FIX: Use Resend's default onboarding email for testing mode!
                              from: "onboarding@resend.dev",
                              to: admin.email, // Ensure this is the same email you registered Resend with during testing
                              subject: "Action Required: System Gateway Password Reset",
                              html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              <h2 style="color: #333;">Security Override Request</h2>
              <p style="color: #555; line-height: 1.5;">A password reset request was initiated for the commander profile associated with this email address.</p>
              <p style="color: #555; line-height: 1.5;">Click the secure link below to proceed with the security override and set a new password. This link is only valid for <strong>1 hour</strong>.</p>
              <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #e11d48; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email. Your account remains secure.</p>
            </div>
          `
                    });

                    // ⚡ FIX: Check if Resend itself returned an API error
                    if (error) {
                              console.error("Resend API Rejection:", error);
                              return { success: false, error: "Gateway blocked the email. Check Resend logs." };
                    }

                    console.log("Email sent successfully! ID:", data?.id);
                    return { success: true, status: "SUCCESS" };

          } catch (error) {
                    console.error("Forgot Password Catch Error:", error);
                    return { success: false, error: "Failed to dispatch recovery email. Please check server configuration." };
          }
}

// ⚡ RESET PASSWORD ACTION (Validates Token & Updates DB)
export async function resetPasswordAction(token: string, newPassword: string): Promise<AuthResponse> {
          try {
                    if (!token) {
                              return { success: false, error: "Security token is missing." };
                    }

                    // 1. Find the admin with this specific token AND ensure it hasn't expired
                    const admin = await prisma.admin.findFirst({
                              where: {
                                        resetToken: token,
                                        resetTokenExpiry: {
                                                  gt: new Date(), // Must be greater than current time (not expired)
                                        },
                              },
                    });

                    // 2. Protect against invalid or expired tokens
                    if (!admin) {
                              return { success: false, error: "The recovery link is invalid or has expired. Please request a new one." };
                    }

                    // 3. Hash the new password securely
                    const hashedPassword = await bcrypt.hash(newPassword, 10);

                    // 4. Update the database and clear the used tokens
                    await prisma.admin.update({
                              where: { id: admin.id },
                              data: {
                                        password: hashedPassword,
                                        resetToken: null,        // Clean up the token so it can't be reused
                                        resetTokenExpiry: null,  // Clean up expiry date
                              },
                    });

                    return { success: true, status: "SUCCESS" };

          } catch (error: any) {
                    console.error("Reset Password Action Error:", error);
                    return { success: false, error: "A system error occurred while updating your credentials." };
          }
}

export async function logoutAction() {
          try {
                    const cookieStore = await cookies();
                    cookieStore.delete("admin_session"); // Cookie delete ho jayegi
                    return { success: true };
          } catch (error) {
                    console.error("Logout Error:", error);
                    return { success: false, error: "Failed to securely terminate session." };
          }
}