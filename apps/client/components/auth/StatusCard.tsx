"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusCardProps {
          status: "loading" | "success" | "error";
          icon: LucideIcon;
          title: string;
          description: string;
          actionLabel?: string;
          onAction?: () => void;
          iconColor?: string;
}

export default function StatusCard({
          status,
          icon: Icon,
          title,
          description,
          actionLabel,
          onAction,
          iconColor
}: StatusCardProps) {

          // Status based themes
          const statusConfig = {
                    loading: {
                              color: "text-primary",
                              glow: "from-primary/20",
                              border: "border-primary/20"
                    },
                    success: {
                              color: "text-emerald-500",
                              glow: "from-emerald-500/20",
                              border: "border-emerald-500/20"
                    },
                    error: {
                              color: "text-destructive",
                              glow: "from-destructive/20",
                              border: "border-destructive/20"
                    }
          };

          const config = statusConfig[status];

          return (
                    <motion.div
                              initial={{ opacity: 0, y: 20, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="bg-card/40 backdrop-blur-3xl border border-border/50 p-8 md:p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden group"
                    >
                              {/* 🚀 Dynamic Background Glow */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${config.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                              {/* Subtle Aurora Orb */}
                              <div className={`absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none`} />

                              <div className="relative z-10">
                                        {/* Icon Container */}
                                        <div className={`w-20 h-20 md:w-24 md:h-24 border border-border/50 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-secondary/30 backdrop-blur-xl shadow-inner group-hover:border-primary/30 transition-colors duration-500`}>
                                                  <Icon
                                                            className={`w-10 h-10 md:w-12 md:h-12 ${iconColor || config.color} 
            ${status === 'loading' ? 'animate-spin' : 'group-hover:scale-110 transition-transform duration-500'}`}
                                                            strokeWidth={1.5}
                                                  />
                                        </div>

                                        {/* Text Content */}
                                        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 tracking-tighter font-headline uppercase italic">
                                                  {title}
                                        </h2>

                                        <p className="text-muted-foreground max-w-xs mx-auto mb-10 text-sm md:text-base leading-relaxed font-medium">
                                                  {description}
                                        </p>

                                        {/* Action Button */}
                                        {actionLabel && (
                                                  <Button
                                                            onClick={onAction}
                                                            size="lg"
                                                            variant={status === 'error' ? 'outline' : 'default'}
                                                            className={`w-full h-12 rounded-xl font-headline font-black uppercase italic tracking-widest transition-all duration-300 active:scale-95
              ${status !== 'error' ? 'purple-glow' : 'border-border/60 hover:bg-secondary'}
            `}
                                                  >
                                                            {actionLabel}
                                                  </Button>
                                        )}
                              </div>
                    </motion.div>
          );
}