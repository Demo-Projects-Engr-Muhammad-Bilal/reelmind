// src/context/MarketingProviders.tsx
"use client";

import React from "react";
import { GalleryProvider, useGallery } from "@/context/gallery/GalleryContext";
import { PricingProvider, usePricing } from "@/context/pricing/PricingContext";
import GlobalLoader from "@/components/theme/GlobalLoader";

// ⚡ Yeh manager ab sirf Gallery aur Pricing ko dekhega (Auth ko nahi)
const MarketingLoaderManager = ({ children }: { children: React.ReactNode }) => {
          const { isLoading: galleryLoading } = useGallery();
          const { isLoading: pricingLoading } = usePricing();

          if (galleryLoading || pricingLoading) {
                    return <GlobalLoader />;
          }

          return <>{children}</>;
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