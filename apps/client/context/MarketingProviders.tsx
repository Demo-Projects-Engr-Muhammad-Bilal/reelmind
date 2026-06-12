"use client";

import React, { useState, useEffect } from "react";
import { GalleryProvider, useGallery } from "@/context/gallery/GalleryContext";
import { PricingProvider, usePricing } from "@/context/pricing/PricingContext";
import GlobalLoader from "@/components/theme/GlobalLoader";

const MarketingLoaderManager = ({ children }: { children: React.ReactNode }) => {
          const { isLoading: galleryLoading } = useGallery();
          const { isLoading: pricingLoading } = usePricing();

          const [isMounted, setIsMounted] = useState(false);
          const [showLoader, setShowLoader] = useState(true);

          // 1. SSR & Hydration Sync
          useEffect(() => {
                    setIsMounted(true);
          }, []);

          // 2. Smooth Transition Logic
          useEffect(() => {
                    const isDataLoading = galleryLoading || pricingLoading;

                    if (isDataLoading) {
                              setShowLoader(true);
                    } else {
                              // ⚡ Data aane ke baad 400ms ka buffer taake koi screen flash na ho
                              const timer = setTimeout(() => {
                                        setShowLoader(false);
                              }, 400);
                              return () => clearTimeout(timer);
                    }
          }, [galleryLoading, pricingLoading]);

          // Agar client par hydrate nahi hua ya data load ho raha hai, toh loader dikhao
          if (!isMounted || showLoader) {
                    return <GlobalLoader />;
          }

          return (
                    <div className="animate-in fade-in duration-700 ease-in-out">
                              {children}
                    </div>
          );
};

export const MarketingProviders = ({ children }: { children: React.ReactNode }) => {
          return (
                    <GalleryProvider>
                              <PricingProvider>
                                        <MarketingLoaderManager>
                                                  {children}
                                        </MarketingLoaderManager>
                              </PricingProvider>
                    </GalleryProvider>
          );
};