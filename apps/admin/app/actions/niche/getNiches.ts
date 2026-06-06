"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse, NicheRecord } from "@/lib/types";

export async function getNichesAction(): Promise<ActionResponse<NicheRecord[]>> {
  try {
    const niches = await prisma.niche.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: niches };
  } catch {
    return { success: false, error: "Failed to fetch niches." };
  }
}
