// Imported In: ComposerManager (captions.ts)

// CHANGE: Replaced path.resolve(`temp/transcription_...`) with import.meta.url-based
// absolute path resolution. The old pattern was CWD-relative and broke on cloud platforms
// where Node.js is started from a different working directory than the project root.

import { SpeechClient } from '@google-cloud/speech';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StorageService } from './storage.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 1 level: services/ -> src/ -> project root -> temp/
const BASE_TEMP = path.join(__dirname, '..', '..', 'temp');

/**
 * 📝 TranscriptionService
 * Generates word-level timestamps using Google Cloud Speech-to-Text.
 */
export class TranscriptionService {
          private client: SpeechClient;
          private storage: StorageService;

          constructor() {
                    this.client = new SpeechClient();
                    this.storage = new StorageService();
          }

          async getWordTimestamps(audioInput: string): Promise<any[]> {
                    let audioPath = audioInput;
                    let isTempFile = false;

                    try {
                              if (audioInput.startsWith('http')) {
                                        // CHANGE: Uses BASE_TEMP constant (absolute) instead of
                                        // path.resolve(`temp/transcription_${Date.now()}.mp3`) which was CWD-relative.
                                        const tempPath = path.join(BASE_TEMP, `transcription_${Date.now()}.mp3`);
                                        audioPath = await this.storage.downloadToLocal(audioInput, tempPath);
                                        isTempFile = true;
                              }

                              const file = fs.readFileSync(audioPath);
                              const audioBytes = file.toString('base64');

                              const request = {
                                        audio: { content: audioBytes },
                                        config: {
                                                  encoding: 'MP3' as any,
                                                  sampleRateHertz: 16000,
                                                  languageCode: 'en-US',
                                                  enableWordTimeOffsets: true,
                                        },
                              };

                              const [response] = await this.client.recognize(request);

                              if (isTempFile && fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

                              const words: any[] = [];
                              response.results?.forEach(result => {
                                        result.alternatives?.[0].words?.forEach(word => {
                                                  words.push({
                                                            word: word.word,
                                                            start: this.parseGoogleTime(word.startTime),
                                                            end: this.parseGoogleTime(word.endTime),
                                                  });
                                        });
                              });

                              return words;
                    } catch (err: any) {
                              console.error("❌ Transcription Error:", err.message);
                              return [];
                    }
          }

          private parseGoogleTime(timeObj: any): number {
                    const seconds = parseFloat(timeObj?.seconds as string || "0");
                    const nanos = (timeObj?.nanos || 0) / 1000000000;
                    return seconds + nanos;
          }
}
