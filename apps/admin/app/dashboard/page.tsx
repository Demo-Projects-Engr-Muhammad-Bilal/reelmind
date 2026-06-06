"use client";

import { useDashboard } from "@/context/dashboard/DashboardProvider";
import Overview from "@/components/dashboard/views/overview/Overview"; // ⚡ NEW IMPORT
import NichesList from "@/components/dashboard/views/niches/NichesList";
import PricingList from "@/components/dashboard/views/pricings/PricingList";
import PackagesList from "@/components/dashboard/views/packages/PackagesList";
import UsersList from "@/components/dashboard/views/users/UsersList";
import UsageLogsList from "@/components/dashboard/views/usagelogs/UsageLogsList";
import ReelsObserver from "@/components/dashboard/views/reels/ReelsObserver";
import AdminSettings from "@/components/dashboard/views/settings/AdminSettings";

export default function DashboardPage() {
          const { activeView } = useDashboard();

          return (
                    <div className="px-6 py-6 md:p-8 lg:p-10 pb-32 w-full max-w-7xl mx-auto animate-in fade-in duration-500">

                              {/* Route Switcher Logic */}
                              {activeView === "overview" && <Overview />} {/* ⚡ NEW ROUTE ADDED */}
                              {activeView === "niches" && <NichesList />}
                              {activeView === "rates" && <PricingList />}
                              {activeView === "packages" && <PackagesList />}
                              {activeView === "users" && <UsersList />}
                              {activeView === "audit" && <UsageLogsList />}
                              {activeView === "reels" && <ReelsObserver />}
                              {activeView === "settings" && <AdminSettings />}

                              {/* Fallbacks */}
                              {/* ⚡ 'dashboard' added to the exclusion list below */}
                              {activeView !== "overview" && activeView !== "niches" && activeView !== "rates" && activeView !== "packages" && activeView !== "users" && activeView !== "audit" && activeView !== "reels" && activeView !== "settings" && (
                                        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                                                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl uppercase shadow-inner">
                                                            {activeView.charAt(0)}
                                                  </div>
                                                  <h2 className="text-3xl font-semibold text-foreground capitalize">{activeView.replace('-', ' ')}</h2>
                                                  <p className="text-muted-foreground">This module is currently under construction.</p>
                                        </div>
                              )}
                    </div>
          );
}