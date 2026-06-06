// components/dashboard/navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLayoutState } from "@/context/dashboard/LayoutContext";
import { useAuth } from "@/context/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Navbar() {
  const { user } = useAuth();
  const { isMobileOpen, setIsMobileOpen, isCollapsed, isFullscreen } = useLayoutState();

  return (
    <div className="fixed top-0 right-0 left-0 z-40 flex flex-col transition-all duration-300 max-w-full">
      <header
        className={`h-[70px] bg-sidebar/80 backdrop-blur-md flex justify-between items-center px-3 sm:px-6 md:px-[40px] transition-all duration-300 fixed top-0 right-0 z-40 left-0
          ${isCollapsed ? "md:left-[80px]" : "md:left-[280px]"}
          ${isFullscreen ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}
        `}
      >
        {/* Left */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden rounded-full shrink-0 cursor-pointer text-muted-foreground hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0 min-w-0">
          <div className="flex items-center bg-primary/10 text-primary rounded-full p-0.5 pl-2.5 sm:pl-4 gap-1.5 sm:gap-3 border border-primary/20 shadow-sm select-none shrink-0 min-w-0">
            <span className="text-[10px] sm:text-[12px] font-bold tracking-wider uppercase whitespace-nowrap truncate max-w-[75px] sm:max-w-none">
              {user ? `${(user as any).credits?.toLocaleString()} Credits` : "0 Credits"}
            </span>
            <Link href="/pricing" className="shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 sm:h-7 px-2 sm:px-3 bg-background text-primary rounded-full text-[10px] sm:text-[11px] font-bold border border-border hover:bg-muted shadow-sm transition-all cursor-pointer"
              >
                Recharge
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.success("All system operational notices synchronized.")}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all relative cursor-pointer"
            >
              <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
