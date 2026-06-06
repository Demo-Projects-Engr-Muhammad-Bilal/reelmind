import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
          const origin = "http://localhost:3000"; // Exact origin (no wildcard *)

          // 1. Handle Preflight (OPTIONS)
          if (request.method === "OPTIONS") {
                    return new NextResponse(null, {
                              status: 204,
                              headers: {
                                        "Access-Control-Allow-Origin": origin,
                                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                                        "Access-Control-Allow-Credentials": "true", // YE SAB SE ZAROORI HAI
                                        "Access-Control-Max-Age": "86400",
                              },
                    });
          }

          // 2. Handle Actual Request
          const response = NextResponse.next();
          response.headers.set("Access-Control-Allow-Origin", origin);
          response.headers.set("Access-Control-Allow-Credentials", "true"); // Phir se check karein
          response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
          response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

          return response;
}

export const config = {
          matcher: "/api/:path*",
};