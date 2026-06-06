import { IBaseProvider } from "./base.interface.js";
import { GenInput } from "./common.interface.js";

/**
 * 🖼️ Image Provider Types
 */
export interface ImageProviderOutput {
          path: string;
          provider: string;
}

export interface IImageProvider extends IBaseProvider {
          generate(input: GenInput): Promise<ImageProviderOutput>;
}