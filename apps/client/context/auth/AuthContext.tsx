// context/auth/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/auth/auth-services";
import { AUTH_SERVICE_URL } from "@/lib/constants";

// ⚡ Prisma Schema Mapped Interface
export interface UserData {
  id: string;
  email: string;
  name?: string | null;
  password?: string; // Usually backend se filter ho kar aana chahiye
  credits: number;
  isVerified: boolean;
  verifyToken?: string | null;
  verifyTokenExpiry?: Date | string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | string | null;
  currentSessionId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  telegramId?: string | null;

  // Relations / Extra UI Fields
  reels?: any[];
  telegramCreds?: any;
  avatar?: string; // UI ke liye safe fallback

  [key: string]: any; // Catch-all for any extra fields
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  setUser: (user: UserData | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { ok, data } = await authService.validateSession();
        if (ok && data?.valid) {
          setUser(data.user as UserData);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${AUTH_SERVICE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout API failed, continuing client-side logout", e);
    } finally {
      setUser(null);
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/auth?mode=login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};