"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse, PricingRateRecord } from "@/lib/types";

export async function getPricingRatesAction(): Promise<ActionResponse<PricingRateRecord[]>> {
  try {
    const rates = await prisma.pricingRate.findMany({ orderBy: { stage: "asc" } });
    return { success: true, data: rates };
  } catch {
    return { success: false, error: "Failed to fetch pricing rates." };
  }
}
