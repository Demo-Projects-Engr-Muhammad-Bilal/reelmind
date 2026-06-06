"use client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
          DropdownMenu,
          DropdownMenuContent,
          DropdownMenuItem,
          DropdownMenuSeparator,
          DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth/AuthContext";
import { Coins, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function UserActions() {
          const { user, logout } = useAuth();

          return (
                    <div className="flex items-center gap-3">
                              <ThemeToggle />

                              {!user ? (
                                        <>
                                                  <Link href="/auth?mode=login" className="hidden sm:block">
                                                            <Button variant="ghost" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                                                                      Log in
                                                            </Button>
                                                  </Link>
                                                  <Link href="/auth?mode=signup">
                                                            <Button className="h-9 px-5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all active:scale-95">
                                                                      Get Started
                                                            </Button>
                                                  </Link>
                                        </>
                              ) : (
                                        <div className="flex items-center gap-3">
                                                  {/* Credits pill: Clean & Minimal */}
                                                  <Link href="/billing" className="hidden md:block">
                                                            <div className="h-9 px-4 rounded-full bg-secondary/40 border border-border/50 flex items-center gap-2 hover:bg-secondary/60 transition-colors">
                                                                      <Coins className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                                                                      <span className="text-[11px] font-bold tracking-tight">{user.credits}</span>
                                                            </div>
                                                  </Link>

                                                  {/* Profile Dropdown: Using Shadcn for logic, Custom for Look */}
                                                            <DropdownMenu>
                                                                      <DropdownMenuTrigger asChild>
                                                                                <button className="cursor-pointer focus:outline-none group rounded-full">
                                                                                          {/* ⚡ PREMIUM AVATAR: Subtle border aur hover par glow effect */}
                                                                                          <Avatar className="h-10 w-10 border border-border/50 bg-card group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300">
                                                                                                    <AvatarImage src={user.avatar} className="object-cover" />
                                                                                                    <AvatarFallback className="text-xs font-bold bg-muted text-primary uppercase tracking-wider">
                                                                                                              US {/* User ke initials yahan aayenge */}
                                                                                                    </AvatarFallback>
                                                                                          </Avatar>
                                                                                </button>
                                                                      </DropdownMenuTrigger>

                                                                      {/* ⚡ PREMIUM CONTENT BOX: Glassmorphism with dark theme variables */}
                                                                      <DropdownMenuContent
                                                                                align="end"
                                                                                className="w-64 bg-card border border-border/50 rounded-2xl p-2 mt-2"
                                                                      >
                                                                                {/* User Info Section */}
                                                                                <div className="px-3 py-2.5 mb-1 flex flex-col">
                                                                                          {/* ⚡ font-headline use kiya hai jo tumne layout mein define kiya tha */}
                                                                                          <p className="text-sm font-headline font-bold text-foreground leading-none truncate tracking-wide">
                                                                                                    {user.name}
                                                                                          </p>
                                                                                          <p className="text-[11px] text-muted-foreground truncate mt-1.5">
                                                                                                    {user.email}
                                                                                          </p>
                                                                                </div>

                                                                                <DropdownMenuSeparator className="bg-border/50 mx-1" />

                                                                                {/* Menu Items */}
                                                                                <Link href="/dashboard" className="outline-none">
                                                                                          <DropdownMenuItem className="text-sm font-medium cursor-pointer gap-3 px-3 py-2.5 rounded-xl focus:bg-primary/10 focus:text-primary transition-colors">
                                                                                                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                                                                                    Dashboard
                                                                                          </DropdownMenuItem>
                                                                                </Link>

                                                                                

                                                                                <DropdownMenuSeparator className="bg-border/50 mx-1" />

                                                                                {/* Logout Button */}
                                                                                <DropdownMenuItem
                                                                                          onClick={() => logout()}
                                                                                          className="text-sm font-bold !text-rose-500 cursor-pointer gap-3 px-3 py-2.5 rounded-xl focus:bg-rose-500/10 focus:!text-rose-500 transition-colors"
                                                                                >
                                                                                          <LogOut className="w-4 h-4" />
                                                                                          Log out
                                                                                </DropdownMenuItem>

                                                                      </DropdownMenuContent>
                                                            </DropdownMenu>
                                        </div>
                              )}
                    </div>
          );
}