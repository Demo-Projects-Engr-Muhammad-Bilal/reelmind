// Role: Final composition engine — merges scene clips, applies transitions, and mixes BGM.

// CHANGE 1: Replaced path.resolve(`temp/${reelId}`) with import.meta.url-based absolute path.
//           CWD-relative resolution fails on Render/Railway/Fly.io.
// CHANGE 2: BGM fallback path now also uses import.meta.url resolution.
//           The old path.resolve("assets/bgm/dark-luxury.mp3") was relative to CWD and would
//           return ENOENT on cloud platforms. Now correctly resolves from project root.

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { StorageService } from '../../../services/storage.service.js';
import { getDuration } from "./helpers.js";

const execAsync = promisify(exec);
const storage = new StorageService();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 4 levels: core/ -> composer/ -> managers/ -> src/ -> project root
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..', '..');
const BASE_TEMP = path.join(PROJECT_ROOT, 'temp');

// CHANGE: BGM fallback path derived from project root — not from process.cwd().
const BGM_FALLBACK_PATH = path.join(PROJECT_ROOT, 'assets', 'bgm', 'dark-luxury.mp3').replace(/\\/g, '/');

/**
 * 🔗 Merge Composition Engine with Dynamic BGM Downloader
 */
export const mergeComposition = async (
          reelId: string,
          transDuration: number,
          bgmUrls: string[],
          bgmVolume: number,
          selectedBgmIndex?: number
): Promise<string> => {
          console.log("🔗 [Composer] Phase 3: Merging Final Composition with Dynamic BGM...");

          // CHANGE: Uses BASE_TEMP constant instead of path.resolve() with relative string.
          const reelDir = path.join(BASE_TEMP, reelId);
          const folders = fs.readdirSync(reelDir).filter(f => f.startsWith('scene_')).sort();

          // 🎵 STEP 1: RESOLVE BGM FILE CONTEXT
          let chosenBgmUrl = "";

          if (selectedBgmIndex !== undefined && selectedBgmIndex >= 0 && selectedBgmIndex < bgmUrls.length) {
                    chosenBgmUrl = bgmUrls[selectedBgmIndex];
                    console.log(`🎯 [Composer] User targeted index [${selectedBgmIndex}]: ${chosenBgmUrl}`);
          } else if (bgmUrls.length > 0) {
                    const randomIndex = Math.floor(Math.random() * bgmUrls.length);
                    chosenBgmUrl = bgmUrls[randomIndex];
                    console.log(`🎲 [Composer] Auto-Shuffled BGM index [${randomIndex}]: ${chosenBgmUrl}`);
          }

          let bgmIn = "";
          if (chosenBgmUrl) {
                    const localBgmPath = path.join(reelDir, "downloaded_bgm.mp4");
                    console.log("⏳ [Composer] Downloading remote BGM asset from cloud workspace...");
                    await storage.downloadToLocal(chosenBgmUrl, localBgmPath);
                    bgmIn = localBgmPath.replace(/\\/g, '/');
                    console.log("✅ [Composer] Audio track cached locally at workfolder.");
          } else {
                    // CHANGE: Uses BGM_FALLBACK_PATH (absolute, import.meta.url-based) instead of
                    // the old path.resolve("assets/bgm/dark-luxury.mp3") which was CWD-relative.
                    console.warn("⚠️ [Composer] No URLs provided in Niche array, using global fallback.");
                    bgmIn = BGM_FALLBACK_PATH;
          }

          // 🎬 STEP 2: SCENE SEAMLESS TRANSITIONS
          let currentMaster = path.join(reelDir, folders[0], "scene_final.mp4").replace(/\\/g, '/');

          for (let i = 1; i < folders.length; i++) {
                    const nextClip = path.join(reelDir, folders[i], "scene_final.mp4").replace(/\\/g, '/');
                    const outputName = path.join(reelDir, `step_merge_${i}.mp4`);
                    const dur = await getDuration(currentMaster);
                    const offset = dur - transDuration;

                    const mergeCmd = `ffmpeg -i "${currentMaster}" -i "${nextClip}" -y -filter_complex "[0:v]settb=AVTB,setpts=PTS-STARTPTS[v0]; [1:v]settb=AVTB,setpts=PTS-STARTPTS[v1]; [v0][v1]xfade=transition=fade:duration=${transDuration}:offset=${offset},format=yuv420p[v]; [0:a][1:a]acrossfade=d=0.2[a]" -map "[v]" -map "[a]" -c:v libx264 -preset fast -r 24 -fps_mode cfr "${outputName}"`;

                    await execAsync(mergeCmd);
                    currentMaster = outputName;
          }

          // 🎚️ STEP 3: AUDIO MASTERING & MIXDOWN
          const localFinalMaster = path.join(reelDir, "FINAL_REEL_MASTER.mp4");

          const masteringCmd = `ffmpeg -i "${currentMaster}" -i "${bgmIn}" -filter_complex "[1:a]volume=${bgmVolume}[music]; [0:a][music]amix=inputs=2:duration=first[aout]" -map 0:v -map "[aout]" -c:v libx264 -y "${localFinalMaster}"`;

          console.log(`🎚️ [Composer] Executing audio mastering with gain adjustment at ${bgmVolume}`);
          await execAsync(masteringCmd);

          return await storage.uploadFile(localFinalMaster, `reels/${reelId}/final`);
};
