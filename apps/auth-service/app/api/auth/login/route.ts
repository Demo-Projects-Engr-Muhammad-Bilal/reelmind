import { ApiResponse } from "@/lib/api-response/api-response";
import { loginSchema } from "@/lib/validators/zod-validations";
import { sendLoginAlertEmail } from "@/services/mail.service";
import { createSingletonSession } from "@/lib/utils/auth-utils";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "../../../../../../packages/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) return ApiResponse.error(validation.error.issues[0].message, 400);

    const { email, password } = validation.data;

    // ✅ Optimization: Sirf required fields uthao
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true, name: true, email: true,
        password: true, isVerified: true, credits: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return ApiResponse.error("Invalid Credentials", 401);
    }

    if (!user.isVerified) return ApiResponse.error("Verify your email first.", 403);

    const token = await createSingletonSession(user.id, user.email);

    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    sendLoginAlertEmail(user.email ?? "", user.name ?? "").catch(() => { });

    return ApiResponse.success({
      user: { id: user.id, name: user.name, credits: user.credits }
    }, "Login successful");

  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return ApiResponse.error("Server error", 500);
  }
}