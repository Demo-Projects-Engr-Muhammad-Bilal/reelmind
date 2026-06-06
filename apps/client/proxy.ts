// middleware.ts
// Note: middleware runs in the Edge runtime — it cannot import from lib/constants
// because constants.ts uses React (JSX). We read env vars directly here only.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aireelgen-default-secret-key-change-me"
);

// Read AUTH_SERVICE_URL directly in middleware (Edge-safe — no React imports).
const AUTH_SERVICE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth?mode=login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);

      const sessionCheck = await fetch(
        `${AUTH_SERVICE_URL}/api/auth/validate-session`,
        {
          headers: { Cookie: `auth_token=${token}` },
          signal: AbortSignal.timeout(3000),
        }
      ).catch(() => ({ status: 200 }));

      if ((sessionCheck as Response).status === 401) {
        const response = NextResponse.redirect(new URL("/auth?mode=login", request.url));
        response.cookies.delete("auth_token");
        return response;
      }

      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/auth?mode=login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  if (pathname.startsWith("/auth") && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
