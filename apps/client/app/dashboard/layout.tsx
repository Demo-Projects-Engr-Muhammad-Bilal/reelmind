"use client";

import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import { DashboardProvider } from "@/context/dashboard/DashboardContext";
import { LayoutStateProvider, useLayoutState } from "@/context/dashboard/LayoutContext";
import SessionGuard from "@/components/auth/SessionGuard";

export { useLayoutState };

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isFullscreen, isMobileOpen, setIsMobileOpen } = useLayoutState();

  return (
    <div className="min-h-screen bg-sidebar text-foreground relative selection:bg-primary/20 overflow-x-hidden transition-colors duration-300 flex w-full">
      <aside
        className={`fixed left-0 top-0 h-full z-50 bg-sidebar transition-all duration-300 ease-in-out transform w-[280px]
          ${isFullscreen
            ? "-translate-x-full md:-translate-x-full"
            : isMobileOpen
              ? "translate-x-0 md:translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          ${isCollapsed ? "md:w-[80px]" : "md:w-[280px]"}
        `}
      >
        <Sidebar />
      </aside>

      <div
        className={`min-h-screen flex flex-col w-full transition-all duration-300 ease-in-out relative z-10 max-w-full pl-0
          ${isFullscreen
            ? "pl-0 pt-0"
            : isCollapsed ? "md:pl-[80px] pt-[70px]" : "md:pl-[280px] pt-[70px]"}
        `}
      >
        <Navbar />
        <div
          className={`flex-1 w-auto transition-all duration-300 bg-background overflow-hidden box-sizing max-w-full
            ${isFullscreen
              ? "md:rounded-tl-0 border-t-0 border-l-0"
              : "md:rounded-tl-[32px] md:border-t md:border-l md:border-border"}
          `}
        >
          <main className="w-auto h-full px-4 sm:px-6 md:px-12 py-5 mx-auto flex flex-col justify-start items-center box-border">
            {children}
          </main>
        </div>
      </div>

      {isMobileOpen && !isFullscreen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-sidebar/60 backdrop-blur-xs z-40 md:hidden transition-all duration-300"
        />
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutStateProvider>
      <DashboardProvider>
        <SessionGuard />
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </LayoutStateProvider>
  );
}
