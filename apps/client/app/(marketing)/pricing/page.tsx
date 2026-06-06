"use client";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import PageWrapper from "@/components/layout/PageWrapper";
import Pricing from "@/components/marketing/pricing/Pricing";
import ComparePlansTable from "@/components/pricing/ComparePlansTable";
import FAQSection from "@/components/pricing/FAQSection";

const SectionDivider = () => (
          <div className="w-[95%] max-w-7xl mx-auto flex items-center justify-center py-4 relative opacity-70">
                    {/* Base subtle line */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    {/* Purple glowing center highlight */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent blur-[1px]"></div>
          </div>
);

export default function PricingPage() {
          return (
                    <main className="flex flex-col min-h-screen bg-background text-foreground w-full max-w-[100vw] overflow-x-hidden">
                              <Navbar />
                              <PageWrapper>
                                        <div className="w-full flex-1 flex flex-col pt-20 pb-10 ">
                                                  <Pricing />
                                                  <SectionDivider />
                                                  <ComparePlansTable />
                                                  <SectionDivider />
                                                  <FAQSection />
                                                  <SectionDivider />
                                        </div>
                              </PageWrapper>
                              <Footer />
                    </main>
          );
}