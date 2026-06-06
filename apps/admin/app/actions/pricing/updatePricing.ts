"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { pricingSchema, PricingFormValues } from "@/lib/validations/pricing";
import { ActionResponse, PricingRateRecord } from "@/lib/types";

export async function updatePricingAction(
  id: string,
  formData: PricingFormValues
): Promise<ActionResponse<PricingRateRecord>> {
  try {
    const validatedData = pricingSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data." };
    }

    const updatedRate = await prisma.pricingRate.update({
      where: { id },
      data: validatedData.data,
    });
    revalidatePath("/dashboard");
    return { success: true, data: updatedRate };
  } catch {
    return { success: false, error: "Failed to update pricing rate." };
  }
}
