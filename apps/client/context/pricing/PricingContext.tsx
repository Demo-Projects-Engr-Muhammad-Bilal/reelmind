"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface CreditPackage {
          id: string;
          planId: string;
          name: string;
          credits: number;
          priceUSD: number;
}

interface PricingContextType {
          packages: CreditPackage[];
          isLoading: boolean;
          error: string | null;
}

const PricingContext = createContext<PricingContextType>({
          packages: [],
          isLoading: true,
          error: null,
});

export const usePricing = () => useContext(PricingContext);

export const PricingProvider = ({ children }: { children: React.ReactNode }) => {
          const [packages, setPackages] = useState<CreditPackage[]>([]);
          const [isLoading, setIsLoading] = useState(true);
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
                    const fetchPackages = async () => {
                              try {
                                        // Tumhara backend port 5001 par hai
                                        const { AI_SERVICE_URL } = await import("@/lib/constants");
                                        const response = await axios.get(`${AI_SERVICE_URL}/api/v1/payments/packages`);
                                        if (response.data.success) {
                                                  setPackages(response.data.data);
                                        } else {
                                                  setError("Failed to load packages.");
                                        }
                              } catch (err: any) {
                                        setError(err.message || "An error occurred.");
                              } finally {
                                        setIsLoading(false);
                              }
                    };

                    fetchPackages();
          }, []);

          return (
                    <PricingContext.Provider value={{ packages, isLoading, error }}>
                              {children}
                    </PricingContext.Provider>
          );
};