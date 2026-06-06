// apps/web/src/components/marketing/hero/HeroContent.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroContent({ wordIndex, rotatingWords, variants }: any) {
          return (
                    <motion.div className="space-y-8" variants={variants} initial="hidden" animate="visible">
                              {/* Branded Pill */}
                              <motion.div variants={variants}>
                                        <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary rounded-full font-bold uppercase italic tracking-widest text-[10px]">
                                                  <Sparkles className="w-3 h-3 mr-2 fill-primary" /> Building the Future of AI
                                        </Badge>
                              </motion.div>

                              {/* Main Heading with Vertical Slide Animation */}
                              <motion.h1 variants={variants} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-foreground">
                                        <span className="block">Build Your</span>

                                        {/* Animation Container */}
                                        <span className="relative block h-[1.2em] overflow-hidden">
                                                  <AnimatePresence initial={false}>
                                                            <motion.span
                                                                      key={wordIndex}
                                                                      initial={{ y: "100%", opacity: 0 }}
                                                                      animate={{ y: "0%", opacity: 1 }}
                                                                      exit={{ y: "-100%", opacity: 0 }}
                                                                      transition={{
                                                                                type: "spring",
                                                                                stiffness: 120,
                                                                                damping: 20,
                                                                                mass: 1
                                                                      }}
                                                                      className="absolute left-0 text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#d0bcff] to-primary italic"
                                                            >
                                                                      {rotatingWords[wordIndex]}
                                                            </motion.span>
                                                  </AnimatePresence>
                                        </span>
                              </motion.h1>

                              <motion.p variants={variants} className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed font-medium">
                                        Distill your ideas into viral masterpieces. The AI-first engine designed for high-retention short-form content.
                              </motion.p>

                              <motion.div variants={variants} className="flex flex-wrap gap-4 pt-4">
                                        <Link href="/auth?mode=signup">
                                                  <Button size="lg" className="h-14 px-8 rounded-full font-black uppercase italic tracking-wider text-sm purple-glow group">
                                                            Start Creating Free <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                  </Button>
                                        </Link>
                                        <Link href="/gallery">
                                                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full font-bold uppercase italic tracking-wide text-sm border-border/60 hover:bg-secondary">
                                                            View Showcase
                                                  </Button>
                                        </Link>
                              </motion.div>
                    </motion.div>
          );
}