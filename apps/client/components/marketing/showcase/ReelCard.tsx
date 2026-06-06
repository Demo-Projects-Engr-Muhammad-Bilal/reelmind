// apps/web/src/components/marketing/showcase/ReelCard.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Play, Volume2 } from "lucide-react";

interface ReelCardProps {
  reel: {
    id: string | number; // 👈 Pehle sirf 'number' tha, ab string bhi allow kar diya
    title: string;
    views: string;
    videoSrc: string;
    tag: string;
    icon: React.ReactNode;
    badgeText?: string;
  };
  isActive: boolean;
  onHover: (id: string | number | null) => void; // 👈 Yahan bhi 'string | number' allow karo
  videoRef: React.Ref<HTMLVideoElement>;
  variants?: any;
}

export default function ReelCard({ reel, isActive, onHover, videoRef, variants }: ReelCardProps) {
  return (
    <div className="flex flex-col relative">
      <motion.div
        variants={variants}
        onMouseEnter={() => onHover(reel.id)}
        onMouseLeave={() => onHover(null)}
        className={`relative group rounded-[2rem] border-4 transition-all duration-500 bg-black p-1 cursor-pointer
          ${isActive ? 'border-primary/40 shadow-[0_0_40px_rgba(139,92,246,0.15)] -translate-y-2' : 'border-border/40 shadow-xl'}
        `}
      >
        {/* Floating Info Badge */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: -15 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-10 left-0 z-30 bg-background/90 backdrop-blur-md border border-border/50 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xl whitespace-nowrap"
            >
              {reel.icon}
              <span className="text-foreground font-headline text-[10px] font-black uppercase italic tracking-wider">{reel.badgeText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="aspect-[9/16] rounded-[1.7rem] bg-zinc-900 overflow-hidden relative">
          <video
            ref={videoRef}
            src={reel.videoSrc}
            loop
            muted={!isActive}
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Professional Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-40' : 'opacity-80'}`} />

          {/* Compact Action Icon */}
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-20">
            {isActive ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />}
          </div>

          {/* Branded Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end z-20">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-md bg-primary/20 backdrop-blur-md border border-primary/20 text-primary font-bold text-[9px] uppercase tracking-widest">
                {reel.tag}
              </span>
              <span className="flex items-center gap-1 text-white text-[10px] font-black bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                <Eye className="w-3 h-3 text-muted-foreground" strokeWidth={3} />
                {reel.views}
              </span>
            </div>
            <h3 className="font-headline font-bold text-white text-base tracking-tight drop-shadow-md leading-tight">
              {reel.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
}