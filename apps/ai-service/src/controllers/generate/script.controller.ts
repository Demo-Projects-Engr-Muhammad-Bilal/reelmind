import { Request, Response } from "express";
import { prisma } from "@aireelgen/database";
import { LLMManager } from "../../managers/generation/llm/llm.manager.js";
import { getIO } from "../../services/socket.service.js"; 

const llmManager = new LLMManager();

/**
 * 📜 Script Writing & Scene Injection Phase
 */
export const generateScriptPhase = async (req: Request, res: Response) => {
          const { reelId, winnerHook, nicheKey, isRetake, sceneOrder } = req.body;

          try {
                    const nicheConfig = await prisma.niche.findUnique({ where: { key: nicheKey } });
                    if (!nicheConfig) throw new Error("Niche logic not found in DB.");

                    let updatedReel;

                    // ⚡ NEW: SINGLE SCENE RETAKE LOGIC
                    if (sceneOrder && isRetake) {
                              const existingScene = await prisma.scene.findFirst({
                                        where: { reelId: reelId, order: Number(sceneOrder) }
                              });

                              if (!existingScene) throw new Error("Scene not found for retake.");

                              // Request purely 1 scene using old data as negative constraint
                              const rawResult = await llmManager.generateSingleSceneRetake(
                                        winnerHook, nicheConfig, existingScene.audioText || "", existingScene.visualPrompt || ""
                              );
                              
                              const newScene = Array.isArray(rawResult) ? rawResult[0] : rawResult;

                              // Target and update strictly the requested scene
                              await prisma.scene.updateMany({
                                        where: { reelId: reelId, order: Number(sceneOrder) },
                                        data: {
                                                  visualPrompt: newScene.visualPrompt || newScene.prompt || "",
                                                  audioText: newScene.audioText || newScene.text || ""
                                        }
                              });

                              updatedReel = await prisma.reel.findUnique({
                                        where: { id: reelId },
                                        include: { scenes: { orderBy: { order: 'asc' } } }
                              });

                    } else {
                              // ⚡ NORMAL FULL SCRIPT LOGIC
                              const result = await llmManager.generateFinalScripts(winnerHook, nicheConfig, isRetake);
                              const primaryVariation = Array.isArray(result) ? result[0] : result;

                              if (!primaryVariation || !primaryVariation.scenes) {
                                        throw new Error("AI returned a script without scenes.");
                              }

                              updatedReel = await prisma.$transaction(async (tx) => {
                                        await tx.scene.deleteMany({ where: { reelId: reelId } });

                                        await tx.scene.createMany({
                                                  data: primaryVariation.scenes.map((s: any) => ({
                                                            reelId: reelId,
                                                            order: s.order || 0,
                                                            visualPrompt: s.visualPrompt || s.prompt || "",
                                                            audioText: s.audioText || s.text || "",
                                                            voiceoverUrl: null,
                                                            audioDuration: 0
                                                  }))
                                        });

                                        return await tx.reel.update({
                                                  where: { id: reelId },
                                                  data: {
                                                            winnerScript: primaryVariation as any,
                                                            status: "SCRIPT_GENERATED"
                                                  },
                                                  include: { scenes: { orderBy: { order: 'asc' } } }
                                        });
                              });
                    }

                    // Push updated scene data to Frontend Real-time via Socket
                    try {
                              getIO().to(reelId).emit("step_update", { step: "script", status: "completed", data: updatedReel?.scenes });
                    } catch (e) {}

                    return res.status(200).json({
                              success: true,
                              reelId: reelId,
                              status: updatedReel?.status,
                              script: updatedReel?.winnerScript,
                              scenes: updatedReel?.scenes
                    });
          } catch (error: any) {
                    return res.status(500).json({ error: error.message });
          }
};