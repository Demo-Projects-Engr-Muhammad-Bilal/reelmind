// apps/web/src/components/marketing/footer/Footer.tsx
"use client";
import { FOOTER_LINKS } from "./footer-constants";
import FooterBrand from "./FooterBrand";
import FooterColumn from "./FooterColumn";
import FooterBottom from "./FooterBottom";

export default function Footer() {
          const currentYear = new Date().getFullYear();

          return (
                    <footer className="w-full bg-background border-t border-border/40 pt-20 pb-12 relative overflow-hidden">
                              {/* 🚀 Background Glow (Aireelgen Purple) */}
                              <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[150px] rounded-full -z-10 pointer-events-none" />

                              <div className="w-[95%] max-w-6xl mx-auto px-6">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                                                  <FooterBrand />

                                                  {FOOTER_LINKS.map((section, idx) => (
                                                            <FooterColumn key={section.title} section={section} idx={idx} />
                                                  ))}
                                        </div>

                                        <FooterBottom currentYear={currentYear} />
                              </div>
                    </footer>
          );
}