// Imported In: src/managers/generation/audio/audio.manager.ts

// CHANGE: Updated return path to use absolute outputPath instead of hardcoded relative string.
// Same fix as elevenlabs.audio.ts — the old "temp/reelId/sceneId/audio.mp3" string
// caused ENOENT errors on cloud platforms. Now returns the actual absolute path.

import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import { BaseAudioProvider } from './base.audio.js';
import { GenInput } from "../../interfaces/common.interface.js";
import { IAudioProvider, AudioProviderOutput } from "../../interfaces/audio.interface.js";

/**
 * 🎙️ GoogleTTSProvider
 * High-speed Neural TTS implementation.
 */
export class GoogleTTSProvider extends BaseAudioProvider implements IAudioProvider {
          name = 'google-tts';

          async synthesize(input: GenInput): Promise<AudioProviderOutput> {
                    const client = new textToSpeech.TextToSpeechClient();
                    const [response] = await client.synthesizeSpeech({
                              input: { text: input.audioText || input.prompt },
                              voice: { languageCode: "en-US", name: "en-US-Neural2-F" },
                              audioConfig: {
                                        audioEncoding: "MP3",
                                        pitch: input.audioStyle?.includes("deep") ? -4.0 : 0.0,
                                        speakingRate: input.audioStyle?.includes("slow") ? 0.85 : 1.0
                              },
                    });

                    const sceneFolder = this.ensureDirectory(input.reelId, input.sceneId);
                    const outputPath = this.getOutputPath(sceneFolder);

                    fs.writeFileSync(outputPath, response.audioContent as Uint8Array, "binary");

                    return {
                              // CHANGE: Return absolute outputPath, not hardcoded relative string.
                              path: outputPath,
                              provider: this.name
                    };
          }
}
