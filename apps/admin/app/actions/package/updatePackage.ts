"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { packageSchema, PackageFormValues } from "@/lib/validations/package";
import { ActionResponse, CreditPackageRecord } from "@/lib/types";

export async function updatePackageAction(
  id: string,
  formData: PackageFormValues
): Promise<ActionResponse<CreditPackageRecord>> {
  try {
    const validatedData = packageSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data." };
    }

    const updatedPackage = await prisma.creditPackage.update({
      where: { id },
      data: validatedData.data,
    });
    revalidatePath("/dashboard");
    return { success: true, data: updatedPackage };
  } catch {
    return { success: false, error: "Failed to update package." };
  }
}
