"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse, CreditPackageRecord } from "@/lib/types";

export async function getPackagesAction(): Promise<ActionResponse<CreditPackageRecord[]>> {
  try {
    const packages = await prisma.creditPackage.findMany({
      orderBy: { priceUSD: "asc" },
    });
    return { success: true, data: packages };
  } catch {
    return { success: false, error: "Failed to fetch packages." };
  }
}
