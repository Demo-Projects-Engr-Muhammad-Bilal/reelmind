// Imported In: src / controllers / generate / hooks.controller.js, src / controllers / generate / script.controller.js, src / workers / generation.worker.js.

import { GenInput } from "../../../interfaces/common.interface.js";
import { StorageService } from "../../../services/storage.service.js";
import { ElevenLabsProvider } from "../../../providers/audio/elevenlabs.audio.js";
import { GoogleTTSProvider } from "../../../providers/audio/google.audio.js";

const storage = new StorageService();
/**
 * 🎙️ AudioManager
 * Manages Voiceover Synthesis with Fallback (Google -> ElevenLabs) and Cloud Upload.
 */
export class AudioManager {
          private providers = [
                    new GoogleTTSProvider(),
                    new ElevenLabsProvider()
          ];

          async synthesize(input: GenInput) {
                    for (const provider of this.providers) {
                              try {
                                        console.log(`[AudioManager] Trying Provider: ${provider.name}`);
                                        const result = await provider.synthesize(input);

                                        // ⬆️ Step 2: Upload local asset to Cloudinary
                                        const cloudUrl = await storage.uploadFile(
                                                  result.path,
                                                  `reels/${input.reelId}/audios`
                                        );

                                        return { url: cloudUrl, provider: provider.name };
                              } catch (err: any) {
                                        console.warn(`⚠️ [AudioManager] ${provider.name} failed: ${err.message}`);
                              }
                    }
                    throw new Error("CRITICAL: All audio providers exhausted.");
          }
}