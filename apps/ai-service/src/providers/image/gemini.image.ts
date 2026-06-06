import { GoogleGenAI } from '@google/genai';
import { BaseImageProvider } from './base.image.js';
import { GenInput } from "../../interfaces/common.interface.js";
import { IImageProvider, ImageProviderOutput } from "../../interfaces/image.interface.js";
import { Buffer } from "node:buffer";

export class GeminiFlashImageProvider extends BaseImageProvider implements IImageProvider {
          name = 'gemini-2.5-flash-image';

          async generate(input: GenInput): Promise<ImageProviderOutput> {
                    const vertexAI = new GoogleGenAI({
                              vertexai: true, project: process.env.GCLOUD_PROJECT_ID, location: 'us-central1'
                    });

                    const response = await vertexAI.models.generateContent({
                              model: 'gemini-2.0-flash-image', // 💡 Fixed to latest stable exp or flash
                              contents: [{ role: 'user', parts: [{ text: this.buildFullPrompt(input) }] }],
                              config: {
                                        responseModalities: ['IMAGE'],
                                        safetySettings: [{ category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' }]
                              } as any
                    });

                    const candidate = response.candidates?.[0];
                    const data = candidate?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;

                    if (!data) {
                              // 🚨 Is error message ki wajah se manager retry karega
                              throw new Error(`[GeminiImage] Refusal: ${candidate?.finishReason || 'UNKNOWN'}`);
                    }

                    const localPath = await this.processAndSave(Buffer.from(data, 'base64'), input);
                    return { path: localPath, provider: this.name };
          }
}