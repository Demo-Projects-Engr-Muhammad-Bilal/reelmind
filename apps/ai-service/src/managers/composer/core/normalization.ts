// Role: Normalizes audio tempo per scene so voiceover fits inside the video clip duration.

// CHANGE: Replaced CWD-relative path operations with the absolute paths provided by
// prepareLocalSceneAssets() from helpers.ts. No direct path.resolve() calls remain here.
// The scenePath returned by prepareLocalSceneAssets is already absolute, so path.join()
// on top of it is safe on all platforms.

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { StorageService } from '../../../services/storage.service.js';
import { prisma } from "@aireelgen/database";
import { getDuration, prepareLocalSceneAssets } from "./helpers.js";

const execAsync = promisify(exec);
const storage = new StorageService();

export const normalizeAllAudios = async (reelId: string, scenes: any[], transDuration: number, safetyGap: number) => {
          console.log("🎙️ [Composer] Phase 1: Normalizing Audio Tempos...");

          for (const scene of scenes) {
                    // prepareLocalSceneAssets already returns absolute paths — no path fix needed here.
                    const { videoLocal, audioLocal, scenePath } = await prepareLocalSceneAssets(reelId, scene);

                    // CHANGE: audioOut path built from the already-absolute scenePath.
                    const audioOut = path.join(scenePath, "audio_normalized.mp3");

                    const vDur = await getDuration(videoLocal);
                    const aDur = await getDuration(audioLocal);
                    const targetDur = vDur - transDuration - safetyGap;

                    const tempo = aDur > targetDur ? `atempo=${(aDur / targetDur).toFixed(2)}` : "anull";
                    await execAsync(`ffmpeg -i "${audioLocal}" -filter:a "${tempo}" -y "${audioOut}"`);

                    const normalizedUrl = await storage.uploadFile(audioOut, `reels/${reelId}/audios_final`, false);

                    await prisma.scene.update({
                              where: { id: scene.id },
                              data: { voiceoverUrl: normalizedUrl }
                    });

                    if (fs.existsSync(audioLocal)) fs.unlinkSync(audioLocal);
          }
};
