import { prisma } from "../../../../packages/database";
import { SignJWT } from "jose";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "aireelgen-default-secret");

export async function createSingletonSession(userId: string, email: string) {
          const newSessionId = crypto.randomUUID();

          // 🛡️ Singleton Logic: Purane sessions invalid
          await prisma.user.update({
                    where: { id: userId },
                    data: { currentSessionId: newSessionId },
          });

          const token = await new SignJWT({ userId, email, sessionId: newSessionId })
                    .setProtectedHeader({ alg: "HS256" })
                    .setIssuedAt()
                    .setExpirationTime("24h")
                    .sign(JWT_SECRET);

          return token;
}