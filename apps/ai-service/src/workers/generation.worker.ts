import 'dotenv/config';
import { prisma } from "@aireelgen/database";
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/bullmq.config.js';

import { ComposerManager } from '../managers/composer/composer.manager.js';
import { AudioManager } from '../managers/generation/audio/audio.manager.js';
import { ImageManager } from '../managers/generation/image/image.manager.js';
import { VideoManager } from '../managers/generation/video/video.manager.js';
import { BillingService } from '../services/billing.service.js';
import { getIO } from '../services/socket.service.js';
import { StorageService } from '../services/storage.service.js';

const imgManager = new ImageManager();
const audManager = new AudioManager();
const videoManager = new VideoManager();
const composerManager = new ComposerManager();
const billingService = new BillingService();
const storageService = new StorageService();

// ⚡ Security function: Check if user hit the Cancel button
const checkIfAborted = async (reelId: string) => {
    const reel = await prisma.reel.findUnique({ where: { id: reelId }, select: { status: true } });
    if (reel?.status === 'CANCELLED') {
        throw new Error("ABORTED_BY_USER");
    }
};

export const generationWorker = new Worker('reel-generation', async (job: Job) => {
    const { reelId, nicheKey, videoType, selectedBgmIndex, userId, taskType = 'FULL', sceneOrder } = job.data;
    console.log(`\n🚀 [JOB ${job.id}] STARTED | Type: ${taskType} | Reel: ${reelId} ${sceneOrder ? `| Scene: ${sceneOrder}` : ''}`);

    try {
        const nicheConfig = await prisma.niche.findUnique({ where: { key: nicheKey } });

        // 🎨 BLOCK 1: ASSETS
        if (taskType === 'FULL' || taskType === 'ASSETS') {
            console.log(`🎨 STAGE 1: Generating Assets & Processing Micro-Transactions...`);
            const scenes = await prisma.scene.findMany({ where: { reelId }, orderBy: { order: 'asc' } });

            for (const scene of scenes) {
                await checkIfAborted(reelId); // ⚡ Check DB Status

                if (sceneOrder && scene.order !== sceneOrder) continue;

                if (scene.voiceoverUrl) await storageService.deleteFromCloud(scene.voiceoverUrl);
                if (scene.imagePath) await storageService.deleteFromCloud(scene.imagePath);

                const sceneIdentifier = `scene_0${scene.order}`;
                const input = {
                    reelId, sceneId: sceneIdentifier, prompt: scene.visualPrompt,
                    audioText: scene.audioText, style: nicheConfig?.imageInstruction || "Cinematic",
                    characterDescription: nicheConfig?.systemPrompt
                };

                const audioResult = await audManager.synthesize(input);
                await billingService.chargeUser(userId, reelId, 'AUDIO', 'google-tts', scene.audioText.length, sceneIdentifier);

                const actualDuration = await videoManager.getAudioDuration(audioResult.url);
                await billingService.chargeUser(userId, reelId, 'UTILITY', 'timestamp-extractor', 1, sceneIdentifier);

                const imgResult = await imgManager.generate(input);
                await billingService.chargeUser(userId, reelId, 'IMAGE', imgResult.provider, 1, sceneIdentifier);

                await prisma.scene.update({
                    where: { id: scene.id },
                    data: { voiceoverUrl: audioResult.url, imagePath: imgResult.url, audioDuration: actualDuration }
                });

                try {
                    const updatedAssetScenes = await prisma.scene.findMany({ where: { reelId }, orderBy: { order: 'asc' } });
                    getIO().to(reelId).emit("step_update", { step: "assets", status: "processing", data: updatedAssetScenes });
                } catch (e) { }
            }

            await checkIfAborted(reelId); // ⚡ Check DB Status
            try {
                const updatedAssetScenes = await prisma.scene.findMany({ where: { reelId }, orderBy: { order: 'asc' } });
                getIO().to(reelId).emit("step_update", { step: "assets", status: "completed", data: updatedAssetScenes });
            } catch (e) { }
        }

        // 🎬 BLOCK 2: VIDEO RENDERING
        if (taskType === 'FULL' || taskType === 'VIDEO') {
            console.log("\n🎬 STAGE 2: Rendering Clips & Processing Video Deductions...");
            const assetReadyScenes = await prisma.scene.findMany({ where: { reelId }, orderBy: { order: 'asc' } });

            for (const scene of assetReadyScenes) {
                await checkIfAborted(reelId); // ⚡ Check DB Status

                if (sceneOrder && scene.order !== sceneOrder) continue;

                if (scene.videoPath) await storageService.deleteFromCloud(scene.videoPath);

                const sceneIdentifier = `scene_0${scene.order}`;
                const videoResult = await videoManager.generateSceneVideo(videoType, {
                    reelId, scene_number: scene.order, image_path: scene.imagePath,
                    voiceoverUrl: scene.voiceoverUrl, duration_seconds: scene.audioDuration || 8
                });

                await billingService.chargeUser(userId, reelId, 'VIDEO', videoType, 1, sceneIdentifier);

                await prisma.scene.update({
                    where: { id: scene.id }, data: { videoPath: videoResult.video_path }
                });

                try {
                    const updatedVideoScenes = await prisma.scene.findMany({ where: { reelId }, orderBy: { order: 'asc' } });
                    getIO().to(reelId).emit("step_update", { step: "video", status: "processing", data: updatedVideoScenes });
                } catch (e) { }
            }

            await checkIfAborted(reelId); // ⚡ Check DB Status
            try {
                const updatedVideoScenes = await prisma.scene.findMany({ where: { reelId }, orderBy: { order: 'asc' } });
                getIO().to(reelId).emit("step_update", { step: "video", status: "completed", data: updatedVideoScenes });
            } catch (e) { }
        }

        // 🏆 BLOCK 3: MASTERING
        if (taskType === 'FULL' || taskType === 'COMPOSITION') {
            console.log("\n🏆 STAGE 3: Final Composition & Audio Mastering...");
            await checkIfAborted(reelId); // ⚡ Check DB Status

            const reelDoc = await prisma.reel.findUnique({ where: { id: reelId } });
            if (reelDoc?.videoUrl) await storageService.deleteFromCloud(reelDoc.videoUrl);

            const finalScenes = await prisma.scene.findMany({ where: { reelId }, orderBy: { order: 'asc' } });

            await composerManager.normalizeAllAudios(reelId, finalScenes);
            await checkIfAborted(reelId); // ⚡ Check DB Status

            await composerManager.burnAllCaptions(reelId, finalScenes);
            await checkIfAborted(reelId); // ⚡ Check DB Status

            const finalCloudUrl = await composerManager.mergeComposition(
                reelId, nicheConfig?.bgmUrls || [], nicheConfig?.bgmVolume ?? 0.2, selectedBgmIndex
            );

            await prisma.reel.update({ where: { id: reelId }, data: { status: "COMPLETED", videoUrl: finalCloudUrl } });
            await composerManager.cleanGlobalTemp(reelId);

            try {
                getIO().to(reelId).emit("step_update", { step: "composition", status: "completed", data: { finalVideoUrl: finalCloudUrl } });
            } catch (e) { }

            console.log(`\n✅ Reel ${reelId} is LIVE!\n`);
        }

    } catch (error: any) {
        // ⚡ If intentionally aborted by user, don't mark as FAILED
        if (error.message === "ABORTED_BY_USER") {
            console.log(`\n🛑 [JOB ${job.id}] CANCELLED BY USER. Processing stopped.`);
            throw error;
        }

        console.error(`\n❌ [JOB ${job.id}] FAILED: ${error.message}`);
        await prisma.reel.update({ where: { id: reelId }, data: { status: "FAILED" } });
        throw error;
    }
}, { connection: redisConnection as any });

console.log("🏭 BullMQ Generation Worker is active.");