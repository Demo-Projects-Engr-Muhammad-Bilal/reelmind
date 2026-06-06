"use client";
import { useState, useEffect, useRef } from "react";

export const useHeroLogic = (rotatingWords: string[]) => {
          const [wordIndex, setWordIndex] = useState(0);
          const [isMuted, setIsMuted] = useState(true);
          const videoRef = useRef<HTMLVideoElement>(null);

          // 1. Text Rotation Effect
          useEffect(() => {
                    const interval = setInterval(() => {
                              setWordIndex((prev) => (prev + 1) % rotatingWords.length);
                    }, 3000);
                    return () => clearInterval(interval);
          }, [rotatingWords.length]);

          // 2. Sync Sound Toggle and State
          useEffect(() => {
                    if (videoRef.current) {
                              videoRef.current.muted = isMuted;
                    }
          }, [isMuted]);

          return { wordIndex, isMuted, setIsMuted, videoRef };
};