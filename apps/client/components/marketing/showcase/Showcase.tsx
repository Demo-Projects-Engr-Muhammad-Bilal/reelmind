"use client";

import { useState, useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import ShowcaseHeader from "./ShowcaseHeader";
import ReelCard from "./ReelCard";
import ReelCardSkeleton from "./ReelCardSkeleton";
import { useGallery } from "@/context/gallery/GalleryContext";

export default function Showcase() {
  // ✅ fetchGallery ko destructure kiya
  const { reels, isLoading, error, fetchGallery } = useGallery();
  const [activeVideoId, setActiveVideoId] = useState<string | number | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const displayReels = reels.slice(0, 4);

  // ✅ ⚡ Yeh trigger karega aapki network request ko
  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (video) {
        if (key === String(activeVideoId)) {
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      }
    });
  }, [activeVideoId]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } },
  };

  return (
    <section className="py-24 overflow-hidden relative z-10" id="showcase">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-[95%] max-w-6xl mx-auto px-6">
        <ShowcaseHeader />

        {/* ⚡ Loading aur Error state ki handling */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative mb-16">
            {Array.from({ length: 4 }).map((_, i) => <ReelCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center text-rose-500 py-10 font-bold">{error}</div>
        ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {displayReels.map((rawReel) => {
                  const uniqueId = String(rawReel.id ?? (rawReel as any)._id);

                  // ⚡ Backend properties ko ReelCard ki properties se map kar rahe hain
                  const formattedReel = {
                    id: uniqueId,
                    title: rawReel.topic || "Viral AI Reel",    // Backend 'topic' ko 'title' banaya
                    videoSrc: rawReel.videoUrl || "",           // Backend 'videoUrl' ko 'videoSrc' banaya
                    views: "10K+",                              // Agar views DB mein nahi hain toh static dal dein
                    tag: rawReel.isPublic ? "COMMUNITY" : "NEW",
                    icon: <Play className="w-3 h-3 text-primary" />, // Icon jo ReelCard expect kar raha hai
                    badgeText: "VIRAL",
                  };

                  return (
                    <ReelCard
                      key={uniqueId}
                      reel={formattedReel} // ⚡ Ab formattedReel pass kar rahe hain
                      isActive={activeVideoId === uniqueId}
                      onHover={setActiveVideoId}
                      videoRef={(el) => {
                        videoRefs.current[uniqueId] = el;
                      }}
                      variants={cardVariants}
                    />
                  );
                })}
              </motion.div>
        )}

        <div className="flex justify-center md:justify-end">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <Link href="/gallery" className="group flex items-center gap-3 text-muted-foreground hover:text-foreground font-headline font-black uppercase italic text-xs tracking-widest transition-all">
              Explore Full Gallery
              <span className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}