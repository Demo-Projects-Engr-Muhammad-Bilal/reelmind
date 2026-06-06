// apps/web/src/components/marketing/features/FeatureHeader.tsx
"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FeatureHeader() {
          return (
                    <div className="flex flex-col items-center text-center mb-16 md:mb-24 space-y-4 md:space-y-6">
                              <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                              >
                                        <Badge variant="outline" className="px-4 py-1 border-primary/30 bg-primary/5 text-primary rounded-full font-bold uppercase italic tracking-[0.2em] text-[10px]">
                                                  <Sparkles className="w-3 h-3 mr-2 fill-primary" /> The Pipeline
                                        </Badge>
                              </motion.div>

                              <motion.h2
                                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-foreground tracking-tight leading-[1.1]"
                              >
                                        Engineered for <br className="hidden sm:block" />
                                        <span className="relative inline-block mt-2">
                                                  <span className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full pointer-events-none"></span>
                                                  <span className="relative bg-gradient-to-r from-primary via-[#d0bcff] to-primary text-transparent bg-clip-text">
                                                            Virality.
                                                  </span>
                                        </span>
                              </motion.h2>
                    </div>
          );
}