"use server";

import prisma from "@/lib/prisma/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";

interface UpdateAdminProfilePayload {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function updateAdminProfileAction(
  formData: UpdateAdminProfilePayload
): Promise<ActionResponse<boolean>> {
  try {
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return { success: false, error: "Admin account not found." };
    }

    const { name, email, currentPassword, newPassword } = formData;
    const updateData: Record<string, unknown> = { name, email };

    if (currentPassword && newPassword) {
      const isPasswordMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isPasswordMatch) {
        return { success: false, error: "Current password is incorrect." };
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
      updateData.lastPasswordChange = new Date();
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: updateData,
    });

    revalidatePath("/dashboard");
    return { success: true, data: true };
  } catch (error) {
    console.error("[updateAdminProfile]", error);
    return { success: false, error: "Failed to update profile settings." };
  }
}
