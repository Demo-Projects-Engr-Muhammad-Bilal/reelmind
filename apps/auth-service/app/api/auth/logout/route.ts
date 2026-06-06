import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-response/api-response";

export async function POST() {
          try {
                    const cookieStore = await cookies();

                    // Professional Cookie Clearance
                    cookieStore.set("auth_token", "", {
                              httpOnly: true,
                              secure: process.env.NODE_ENV === "production",
                              sameSite: "lax",
                              maxAge: 0,
                              path: "/",
                    });

                    console.log("[AUTH-SERVICE] User session cleared.");
                    return ApiResponse.success({}, "Logged out successfully");

          } catch (error) {
                    console.error("[AUTH-SERVICE] Logout Crash:", error);
                    return ApiResponse.error("Logout process failed", 500);
          }
}