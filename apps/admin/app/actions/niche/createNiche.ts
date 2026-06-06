"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { nicheSchema, NicheFormValues } from "@/lib/validations/niche";
import { ActionResponse, NicheRecord } from "@/lib/types";

export async function createNicheAction(
  formData: NicheFormValues
): Promise<ActionResponse<NicheRecord>> {
  try {
    const validatedData = nicheSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data received on server." };
    }

    const newNiche = await prisma.niche.create({ data: validatedData.data });
    revalidatePath("/dashboard");
    return { success: true, data: newNiche };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Unique Key already exists." };
    }
    return { success: false, error: "Database error occurred." };
  }
}
