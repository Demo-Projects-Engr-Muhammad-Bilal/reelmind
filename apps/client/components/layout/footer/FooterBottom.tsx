// apps/web/src/components/marketing/footer/FooterBottom.tsx
"use client";
import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "./footer-constants";

export default function FooterBottom({ currentYear }: { currentYear: number }) {
          return (
                    <motion.div
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                              className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6"
                    >
                              <p className="text-muted-foreground font-bold text-[11px] uppercase tracking-widest italic">
                                        © {currentYear} Aireelgen. All rights reserved.
                              </p>

                              <div className="flex items-center gap-6">
                                        {SOCIAL_LINKS.map((social) => (
                                                  <a
                                                            key={social.name}
                                                            href={social.href}
                                                            className="text-muted-foreground hover:text-primary hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                                                            aria-label={social.name}
                                                  >
                                                            {social.icon}
                                                  </a>
                                        ))}
                              </div>
                    </motion.div>
          );
}