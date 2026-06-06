import { ApiResponse } from "@/lib/api-response/api-response";
import { signupSchema } from "@/lib/validators/zod-validations";
import { sendVerificationEmail } from "@/services/mail.service";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../../../../../../packages/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);
    if (!validation.success) return ApiResponse.error(validation.error.issues[0].message, 400);

    const { name, email, password } = validation.data;

    // ✅ Optimization: Sirf ID check karo, poora record nahi
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) return ApiResponse.error("Email already registered.", 409);

    const hashedPassword = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    const user = await prisma.user.create({
      data: {
        name, email, password: hashedPassword, credits: 50,
        verifyToken: token, verifyTokenExpiry: expiry,
        resetToken: crypto.randomUUID(),
      },
      // ✅ Optimization: Sirf wo data wapis lo jo response mein chahiye
      select: { id: true, email: true, name: true }
    });

    // 📧 Error Resilience logic
    const { error: mailError } = await sendVerificationEmail(user.email ?? "", user.name ?? "", token);

    if (mailError) {
      // 🛡️ User ban gaya hai magar email nahi gayi. 
      // 201 bhejenge magar status message change kar denge taake UI "Resend" button dikhaye.
      return ApiResponse.success(
        { userId: user.id, partialSuccess: true },
        "Account created, but verification email failed. Please use 'Resend' to verify.",
        201
      );
    }

    return ApiResponse.success({ userId: user.id }, "Verification email sent!", 201);
  } catch (error) {
    return ApiResponse.error("Internal Server Error", 500);
  }
}