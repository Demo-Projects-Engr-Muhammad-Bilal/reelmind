"use server";

import prisma from "@/lib/prisma/prisma";
import { ActionResponse, AdminRecord } from "@/lib/types";

export async function getAdminProfileAction(): Promise<ActionResponse<AdminRecord>> {
  try {
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return { success: false, error: "Admin account not found." };
    }

    // Strip password from the returned object
    const { password: _password, ...adminDetails } = admin;
    return { success: true, data: adminDetails as AdminRecord };
  } catch {
    return { success: false, error: "Failed to load admin profile." };
  }
}
