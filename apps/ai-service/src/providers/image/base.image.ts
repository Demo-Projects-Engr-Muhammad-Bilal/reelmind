// Imported In: gemini.image.ts, imagen.image.ts

// CHANGE: Replaced process.cwd()-based path with import.meta.url-based __dirname equivalent.
// On cloud platforms, process.cwd() is not guaranteed to point to the project root.
// Using import.meta.url gives us the actual file location, making temp/ resolution reliable
// regardless of where Node.js was launched from.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { GenInput } from "../../interfaces/common.interface.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CHANGE: Temp directory is now resolved relative to this file's location (src/providers/image/).
// Going up 3 levels: image/ -> providers/ -> src/ -> project root -> temp/
const BASE_TEMP = path.join(__dirname, '..', '..', '..', 'temp');

/**
 * 🏗️ BaseImageProvider
 * Shared utility for processing and saving AI-generated images.
 */
export abstract class BaseImageProvider {
          protected async processAndSave(imageBuffer: Buffer, input: GenInput): Promise<string> {
                    const sceneFolder = path.join(BASE_TEMP, input.reelId, input.sceneId);
                    if (!fs.existsSync(sceneFolder)) fs.mkdirSync(sceneFolder, { recursive: true });

                    const outputPath = path.join(sceneFolder, 'image.png');

                    await sharp(imageBuffer)
                              .resize(1080, 1920, { fit: 'cover', position: 'centre' })
                              .png()
                              .toFile(outputPath);

                    // CHANGE: Return absolute path instead of relative string.
                    // Downstream consumers (StorageService.uploadFile) receive a path they can
                    // actually open regardless of current working directory.
                    return outputPath;
          }

          protected buildFullPrompt(input: GenInput): string {
                    return `MASTER AESTHETIC: ${input.style}. SCENE: ${input.prompt}. ATMOSPHERE: ${input.characterDescription}. 
        TECHNICAL: 9:16 vertical, photorealistic, 8k. NEGATIVE: text, watermark, blurry.`.trim();
          }
}
