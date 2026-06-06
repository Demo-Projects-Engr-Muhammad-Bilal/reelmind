/**
 * 🧩 Common Inputs
 * Used across Image and Audio synthesis phases.
 */
export interface GenInput {
          reelId: string;
          sceneId: string;
          prompt: string;
          audioText: string;
          style?: string;           // Image instruction from Niche
          audioStyle?: string;      // Audio instruction from Niche
          characterDescription?: string;
}