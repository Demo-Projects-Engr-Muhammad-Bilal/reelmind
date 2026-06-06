/**
 * 💸 AI Factory Pricing Matrix Configuration
 * Rate definitions: 1 Credit = 1 Unit of calculation (e.g., per character or per asset)
 * Path: src/config/pricing.config.ts
 */

export const PRICING_MATRIX = {
          AUDIO: {
                    'google-tts': 0.05,       // 0.05 credits per character of text
                    'elevenlabs': 0.5,        // Future proof: ElevenLabs costly hoga
          },
          IMAGE: {
                    'gemini-flash': 2,        // 2 credits per scene image
                    'imagen-3': 5,            // 5 credits for premium image
                    'static-fallback-cached': 0,    // Local cache use karne par ZERO cost
                    'static-fallback-downloaded': 0 // Cloudinary se fallback image download karne par bhi ZERO cost
          },
          VIDEO: {
                    'veo': 15,                // 15 credits per video clip prompt
                    'ken-burns': 1,           // 1 credit for local FFmpeg rendering motion
          },
          UTILITY: {
                    'timestamp-extractor': 0.5, // 0.5 credits per scene analysis
          }
};