// apps/web/src/components/layout/navbar/Navbar.tsx
"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useNavbarLogic } from "@/hooks/marketing/use-navbar-logic";
import NavLinks from "./NavLinks";
import UserActions from "./UserActions";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
          const { states, setters, handleNavClick } = useNavbarLogic();

          return (
                    <>
                              <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent z-[98] pointer-events-none" />

                              <div className="fixed top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[100]">
                                        <nav className={`w-full rounded-full transition-all duration-500 flex justify-between items-center px-5 py-2.5 border animate-nav-enter ${states.isScrolled
                                                            ? "bg-background/80 backdrop-blur-xl border-border shadow-2xl scale-[0.98]"
                                                            : "bg-background/40 backdrop-blur-md border-white/5"
                                                  }`}>
                                                  <div className="flex items-center gap-10">
                                                            <Link
                                                                      href="/"
                                                                      onClick={(e) => handleNavClick(e, '/')}
                                                                      className="text-xl font-black tracking-wider hover:opacity-80 transition-opacity"
                                                            >
                                                                      <span className="text-primary font-black italic">REEL</span>MIND
                                                            </Link>

                                                            <NavLinks activeSection={states.activeSection} onNavClick={handleNavClick} />
                                                  </div>

                                                  <div className="flex items-center gap-2">
                                                            <UserActions />

                                                            <Button
                                                                      variant="ghost"
                                                                      size="icon"
                                                                      className="md:hidden rounded-full"
                                                                      onClick={() => setters.setIsMobileMenuOpen(!states.isMobileMenuOpen)}
                                                            >
                                                                      {states.isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                                            </Button>
                                                  </div>
                                        </nav>

                                        <MobileMenu
                                                  isOpen={states.isMobileMenuOpen}
                                                  onNavClick={handleNavClick}
                                                  toggleMenu={() => setters.setIsMobileMenuOpen(false)}
                                        />
                              </div>
                    </>
          );
}