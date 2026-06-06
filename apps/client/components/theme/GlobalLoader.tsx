"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function GlobalLoader() {
          return (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">

                              {/* ⚡ THE FIX: motion.div ko flex, items-center aur justify-center diya gaya hai */}
                              <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="relative mb-10 flex items-center justify-center"
                              >
                                        {/* ⚡ THE FIX: "fill" property hata kar direct width aur height apply kar di hai */}
                                        <Image
                                                  src="/reelmind-logo.png"
                                                  alt="ReelMind Logo"
                                                  width={128}   // 👈 Exact pixel width
                                                  height={128}  // 👈 Exact pixel height
                                                  className="object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse"
                                                  priority
                                        />

                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/10 blur-[50px] rounded-full pointer-events-none -z-10"></div>
                              </motion.div>

                              <div className="w-56 sm:w-64 flex flex-col items-center gap-5">

                                        <div className="h-[2px] w-full bg-border/40 rounded-full overflow-hidden relative">
                                                  <motion.div
                                                            initial={{ x: "-100%" }}
                                                            animate={{ x: "100%" }}
                                                            transition={{
                                                                      repeat: Infinity,
                                                                      duration: 1.5,
                                                                      ease: "easeInOut",
                                                            }}
                                                            className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                                                  />
                                        </div>

                                        <motion.p
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  transition={{
                                                            repeat: Infinity,
                                                            duration: 1.5,
                                                            ease: "easeInOut",
                                                            repeatType: "reverse"
                                                  }}
                                                  className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground/80"
                                        >
                                                  Distilling Vision...
                                        </motion.p>
                              </div>

                    </div>
          );
}