import { ApiResponse } from "@/lib/api-response/api-response";
import { forgotSchema } from "@/lib/validators/zod-validations";
import { sendForgotPasswordEmail } from "@/services/mail.service";
import crypto from "crypto";
import { prisma } from "../../../../../../packages/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = forgotSchema.safeParse(body);
    if (!validation.success) return ApiResponse.error(validation.error.issues[0].message, 400);

    const { email } = validation.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // 🛡️ Privacy Safe: Success message even if user not found
    if (!user) return ApiResponse.success({}, "Check your inbox for the reset link!");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 Mins

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry: expiry },
    });

    // ✅ Clean Refactored Dispatch
    const { error: mailError } = await sendForgotPasswordEmail(user.email ?? "", user.name ?? "Creator", resetToken);

    if (mailError) {
      console.error("[AUTH] Forgot Mail Fail:", mailError);
      return ApiResponse.error("Failed to dispatch recovery email.", 500);
    }

    return ApiResponse.success({}, "Check your inbox for the reset link!");
  } catch (error) {
    return ApiResponse.error("Internal Server Error", 500);
  }
}