"use server";

import prisma from "@/lib/prisma/prisma";
import bcrypt from "bcrypt"; // Ya jo bhi hashing library tum use kar rahay ho
import { revalidatePath } from "next/cache";


export type ActionResponse<T> = { success: boolean; data?: T; error?: string };

// 1. GET ADMIN PROFILE
export async function getAdminProfileAction(): Promise<ActionResponse<any>> {
          try {
                    const admin = await prisma.admin.findFirst();
                    if (!admin) return { success: false, error: "Admin account not found." };

                    const { password, ...adminDetails } = admin;
                    return { success: true, data: adminDetails };
          } catch (error) {
                    return { success: false, error: "Failed to load admin profile." };
          }
}

// 2. UPDATE ADMIN PROFILE
export async function updateAdminProfileAction(formData: any): Promise<ActionResponse<boolean>> {
          try {
                    const admin = await prisma.admin.findFirst();
                    if (!admin) return { success: false, error: "Admin account not found." };

                    const { name, email, currentPassword, newPassword } = formData;
                    const updateData: any = { name, email };

                    // Password Update Logic
                    if (currentPassword && newPassword) {
                              const isPasswordMatch = await bcrypt.compare(currentPassword, admin.password);
                              if (!isPasswordMatch) {
                                        return { success: false, error: "Current password is incorrect." };
                              }
                              const salt = await bcrypt.genSalt(10);
                              updateData.password = await bcrypt.hash(newPassword, salt);
                              updateData.lastPasswordChange = new Date(); // ⚡ Update tracking time
                    }

                    await prisma.admin.update({
                              where: { id: admin.id },
                              data: updateData
                    });

                    revalidatePath("/dashboard");
                    return { success: true, data: true };
          } catch (error) {
                    console.error(error);
                    return { success: false, error: "Failed to update profile settings." };
          }
}