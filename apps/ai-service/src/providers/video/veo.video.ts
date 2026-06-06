// Imported In: src / managers / video.manager.ts

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import sharp from 'sharp';
import { BaseVideoProvider } from './base.video.js';
import { VideoProviderInput, VideoProviderOutput } from '../../interfaces/video.interface.js';

export const VEO_CINEMATIC_BOOSTERS = "high fidelity, 8k resolution, cinematic lighting, photorealistic, highly detailed textures, smooth camera motion, professional color grading, no text, no watermarks, masterpiece quality, 35mm film look";

export const VEO_NEGATIVE_PROMPT = "blurry, flickering, low resolution, cartoonish, distorted faces, text, captions, static image, jittery motion";

/**
 * 🎥 VeoVideoProvider
 * Multi-model fallback logic handle karta hai (3.1 -> 3.0 -> 2.0).
 * Extends BaseVideoProvider for path management.
 * * Imported In: src/managers/video.manager.ts
 */
export class VeoVideoProvider extends BaseVideoProvider {
          private client: GoogleGenAI;

          constructor() {
                    super();
                    this.client = new GoogleGenAI({
                              vertexai: true,
                              project: process.env.GCLOUD_PROJECT_ID || '',
                              location: 'us-central1'
                    });
          }

          async generate(input: VideoProviderInput): Promise<VideoProviderOutput> {
                    const duration = Math.min(input.duration_seconds, 8);

                    // 🖼️ Image Pre-processing (Compression for API stability)
                    const buffer = fs.readFileSync(input.image_path);
                    const compressed = await sharp(buffer).resize(768).jpeg().toBuffer();

                    // 🏗️ TRIPLE-LAYER PROMPT (Context + Scene + Aesthetic Boosters)
                    const finalPrompt = [
                              input.nicheVideoInstruction,
                              input.prompt,
                              VEO_CINEMATIC_BOOSTERS
                    ].filter(Boolean).join('. ');

                    // 🚀 Priority List: Latest to Stable
                    const models = ['veo-3.1-generate-preview', 'veo-3.0-generate-preview', 'veo-2.0-generate-001'];

                    for (const model of models) {
                              try {
                                        console.log(`🎬 [VeoProvider] Attempting with: ${model} | Scene: ${input.scene_number}`);

                                        const videoConfig: any = {
                                                  aspectRatio: '9:16',
                                                  durationSeconds: duration,
                                                  includeAudio: false,
                                                  enhancePrompt: true
                                        };

                                        let operation = await this.client.models.generateVideos({
                                                  model,
                                                  prompt: finalPrompt,
                                                  image: {
                                                            imageBytes: compressed.toString('base64'),
                                                            mimeType: 'image/jpeg'
                                                  },
                                                  config: videoConfig
                                        });

                                        // ⏳ Polling for completion
                                        while (!operation.done) {
                                                  await new Promise(r => setTimeout(r, 10000));
                                                  operation = await this.client.operations.get({ operation });
                                        }

                                        // 💾 Extracting Video Bytes
                                        const videos = (operation.response as any)?.generatedVideos || (operation.response as any)?.videos || [];
                                        const videoBytes = videos[0]?.video?.videoBytes || videos[0]?.videoBytes || videos[0]?.bytesBase64Encoded;

                                        if (!videoBytes) throw new Error("No video data in response.");

                                        // 📁 Base Class Path Helper
                                        const outputPath = this.getOutputVideoPath(input.image_path);
                                        fs.writeFileSync(outputPath, Buffer.from(videoBytes, 'base64'));

                                        return {
                                                  scene_number: input.scene_number,
                                                  video_path: outputPath,
                                                  duration_seconds: duration,
                                                  provider: model
                                        };

                              } catch (err: any) {
                                        console.warn(`⚠️ [VeoProvider] ${model} failed: ${err.message}. Trying next fallback...`);
                                        // Loop continues to next model...
                              }
                    }

                    // ❌ Global Failure
                    throw new Error("CRITICAL: All Veo AI Video models failed to process this scene.");
          }
}