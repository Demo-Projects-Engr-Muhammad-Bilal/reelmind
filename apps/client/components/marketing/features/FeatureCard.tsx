// apps/web/src/components/marketing/features/FeatureCard.tsx
"use client";
import { motion } from "framer-motion";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  variants: any;
  glowColor?: string;
}

export default function FeatureCard({ children, className, variants, glowColor = "var(--primary)" }: FeatureCardProps) {
  return (
    <motion.div
      variants={variants}
      className={`
        bg-card/30 backdrop-blur-sm 
        rounded-3xl border border-border/50 
        p-6 md:p-8 
        flex flex-col justify-between overflow-hidden relative group 
        transition-all duration-500 shadow-xl hover:-translate-y-1 hover:border-primary/40
        ${className}
      `}
      style={{
        // @ts-ignore
        "--glow-color": glowColor
      } as any}
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-color)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {children}
    </motion.div>
  );
}