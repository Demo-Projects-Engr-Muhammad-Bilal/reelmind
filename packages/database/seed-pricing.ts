/**
 * 🌱 AI Factory Pricing Matrix Seeder (4x Strategic Markup Edition)
 * Responsibility: Syncing premium calibrated AI provider rates into MongoDB.
 * Path: src/seed-pricing.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
          console.log("⏳ Database mein 4x Markup (Cloudinary-inclusive) Pricing Matrix sync ho rahi hai...");

          const pricingRates = [
                    // 🎙️ AUDIO STAGE PROVIDERS
                    // Google TTS: Neural voice character multiplier (1 char = 0.1 credits)
                    { stage: "AUDIO", provider: "google-tts", rate: 0.1 },
                    // ElevenLabs: Ultra premium hyper-realistic voiceover characters (1 char = 0.5 credits)
                    { stage: "AUDIO", provider: "eleven-labs", rate: 0.5 },

                    // 🎨 IMAGE STAGE PROVIDERS
                    // Flat credit values deducted per successful scene asset delivery
                    { stage: "IMAGE", provider: "gemini-2.5-flash-image", rate: 5.0 },
                    { stage: "IMAGE", provider: "imagen-3", rate: 15.0 },
                    { stage: "IMAGE", provider: "static-fallback-cached", rate: 0.0 },     // Free cache leverage
                    { stage: "IMAGE", provider: "static-fallback-downloaded", rate: 0.0 },   // Free fallback download

                    // 🎬 VIDEO STAGE PROVIDERS
                    // Video rates mapped directly against scene configuration types
                    { stage: "VIDEO", provider: "veo", rate: 50.0 },       // Premium Multi-Model Gen Video Clip
                    { stage: "VIDEO", provider: "ken-burns", rate: 5.0 },  // Standard local viewport motion rendering

                    // 🔍 UTILITY PROVIDERS
                    // Word offset timeline extraction and speech tracking logs
                    { stage: "UTILITY", provider: "timestamp-extractor", rate: 2.0 }
          ];

          for (const rate of pricingRates) {
                    await prisma.pricingRate.upsert({
                              where: { provider: rate.provider },
                              update: {
                                        stage: rate.stage,
                                        rate: rate.rate
                              },
                              create: rate,
                    });
          }

          console.log("✅ 4x Profit Strategy Pricing Matrix successfully synced to MongoDB!");
}

main()
          .catch((e) => {
                    console.error("❌ Pricing seeding failed:", e);
                    throw e;
          })
          .finally(async () => {
                    await prisma.$disconnect();
          });