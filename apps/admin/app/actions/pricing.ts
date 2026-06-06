"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { pricingSchema, PricingFormValues } from "@/lib/validations/pricing";
import { ActionResponse } from "./niche";

// 1. READ RATES
export async function getPricingRatesAction(): Promise<ActionResponse<any[]>> {
          try {
                    const rates = await prisma.pricingRate.findMany({ orderBy: { stage: "asc" } });
                    return { success: true, data: rates };
          } catch (error) {
                    return { success: false, error: "Failed to fetch pricing rates." };
          }
}

// 2. UPDATE RATE ONLY
export async function updatePricingAction(id: string, formData: PricingFormValues): Promise<ActionResponse<any>> {
          try {
                    const validatedData = pricingSchema.safeParse(formData);
                    if (!validatedData.success) return { success: false, error: "Invalid data." };

                    const updatedRate = await prisma.pricingRate.update({ where: { id }, data: validatedData.data });
                    revalidatePath("/dashboard");
                    return { success: true, data: updatedRate };
          } catch (error) {
                    return { success: false, error: "Failed to update pricing rate." };
          }
}