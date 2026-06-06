import { DashboardProvider } from "@/context/dashboard/DashboardProvider";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import Header from "@/components/dashboard/layout/Header";
import { ReactNode } from "react";
import SessionGuard from "@/components/dashboard/guard/SessionGuard";

export const metadata = {
          title: "Reelmind | Management Hub",
          description: "Restricted access admin portal for Reelmind",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
          return (
                    <SessionGuard>
                              <DashboardProvider>
                                        <div className="h-screen w-full flex bg-background overflow-hidden relative">
                                                  <Sidebar />

                                                  {/* Main Content Area */}
                                                  <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                                                            <Header />
                                                            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                                                                      {children}
                                                            </main>
                                                  </div>
                                        </div>
                              </DashboardProvider>
                    </SessionGuard>
          );
}