// Role: Burns word-level subtitles into each scene video using FFmpeg drawtext filter.

// CHANGE 1: Replaced path.resolve(`temp/${reelId}`) with import.meta.url-based absolute path.
//           CWD-relative resolve() breaks on cloud deployments.
// CHANGE 2: Font path now uses import.meta.url resolution pointing to assets/fonts/.
//           The old path.resolve("assets/fonts/...") was relative to CWD and would fail
//           if Node.js was not launched from the project root (common on Render/Railway).

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { getDuration } from "./helpers.js";
import { TranscriptionService } from "../../../services/transcription.service.js";

const execAsync = promisify(exec);
const transService = new TranscriptionService();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 4 levels: core/ -> composer/ -> managers/ -> src/ -> project root
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..', '..');
const BASE_TEMP = path.join(PROJECT_ROOT, 'temp');

// CHANGE: Font path derived from project root using import.meta.url, not process.cwd().
// This is safe regardless of which directory Node.js was started from.
const FONT_PATH = path.join(PROJECT_ROOT, 'assets', 'fonts', 'Anton-Regular.ttf')
          .replace(/\\/g, '/')
          .replace(/:/g, '\\:');

export const burnAllCaptions = async (reelId: string, scenes: any[]) => {
          console.log("🔥 [Composer] Phase 2: Burning Dynamic Captions...");

          // CHANGE: Uses BASE_TEMP constant instead of path.resolve() with relative string.
          const reelDir = path.join(BASE_TEMP, reelId);

          for (let i = 0; i < scenes.length; i++) {
                    const scene = scenes[i];
                    const scenePath = path.join(reelDir, `scene_0${scene.order}`).replace(/\\/g, '/');

                    const audioIn = path.join(scenePath, "audio_normalized.mp3").replace(/\\/g, '/');
                    const videoIn = path.join(scenePath, "scene_video_ai.mp4").replace(/\\/g, '/');
                    const videoOut = path.join(scenePath, "scene_final.mp4").replace(/\\/g, '/');

                    if (!fs.existsSync(audioIn) || !fs.existsSync(videoIn)) continue;

                    const words = await transService.getWordTimestamps(audioIn);
                    const delay = (i === 0) ? 0 : (i === scenes.length - 1) ? 0.6 : 0.3;

                    const captionFilters = words.map(w => {
                              const word = w.word.replace(/'/g, "").toUpperCase();
                              return `drawtext=text='${word}':fontfile='${FONT_PATH}':fontsize=70:fontcolor=white:borderw=2.5:bordercolor=black@0.6:shadowcolor=black@0.3:shadowx=3:shadowy=3:x=(w-text_w)/2:y=(h-text_h)/2+280:enable='between(t,${w.start + delay},${w.end + delay})'`;
                    }).join(",");

                    const renderCmd = `ffmpeg -i "${videoIn}" -i "${audioIn}" -y -filter_complex "[0:v]scale=720:1280,fps=24,setpts=PTS-STARTPTS,${captionFilters}[vburned]; [1:a]adelay=${delay * 1000}|${delay * 1000},aresample=async=1[aout]" -map "[vburned]" -map "[aout]" -c:v libx264 -preset superfast -pix_fmt yuv420p -r 24 -t ${await getDuration(videoIn)} "${videoOut}"`;

                    await execAsync(renderCmd);
          }
};
