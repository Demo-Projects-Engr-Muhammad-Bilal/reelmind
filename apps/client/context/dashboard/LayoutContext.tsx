// context/dashboard/LayoutContext.tsx
// Extracted from app/dashboard/layout.tsx to decouple UI state from routing infrastructure.
"use client";

import React, { createContext, useContext, useState } from "react";

interface LayoutStateContextType {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

const LayoutStateContext = createContext<LayoutStateContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  isFullscreen: false,
  setIsFullscreen: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
});

export const useLayoutState = () => useContext(LayoutStateContext);

export const LayoutStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <LayoutStateContext.Provider
      value={{ isCollapsed, setIsCollapsed, isFullscreen, setIsFullscreen, isMobileOpen, setIsMobileOpen }}
    >
      {children}
    </LayoutStateContext.Provider>
  );
};
