"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { nicheSchema, NicheFormValues } from "@/lib/validations/niche";
import { ActionResponse, NicheRecord } from "@/lib/types";

export async function updateNicheAction(
  id: string,
  formData: NicheFormValues
): Promise<ActionResponse<NicheRecord>> {
  try {
    const validatedData = nicheSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data received on server." };
    }

    const updatedNiche = await prisma.niche.update({
      where: { id },
      data: validatedData.data,
    });
    revalidatePath("/dashboard");
    return { success: true, data: updatedNiche };
  } catch {
    return { success: false, error: "Failed to update niche." };
  }
}
