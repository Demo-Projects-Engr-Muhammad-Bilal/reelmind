import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "../../../../packages/database";
import { ApiResponse } from "@/lib/api-response/api-response";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "aireelgen-default-secret");

export type AuthenticatedHandler = (req: Request, user: any) => Promise<Response>;


export function withAuth(handler: AuthenticatedHandler) {
          return async (req: Request) => {
                    try {
                              const token = (await cookies()).get("auth_token")?.value;
                              if (!token) return ApiResponse.error("Unauthorized: No token provided", 401);

                              // 1. JWT Verification
                              const { payload } = await jwtVerify(token, JWT_SECRET);
                              const userId = payload.userId as string;
                              const sessionId = payload.sessionId as string;

                              // 2. Singleton Match Check (Prisma Select Optimized)
                              const user = await prisma.user.findUnique({
                                        where: { id: userId },
                                        select: { id: true, name: true, email: true, credits: true, currentSessionId: true }
                              });

                              if (!user) return ApiResponse.error("User not found", 401);

                              if (user.currentSessionId !== sessionId) {
                                        return ApiResponse.error("Session conflict: Logged in elsewhere", 401);
                              }

                              // 3. Sab theek hai? Proceed to original route logic
                              const { currentSessionId, ...safeUser } = user;
                              return handler(req, safeUser);

                    } catch (error: any) {
                              if (error.code === "ERR_JWT_EXPIRED") return ApiResponse.error("Session expired", 401);
                              return ApiResponse.error("Invalid session", 401);
                    }
          };
}