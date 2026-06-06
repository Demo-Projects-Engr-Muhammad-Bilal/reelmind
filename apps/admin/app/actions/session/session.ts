"use server";

import prisma from "@/lib/prisma/prisma"; // ⚡ Apne path ke mutabiq check kar lena
import { cookies } from "next/headers";
import { jwtVerify, errors } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_key_32_chars_long");
const COOKIE_NAME = "admin_session";

export async function validateSessionPollingAction() {
          try {
                    const cookieStore = await cookies();
                    const sessionCookie = cookieStore.get(COOKIE_NAME);

                    if (!sessionCookie || !sessionCookie.value) {
                              console.log("❌ [SESSION GUARD] Cookie missing or empty.");
                              return { isValid: false, reason: "NO_COOKIE" };
                    }

                    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);

                    if (!payload || !payload.email || !payload.sessionId) {
                              console.log("❌ [SESSION GUARD] JWT Payload is corrupt or missing sessionId.");
                              return { isValid: false, reason: "INVALID_TOKEN" };
                    }

                    const admin = await prisma.admin.findUnique({
                              where: { email: payload.email as string },
                              select: { currentSessionId: true }
                    });

                    if (!admin) {
                              console.log("❌ [SESSION GUARD] Admin user not found in DB.");
                              return { isValid: false, reason: "USER_NOT_FOUND" };
                    }

                    // ⚡ DEBUG LOGS: Terminal mein check karne ke liye
                    console.log(`🔍 [SESSION GUARD] Checking ${payload.email}:`);
                    console.log(`   -> Cookie Session ID: ${payload.sessionId}`);
                    console.log(`   -> Database Session ID: ${admin.currentSessionId}`);

                    // CROSS CHECK
                    if (admin.currentSessionId !== payload.sessionId) {
                              console.log("❌ [SESSION GUARD] Mismatch detected! Another device logged in.");
                              cookieStore.delete(COOKIE_NAME);
                              return { isValid: false, reason: "CONCURRENT_LOGIN" };
                    }

                    console.log("✅ [SESSION GUARD] Session is valid.");
                    return { isValid: true };

          } catch (error) {
                    if (error instanceof errors.JWTExpired || error instanceof errors.JWTInvalid) {
                              console.log("❌ [SESSION GUARD] JWT Expired or Invalid.");
                              const cookieStore = await cookies();
                              cookieStore.delete(COOKIE_NAME);
                              return { isValid: false, reason: "EXPIRED" };
                    }

                    console.log("⚠️ [SESSION GUARD] Network glitch or Turbopack refresh ignored:", error);
                    return { isValid: true, reason: "NETWORK_GLITCH_IGNORED" };
          }
}