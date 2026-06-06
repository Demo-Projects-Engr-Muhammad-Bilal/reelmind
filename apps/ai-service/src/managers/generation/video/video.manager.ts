// Imported In: src/workers/generation.worker.ts

// CHANGE: Replaced path.resolve(`temp/...`) with import.meta.url-based absolute path resolution.
// CWD-relative path.resolve() breaks on cloud deployments where Node.js is not launched
// from the project root. Now uses a BASE_TEMP constant derived from this file's location.

import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { VeoVideoProvider } from '../../../providers/video/veo.video.js';
import { VideoProviderInput, VideoProviderOutput } from '../../../interfaces/video.interface.js';
import { StorageService } from '../../../services/storage.service.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const ffprobe = promisify(ffmpeg.ffprobe);
const storage = new StorageService();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 3 levels: video/ -> generation/ -> managers/ -> src/ -> project root -> temp/
const BASE_TEMP = path.join(__dirname, '..', '..', '..', '..', 'temp');

/**
 * 🎬 VideoManager
 * Scene-level rendering orchestration.
 * AI Video (Veo) primary option, Ken Burns stable fallback.
 */
export class VideoManager {
          private aiProvider = new VeoVideoProvider();

          public async getAudioDuration(audioPath: string): Promise<number> {
                    try {
                              const metadata = await ffprobe(audioPath) as any;
                              return metadata.format.duration || 5;
                    } catch (err) {
                              console.error("[VideoManager] FFprobe duration error, defaulting to 5s.");
                              return 5;
                    }
          }

          async generateSceneVideo(type: 'ken-burns' | 'ai', input: any): Promise<any> {
                    // CHANGE: Uses BASE_TEMP constant (absolute) instead of path.resolve() (CWD-relative).
                    const sceneDir = path.join(BASE_TEMP, input.reelId, `scene_0${input.scene_number}`);
                    if (!fs.existsSync(sceneDir)) fs.mkdirSync(sceneDir, { recursive: true });

                    const localImgPath = path.join(sceneDir, "image.png");
                    const localAudioPath = path.join(sceneDir, "audio.mp3");

                    console.log(`📥 [VideoManager] Fetching assets for Scene ${input.scene_number}...`);
                    await storage.downloadToLocal(input.image_path, localImgPath);
                    await storage.downloadToLocal(input.voiceoverUrl, localAudioPath);

                    const actualAudioDuration = await this.getAudioDuration(localAudioPath);
                    const duration = type === 'ai' ? Math.min(actualAudioDuration, 8) : actualAudioDuration;

                    const videoInput = { ...input, image_path: localImgPath, duration_seconds: duration };
                    let result: VideoProviderOutput;

                    if (type === 'ai') {
                              try {
                                        console.log(`🎬 [VideoManager] Requesting AI Synthesis (Veo) for Scene ${input.scene_number}...`);
                                        result = await this.aiProvider.generate(videoInput);
                              } catch (err: any) {
                                        console.warn(`⚠️ [VideoManager] AI failed for Scene ${input.scene_number}: ${err.message}`);
                                        console.log(`🔄 [VideoManager] Switching to Ken Burns Fallback for Scene ${input.scene_number}...`);
                                        videoInput.duration_seconds = actualAudioDuration;
                                        result = await this.renderKenBurns(videoInput, localAudioPath);
                              }
                    } else {
                              result = await this.renderKenBurns(videoInput, localAudioPath);
                    }

                    console.log(`⬆️ [VideoManager] Uploading rendered Scene ${input.scene_number} to Cloud...`);
                    const cloudUrl = await storage.uploadFile(result.video_path, `reels/${input.reelId}/videos`);

                    return { video_path: cloudUrl, scene_number: input.scene_number };
          }

          private async renderKenBurns(input: VideoProviderInput, audioPath: string): Promise<VideoProviderOutput> {
                    const outputPath = input.image_path.replace('image.png', 'scene_video_ai.mp4');
                    const renderDuration = 8;
                    const totalFrames = Math.ceil(renderDuration * 25);

                    return new Promise((resolve, reject) => {
                              const filterChain = [
                                        `scale=1280:2272,setsar=1`,
                                        `zoompan=z='min(zoom+0.001,1.3)':d=${totalFrames}:s=1280x2272:fps=25`,
                                        `crop=1080:1920:'(in_w-out_w)/2+sin(n/10)*25':'(in_h-out_h)/2+cos(n/10)*25'`,
                                        `vignette=angle=0.3`
                              ].join(',');

                              ffmpeg(input.image_path)
                                        .inputOptions(['-loop 1', `-t ${renderDuration}`])
                                        .input(audioPath)
                                        .complexFilter(filterChain)
                                        .videoCodec('libx264')
                                        .audioCodec('aac')
                                        .outputOptions(['-pix_fmt yuv420p', '-r 25', '-shortest'])
                                        .on('error', (err) => {
                                                  console.error('❌ FFmpeg Ken Burns Error:', err.message);
                                                  reject(err);
                                        })
                                        .on('end', () => resolve({
                                                  scene_number: input.scene_number,
                                                  video_path: outputPath,
                                                  duration_seconds: renderDuration,
                                                  provider: 'ken-burns'
                                        }))
                                        .save(outputPath);
                    });
          }
}
