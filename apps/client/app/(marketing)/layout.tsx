"use client";
import Navbar from "@/components/layout/navbar/Navbar";
import PageWrapper from "@/components/layout/PageWrapper";
import { MarketingProviders } from "@/context/MarketingProviders"; // ⚡ Naya Provider

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
          return (
                    <MarketingProviders>
                              <Navbar />
                              <PageWrapper>
                                        {children}
                              </PageWrapper>
                    </MarketingProviders>
          );
}