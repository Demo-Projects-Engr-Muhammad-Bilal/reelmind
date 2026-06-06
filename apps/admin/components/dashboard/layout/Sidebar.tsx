"use client";

import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard/DashboardProvider";
import { Activity, Clapperboard, Coins, Layers, Package, Settings, Users, X, LogOut, ListTreeIcon } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAction } from "@/app/actions/auth/auth";

export default function Sidebar() {
          const { activeView, setActiveView, isSidebarCollapsed, toggleSidebar } = useDashboard();
          const router = useRouter();

          // On initial load: Close sidebar on mobile and strictly set Overview as active
          useEffect(() => {
                    if (window.innerWidth < 768 && !isSidebarCollapsed) {
                              toggleSidebar();
                    }
                    setActiveView("overview");
                    // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);

          // Split links into two arrays for the 85% / 15% layout
          const mainLinks = [
                    { id: "overview", label: "Overview", icon: ListTreeIcon },
                    { id: "niches", label: "Niches", icon: Layers },
                    { id: "rates", label: "AI Rates", icon: Coins },
                    { id: "packages", label: "Credit Packages", icon: Package },
                    { id: "users", label: "Users", icon: Users },
                    { id: "audit", label: "Audit Logs", icon: Activity },
                    { id: "reels", label: "Observer Dash", icon: Clapperboard },
          ];

          const configLinks = [
                    { id: "settings", label: "Configuration", icon: Settings },
          ];

          const handleNavClick = (id: string) => {
                    setActiveView(id);
                    // Auto-close sidebar on mobile after clicking a link
                    if (window.innerWidth < 768) {
                              toggleSidebar();
                    }
          };

          const handleLogout = async () => {
                    const toastId = toast.loading("Terminating session...");
                    const res = await logoutAction();

                    if (res.success) {
                              toast.success("Logged out successfully.", { id: toastId });
                              router.push("/");
                    } else {
                              toast.error(res.error || "Failed to log out.", { id: toastId });
                    }
          };

          return (
                    <>
                              {/* Mobile Overlay Backdrop */}
                              {!isSidebarCollapsed && (
                                        <div
                                                  className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                                                  onClick={toggleSidebar}
                                        />
                              )}

                              <aside
                                        className={`fixed md:relative top-0 left-0 h-screen bg-background border-r border-border/50 transition-transform duration-300 z-50 flex flex-col pb-6 pt-0
        ${isSidebarCollapsed ? "-translate-x-full md:translate-x-0 md:w-20 px-2" : "translate-x-0 w-64 px-4 shadow-2xl md:shadow-none"}`}
                              >
                                        {/* --- PART 1: HEADER (Logo & Name) --- */}
                                        <div className={`flex-none h-16 flex items-center mb-2 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-2'}`}>
                                                  {isSidebarCollapsed ? (
                                                            <div className="size-10 rounded-full font-bold overflow-hidden flex items-center justify-center">
                                                                      <img
                                                                                src="/reelmind-logo-removebg-preview.png"
                                                                                alt="Logo"
                                                                                className="w-full h-full object-cover"
                                                                      />
                                                            </div>
                                                  ) : (
                                                            <>
                                                                      <div className="flex flex-col justify-center mt-3">
                                                                                <h1 className="text-2xl font-extrabold text-foreground tracking-wider whitespace-nowrap leading-none">ReelMind</h1>
                                                                                <p className="text-[10px] tracking-wider uppercase text-muted-foreground mt-1 font-semibold whitespace-nowrap leading-none">Management Hub</p>
                                                                      </div>
                                                                      <Button variant="ghost" size="icon" className="md:hidden -mr-2 cursor-pointer" onClick={toggleSidebar}>
                                                                                <X className="w-5 h-5 text-muted-foreground" />
                                                                      </Button>
                                                            </>
                                                  )}
                                        </div>

                                        {/* --- PART 2: MID (85% Main Links / 15% Config) --- */}
                                        <div className="flex-grow flex flex-col overflow-hidden my-7">

                                                  {/* Top 85% - Main Links */}
                                                  <nav className="h-[85%] overflow-y-auto space-y-2 no-scrollbar pb-2">
                                                            {mainLinks.map((item) => {
                                                                      const Icon = item.icon;
                                                                      const isActive = activeView === item.id;
                                                                      return (
                                                                                <div
                                                                                          key={item.id}
                                                                                          onClick={() => handleNavClick(item.id)}
                                                                                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group
                    ${isActive ? "text-primary font-semibold border-r-2 border-primary bg-muted/40" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}
                    ${isSidebarCollapsed ? "justify-center hidden md:flex" : "flex"}`}
                                                                                          title={isSidebarCollapsed ? item.label : ""}
                                                                                >
                                                                                          <Icon className="w-5 h-5 flex-shrink-0" />
                                                                                          {!isSidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                                                                                </div>
                                                                      );
                                                            })}
                                                  </nav>

                                                  {/* Bottom 15% - Configuration Link */}
                                                  <nav className="h-[15%] overflow-y-auto pt-3 space-y-2 border-t border-border/50 no-scrollbar">
                                                            {configLinks.map((item) => {
                                                                      const Icon = item.icon;
                                                                      const isActive = activeView === item.id;
                                                                      return (
                                                                                <div
                                                                                          key={item.id}
                                                                                          onClick={() => handleNavClick(item.id)}
                                                                                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group
                    ${isActive ? "text-primary font-semibold border-r-2 border-primary bg-muted/40" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}
                    ${isSidebarCollapsed ? "justify-center hidden md:flex" : "flex"}`}
                                                                                          title={isSidebarCollapsed ? item.label : ""}
                                                                                >
                                                                                          <Icon className="w-5 h-5 flex-shrink-0" />
                                                                                          {!isSidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                                                                                </div>
                                                                      );
                                                            })}
                                                  </nav>

                                        </div>

                                        {/* --- PART 3: FOOTER (User Details & Logout) --- */}
                                        <div className={`flex-none mt-auto pt-6 border-t border-border/50 flex ${isSidebarCollapsed ? 'flex-col items-center gap-4 px-0 hidden md:flex' : 'items-center justify-between px-2'}`}>
                                                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                                                            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                                      M
                                                            </div>
                                                            {!isSidebarCollapsed && (
                                                                      <div className="flex flex-col whitespace-nowrap overflow-hidden">
                                                                                <span className="text-sm font-medium text-foreground truncate">M Bilal Khalid</span>
                                                                                <span className="text-xs text-muted-foreground truncate">Full Stack Engineer</span>
                                                                      </div>
                                                            )}
                                                  </div>

                                                  <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={handleLogout}
                                                            title="Log Out"
                                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                                                  >
                                                            <LogOut className="w-5 h-5" />
                                                  </Button>
                                        </div>
                              </aside>
                    </>
          );
}