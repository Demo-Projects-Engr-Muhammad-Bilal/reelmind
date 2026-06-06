import { GoogleGenAI } from '@google/genai';
import { BaseImageProvider } from './base.image.js';
import { GenInput } from "../../interfaces/common.interface.js";
import { IImageProvider, ImageProviderOutput } from "../../interfaces/image.interface.js";
import { Buffer } from "node:buffer"; // 👈 Fixed Import

export class Imagen3Provider extends BaseImageProvider implements IImageProvider {
          name = 'imagen-3';

          async generate(input: GenInput): Promise<ImageProviderOutput> {
                    try {
                              const vertexAI = new GoogleGenAI({
                                        vertexai: true,
                                        project: process.env.GCLOUD_PROJECT_ID,
                                        location: 'us-central1'
                              });

                              const response = await vertexAI.models.generateContent({
                                        model: 'imagen-3.0-fast-generate-001',
                                        contents: [{ role: 'user', parts: [{ text: this.buildFullPrompt(input) }] }],
                                        config: { responseModalities: ['IMAGE'] } as any
                              });

                              const candidate = response.candidates?.[0];
                              const data = candidate?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;

                              if (!data) {
                                        throw new Error(`[Imagen] Refusal: ${candidate?.finishReason || 'NO_DATA'}`);
                              }

                              // Fixed Buffer conversion
                              const path = await this.processAndSave(Buffer.from(data, 'base64'), input);
                              return { path, provider: this.name };

                    } catch (err: any) {
                              // 💡 Agar error message mein 429 hai toh manager isay catch karke wait karega
                              throw new Error(`[Imagen3] ${err.message}`);
                    }
          }
}