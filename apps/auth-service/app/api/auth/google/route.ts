import { ApiResponse } from "@/lib/api-response/api-response";
import { createSingletonSession } from "@/lib/utils/auth-utils";
import crypto from "crypto";
import { prisma } from "../../../../../../packages/database";

export async function POST(req: Request) {
          try {
                    const { code } = await req.json();
                    // [Google Profile Fetch Logic...]
                    const profile = { email: "social@gmail.com", name: "Bilal" };

                    // ✅ Optimization: Check existence with select
                    let user = await prisma.user.findUnique({
                              where: { email: profile.email },
                              select: { id: true, email: true, name: true, credits: true }
                    });

                    if (!user) {
                              user = await prisma.user.create({
                                        data: {
                                                  email: profile.email,
                                                  name: profile.name,
                                                  password: crypto.randomBytes(16).toString("hex"),
                                                  isVerified: true,
                                                  credits: 50,
                                                  resetToken: crypto.randomUUID(),
                                        },
                                        select: { id: true, email: true, name: true, credits: true }
                              });
                    }

                    const token = await createSingletonSession(user.id, user.email);

                    return ApiResponse.success({
                              token,
                              user: { name: user.name, email: user.email, credits: user.credits }
                    }, "Google Auth Success");

          } catch (error: any) {
                    return ApiResponse.error("Authentication failed", 500);
          }
}