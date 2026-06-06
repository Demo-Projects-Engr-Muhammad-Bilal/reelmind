"use server";

import prisma from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export type ActionResponse<T> = { success: boolean; data?: T; error?: string };

// 1. GET ALL REELS (With Scenes & User Data)
export async function getReelsAction(): Promise<ActionResponse<any[]>> {
          try {
                    const reels = await prisma.reel.findMany({
                              orderBy: { createdAt: "desc" },
                              take: 500, // Limit for performance, adjust as needed
                              include: {
                                        user: {
                                                  select: { name: true, email: true }
                                        },
                                        scenes: {
                                                  orderBy: { order: 'asc' } // Scene 1, Scene 2, etc.
                                        }
                              }
                    });
                    return { success: true, data: reels };
          } catch (error) {
                    console.error("Failed to fetch reels:", error);
                    return { success: false, error: "Failed to load reels data." };
          }
}

// 2. TOGGLE REEL VISIBILITY (isPublic)
export async function toggleReelVisibilityAction(reelId: string, currentStatus: boolean): Promise<ActionResponse<any>> {
          try {
                    const updatedReel = await prisma.reel.update({
                              where: { id: reelId },
                              data: { isPublic: !currentStatus }
                    });
                    revalidatePath("/dashboard");
                    return { success: true, data: updatedReel };
          } catch (error) {
                    return { success: false, error: "Failed to update visibility." };
          }
}

// 3. DELETE REEL (Cascade will handle scenes if setup in DB)
export async function deleteReelAction(reelId: string): Promise<ActionResponse<boolean>> {
          try {
                    await prisma.reel.delete({
                              where: { id: reelId }
                    });
                    revalidatePath("/dashboard");
                    return { success: true, data: true };
          } catch (error) {
                    return { success: false, error: "Failed to delete the reel." };
          }
}