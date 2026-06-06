// apps/web/src/components/marketing/pricing/PricingCard.tsx
"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  plan: any;
  variants: any;
  onSelect: (id: string, name: string) => void;
}

export default function PricingCard({ plan, variants, onSelect }: PricingCardProps) {
  return (
    <motion.div
      variants={variants}
      className={`relative group rounded-3xl flex flex-col h-full transition-all duration-500 hover:-translate-y-2
        bg-card/40 backdrop-blur-sm border border-border/50 shadow-2xl py-8 px-6 md:px-8
        ${plan.isPopular ? 'z-10 ring-2 ring-primary/20 bg-card/60' : 'hover:border-primary/30'}
      `}
    >
      {/* Subtle Hover Glow */}
      <div className="absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none z-10 opacity-0 group-hover:opacity-100 border border-primary/40 shadow-[0_0_40px_rgba(139,92,246,0.1)]" />

      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-primary to-[#7c3aed] text-primary-foreground font-headline text-[10px] font-black rounded-full tracking-[0.2em] uppercase shadow-lg z-20">
          Most Popular
        </div>
      )}

      <div className="z-10 relative flex flex-col h-full">
        {/* Header: Name & Price */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-headline font-black mb-3 text-foreground flex items-center gap-2">
            {plan.name}
            {plan.isPopular && <Sparkles className="w-4 h-4 text-primary fill-primary" />}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl md:text-5xl font-headline font-black text-foreground tracking-tighter">${plan.price}</span>
            <span className={`text-xs font-bold uppercase italic tracking-wider ${plan.isPopular ? 'text-primary' : 'text-muted-foreground'}`}>
              / {plan.credits} credits
            </span>
          </div>
        </div>

        {/* Features List - Sleek spacing */}
        <div className="grow mb-10">
          <ul className="space-y-4">
            {plan.features.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-[13px] leading-tight">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.isPopular ? 'text-primary' : 'text-primary/60'}`} strokeWidth={3} />
                <span className={plan.isPopular ? 'text-foreground font-medium' : 'text-muted-foreground'}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button - Sync with Hero style */}
        <Button
          onClick={() => onSelect(plan.id, plan.name)}
          className={`w-full h-12 rounded-xl font-headline font-black uppercase italic text-xs tracking-widest transition-all duration-300 active:scale-95
            ${plan.isPopular
              ? 'bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'
              : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/50'}
          `}
        >
          {plan.buttonText}
        </Button>
      </div>
    </motion.div>
  );
}