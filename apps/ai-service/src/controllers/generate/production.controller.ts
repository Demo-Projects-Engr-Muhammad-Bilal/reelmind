import 'dotenv/config';
import { Request, Response } from "express";
import { prisma } from "@aireelgen/database";
import { generationQueue } from "../../config/bullmq.config.js";

// Utility to dispatch job to BullMQ with taskType
const dispatchJob = async (res: Response, payload: any, taskType: string) => {
    // ⚡ FIX: Added sceneOrder to destructuring for Single Scene Retakes
    const { reelId, nicheKey, videoType, selectedBgmIndex, userId, sceneOrder } = payload;

    try {
        if (!userId) return res.status(400).json({ error: "Missing required 'userId' payload parameter." });

        // 🛑 1. SECURE QUEUE LIMIT CHECK (Max 3 Active Reels)
        // Hum current reel (reelId) ko count mein shamil nahi karenge
        // kyunke ho sakta hai user usi active reel ka next step trigger kar raha ho
        const activeJobsCount = await prisma.reel.count({
            where: {
                userId: userId,
                status: {
                    notIn: ['COMPLETED', 'FAILED', 'CANCELLED']
                },
                id: {
                    not: reelId
                }
            }
        });

        // 🛑 2. BLOCK IF LIMIT EXCEEDED
        if (activeJobsCount >= 3) {
            return res.status(429).json({
                success: false,
                error: "Queue limit exceeded. You can only have 3 active generations at a time."
            });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "User account context error: Record not found." });

        const MINIMUM_CREDIT_REQUIRED = parseInt(process.env.MINIMUM_CREDIT_REQUIRED || "400", 10);
        if (user.credits < MINIMUM_CREDIT_REQUIRED) {
            return res.status(402).json({ success: false, error: "Insufficient Credits" });
        }

        const reel = await prisma.reel.findUnique({ where: { id: reelId } });
        if (!reel) return res.status(404).json({ error: "Reel entity mismatch." });

        const job = await generationQueue.add(`production-${reelId}-${taskType}`, {
            reelId,
            nicheKey,
            videoType: videoType || 'ai',
            selectedBgmIndex,
            userId,
            taskType, // 'FULL' | 'ASSETS' | 'VIDEO' | 'COMPOSITION'
            sceneOrder // ⚡ FIX: Optional param to target a specific scene
        });

        await prisma.reel.update({ where: { id: reelId }, data: { status: "QUEUED" } });

        return res.status(202).json({
            success: true,
            message: `Reel ${taskType} production started in background!`,
            jobId: job.id,
            status: "QUEUED"
        });
    } catch (error: any) {
        console.error(`❌ Producer Error [${taskType}]:`, error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const startFullProduction = async (req: Request, res: Response) => {
    return dispatchJob(res, req.body, 'FULL');
};

export const startAssetProduction = async (req: Request, res: Response) => {
    return dispatchJob(res, req.body, 'ASSETS');
};

export const startVideoProduction = async (req: Request, res: Response) => {
    return dispatchJob(res, req.body, 'VIDEO');
};

export const startCompositionProduction = async (req: Request, res: Response) => {
    return dispatchJob(res, req.body, 'COMPOSITION');
};