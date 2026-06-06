import { Request, Response } from "express";
import { prisma } from "@aireelgen/database";

/**
 * 🔄 Toggle Public/Private Visibility
 * Path: src/controllers/reel/reel.controller.ts
 */
export const toggleReelVisibility:any = async (req: Request, res: Response) => {
    try {
        const id  = req.params.id as string;
        const { isPublic } = req.body;

        const updatedReel = await prisma.reel.update({
            where: { id },
            data: { isPublic }
        });

        return res.status(200).json({ success: true, isPublic: updatedReel.isPublic });
    } catch (error: any) {
        console.error("❌ Toggle Visibility Error:", error.message);
        return res.status(500).json({ error: "Failed to update visibility status." });
    }
};

/**
 * 📚 Get User Specific History
 */

export const getUserHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;
        const filter = req.query.filter as string; // 'completed' or 'queue'

        if (!userId) return res.status(400).json({ error: "User ID is required." });

        // ⚡ Status Filtering Logic
        let statusCondition = {};
        if (filter === 'completed') {
            statusCondition = { status: 'COMPLETED' };
        } else if (filter === 'queue') {
            statusCondition = { status: { not: 'COMPLETED' } }; // Har incomplete reel
        }

        const history = await prisma.reel.findMany({
            where: {
                userId,
                ...statusCondition
            },
            orderBy: { createdAt: 'desc' },
            include: { scenes: true }
        });

        return res.status(200).json({ success: true, data: history });
    } catch (error: any) {
        console.error("❌ Fetch History Error:", error.message);
        return res.status(500).json({ error: "Failed to fetch user history." });
    }
};

/**
 * 🌍 Get Public Community Gallery
 */
export const getPublicGallery = async (req: Request, res: Response) => {
    try {
        const gallery = await prisma.reel.findMany({
            where: {
                isPublic: true,
                status: 'COMPLETED'
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } }, // Author ka naam dikhane ke liye
                scenes: true
            }
        });

        return res.status(200).json({ success: true, data: gallery });
    } catch (error: any) {
        console.error("❌ Fetch Gallery Error:", error.message);
        return res.status(500).json({ error: "Failed to fetch public gallery." });
    }
};


export const cancelGeneration = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        // DB mein status update karna sab se zaroori hai
        // Is se active BullMQ worker automatically abort ho jayega
        const updatedReel = await prisma.reel.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });

        return res.status(200).json({ success: true, message: "Generation cancelled safely." });
    } catch (error: any) {
        console.error("❌ Cancel Generation Error:", error.message);
        return res.status(500).json({ error: "Failed to cancel generation." });
    }
};