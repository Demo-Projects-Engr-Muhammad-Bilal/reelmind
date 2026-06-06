// lib/api-clients.ts
// Two separate fetch wrappers — one per microservice.
// NEVER merge these: they target different ports / auth mechanisms.

import { AI_SERVICE_URL, AUTH_SERVICE_URL } from "@/lib/constants";

// ─── AI / Backend Service Client ─────────────────────────────────────────────
export async function aiServiceFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${AI_SERVICE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
}

// ─── Auth Service Client ──────────────────────────────────────────────────────
// Targets a completely separate microservice (different port).
// Always passes credentials: "include" so session cookies are forwarded.
export async function authServiceFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${AUTH_SERVICE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
}
