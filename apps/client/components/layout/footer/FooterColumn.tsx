// apps/web/src/components/marketing/footer/FooterColumn.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface FooterColumnProps {
          section: {
                    title: string;
                    links: { name: string; href: string }[];
          };
          idx: number;
}

export default function FooterColumn({ section, idx }: FooterColumnProps) {
          return (
                    <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.1 * (idx + 1), duration: 0.5 }}
                              className="flex flex-col space-y-5"
                    >
                              <h4 className="font-headline font-black text-foreground text-[11px] uppercase tracking-[0.2em] italic">
                                        {section.title}
                              </h4>
                              <div className="flex flex-col space-y-3">
                                        {section.links.map((link) => (
                                                  <Link
                                                            key={link.name}
                                                            href={link.href}
                                                            className="text-muted-foreground hover:text-primary text-[13px] font-bold tracking-tight transition-all duration-300 hover:translate-x-1 w-fit"
                                                  >
                                                            {link.name}
                                                  </Link>
                                        ))}
                              </div>
                    </motion.div>
          );
}