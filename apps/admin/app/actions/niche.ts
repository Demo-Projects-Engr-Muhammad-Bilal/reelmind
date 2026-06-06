"use server";

import prisma from "@/lib/prisma/prisma"; // Check this path matches your prisma client
import { revalidatePath } from "next/cache";
import { nicheSchema, NicheFormValues } from "@/lib/validations/niche";

// ⚡ STRICT TYPE DEFINITION (Yeh TS Error fix karega)
export type ActionResponse<T> =
          | { success: true; data: T }
          | { success: false; error: string };

// 1. CREATE NICHE
export async function createNicheAction(formData: NicheFormValues): Promise<ActionResponse<any>> {
          try {
                    // 🛡️ BACKEND ZOD VALIDATION
                    const validatedData = nicheSchema.safeParse(formData);
                    if (!validatedData.success) {
                              return { success: false, error: "Invalid data received on server." };
                    }

                    const newNiche = await prisma.niche.create({ data: validatedData.data });
                    revalidatePath("/dashboard");

                    return { success: true, data: newNiche };
          } catch (error: any) {
                    if (error.code === "P2002") return { success: false, error: "Unique Key already exists." };
                    return { success: false, error: "Database error occurred." };
          }
}

// 2. READ NICHES
export async function getNichesAction(): Promise<ActionResponse<any[]>> {
          try {
                    const niches = await prisma.niche.findMany({
                              orderBy: { createdAt: "desc" },
                    });
                    return { success: true, data: niches };
          } catch (error) {
                    return { success: false, error: "Failed to fetch niches." };
          }
}

// 3. UPDATE NICHE
export async function updateNicheAction(id: string, formData: NicheFormValues): Promise<ActionResponse<any>> {
          try {
                    // 🛡️ BACKEND ZOD VALIDATION
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
          } catch (error) {
                    return { success: false, error: "Failed to update niche." };
          }
}