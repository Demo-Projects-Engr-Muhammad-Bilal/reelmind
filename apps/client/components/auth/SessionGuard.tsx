"use client";
import { useSessionGuard } from "@/hooks/auth/use-session-guard";

export default function SessionGuard() {
          useSessionGuard(10000); // 10s for testing as per your code
          return null;
}