import { Request, Response } from "express";
import { prisma } from "@aireelgen/database";
import { ScoringService } from "../../services/scoring.service.js";
import { LLMManager } from "../../managers/generation/llm/llm.manager.js";

const llmManager = new LLMManager();

/**
 * 🪝 Hook Generation & Scoring Phase
 * Path: src/controllers/generate/hooks.controller.ts
 */
export const generateHooksPhase = async (req: Request, res: Response) => {
          // ⚡ EXTRACT isRetake and reelId
          const { topic, nicheKey, userId, isRetake, reelId } = req.body;

          try {
                    const nicheConfig = await prisma.niche.findUnique({ where: { key: nicheKey } });
                    if (!nicheConfig) throw new Error("Niche logic not found in DB.");

                    let reel;
                    if (isRetake && reelId) {
                              // ⚡ UPDATE existing reel if it's a retake so we don't spam the DB
                              reel = await prisma.reel.update({
                                        where: { id: reelId },
                                        data: { status: "GENERATING_HOOKS" }
                              });
                    } else {
                              // Create fresh reel
                              reel = await prisma.reel.create({
                                        data: { userId, topic, style: nicheConfig.name, status: "GENERATING_HOOKS" }
                              });
                    }

                    // ⚡ PASS isRetake flag to LLM Manager
                    const hooks = await llmManager.generateHooks(topic, nicheConfig, 3, isRetake);
                    const rankedResults = await ScoringService.rankAllHooks(hooks);
                    const winner = rankedResults[0];

                    // ⚡ FIX: Save the generated hooks to the database so they are not lost on refresh
                    await prisma.reel.update({
                              where: { id: reel.id },
                              data: {
                                        hooks: JSON.stringify(rankedResults),
                                        status: "PENDING_APPROVAL" // Update status since it's waiting for user
                              }
                    });

                    return res.status(200).json({
                              success: true,
                              reelId: reel.id,
                              mlScore: winner.score.toFixed(2),
                              hooksAnalysedWithScores: rankedResults,
                    });
          } catch (error: any) {
                    console.error("❌ Phase 1 Crash:", error.message);
                    return res.status(500).json({ error: error.message });
          }
};