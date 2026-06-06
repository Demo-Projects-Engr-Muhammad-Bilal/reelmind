import { ApiResponse } from "@/lib/api-response/api-response";
import { resendSchema } from "@/lib/validators/zod-validations";
import { sendResendVerificationEmail } from "@/services/mail.service";
import crypto from "crypto";
import { prisma } from "../../../../../../packages/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = resendSchema.safeParse(body);
    if (!validation.success) return ApiResponse.error(validation.error.issues[0].message, 400);

    const { email } = validation.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return ApiResponse.error("User not found.", 404);
    if (user.isVerified) return ApiResponse.error("Account already verified.", 400);

    const newToken = crypto.randomBytes(32).toString("hex");
    const newExpiry = new Date(Date.now() + 3600000); // 1 Hour

    await prisma.user.update({
      where: { email },
      data: { verifyToken: newToken, verifyTokenExpiry: newExpiry },
    });

    // ✅ Clean Refactored Dispatch
    const { error: mailError } = await sendResendVerificationEmail(user.email ?? "", newToken);

    if (mailError) {
      return ApiResponse.error("Failed to send verification link.", 500);
    }

    return ApiResponse.success({}, "New verification link sent!");
  } catch (error) {
    return ApiResponse.error("Failed to resend link.", 500);
  }
}