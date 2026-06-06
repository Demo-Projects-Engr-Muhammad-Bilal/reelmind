import { IBaseProvider } from "./base.interface.js";
import { GenInput } from "./common.interface.js";

/**
 * 🎙️ Audio Provider Types
 */
export interface AudioProviderOutput {
          path: string;
          provider: string;
}

export interface IAudioProvider extends IBaseProvider {
          synthesize(input: GenInput): Promise<AudioProviderOutput>;
}