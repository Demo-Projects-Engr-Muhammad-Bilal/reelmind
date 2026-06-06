"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
          const { theme, setTheme } = useTheme()
          const [mounted, setMounted] = useState(false)

          // Hydration error se bachne ke liye
          useEffect(() => setMounted(true), [])
          if (!mounted) return <div className="w-9 h-9" />

          return (
                    <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full w-9 h-9 border border-border/40 hover:bg-secondary/50 transition-all duration-300"
                              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                              <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                              <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
                              <span className="sr-only">Toggle theme</span>
                    </Button>
          )
}