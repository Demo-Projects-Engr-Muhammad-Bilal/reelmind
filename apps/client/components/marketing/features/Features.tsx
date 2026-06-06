// apps/web/src/components/marketing/features/Features.tsx
"use client";
import { motion, Variants } from "framer-motion";
import { BrainCircuit, AudioWaveform, Coins, Rocket, Smartphone, PlaySquare, Flame, Send } from "lucide-react";
import { VISUALIZER_DATA, PRICING_DATA } from "@/lib/dummyData";
import FeatureHeader from "./FeatureHeader";
import FeatureCard from "./FeatureCard";

export default function Features() {
          const containerVariants: Variants = {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          };

          const cardVariants: Variants = {
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
          };

          return (
                    <section className="py-20 px-6 max-w-6xl mx-auto relative z-10" id="features">
                              <FeatureHeader />

                              <motion.div
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[minmax(280px,auto)]"
                                        variants={containerVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                              >
                                        {/* 1. The Human Touch */}
                                        <FeatureCard variants={cardVariants} className="md:col-span-2">
                                                  <div className="absolute top-0 right-0 p-6 md:p-10">
                                                            <BrainCircuit className="w-24 h-24 md:w-32 md:h-32 text-primary opacity-[0.05] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700" />
                                                  </div>
                                                  <div className="max-w-lg z-10">
                                                            <h3 className="text-2xl md:text-3xl font-headline font-black mb-4 text-foreground">The Human Touch 🤌</h3>
                                                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                                                      We don't just generate AI sludge. Our engine blends psychology hooks with AI visuals for content that feels <strong className="text-foreground">authentically human</strong>.
                                                            </p>
                                                  </div>
                                                  <div className="flex flex-wrap gap-3 mt-8 md:mt-10 z-10">
                                                            <Tag label="GPT-4o Integration" active />
                                                            <Tag label="Custom Hooks" />
                                                  </div>
                                        </FeatureCard>

                                        {/* 2. Auto Sync */}
                                        <FeatureCard variants={cardVariants} glowColor="#3B82F6" className="md:col-span-1">
                                                  <div className="z-10">
                                                            <h3 className="text-2xl md:text-3xl font-headline font-black mb-4 text-foreground flex items-center justify-between">
                                                                      Auto Sync <AudioWaveform className="w-6 h-6 md:w-8 md:h-8 text-[#3B82F6] opacity-80" />
                                                            </h3>
                                                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 md:mb-8">
                                                                      FFmpeg normalization ensures every cut hits the beat with <strong className="text-foreground font-semibold">sub-millisecond precision.</strong>
                                                            </p>
                                                  </div>
                                                  <div className="h-20 md:h-24 w-full flex items-end justify-between gap-1 md:gap-1.5 opacity-60 group-hover:opacity-100 transition-all z-10">
                                                            {VISUALIZER_DATA.heights.map((height, i) => (
                                                                      <div key={i} className="w-full bg-gradient-to-t from-[#3B82F6] to-primary rounded-t-sm"
                                                                                style={{ height: `${height}%`, animation: `pulse ${VISUALIZER_DATA.durations[i]}s infinite alternate` }} />
                                                            ))}
                                                  </div>
                                        </FeatureCard>

                                        {/* 3. Pay-As-You-Go */}
                                        <FeatureCard variants={cardVariants} glowColor="#F59E0B" className="md:col-span-1">
                                                  <div className="absolute top-0 right-0 p-6 md:p-10">
                                                            <Coins className="w-16 h-16 md:w-20 md:h-20 text-[#F59E0B] opacity-[0.05] group-hover:opacity-[0.15] group-hover:rotate-12 transition-all" />
                                                  </div>
                                                  <div className="z-10">
                                                            <h3 className="text-2xl md:text-3xl font-headline font-black mb-4 text-foreground">{PRICING_DATA.billingType}</h3>
                                                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">No monthly subscriptions. Buy credits when you need them.</p>
                                                  </div>
                                                  <div className="mt-8 md:mt-10 flex items-baseline gap-1 z-10 group-hover:scale-105 transition-transform origin-left">
                                                            <span className="text-5xl md:text-6xl font-headline font-black text-foreground">{PRICING_DATA.currency}{PRICING_DATA.costPerReel}</span>
                                                            <span className="text-base md:text-lg text-muted-foreground">/reel</span>
                                                  </div>
                                        </FeatureCard>

                                        {/* 4. Auto-Publish */}
                                        <FeatureCard variants={cardVariants} glowColor="#EC4899" className="md:col-span-2">
                                                  <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4">
                                                            <Rocket className="w-48 h-48 md:w-[250px] md:h-[250px] text-[#EC4899] opacity-[0.03] group-hover:opacity-[0.08] group-hover:-translate-y-6 transition-all duration-700" />
                                                  </div>
                                                  <div className="max-w-lg z-10">
                                                            <h3 className="text-2xl md:text-3xl font-headline font-black mb-4 text-foreground">Auto-Publish 🚀</h3>
                                                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 md:mb-8">Direct integration with social APIs. Generate, review, and schedule automatically.</p>
                                                            <div className="flex flex-wrap gap-2 md:gap-3">
                                                                      <PlatformPill icon={Smartphone} label="TikTok" />
                                                                      <PlatformPill icon={Flame} label="Reels" color="#EC4899" />
                                                                      <PlatformPill icon={PlaySquare} label="Shorts" color="#ef4444" />
                                                            </div>
                                                  </div>
                                        </FeatureCard>

                                        {/* 5. Telegram Bot */}
                                        <FeatureCard variants={cardVariants} glowColor="#0088cc" className="md:col-span-3 mt-2">
                                                  <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
                                                            <div className="flex-1 z-10 text-center md:text-left">
                                                                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0088cc]/10 border border-[#0088cc]/20 mb-4">
                                                                                <Send className="w-3 h-3 text-[#EC4899] fill-[#EC4899]" />
                                                                                <span className="text-[#EC4899] font-bold text-[10px] tracking-widest uppercase">Telegram Bot</span>
                                                                      </div>
                                                                      <h3 className="text-2xl md:text-3xl font-headline font-black mb-3 text-foreground">Prompt to Reel <span className="text-[#EC4899]">Instantly.</span></h3>
                                                                      <p className="text-muted-foreground text-base md:text-lg max-w-xl">Send a prompt or audio note and watch it generate and auto-publish.</p>
                                                            </div>

                                                            <div className="flex items-center gap-3 md:gap-4 z-10 shrink-0">
                                                                      <StepIcon icon={Send} label="Input" color="#0088cc" />
                                                                      <Connector color="from-[#0088cc] to-primary" delay="0s" />
                                                                      <StepIcon icon={BrainCircuit} label="Engine" color="var(--primary)" />
                                                                      <Connector color="from-primary to-[#EC4899]" delay="0.5s" />
                                                                      <StepIcon icon={Rocket} label="Upload" color="#EC4899" />
                                                            </div>
                                                  </div>
                                        </FeatureCard>
                              </motion.div>
                    </section>
          );
}

// 🧱 HELPERS (Keeping logic, upgrading UI)
function Tag({ label, active }: any) {
          return (
                    <span className={`px-4 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-2 backdrop-blur-md transition-colors ${active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/50 border-border/50 text-muted-foreground'}`}>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />} {label}
                    </span>
          );
}

function PlatformPill({ icon: Icon, label, color = "white" }: any) {
          return (
                    <div className="flex items-center gap-2 bg-background/50 border border-border/50 px-4 py-2 rounded-xl hover:border-primary/30 transition-colors">
                              <Icon className="w-3.5 h-3.5" style={{ color }} /> <span className="text-xs font-bold text-foreground">{label}</span>
                    </div>
          );
}

function StepIcon({ icon: Icon, label, color }: any) {
          return (
                    <div className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl bg-secondary/30 border border-border/50 shrink-0">
                              <Icon className="w-5 h-5 md:w-6 md:h-6 mb-1" style={{ color }} />
                              <span className="text-[9px] font-bold uppercase tracking-tighter" style={{ color }}>{label}</span>
                    </div>
          );
}

function Connector({ color, delay }: any) {
          return (
                    <div className={`h-[1px] w-4 md:w-8 bg-gradient-to-r ${color} relative`}>
                              <div className="absolute -top-[3px] right-0 w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: 'currentColor', animationDelay: delay }} />
                    </div>
          );
}