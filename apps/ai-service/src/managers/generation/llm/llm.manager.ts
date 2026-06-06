import { GeminiLLMProvider } from "../../../providers/llm/gemini.llm.js";

export class LLMManager {
          private provider = new GeminiLLMProvider();

          async generateHooks(topic: string, config: any, count: number, isRetake: boolean = false) {
                    return await this.provider.generateHooks(topic, config, count, isRetake);
          }

          async generateFinalScripts(winnerHook: string, config: any, isRetake: boolean = false) {
                    return await this.provider.generateFinalScripts(winnerHook, config, isRetake);
          }

          // ⚡ NEW: Exposes single scene regeneration to the controller
          async generateSingleSceneRetake(winnerHook: string, config: any, oldAudio: string, oldVisual: string) {
                    // Type-cast to any avoids strict interface checks temporarily
                    return await (this.provider as any).generateSingleSceneRetake(winnerHook, config, oldAudio, oldVisual);
          }
}