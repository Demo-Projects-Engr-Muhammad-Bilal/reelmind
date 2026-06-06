"use client";

import { Check, Minus, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
          Table,
          TableBody,
          TableCell,
          TableHead,
          TableHeader,
          TableRow,
} from "@/components/ui/table";

const features = [
          { name: "Included Credits", starter: "500", creator: "1,500", agency: "5,000+" },
          { name: "Render Priority", starter: "Standard", creator: "High", agency: "Ultra-High" },
          { name: "Concurrent Render Jobs", starter: "1 Queue", creator: "3 Queues", agency: "Unlimited" },
          { name: "Ken Burns Motion", starter: true, creator: true, agency: true },
          { name: "Standard TTS Voice", starter: true, creator: true, agency: true },
          { name: "AI Video Loops", starter: false, creator: true, agency: true },
          { name: "ElevenLabs Ultra-Real Voice", starter: false, creator: true, agency: true },
          { name: "Custom Font Uploads", starter: false, creator: true, agency: true },
          { name: "No Watermark", starter: false, creator: false, agency: true },
          { name: "Solutions Engineer", starter: false, creator: false, agency: true },
];

export default function ComparePlansTable() {

          // ⚡ Helper function to render text or icons cleanly
          const renderValue = (value: string | boolean, isHighlighted = false) => {
                    if (typeof value === "boolean") {
                              if (value) return <Check className={`w-4 h-4 ${isHighlighted ? 'text-primary' : 'text-emerald-500'}`} />;
                              return <Minus className="w-4 h-4 text-muted-foreground/30" />;
                    }
                    return <span className={isHighlighted ? "font-bold text-foreground" : "font-semibold text-muted-foreground"}>{value}</span>;
          };

          return (
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 relative z-10">

                              {/* ⚡ Header Section */}
                              <div className="flex flex-col items-center text-center mb-10 sm:mb-16 space-y-4 sm:space-y-6">
                                        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                                                  <Badge variant="outline" className="px-4 py-1 border-primary/30 bg-primary/5 text-primary rounded-full font-bold uppercase italic tracking-[0.2em] text-[10px]">
                                                            <LayoutGrid className="w-3 h-3 mr-2 fill-primary" /> Capabilities
                                                  </Badge>
                                        </motion.div>

                                        <motion.h2
                                                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                  viewport={{ once: true }}
                                                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                                  className="text-3xl md:text-5xl font-headline font-black text-foreground tracking-tight leading-[1.1]"
                                        >
                                                  Compare <span className="relative inline-block mt-1">
                                                            <span className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full pointer-events-none"></span>
                                                            <span className="relative bg-gradient-to-r from-primary via-[#d0bcff] to-primary text-transparent bg-clip-text">Features</span>
                                                  </span>
                                        </motion.h2>

                                        <motion.p
                                                  initial={{ opacity: 0, y: 10 }}
                                                  whileInView={{ opacity: 1, y: 0 }}
                                                  viewport={{ once: true }}
                                                  transition={{ duration: 0.5, delay: 0.3 }}
                                                  className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-4"
                                        >
                                                  Detailed breakdown of pipeline capabilities across different tiers.
                                        </motion.p>
                              </div>


                              {/* =========================================
          📱 MOBILE VIEW (Cards Layout) 
          ========================================= */}
                              <div className="block md:hidden space-y-4">
                                        {features.map((feature, idx) => (
                                                  <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                                            className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm"
                                                  >
                                                            <h3 className="font-bold text-foreground text-sm border-b border-border/40 pb-3 mb-3">
                                                                      {feature.name}
                                                            </h3>
                                                            <div className="space-y-3">
                                                                      <div className="flex justify-between items-center text-sm">
                                                                                <span className="text-muted-foreground font-medium">Starter</span>
                                                                                {renderValue(feature.starter)}
                                                                      </div>

                                                                      {/* Creator Highlighted Row */}
                                                                      <div className="flex justify-between items-center text-sm bg-primary/[0.04] border border-primary/10 rounded-lg p-2 -mx-2">
                                                                                <span className="text-primary font-bold">Creator</span>
                                                                                {renderValue(feature.creator, true)}
                                                                      </div>

                                                                      <div className="flex justify-between items-center text-sm">
                                                                                <span className="text-muted-foreground font-medium">Agency</span>
                                                                                {renderValue(feature.agency)}
                                                                      </div>
                                                            </div>
                                                  </motion.div>
                                        ))}
                              </div>


                              {/* =========================================
          💻 DESKTOP VIEW (Table Layout) 
          ========================================= */}
                              <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                        className="hidden md:block w-full bg-card border border-border/60 rounded-3xl shadow-lg relative z-0 overflow-hidden"
                              >
                                        <div className="w-full">
                                                  <Table className="w-full">
                                                            <TableHeader>
                                                                      <TableRow className="border-b border-border/60 bg-sidebar/80 hover:bg-sidebar/80">
                                                                                <TableHead className="py-5 px-6 font-bold text-[13px] text-muted-foreground uppercase tracking-wider w-[25%] border-r border-border/30">
                                                                                          Capabilities
                                                                                </TableHead>
                                                                                <TableHead className="py-5 px-6 font-bold text-[13px] text-foreground text-center">
                                                                                          Starter
                                                                                </TableHead>
                                                                                <TableHead className="py-5 px-6 font-bold text-[13px] text-primary text-center bg-primary/[0.05] border-x border-primary/10 relative">
                                                                                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[1px]"></div>
                                                                                          Creator
                                                                                </TableHead>
                                                                                <TableHead className="py-5 px-6 font-bold text-[13px] text-foreground text-center">
                                                                                          Agency
                                                                                </TableHead>
                                                                      </TableRow>
                                                            </TableHeader>

                                                            <TableBody>
                                                                      {features.map((feature, idx) => (
                                                                                <TableRow key={idx} className="border-b border-border/30 hover:bg-sidebar/30 transition-colors">
                                                                                          <TableCell className="py-4 px-6 text-sm font-medium text-foreground border-r border-border/30">
                                                                                                    {feature.name}
                                                                                          </TableCell>
                                                                                          <TableCell className="py-4 px-6 text-sm text-center">
                                                                                                    {renderValue(feature.starter)}
                                                                                          </TableCell>
                                                                                          <TableCell className="py-4 px-6 text-sm text-center bg-primary/[0.02] border-x border-primary/10">
                                                                                                    {renderValue(feature.creator, true)}
                                                                                          </TableCell>
                                                                                          <TableCell className="py-4 px-6 text-sm text-center">
                                                                                                    {renderValue(feature.agency)}
                                                                                          </TableCell>
                                                                                </TableRow>
                                                                      ))}
                                                            </TableBody>
                                                  </Table>
                                        </div>
                              </motion.div>

                    </div>
          );
}