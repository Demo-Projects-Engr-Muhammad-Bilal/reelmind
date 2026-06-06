import { NextResponse } from "next/server";
import { prisma } from "../../../../../../packages/database";
import { z } from "zod";
import { ApiResponse } from "@/lib/api-response/api-response";
import { verifySchema } from "@/lib/validators/zod-validations";

// 🛡️ URL Param Schema

export async function GET(req: Request) {
          try {
                    const { searchParams } = new URL(req.url);
                    const queryData = { token: searchParams.get("token") };

                    // 1. Zod Validation for Query Params
                    const validation = verifySchema.safeParse(queryData);
                    if (!validation.success) {
                              return ApiResponse.error(validation.error.issues[0].message, 400);
                    }

                    const { token } = validation.data;

                    // 2. Find User by Token
                    const user = await prisma.user.findUnique({
                              where: { verifyToken: token }
                    });

                    // 3. Logic Check: Existence & Expiry (Intact)
                    if (!user) {
                              return ApiResponse.error("Invalid verification link", 400);
                    }

                    if (user.verifyTokenExpiry && user.verifyTokenExpiry < new Date()) {
                              return ApiResponse.error("Verification link has expired", 400);
                    }

                    // 4. Update Database: Activate User
                    await prisma.user.update({
                              where: { id: user.id },
                              data: {
                                        isVerified: true,
                                        verifyToken: null,
                                        verifyTokenExpiry: null
                              }
                    });

                    console.log(`[AUTH-SERVICE] Email verified for: ${user.email}`);

                    return ApiResponse.success({}, "Email verified successfully!");

          } catch (error) {
                    console.error("[AUTH-SERVICE] Verification Crash:", error);
                    return ApiResponse.error("Verification process failed", 500);
          }
}