"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "./niche";

// 1. GET ALL USERS (With their Telegram info & Reels count)
export async function getUsersAction(): Promise<ActionResponse<any[]>> {
          try {
                    const users = await prisma.user.findMany({
                              orderBy: { createdAt: "desc" },
                              include: {
                                        telegramCreds: true,
                                        _count: {
                                                  select: { reels: true }
                                        }
                              }
                    });
                    return { success: true, data: users };
          } catch (error) {
                    return { success: false, error: "Failed to fetch users." };
          }
}

// 2. UPDATE USER CREDITS
export async function updateUserCreditsAction(userId: string, newCredits: number): Promise<ActionResponse<any>> {
          try {
                    if (newCredits < 0) return { success: false, error: "Credits cannot be negative." };

                    const updatedUser = await prisma.user.update({
                              where: { id: userId },
                              data: { credits: newCredits }
                    });

                    revalidatePath("/dashboard");
                    return { success: true, data: updatedUser };
          } catch (error) {
                    return { success: false, error: "Failed to update credits." };
          }
}

// 3. TOGGLE ACCOUNT STATUS (FREEZE / UNFREEZE)
export async function toggleUserStatusAction(userId: string, currentStatus: boolean): Promise<ActionResponse<any>> {
          try {
                    const newStatus = !currentStatus; // Agar true hai tou false (freeze) kar do

                    const updatedUser = await prisma.user.update({
                              where: { id: userId },
                              data: { isVerified: newStatus }
                    });

                    // 📧 EMAIL SENDING LOGIC (Trigger only when freezing)
                    if (!newStatus && updatedUser.email) {
                              // Yahan tum apna Email Sending function call karoge (e.g., Resend, Nodemailer)
                              // Example:
                              // await sendEmail({
                              //   to: updatedUser.email,
                              //   subject: "Account Suspended - Aethelgard",
                              //   html: `<p>Hi ${updatedUser.name || 'User'}, your account has been temporarily frozen. Please contact support.</p>`
                              // });
                              console.log(`Email sent to ${updatedUser.email}: Account Blocked`);
                    }

                    revalidatePath("/dashboard");
                    return { success: true, data: updatedUser };
          } catch (error) {
                    return { success: false, error: "Failed to update user status." };
          }
}