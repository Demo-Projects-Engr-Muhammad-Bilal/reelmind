// apps/web/src/components/marketing/footer/FooterBrand.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FooterBrand() {
          return (
                    <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              className="col-span-1 md:col-span-2 space-y-5"
                    >
                              <Link href="/" className="text-2xl font-black tracking-wider hover:opacity-80 transition-opacity inline-block">
                                        <span className="text-primary italic">REEL</span>MIND
                              </Link>
                              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-medium">
                                        Distill motion into gold. The premier AI reel engine designed for the next generation of viral content creators.
                              </p>
                    </motion.div>
          );
}