// apps/web/src/components/marketing/hero/Hero.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useHeroLogic } from "@/hooks/marketing/use-hero-logic";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

const rotatingWords = ["Content Empire.", "TikTok Empire.", "Shorts Empire.", "Reels Empire."];

export default function Hero() {
          const { wordIndex, isMuted, setIsMuted, videoRef } = useHeroLogic(rotatingWords);
          const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

          useEffect(() => {
                    const handleMouseMove = (e: MouseEvent) => {
                              setMousePos({ x: e.clientX, y: e.clientY });
                    };
                    window.addEventListener("mousemove", handleMouseMove);
                    return () => window.removeEventListener("mousemove", handleMouseMove);
          }, []);

          const containerVariants: Variants = {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
          };

          return (
                    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center z-10" id="hero">
                              {/* 🚀 DYNAMIC BACKGROUND SYSTEM */}
                              <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                                        <div className="absolute inset-0 opacity-[0.15] bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')" }} />
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

                                        <motion.div
                                                  className="absolute w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"
                                                  animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
                                                  transition={{ type: "spring", damping: 40, stiffness: 60 }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
                              </div>

                              {/* ✅ Navbar Alignment Sync */}
                              <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                        {/* Content takes exactly 7 columns */}
                                        <div className="lg:col-span-7">
                                                  <HeroContent wordIndex={wordIndex} rotatingWords={rotatingWords} variants={containerVariants} />
                                        </div>

                                        {/* Visual takes exactly 5 columns and is pushed to the end (right edge) */}
                                        <div className="lg:col-span-5 flex justify-end">
                                                  <HeroVisual isMuted={isMuted} setIsMuted={setIsMuted} videoRef={videoRef} />
                                        </div>
                              </div>
                    </section>
          );
}