import { ApiResponse } from "@/lib/api-response/api-response";
import { resetSchema } from "@/lib/validators/zod-validations";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../../packages/database";


export async function POST(req: Request) {
          try {
                    const body = await req.json();
                    const validation = resetSchema.safeParse(body);

                    if (!validation.success) {
                              return ApiResponse.error(validation.error.issues[0].message, 400);
                    }

                    const { token, password } = validation.data;

                    // 1. Find User with Valid Token (Intact Logic)
                    const user = await prisma.user.findFirst({
                              where: {
                                        resetToken: token,
                                        resetTokenExpiry: { gt: new Date() },
                              },
                    });

                    if (!user) {
                              return ApiResponse.error("Invalid or expired recovery link.", 400);
                    }

                    // 2. Hash New Password
                    const hashedPassword = await bcrypt.hash(password, 12);

                    // 3. Update DB & Clear Tokens
                    await prisma.user.update({
                              where: { id: user.id },
                              data: {
                                        password: hashedPassword,
                                        resetToken: null,
                                        resetTokenExpiry: null,
                              },
                    });

                    return ApiResponse.success({}, "Password updated successfully.");

          } catch (error) {
                    console.error("[AUTH-SERVICE] Reset Password Error:", error);
                    return ApiResponse.error("System error during password reset.", 500);
          }
}