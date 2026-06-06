import { IBaseProvider } from "./base.interface.js";

/**
 * 🤖 LLM Provider Interface
 */
export interface ILLMProvider extends IBaseProvider {
          generateHooks(topic: string, nicheConfig: any, count: number): Promise<string[]>;
          generateFinalScripts(winnerHook: string, nicheConfig: any): Promise<any>;
}