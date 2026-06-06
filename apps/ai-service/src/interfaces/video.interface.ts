import { IBaseProvider } from "./base.interface.js";

/**
 * 🎥 Video Provider Types
 */
export interface VideoProviderInput {
          prompt: string;
          nicheVideoInstruction?: string;
          image_path: string;
          duration_seconds: number;
          scene_number: number;
          aspect_ratio?: string;
}

export interface VideoProviderOutput {
          scene_number: number;
          video_path: string;
          duration_seconds: number;
          provider: string;
}

export interface IVideoProvider extends IBaseProvider {
          generate(input: VideoProviderInput): Promise<VideoProviderOutput>;
}