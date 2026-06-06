/**
 * 👑 ComposerManager (The Orchestrator)
 * Path: src/managers/composer/composer.manager.ts
 */

import { normalizeAllAudios } from "./core/normalization.js";
import { burnAllCaptions } from "./core/captions.js";
import { mergeComposition } from "./core/merging.js";
import { cleanGlobalTemp } from "./core/cleanup.js";

export class ComposerManager {
          private transDuration = 0.5;
          private safetyGap = 0.1;

          async normalizeAllAudios(reelId: string, scenes: any[]) {
                    await normalizeAllAudios(reelId, scenes, this.transDuration, this.safetyGap);
          }

          async burnAllCaptions(reelId: string, scenes: any[]) {
                    await burnAllCaptions(reelId, scenes);
          }

          /**
           * 🔗 Phase 3: Merge Composition
           * Accepts dynamic BGM list and volume instructions.
           */
          async mergeComposition(
                    reelId: string,
                    bgmUrls: string[],
                    bgmVolume: number,
                    selectedBgmIndex?: number
          ): Promise<string> {
                    return await mergeComposition(reelId, this.transDuration, bgmUrls, bgmVolume, selectedBgmIndex);
          }

          async cleanGlobalTemp(reelId: string) {
                    await cleanGlobalTemp(reelId);
          }
}