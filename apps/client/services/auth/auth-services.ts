// services/auth/auth-services.ts
// Auth microservice client. All calls target AUTH_SERVICE_URL exclusively.
// Do NOT add AI service calls here — this file is auth-only.

import { AUTH_SERVICE_URL } from "@/lib/constants";

const AUTH_API = `${AUTH_SERVICE_URL}/api/auth`;

export const authService = {
  // 1. Standard Login
  async login(data: Record<string, unknown>) {
    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  // 2. Signup
  async signup(data: Record<string, unknown>) {
    const res = await fetch(`${AUTH_API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { ok: res.ok, data: await res.json() };
  },

  // 3. Google OAuth
  async verifyGoogle(code: string) {
    const res = await fetch(`${AUTH_API}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return { ok: res.ok, data: await res.json() };
  },

  // 4. Forgot Password
  async forgotPassword(email: string) {
    const res = await fetch(`${AUTH_API}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return {
      ok: res.ok,
      data: await res.json(),
      contentType: res.headers.get("content-type"),
    };
  },

  // 5. Reset Password
  async resetPassword(token: string, password: string) {
    const res = await fetch(`${AUTH_API}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    return { ok: res.ok, data: await res.json() };
  },

  // 6. Verify Email
  async verifyEmail(token: string) {
    const res = await fetch(`${AUTH_API}/verify?token=${token}`);
    return res.ok;
  },

  // 7. Validate Session
  async validateSession() {
    const res = await fetch(`${AUTH_API}/validate-session`, {
      cache: "no-store",
      credentials: "include",
    });
    return { ok: res.ok, status: res.status, data: res.ok ? await res.json() : null };
  },

  // 8. Resend Verification
  async resendVerification(email: string) {
    const res = await fetch(`${AUTH_API}/resend-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    return { ok: res.ok, data: await res.json() };
  },

  // Helper: Set auth cookie
  setToken(token: string) {
    if (!token) {
      console.error("setToken called with empty token");
      return;
    }
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `auth_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax;`;
  },
};
