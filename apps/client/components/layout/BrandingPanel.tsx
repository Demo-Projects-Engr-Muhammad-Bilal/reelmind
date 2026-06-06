"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Video } from "lucide-react";
import Link from "next/link";

const brandingContent = {
          signup: {
                    title: "Build your",
                    highlight: "Content Empire.",
                    desc: "Harness the power of hyper-spatial AI to generate high-retention vertical content in seconds."
          },
          login: {
                    title: "Welcome Back to",
                    highlight: "The Pipeline.",
                    desc: "Your AI agents are ready. Log in to scale your shorts and reels across all platforms."
          },
          "forgot-password": {
                    title: "Secure Your",
                    highlight: "Creative Assets.",
                    desc: "Don't worry, even the best creators lose their way. Let's get you back in no time."
          }
};

export default function BrandingPanel({ mode }: { mode: keyof typeof brandingContent }) {
          const content = brandingContent[mode];

          return (
                    <div className="relative h-full flex flex-col justify-between z-10 font-body">
                              {/* 🚀 Integrated Background System */}
                              <div className="absolute inset-0 -z-10">
                                        <div className="absolute inset-0 bg-background" />
                                        {/* Subtle Grid - Dynamic based on theme border color */}
                                        <div
                                                  className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                                                  style={{
                                                            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                                                            backgroundSize: "32px 32px"
                                                  }}
                                        />
                                        {/* Signature Purple Glow Orb */}
                                        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                              </div>

                              <div>
                                        {/* Logo Section - Sync with Navbar style */}
                                        <div className="mb-20 md:mb-28">
                                                  <Link href="/" className="inline-flex items-center gap-2 group">
                                                            {/* Subtle Icon Container */}
                                                            <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                                                      <Home className="w-4 h-4 text-primary" />
                                                            </div>

                                                            {/* Animated Text Link */}
                                                            <span className="relative text-md font-black text-primary tracking-[0.2em] font-headline italic uppercase py-1">
                                                                      Home
                                                                      {/* 🚀 Custom Underline Animation */}
                                                                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 ease-in-out group-hover:w-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                                                            </span>
                                                  </Link>
                                        </div>
                                        {/* Animated Text Content */}
                                        <AnimatePresence mode="wait">
                                                  <motion.div
                                                            key={mode}
                                                            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                                            className="space-y-6"
                                                  >
                                                            <h2 className="text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tighter font-headline">
                                                                      {content.title} <br />
                                                                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#d0bcff] to-primary italic">
                                                                                {content.highlight}
                                                                      </span>
                                                            </h2>
                                                            <p className="text-muted-foreground text-base lg:text-lg max-w-md leading-relaxed font-medium opacity-80">
                                                                      {content.desc}
                                                            </p>
                                                  </motion.div>
                                        </AnimatePresence>
                              </div>

                              {/* Trust Badge & Testimonial Pill */}
                              <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="bg-secondary/20 backdrop-blur-xl p-6 rounded-[2rem] border border-border/40 shadow-2xl max-w-sm group hover:border-primary/30 transition-colors duration-500"
                              >
                                        <div className="flex items-center gap-4 mb-4">
                                                  <div className="flex -space-x-3">
                                                            {[1, 2, 3].map((i) => (
                                                                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary overflow-hidden shadow-lg">
                                                                                <img
                                                                                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 42}`}
                                                                                          alt="user"
                                                                                          className="w-full h-full object-cover"
                                                                                />
                                                                      </div>
                                                            ))}
                                                  </div>
                                                  <div>
                                                            <p className="text-foreground font-black text-xs uppercase tracking-tight italic">10k+ Creators trust us</p>
                                                            <div className="flex text-primary gap-0.5 mt-0.5">
                                                                      {[...Array(5)].map((_, i) => (
                                                                                <span key={i} className="text-[10px] drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">★</span>
                                                                      ))}
                                                            </div>
                                                  </div>
                                        </div>
                                        <p className="text-muted-foreground text-[13px] italic font-bold leading-snug tracking-tight">
                                                  "AIreelgen literally doubled my engagement in 2 weeks. The quality is unmatched."
                                        </p>
                              </motion.div>
                    </div>
          );
}