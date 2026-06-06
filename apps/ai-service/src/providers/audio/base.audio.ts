// Imported In: elevenlabs.audio.ts, google.audio.ts

// CHANGE: Replaced path.resolve(`temp/...`) with import.meta.url-based absolute path resolution.
// path.resolve() with a relative string resolves from process.cwd() which is unreliable
// on cloud platforms. Using import.meta.url ensures the temp/ directory is always resolved
// relative to the actual project structure, not the launch directory.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 3 levels: audio/ -> providers/ -> src/ -> project root -> temp/
const BASE_TEMP = path.join(__dirname, '..', '..', '..', 'temp');

export abstract class BaseAudioProvider {
          protected ensureDirectory(reelId: string, sceneId: string): string {
                    // CHANGE: Uses BASE_TEMP constant (absolute) instead of path.resolve(`temp/...`) (relative).
                    const sceneFolder = path.join(BASE_TEMP, reelId, sceneId);
                    if (!fs.existsSync(sceneFolder)) fs.mkdirSync(sceneFolder, { recursive: true });
                    return sceneFolder;
          }

          protected getOutputPath(sceneFolder: string): string {
                    return path.join(sceneFolder, "audio.mp3");
          }
}
