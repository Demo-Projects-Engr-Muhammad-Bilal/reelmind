"use client";

import { useState, useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { PlaySquare, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import PageWrapper from "@/components/layout/PageWrapper";
import ReelCard from "@/components/marketing/showcase/ReelCard";
import { Badge } from "@/components/ui/badge";
import { useGallery } from "@/context/gallery/GalleryContext";
import ReelCardSkeleton from "@/components/marketing/showcase/ReelCardSkeleton";

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
          const { reels: allReels, isLoading, fetchGallery } = useGallery();

          const [activeVideoId, setActiveVideoId] = useState<string | number | null>(null);
          const [currentPage, setCurrentPage] = useState(1);
          const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

          
          useEffect(() => {
                    fetchGallery();
          }, [fetchGallery]);

          const totalPages = Math.ceil(allReels.length / ITEMS_PER_PAGE) || 1;
          const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
          const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
          const currentItems = allReels.slice(indexOfFirstItem, indexOfLastItem);

          const chunkedItems = [];
          for (let i = 0; i < currentItems.length; i += 4) {
                    chunkedItems.push(currentItems.slice(i, i + 4));
          }

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

          const handlePageChange = (newPage: number) => {
                    setCurrentPage(newPage);
                    setActiveVideoId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          const containerVariants: Variants = {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          };

          const cardVariants: Variants = {
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
          };

          return (
                    <main className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden relative">
                              <Navbar />

                              <PageWrapper>
                                        <div className="w-full flex-1 flex flex-col pt-32 md:pt-48 pb-20 relative z-10">

                                                  <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                                                  <div className="w-[95%] max-w-6xl mx-auto px-4 sm:px-6">

                                                            <div className="flex flex-col items-center text-center mb-16 space-y-4">
                                                                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                                                                                <Badge variant="outline" className="px-4 py-1 border-primary/30 bg-primary/5 text-primary rounded-full font-bold uppercase italic tracking-[0.2em] text-[10px]">
                                                                                          <PlaySquare className="w-3 h-3 mr-2 fill-primary" /> The Vault
                                                                                </Badge>
                                                                      </motion.div>

                                                                      <motion.h1
                                                                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                                                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                                                transition={{ duration: 0.8, delay: 0.1 }}
                                                                                className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-foreground tracking-tight leading-[1.1]"
                                                                      >
                                                                                Distilled <span className="relative inline-block mt-1">
                                                                                          <span className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full pointer-events-none"></span>
                                                                                          <span className="relative bg-gradient-to-r from-primary via-[#d0bcff] to-primary text-transparent bg-clip-text">Masterpieces.</span>
                                                                                </span>
                                                                      </motion.h1>

                                                                      <motion.p
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                                                className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                                                                      >
                                                                                Explore our public repository of high-retention AI videos generated by ReelMind creators.
                                                                      </motion.p>
                                                            </div>

                                                            {isLoading ? (
                                                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16 w-full mb-16">
                                                                                {Array.from({ length: 4 }).map((_, i) => (
                                                                                          <ReelCardSkeleton key={i} />
                                                                                ))}
                                                                      </div>
                                                            ) : allReels.length === 0 ? (
                                                                      <div className="text-center py-20 text-muted-foreground">
                                                                                <p className="text-lg">No public masterpieces found yet.</p>
                                                                      </div>
                                                            ) : (
                                                                      <div key={currentPage} className="flex flex-col space-y-12 md:space-y-16 mb-16">
                                                                                {chunkedItems.map((chunk, chunkIdx) => (
                                                                                          <div key={`chunk-${chunkIdx}`} className="w-full flex flex-col">
                                                                                                    <motion.div
                                                                                                              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16 relative"
                                                                                                              variants={containerVariants}
                                                                                                              initial="hidden"
                                                                                                              animate="visible"
                                                                                                    >
                                                                                                              {chunk.map((rawReel) => {
                                                                                                                        // ⚡ THE FIX: Data mapping yahan apply kar di gayi hai
                                                                                                                        const uniqueId = String(rawReel.id ?? (rawReel as any)._id);

                                                                                                                        const formattedReel = {
                                                                                                                                  id: uniqueId,
                                                                                                                                  title: rawReel.topic || "Viral AI Reel",
                                                                                                                                  videoSrc: rawReel.videoUrl || "",
                                                                                                                                  views: "10K+",
                                                                                                                                  tag: rawReel.isPublic ? "COMMUNITY" : "NEW",
                                                                                                                                  icon: <Play className="w-3 h-3 text-primary" />,
                                                                                                                                  badgeText: "VIRAL",
                                                                                                                        };

                                                                                                                        return (
                                                                                                                                  <ReelCard
                                                                                                                                            key={uniqueId}
                                                                                                                                            reel={formattedReel} // ⚡ Ab sahi formatted prop ja raha hai
                                                                                                                                            isActive={activeVideoId === uniqueId}
                                                                                                                                            onHover={setActiveVideoId}
                                                                                                                                            videoRef={(el) => { videoRefs.current[uniqueId] = el; }}
                                                                                                                                            variants={cardVariants}
                                                                                                                                  />
                                                                                                                        );
                                                                                                              })}
                                                                                                    </motion.div>

                                                                                                    {chunkIdx < chunkedItems.length - 1 && (
                                                                                                              <div className="w-full flex items-center justify-center mt-12 md:mt-16 relative opacity-80">
                                                                                                                        <div className="h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-border/60 to-transparent"></div>
                                                                                                                        <div className="absolute left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[1px]"></div>
                                                                                                              </div>
                                                                                                    )}
                                                                                          </div>
                                                                                ))}
                                                                      </div>
                                                            )}

                                                            {!isLoading && totalPages > 1 && (
                                                                      <div className="flex items-center justify-center gap-2 mt-4">
                                                                                <button
                                                                                          onClick={() => handlePageChange(currentPage - 1)}
                                                                                          disabled={currentPage === 1}
                                                                                          className="p-2 rounded-xl border border-border/50 bg-sidebar/50 text-muted-foreground hover:bg-sidebar hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                                                >
                                                                                          <ChevronLeft className="w-5 h-5" />
                                                                                </button>

                                                                                <div className="flex items-center gap-2 px-4">
                                                                                          {Array.from({ length: totalPages }).map((_, i) => (
                                                                                                    <button
                                                                                                              key={i}
                                                                                                              onClick={() => handlePageChange(i + 1)}
                                                                                                              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1
                                                                                                                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)]"
                                                                                                                        : "bg-transparent text-muted-foreground hover:bg-sidebar/80 border border-transparent hover:border-border/50"
                                                                                                                        }`}
                                                                                                    >
                                                                                                              {i + 1}
                                                                                                    </button>
                                                                                          ))}
                                                                                </div>

                                                                                <button
                                                                                          onClick={() => handlePageChange(currentPage + 1)}
                                                                                          disabled={currentPage === totalPages}
                                                                                          className="p-2 rounded-xl border border-border/50 bg-sidebar/50 text-muted-foreground hover:bg-sidebar hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                                                >
                                                                                          <ChevronRight className="w-5 h-5" />
                                                                                </button>
                                                                      </div>
                                                            )}

                                                  </div>
                                        </div>
                              </PageWrapper>

                              <Footer />
                    </main>
          );
}