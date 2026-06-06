"use client";

/**
 * @file context/dashboard/DashboardProvider.tsx
 * @description UI-only state context: active view, sidebar toggle, cross-navigation search.
 * Data fetching and caching is handled entirely by DashboardDataProvider.
 *
 * Cross-nav search replaces the old sessionStorage hack.
 * When UsersList navigates a user to the Audit or Reels view with a pre-filled
 * search term, it calls setCrossNavSearch() then setActiveView() — no sessionStorage writes.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ViewKey =
  | "overview"
  | "niches"
  | "rates"
  | "packages"
  | "users"
  | "audit"
  | "reels"
  | "settings";

interface CrossNavSearch {
  audit?: string;
  reels?: string;
}

interface DashboardContextType {
  activeView: ViewKey;
  setActiveView: (view: ViewKey) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  crossNavSearch: CrossNavSearch;
  setCrossNavSearch: (view: keyof CrossNavSearch, query: string) => void;
  clearCrossNavSearch: (view: keyof CrossNavSearch) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveViewState] = useState<ViewKey>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [crossNavSearch, setCrossNavSearchState] = useState<CrossNavSearch>({});

  const toggleSidebar = useCallback(
    () => setIsSidebarCollapsed((prev) => !prev),
    []
  );

  const setActiveView = useCallback((view: ViewKey) => {
    setActiveViewState(view);
  }, []);

  const setCrossNavSearch = useCallback(
    (view: keyof CrossNavSearch, query: string) => {
      setCrossNavSearchState((prev) => ({ ...prev, [view]: query }));
    },
    []
  );

  const clearCrossNavSearch = useCallback((view: keyof CrossNavSearch) => {
    setCrossNavSearchState((prev) => {
      const next = { ...prev };
      delete next[view];
      return next;
    });
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        isSidebarCollapsed,
        toggleSidebar,
        crossNavSearch,
        setCrossNavSearch,
        clearCrossNavSearch,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
