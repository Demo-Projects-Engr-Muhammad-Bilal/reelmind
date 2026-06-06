// Role: Shared FFmpeg utility functions used by normalization, captions, and merging.

// CHANGE: Replaced path.resolve(`temp/...`) with import.meta.url-based absolute resolution.
// path.resolve() with a relative string is CWD-dependent and breaks on cloud deployments.
// import.meta.url gives us the actual file location so temp/ is always correctly found.

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { StorageService } from '../../../services/storage.service.js';

const execAsync = promisify(exec);
const storage = new StorageService();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 4 levels: core/ -> composer/ -> managers/ -> src/ -> project root -> temp/
const BASE_TEMP = path.join(__dirname, '..', '..', '..', '..', 'temp');

export const getDuration = async (filePath: string): Promise<number> => {
          const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
          const { stdout } = await execAsync(cmd);
          return parseFloat(stdout.trim());
};

export const prepareLocalSceneAssets = async (reelId: string, scene: any) => {
          // CHANGE: Uses BASE_TEMP (absolute) instead of path.resolve(`temp/...`) (relative).
          const sceneDir = path.join(BASE_TEMP, reelId, `scene_0${scene.order}`);
          if (!fs.existsSync(sceneDir)) fs.mkdirSync(sceneDir, { recursive: true });

          const videoLocal = path.join(sceneDir, "scene_video_ai.mp4");
          const audioLocal = path.join(sceneDir, "audio.mp3");

          if (!fs.existsSync(videoLocal)) await storage.downloadToLocal(scene.videoPath, videoLocal);
          if (!fs.existsSync(audioLocal)) await storage.downloadToLocal(scene.voiceoverUrl, audioLocal);

          return { videoLocal, audioLocal, scenePath: sceneDir };
};
