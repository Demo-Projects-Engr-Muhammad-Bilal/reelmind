import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
          const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

          if (request.method === "OPTIONS") {
                    return new NextResponse(null, {
                              status: 204,
                              headers: {
                                        "Access-Control-Allow-Origin": allowedOrigin,
                                        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
                                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                                        "Access-Control-Allow-Credentials": "true",
                                        "Access-Control-Max-Age": "86400",
                              },
                    });
          }

          const response = NextResponse.next();
          response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
          response.headers.set("Access-Control-Allow-Credentials", "true");
          response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
          response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

          return response;
}

export const config = {
          matcher: "/api/:path*",
};