"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";

export default function NavLinks({ activeSection, onNavClick }: any) {
          return (
                    <div className="hidden md:flex items-center gap-1 bg-secondary/20 border border-border/40 p-1 rounded-full backdrop-blur-sm">
                              {NAV_LINKS.map((link) => {
                                        const isActive = activeSection === link.href.replace("#", "");
                                        return (
                                                  <Link
                                                            key={link.name}
                                                            href={link.href}
                                                            onClick={(e) => onNavClick(e, link.href)}
                                                            className={`relative px-4 py-1.5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-300 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                                                      }`}
                                                  >
                                                            {isActive && (
                                                                      <motion.div
                                                                                layoutId="navPill"
                                                                                className="absolute inset-0 bg-background border border-border/50 shadow-sm rounded-full -z-10"
                                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                                      />
                                                            )}
                                                            {link.name}
                                                  </Link>
                                        );
                              })}
                    </div>
          );
}