"use client";

import { Menu, PanelLeft } from "lucide-react";
import { useDashboard } from "@/context/dashboard/DashboardProvider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Header() {
          const { toggleSidebar, isSidebarCollapsed } = useDashboard();

          return (
                    <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 z-40 sticky top-0 w-full flex items-center">
                              {/* ⚡ MAIN FIX: Is div ki classes aapke neechay wale content wrapper se match honi chahiye */}
                              <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">

                                        <div className="flex items-center gap-2">
                                                  {/* Toggle Icons based on Desktop/Mobile */}
                                                  <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={toggleSidebar}
                                                            className="md:hidden cursor-pointer"
                                                  >
                                                            <Menu className="w-5 h-5 text-foreground" />
                                                  </Button>

                                                  <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={toggleSidebar}
                                                            className="hidden md:flex cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                                                  >
                                                            <PanelLeft
                                                                      className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""
                                                                                }`}
                                                            />
                                                  </Button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                                  {/* ✅ Reusable ThemeToggle component */}
                                                  <ThemeToggle />
                                        </div>

                              </div>
                    </header>
          );
}