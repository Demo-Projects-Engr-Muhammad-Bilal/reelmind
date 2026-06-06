import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseLLMProvider } from "./base.llm.js";
import { ILLMProvider } from "../../interfaces/llm.interface.js";
import { PROMPT_FACTORY } from "../../prompts/reel-prompts.js";

export class GeminiLLMProvider extends BaseLLMProvider implements ILLMProvider {
          name = "gemini-2.5-flash"; 

          async generateHooks(topic: string, config: any, count: number = 3, isRetake: boolean = false) {
                    const prompt = PROMPT_FACTORY.HOOKS(config, topic, count, isRetake);
                    return await this.callAI(prompt, isRetake);
          }

          async generateFinalScripts(winnerHook: string, config: any, isRetake: boolean = false) {
                    const prompt = PROMPT_FACTORY.SCRIPT(config, winnerHook, isRetake);
                    return await this.callAI(prompt, isRetake);
          }

          // ⚡ NEW: Handles the single scene prompt
          async generateSingleSceneRetake(winnerHook: string, config: any, oldAudio: string, oldVisual: string) {
                    const prompt = PROMPT_FACTORY.RETAKE_SCENE(config, winnerHook, oldAudio, oldVisual);
                    return await this.callAI(prompt, true); // High temp forced
          }

          // ⚡ FIX: Added isRetake parameter to dynamically adjust creativity
          private async callAI(prompt: string, isRetake: boolean = false) {
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
                    const model = genAI.getGenerativeModel({
                              model: this.name,
                              generationConfig: { 
                                  responseMimeType: "application/json",
                                  temperature: isRetake ? 0.9 : 0.7 // High temperature for diverse retakes
                              }
                    });

                    const result = await model.generateContent(prompt);
                    return this.sanitizeJSON(result.response.text());
          }
}