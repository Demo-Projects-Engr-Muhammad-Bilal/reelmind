// app/page.tsx
import Footer from "@/components/layout/footer/Footer";
import PageWrapper from "@/components/layout/PageWrapper";
import Features from "@/components/marketing/features/Features";
import Hero from "@/components/marketing/hero/Hero";
import Pricing from "@/components/marketing/pricing/Pricing";
import Showcase from "@/components/marketing/showcase/Showcase";

const SectionDivider = () => (
  <div className="w-[95%] max-w-7xl mx-auto flex items-center justify-center py-4 relative opacity-70">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    <div className="absolute left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent blur-[1px]"></div>
  </div>
);

export default function Home() {
  return (
    <main>
      <PageWrapper>
        <Hero />
        <SectionDivider />
        <Features />
        <SectionDivider />
        <Showcase />
        <SectionDivider />
        <Pricing />
        <Footer />
      </PageWrapper>
    </main>
  );
}