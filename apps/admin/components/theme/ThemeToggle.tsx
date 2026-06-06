"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
          const { theme, setTheme } = useTheme();

          return (
                    <Button
                              variant="outline"
                              size="icon"
                              type="button"
                              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                              className="size-9 rounded-full border-border/60 bg-background/50 hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 cursor-pointer relative flex items-center justify-center"
                    >
                              {/* Sun Icon (Visible in Light Mode) */}
                              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />

                              {/* Moon Icon (Visible in Dark Mode) */}
                              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />

                              <span className="sr-only">Toggle theme</span>
                    </Button>
          );
}
