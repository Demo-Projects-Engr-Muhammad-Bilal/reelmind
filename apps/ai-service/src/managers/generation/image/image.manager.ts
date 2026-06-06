// Imported In: src/workers/generation.worker.ts

// CHANGE: Replaced path.resolve(`temp/...`) and path.resolve("assets/images/...") with
// import.meta.url-based absolute paths. CWD-relative resolve() breaks on cloud platforms.
// Also fixed the return value from providers — base.image.ts now returns an absolute path,
// so the old relative-path assumption in StorageService.uploadFile() is no longer a concern.

import { prisma } from "@aireelgen/database";
import { GenInput } from "../../../interfaces/common.interface.js";
import { StorageService } from "../../../services/storage.service.js";
import { GeminiFlashImageProvider } from "../../../providers/image/gemini.image.js";
import { Imagen3Provider } from "../../../providers/image/imagen.image.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const storage = new StorageService();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 3 levels: image/ -> generation/ -> managers/ -> src/ -> project root
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..', '..');
const BASE_TEMP = path.join(PROJECT_ROOT, 'temp');

// CHANGE: Global fallback image path derived from project root — not from CWD.
const GLOBAL_FALLBACK_IMAGE = path.join(PROJECT_ROOT, 'assets', 'images', 'fallback.png');

export class ImageManager {
          private providers = [
                    new GeminiFlashImageProvider(),
                    new Imagen3Provider()
          ];

          async generate(input: GenInput) {
                    const MAX_RETRIES = 3;

                    for (const provider of this.providers) {
                              for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                                        try {
                                                  console.log(`[ImageManager] ${provider.name} | Attempt ${attempt}/${MAX_RETRIES}...`);

                                                  const result = await provider.generate(input);

                                                  // result.path is now an absolute path (fixed in base.image.ts)
                                                  const cloudUrl = await storage.uploadFile(
                                                            result.path,
                                                            `reels/${input.reelId}/images`
                                                  );

                                                  return { url: cloudUrl, provider: provider.name };

                                        } catch (err: any) {
                                                  const isQuotaError = err.message.includes("429") || err.message.includes("Quota");
                                                  console.warn(`⚠️ [ImageManager] ${provider.name} failed: ${err.message}`);

                                                  if (attempt < MAX_RETRIES) {
                                                            const waitTime = isQuotaError ? 15000 : 5000;
                                                            console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
                                                            await sleep(waitTime);
                                                  }
                                        }
                              }
                              console.log(`❌ Provider ${provider.name} exhausted all ${MAX_RETRIES} attempts.`);
                    }

                    return await this.handleStaticFallback(input);
          }

          private async handleStaticFallback(input: GenInput) {
                    console.log(`🚨 [ImageManager] AI Providers Exhausted. Initiating Fallback System for Reel: ${input.reelId}`);

                    const reel = await prisma.reel.findUnique({ where: { id: input.reelId } });
                    if (!reel) {
                              throw new Error(`CRITICAL: Reel record not found for ID ${input.reelId}`);
                    }

                    if (reel.localFallbackPath && fs.existsSync(reel.localFallbackPath)) {
                              console.log(`🎯 [ImageManager] Cache Hit! Using already downloaded fallback asset: ${reel.localFallbackPath}`);
                              const cloudUrl = await storage.uploadFile(reel.localFallbackPath, `reels/${input.reelId}/images`, false);
                              return { url: cloudUrl, provider: "static-fallback-cached" };
                    }

                    console.log(`📥 [ImageManager] Cache Miss. Fetching niche configurations for key: ${reel.style}`);
                    const nicheConfig = await prisma.niche.findUnique({ where: { key: reel.style } });

                    // CHANGE: Uses BASE_TEMP constant (absolute) instead of path.resolve() (CWD-relative).
                    const localFallbackDir = path.join(BASE_TEMP, input.reelId);
                    if (!fs.existsSync(localFallbackDir)) {
                              fs.mkdirSync(localFallbackDir, { recursive: true });
                    }

                    const targetLocalPath = path.join(localFallbackDir, `fallback_cache_${reel.style}.png`);

                    if (nicheConfig?.fallbackUrl) {
                              console.log(`⏳ [ImageManager] Downloading niche-specific fallback from Cloudinary: ${nicheConfig.fallbackUrl}`);
                              await storage.downloadToLocal(nicheConfig.fallbackUrl, targetLocalPath);
                    } else {
                              console.log("⚠️ [ImageManager] No fallbackUrl found in Niche model. Falling back to global default asset.");

                              // CHANGE: Uses GLOBAL_FALLBACK_IMAGE constant (absolute) instead of
                              // path.resolve("assets/images/fallback.png") which was CWD-relative.
                              if (!fs.existsSync(GLOBAL_FALLBACK_IMAGE)) {
                                        throw new Error("CRITICAL: Global default fallback asset missing at assets/images/fallback.png");
                              }
                              fs.copyFileSync(GLOBAL_FALLBACK_IMAGE, targetLocalPath);
                    }

                    await prisma.reel.update({
                              where: { id: input.reelId },
                              data: { localFallbackPath: targetLocalPath }
                    });
                    console.log(`💾 [ImageManager] Local path cached in database: ${targetLocalPath}`);

                    const cloudUrl = await storage.uploadFile(targetLocalPath, `reels/${input.reelId}/images`, false);
                    return { url: cloudUrl, provider: "static-fallback-downloaded" };
          }
}
