"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutState } from "@/context/dashboard/LayoutContext";
import { useAuth } from "@/context/auth/AuthContext";
import {
  History,
  Globe,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Clock,
  WorkflowIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed, setIsMobileOpen, isFullscreen } = useLayoutState();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // ─── SAFE VARIABLES FOR TYPESCRIPT ───
  // TypeScript ko khush rakhne ke liye inko strictly string mein convert kar liya
  const userName = user?.name ? String(user.name) : "User";
  const userEmail = user?.email ? String(user.email) : "";
  const userAvatar = user?.avatar ? String(user.avatar) : undefined;

  // ─── STYLING HELPERS ───
  const linkContainerClass = (path: string, activeColorClass: string) => `
    w-full justify-start gap-3 rounded-full font-medium text-[15px] transition-all py-6 cursor-pointer 
    ${isActive(path) ? activeColorClass : "text-muted-foreground hover:bg-muted hover:text-foreground"} 
    ${isCollapsed ? "md:justify-center md:px-0 md:h-12 md:w-12 md:mx-auto" : "px-5"}
  `;

  const textClass = `${isCollapsed ? "md:hidden" : "block"} font-headline font-light tracking-wider`;
  const iconClass = "w-[18px] h-[18px] shrink-0";

  return (
    <aside className="h-full w-full bg-sidebar flex flex-col p-[15px] relative transition-all duration-300 select-none">

      {/* ─── COLLAPSE BUTTON ─── */}
      {!isFullscreen && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-[-22px] top-6 size-8 rounded-full bg-background border border-border shadow-sm hidden md:flex items-center justify-center text-muted-foreground hover:text-primary z-50 transition-all cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </Button>
      )}

      {/* ─── HEADER & PROFILE ─── */}
      <div className={`flex flex-col mb-2 pt-0 transition-all ${isCollapsed ? "md:items-center md:px-0" : "px-4"}`}>
        <h1 className={`font-black tracking-tight text-foreground font-headline transition-all ${isCollapsed ? "md:text-[18px] pt-3" : "text-[32px]"}`}>
          {isCollapsed ? "RM" : "ReelMind"}
        </h1>

        <div className={`flex items-center gap-3 mt-5 pt-4 min-w-0 transition-all ${isCollapsed ? "md:justify-center" : ""}`}>
          {user ? (
            <>
              <Avatar className="h-10 w-10 border-2 border-border shadow-sm shrink-0">
                {/* ⚡ Yahan safe variables use kiye hain */}
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary font-headline">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col min-w-0 transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                {/* ⚡ Yahan bhi safe variables render ho rahe hain */}
                <p className="text-[14px] font-bold text-foreground leading-none truncate font-headline">{userName}</p>
                <p className="text-[11px] font-medium text-muted-foreground truncate mt-1.5">{userEmail}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-border shadow-sm flex items-center justify-center font-bold text-xs text-muted-foreground shrink-0">GU</div>
              <div className={`flex flex-col min-w-0 transition-opacity duration-200 ${isCollapsed ? "md:hidden" : "block"}`}>
                <p className="text-[14px] font-semibold text-foreground leading-none truncate">Guest Account</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Free Tier</p>
              </div>
            </>
          )}
        </div>
      </div>

      <Separator className="my-3 bg-border" />

      {/* ─── NAVIGATION ─── */}
      <nav className="flex-1 space-y-1 px-1 mt-2">
        <Link href="/dashboard" className="block w-full" onClick={() => setIsMobileOpen(false)}>
          <Button variant="ghost" className={linkContainerClass("/dashboard", "bg-primary/10 text-primary hover:bg-primary/15")}>
            <WorkflowIcon className={iconClass} />
            <span className={textClass}>Workflow</span>
          </Button>
        </Link>

        {/* Creator Studio Label */}
        {!isCollapsed && (
          <p className="px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1 mt-6">
            Creator Studio
          </p>
        )}

        <div className={isCollapsed ? "mt-2 space-y-1" : "space-y-1"}>
          <Link href="/dashboard/history" className="block w-full" onClick={() => setIsMobileOpen(false)}>
            <Button variant="ghost" className={linkContainerClass("/dashboard/history", "bg-primary/10 text-primary hover:bg-primary/15")}>
              <History className={iconClass} />
              <span className={textClass}>My History</span>
            </Button>
          </Link>

          <Link href="/dashboard/queue" className="block w-full" onClick={() => setIsMobileOpen(false)}>
            <Button variant="ghost" className={linkContainerClass("/dashboard/queue", "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20")}>
              <Clock className={iconClass} />
              <span className={textClass}>My Queue</span>
            </Button>
          </Link>

          <Link href="/dashboard/gallery" className="block w-full" onClick={() => setIsMobileOpen(false)}>
            <Button variant="ghost" className={linkContainerClass("/dashboard/gallery", "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20")}>
              <Globe className={iconClass} />
              <span className={textClass}>Gallery</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* ─── FOOTER ACTIONS ─── */}
      <div className="space-y-1 px-1">
        <Separator className="my-4 bg-border" />

        <Link href="#" className="block w-full" onClick={() => setIsMobileOpen(false)}>
          <Button variant="ghost" className={`w-full justify-start gap-3 text-muted-foreground font-medium text-[14px] hover:bg-muted hover:text-foreground py-5 rounded-full transition-all cursor-pointer ${isCollapsed ? "md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto" : "px-5"}`}>
            <HelpCircle className="w-[18px] h-[18px] shrink-0" />
            <span className={isCollapsed ? "md:hidden" : "block font-headline font-light tracking-wider"}>Help</span>
          </Button>
        </Link>

        {user && (
          <Button
            variant="ghost"
            onClick={() => { logout(); setIsMobileOpen(false); toast.success("Session closed configuration terminated."); }}
            className={`w-full justify-start gap-3 text-red-500 font-bold text-[14px] hover:bg-red-500/10 hover:text-red-600 py-5 rounded-full transition-all cursor-pointer ${isCollapsed ? "md:justify-center md:px-0 md:w-11 md:h-11 md:mx-auto" : "px-5"}`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span className={isCollapsed ? "md:hidden" : "block font-headline font-light tracking-wider"}>Logout</span>
          </Button>
        )}
      </div>
    </aside>
  );
}