// apps/web/src/components/marketing/hero/HeroVisual.tsx
"use client";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroVisual({ isMuted, setIsMuted, videoRef }: any) {
          return (
                    <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="relative group w-full"
                    >
                              {/* Container aspect ratio kept same, but centered within its column */}
                              <div className="relative aspect-[9/16] max-h-[580px] ml-auto rounded-[2rem] border-4 border-border/50 bg-secondary/20 overflow-hidden shadow-2xl transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-primary/10">

                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <video
                                                  ref={videoRef}
                                                  src="https://res.cloudinary.com/dviouzm53/video/upload/v1778826409/aireelgen/reels/6a06b8ca9189d03fbf62bd31/final/u4nc6efhoywmmpclz4yk.mp4"
                                                  autoPlay
                                                  loop
                                                  muted={isMuted}
                                                  playsInline
                                                  className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        <div className="absolute bottom-6 right-6 z-20">
                                                  <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="rounded-full bg-background/40 backdrop-blur-md border-white/10 hover:bg-background/80"
                                                            onClick={() => setIsMuted(!isMuted)}
                                                  >
                                                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                  </Button>
                                        </div>

                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 group-hover:scale-100">
                                                  <div className="bg-primary/20 backdrop-blur-xl p-4 rounded-full border border-primary/40">
                                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                                  </div>
                                        </div>
                              </div>
                    </motion.div>
          );
}