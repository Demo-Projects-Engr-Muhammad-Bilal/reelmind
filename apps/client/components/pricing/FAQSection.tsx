"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
          { question: "How do ReelMind credits work?", answer: "Our pipeline uses a dynamic pricing matrix. Simple tasks like Ken Burns motion cost a flat 5 credits, while premium AI Video loops cost 50 credits per scene. You only pay for the exact magic you generate." },
          { question: "Do my credits expire?", answer: "No. Any credits you purchase will roll over indefinitely as long as your account is active. They sit securely in your digital wallet until you're ready to produce." },
          { question: "What is your refund policy?", answer: "We offer a 14-day money-back guarantee. If you purchase a package and realize our factory doesn't fit your workflow before generating any premium AI videos, we'll refund your purchase in full." },
          { question: "Can I use the videos commercially?", answer: "Yes! All synthesized assets and videos produced under the Creator and Agency tiers grant you full commercial rights for YouTube, TikTok, and client projects." }
];

export default function FAQSection() {
          const [openIndex, setOpenIndex] = useState<number | null>(0);

          return (
                    // ⚡ FIX: Added py-24 md:py-32 to match the flow perfectly
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 relative z-10">

                              <div className="flex flex-col items-center text-center mb-16 space-y-6">
                                        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                                                  <Badge variant="outline" className="px-4 py-1 border-primary/30 bg-primary/5 text-primary rounded-full font-bold uppercase italic tracking-[0.2em] text-[10px]">
                                                            <MessageSquare className="w-3 h-3 mr-2 fill-primary" /> Clarity
                                                  </Badge>
                                        </motion.div>

                                        <motion.h2
                                                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                  viewport={{ once: true }}
                                                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                                                  className="text-3xl md:text-5xl font-headline font-black text-foreground tracking-tight leading-[1.1]"
                                        >
                                                  Frequently Asked <span className="relative inline-block mt-1">
                                                            <span className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full pointer-events-none"></span>
                                                            <span className="relative bg-gradient-to-r from-primary via-[#d0bcff] to-primary text-transparent bg-clip-text">Questions</span>
                                                  </span>
                                        </motion.h2>

                                        <motion.p
                                                  initial={{ opacity: 0, y: 10 }}
                                                  whileInView={{ opacity: 1, y: 0 }}
                                                  viewport={{ once: true }}
                                                  transition={{ duration: 0.5, delay: 0.3 }}
                                                  className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-4"
                                        >
                                                  Everything you need to know about our credit system, billing, and commercial rights.
                                        </motion.p>
                              </div>

                              <div className="space-y-4">
                                        {faqs.map((faq, idx) => (
                                                  <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                                                            key={idx}
                                                            className={`p-3 pb-3 border rounded-2xl transition-all duration-300 overflow-hidden ${openIndex === idx ? "bg-card border-border/60 shadow-md" : "bg-transparent border-border/30 hover:border-border/60 hover:bg-sidebar/30"}`}
                                                  >
                                                            <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="flex items-center justify-between w-full p-5 sm:p-7 text-left focus:outline-none cursor-pointer">
                                                                      <span className="font-bold text-sm sm:text-base text-foreground">{faq.question}</span>
                                                                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${openIndex === idx ? "rotate-180 text-primary" : ""}`} />
                                                            </button>
                                                            <AnimatePresence>
                                                                      {openIndex === idx && (
                                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                                                                                          <div className="px-5 sm:px-7 text-[15px] text-muted-foreground leading-relaxed font-medium ">{faq.answer}</div>
                                                                                </motion.div>
                                                                      )}
                                                            </AnimatePresence>
                                                  </motion.div>
                                        ))}
                              </div>
                    </div>
          );
}