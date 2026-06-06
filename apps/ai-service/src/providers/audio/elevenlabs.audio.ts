// Imported In: src/managers/generation/audio/audio.manager.ts

// CHANGE: Updated return path to use absolute path from ensureDirectory() instead of
// a hardcoded relative string ("temp/reelId/sceneId/audio.mp3").
// The old relative return value caused StorageService.uploadFile() to fail with
// ENOENT errors on cloud platforms where CWD differs from project root.

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Readable } from "stream";
import fs from "fs";
import { BaseAudioProvider } from './base.audio.js';
import { GenInput } from "../../interfaces/common.interface.js";
import { IAudioProvider, AudioProviderOutput } from "../../interfaces/audio.interface.js";

/**
 * 🛠️ ElevenLabsProvider
 * Extends BaseAudioProvider for directory and path management.
 */
export class ElevenLabsProvider extends BaseAudioProvider implements IAudioProvider {
          name = 'eleven-labs';

          async synthesize(input: GenInput): Promise<AudioProviderOutput> {
                    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

                    const response = await client.textToSpeech.convert(process.env.VOICE_ID || "", {
                              text: input.audioText || input.prompt,
                              modelId: "eleven_multilingual_v2"
                    });

                    const sceneFolder = this.ensureDirectory(input.reelId, input.sceneId);
                    const outputPath = this.getOutputPath(sceneFolder);

                    const fileStream = fs.createWriteStream(outputPath);
                    const nodeReadable = Readable.fromWeb(response as any);
                    nodeReadable.pipe(fileStream);

                    return new Promise((resolve, reject) => {
                              fileStream.on('finish', () => resolve({
                                        // CHANGE: Return the absolute outputPath, not a hardcoded relative string.
                                        path: outputPath,
                                        provider: this.name
                              }));
                              fileStream.on('error', reject);
                    });
          }
}
