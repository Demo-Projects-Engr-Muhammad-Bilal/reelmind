"use server";

import prisma from "@/lib/prisma/prisma"; // Confirm this matches your prisma instance path
import { revalidatePath } from "next/cache";
import { packageSchema, PackageFormValues } from "@/lib/validations/package";
import { ActionResponse } from "./niche";

// 1. READ PACKAGES
export async function getPackagesAction(): Promise<ActionResponse<any[]>> {
          try {
                    const packages = await prisma.creditPackage.findMany({
                              orderBy: { priceUSD: "asc" }
                    });
                    return { success: true, data: packages };
          } catch (error) {
                    return { success: false, error: "Failed to fetch packages." };
          }
}

// 2. UPDATE PACKAGE ONLY
export async function updatePackageAction(id: string, formData: PackageFormValues): Promise<ActionResponse<any>> {
          try {
                    const validatedData = packageSchema.safeParse(formData);
                    if (!validatedData.success) return { success: false, error: "Invalid data." };

                    const updatedPackage = await prisma.creditPackage.update({
                              where: { id },
                              data: validatedData.data
                    });
                    revalidatePath("/dashboard");
                    return { success: true, data: updatedPackage };
          } catch (error) {
                    return { success: false, error: "Failed to update package." };
          }
}