"use client";

import { motion, Variants } from "framer-motion";
import PricingHeader from "./PricingHeader";
import PricingCard from "./PricingCard";
import PricingCardSkeleton from "./PricingCardSkeleton"; // ⚡ 1. Skeleton Import Kiya
import { usePricing } from "@/context/pricing/PricingContext";
import { useAuth } from "@/context/auth/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PLAN_UI_DETAILS: Record<string, { features: string[], isPopular?: boolean }> = {
  starter: { features: ["Standard Render Priority", "Full API Access", "Community Support"], isPopular: false },
  pro: { features: ["High Render Priority", "Custom Font Uploads", "Early Feature Access", "Email Support"], isPopular: true },
  agency: { features: ["Ultra-High Priority", "Whitelabel Options", "Dedicated Solutions Engineer"], isPopular: false }
};

export default function Pricing() {
  const { packages, isLoading, error } = usePricing();
  const { user } = useAuth();
  const router = useRouter();

  const handlePlanSelection = async (planId: string, planName: string) => {
    if (!user) {
      toast.info("Authentication Required", { description: "Redirecting you to the login page..." });
      router.push("/auth?mode=login&callbackUrl=/pricing");
      return;
    }

    const toastId = toast.loading(`Preparing secure checkout for ${planName}...`);

    try {
      const { AI_SERVICE_URL: apiUrl } = await import("@/lib/constants");
      const response = await axios.post(`${apiUrl}/api/v1/payments/create-checkout`, {
        userId: user.id || user._id,
        planId: planId
      });

      if (response.data.success && response.data.url) {
        toast.success("Redirecting to Stripe...", { id: toastId });
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to generate checkout link.", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Checkout Failed", { description: err.response?.data?.message || "Something went wrong.", id: toastId });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-24 overflow-hidden relative z-10" id="pricing">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-[95%] max-w-6xl mx-auto px-6">
        <PricingHeader />

        {isLoading ? (
          // ⚡ 2. Spinner ki jagah 3 khoobsurat Skeletons render ho rahe hain
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full animate-in fade-in duration-500">
            <PricingCardSkeleton />
            {/* Middle walay ko thora highlight kar diya taake Pro card jaisi feel aaye */}
            <div className="relative transform md:-translate-y-4">
              <PricingCardSkeleton />
            </div>
            <PricingCardSkeleton />
          </div>
        ) : error ? (
          <div className="text-center text-rose-500 py-10 font-bold">{error}</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {packages.map((plan) => {
              const uiDetails = PLAN_UI_DETAILS[plan.planId] || { features: [] };

              return (
                <PricingCard
                  key={plan.id}
                  plan={{
                    id: plan.planId,
                    name: plan.name,
                    price: plan.priceUSD,
                    credits: plan.credits,
                    features: uiDetails.features,
                    isPopular: uiDetails.isPopular,
                    buttonText:"Subscribe"
                  }}
                  variants={cardVariants}
                  onSelect={handlePlanSelection}
                />
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}