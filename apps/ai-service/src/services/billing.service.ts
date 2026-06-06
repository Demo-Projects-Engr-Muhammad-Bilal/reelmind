/**
 * 💸 Pay-As-You-Go Credit Billing Service (Dynamic DB Version)
 * Responsibility: Executing atomic transactions and updating Reel and Scene cost metrics.
 * Path: src/services/billing.service.ts
 */

import { prisma } from "@aireelgen/database";

export class BillingService {
          /**
           * 🎛️ Dynamic Atomic Credit Charger
           * Deducts user balance, logs usage forensic histories, and tallies Reel/Scene aggregate costs.
           */
          async chargeUser(
                    userId: string,
                    reelId: string,
                    stage: 'AUDIO' | 'IMAGE' | 'VIDEO' | 'UTILITY',
                    provider: string,
                    multiplier: number = 1,
                    sceneId?: string // 💡 Scene context to automatically log cost against a specific scene row
          ): Promise<number> {

                    // 1. Dynamic DB Query: Fetch target rate record using unique provider key
                    const rateRecord = await prisma.pricingRate.findUnique({
                              where: { provider }
                    });

                    const baseCost = rateRecord ? rateRecord.rate : 0;
                    const finalCost = Math.ceil(baseCost * multiplier);

                    // If cost evaluates to zero (e.g., fallback cache features), bypass heavy transactional state
                    if (finalCost === 0) {
                              console.log(`🛡️ [Billing] Zero deduction logged for ${stage} via ${provider}. Skipping transaction.`);
                              return 0;
                    }

                    try {
                              // 2. Identify and resolve target scene order sequence integer if sceneId context supplied
                              let parsedSceneOrder = 1;
                              if (sceneId) {
                                        // Extracts the digits from string structure (e.g., "scene_02" becomes 2)
                                        const matchedDigits = sceneId.match(/\d+/);
                                        if (matchedDigits) {
                                                  parsedSceneOrder = parseInt(matchedDigits[0], 10);
                                        }
                              }

                              // 3. Managed Database Transaction block ensuring isolated ACID execution properties
                              await prisma.$transaction(async (tx) => {
                                        // Operation A: Decrement credit points straight from target user account
                                        await tx.user.update({
                                                  where: { id: userId },
                                                  data: { credits: { decrement: finalCost } }
                                        });

                                        // Operation B: Document strict forensic evidence into the ledger logs
                                        await tx.usageLog.create({
                                                  data: { userId, reelId, stage, provider, cost: finalCost }
                                        });

                                        // Operation C: Increment total cost metrics inside the parent Reel tracker table
                                        await tx.reel.update({
                                                  where: { id: reelId },
                                                  data: { totalCreditsSpent: { increment: finalCost } }
                                        });

                                        // Operation D: If scene context provided, safely increment specific scene row data metrics
                                        if (sceneId) {
                                                  // Finds the exact scene matching parent reel context and sequential ordering constraints
                                                  const targetScene = await tx.scene.findFirst({
                                                            where: { reelId, order: parsedSceneOrder }
                                                  });

                                                  if (targetScene) {
                                                            await tx.scene.update({
                                                                      where: { id: targetScene.id },
                                                                      data: { creditsSpent: { increment: finalCost } }
                                                            });
                                                  }
                                        }
                              });

                              console.log(`💸 [Billing Complete] Deducted ${finalCost} credits. Updated metrics for Reel: ${reelId} ${sceneId ? `and Scene Order: ${parsedSceneOrder}` : ''}`);
                              return finalCost;

                    } catch (error: any) {
                              console.error(`❌ [Billing System Crash] Transaction collapsed for user ${userId}:`, error.message);
                              throw new Error(`Billing transaction collapsed: ${error.message}`);
                    }
          }
}