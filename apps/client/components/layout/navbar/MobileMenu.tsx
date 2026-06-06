"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Coins, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/context/auth/AuthContext";
import { toast } from "sonner";

export default function MobileMenu({ isOpen, onNavClick, toggleMenu }: any) {
          const { user, logout } = useAuth();

          const handleLogout = () => {
                    toast.promise(logout(), {
                              loading: 'Ending session...',
                              success: 'Logged out!',
                              error: 'Logout failed',
                    });
                    toggleMenu();
          };

          return (
                    <AnimatePresence>
                              {isOpen && (
                                        <motion.div
                                                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                                  transition={{ duration: 0.2, ease: "easeOut" }}
                                                  className="absolute top-full left-0 w-full mt-3 bg-background/95 backdrop-blur-xl border border-border rounded-3xl p-5 shadow-2xl md:hidden z-[100]"
                                        >
                                                  {/* 1. Navigation Links */}
                                                  <div className="flex flex-col gap-1">
                                                            {NAV_LINKS.map((link) => (
                                                                      <Link
                                                                                key={link.name}
                                                                                href={link.href}
                                                                                onClick={(e) => onNavClick(e, link.href)}
                                                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all font-headline font-bold uppercase italic text-sm tracking-wide"
                                                                      >
                                                                                {link.icon} {link.name}
                                                                      </Link>
                                                            ))}
                                                  </div>

                                                  <Separator className="my-4 bg-border/50" />

                                                  {/* 2. User Section */}
                                                  <div className="flex flex-col gap-4">
                                                            {user ? (
                                                                      <>
                                                                                {/* Profile Card */}
                                                                                <div className="flex items-center justify-between bg-secondary/30 rounded-2xl p-3 border border-border/50">
                                                                                          <div className="flex items-center gap-3">
                                                                                                    <Avatar className="h-10 w-10 border border-border">
                                                                                                              <AvatarImage src={user.avatar} alt={user.name as string} />
                                                                                                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                                                                                        {user.name?.charAt(0)}
                                                                                                              </AvatarFallback>
                                                                                                    </Avatar>
                                                                                                    <div className="flex flex-col">
                                                                                                              <span className="font-headline font-black text-sm text-foreground leading-none mb-1">{user.name}</span>
                                                                                                              <Link href="/profile" onClick={toggleMenu} className="text-[10px] text-primary font-bold uppercase tracking-tighter hover:underline">
                                                                                                                        View Profile
                                                                                                              </Link>
                                                                                                    </div>
                                                                                          </div>
                                                                                          <div className="flex items-center gap-1.5 font-bold text-[11px] bg-background/50 border border-border px-2.5 py-1 rounded-lg text-foreground shadow-sm">
                                                                                                    <Coins className="w-3.5 h-3.5 text-primary" /> {user.credits}
                                                                                          </div>
                                                                                </div>

                                                                                {/* Actions Grid */}
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                          <Link href="/settings" onClick={toggleMenu} className="w-full">
                                                                                                    <Button variant="outline" className="w-full gap-2 text-xs h-10 font-bold uppercase italic border-border/50">
                                                                                                              <Settings className="w-3.5 h-3.5" /> Settings
                                                                                                    </Button>
                                                                                          </Link>
                                                                                          <Button
                                                                                                    variant="outline"
                                                                                                    onClick={handleLogout}
                                                                                                    className="w-full gap-2 text-xs h-10 font-bold uppercase italic text-red-400 hover:text-red-300 border-border/50"
                                                                                          >
                                                                                                    <LogOut className="w-3.5 h-3.5" /> Log out
                                                                                          </Button>
                                                                                </div>

                                                                                <Link href="/dashboard" onClick={toggleMenu}>
                                                                                          <Button className="w-full gap-2 h-12 font-black uppercase italic tracking-widest purple-glow">
                                                                                                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                                                                                          </Button>
                                                                                </Link>
                                                                      </>
                                                            ) : (
                                                                      /* Auth Actions */
                                                                      <div className="flex flex-col gap-3">
                                                                                <Link href="/auth?mode=login" onClick={toggleMenu} className="w-full">
                                                                                          <Button variant="ghost" className="w-full h-12 font-bold uppercase italic text-muted-foreground hover:text-foreground">
                                                                                                    Log in
                                                                                          </Button>
                                                                                </Link>
                                                                                <Link href="/auth?mode=signup" onClick={toggleMenu} className="w-full">
                                                                                          <Button className="w-full h-12 font-black uppercase italic tracking-widest purple-glow">
                                                                                                    Get Started
                                                                                          </Button>
                                                                                </Link>
                                                                      </div>
                                                            )}
                                                  </div>
                                        </motion.div>
                              )}
                    </AnimatePresence>
          );
}