"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DashboardContextType = {
          activeView: string;
          setActiveView: (view: string) => void;
          isSidebarCollapsed: boolean;
          toggleSidebar: () => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
          const [activeView, setActiveView] = useState("niches"); 
          const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

          const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

          return (
                    <DashboardContext.Provider value={{ activeView, setActiveView, isSidebarCollapsed, toggleSidebar }}>
                              {children}
                    </DashboardContext.Provider>
          );
}

export const useDashboard = () => {
          const context = useContext(DashboardContext);
          if (!context) throw new Error("useDashboard must be used within DashboardProvider");
          return context;
};