/**
 * 🧪 AI Factory Unified Test Script
 * Responsibility: End-to-End testing specifically optimized for Dark Psychology Niche & Billing Metrics.
 * Path: src/test.ts
 */

import axios from 'axios';

// 💡 CONFIG: API Base URLs
const BASE_URL = "http://localhost:5001/api/v1";
const GEN_API = `${BASE_URL}/generate`;
const NICHE_API = `${BASE_URL}/niches`;

const TEST_DATA = {
          // 🧠 Chilling, high-retention dark psychology topic for premium testing
          topic: "Why toxic manipulators use the 'Silent Treatment' to break your mental strength",
          userId: "69efb8bb613ab55c3bf94d3a", // Dummy Student ID
          videoType: "ken-burns",            // Options: 'ai' (Veo) or 'ken-burns'

          // 🎵 BGM CONFIGURATION
          // 0: Paris-Else, 1: Dark Fantasy, 2: Everything is dead, etc.
          // undefined: Auto-shuffle random selection
          selectedBgmIndex: 0
};

async function runDarkPsychologyTest() {
          console.log("🚀 STARTING DARK PSYCHOLOGY ENGINE PRODUCTION TEST (WITH BILLING)...");
          let reelId = "";

          try {
                    // --- PHASE 0: FETCH AND VERIFY DARK PSYCHOLOGY NICHE ---
                    console.log("\n📁 PHASE 0: Validating Niche Presence...");
                    const nicheRes = await axios.get(`${NICHE_API}/all`);
                    const niches = nicheRes.data;

                    // Target key jo humne seed script mein rakhi thi
                    const targetKey = "dark-psychology-secrets";
                    const nicheExists = niches.find((n: any) => n.key === targetKey);

                    if (!nicheExists) {
                              throw new Error(`CRITICAL: '${targetKey}' not found in DB. Please run your seed-niche script first!`);
                    }

                    console.log("✅ Target Niche Locked: " + nicheExists.name + " (" + targetKey + ")");

                    // --- PHASE 1: GENERATE HOOKS ---
                    console.log("\n🪝 PHASE 1: Generating Suspenseful Viral Hooks...");
                    const hooksRes = await axios.post(GEN_API + "/hooks", {
                              topic: TEST_DATA.topic,
                              nicheKey: targetKey,
                              userId: TEST_DATA.userId
                    });

                    reelId = hooksRes.data.reelId;
                    const winnerHook = hooksRes.data.hooksAnalysedWithScores[0].hook;
                    const mlScore = hooksRes.data.mlScore;

                    console.log("✅ Dark Reel Entry Created: " + reelId);
                    console.log("🏆 Selected Winning Hook (ML Score: " + mlScore + "): \"" + winnerHook + "\"");

                    // --- PHASE 2: GENERATE SCRIPT ---
                    console.log("\n📜 PHASE 2: Script Writing & Progressive Narrative Mapping...");
                    const scriptRes = await axios.post(GEN_API + "/script", {
                              reelId,
                              winnerHook,
                              nicheKey: targetKey
                    });

                    console.log("✅ Script Finalized! Sequential Scenes Rendered: " + scriptRes.data.scenes.length);

                    // --- PHASE 3: TRIGGER BACKGROUND WORKER ---
                    console.log("\n🏭 PHASE 3: Dispatching Production Task to BullMQ Factory...");
                    console.log("💡 Processing '" + TEST_DATA.videoType + "' visual rendering style...");
                    console.log("🎵 Selected BGM Mode: " + (TEST_DATA.selectedBgmIndex !== undefined ? "Force Track Index [" + TEST_DATA.selectedBgmIndex + "]" : "Auto-Shuffle Random"));

                    const productionRes = await axios.post(GEN_API + "/full-production", {
                              reelId,
                              nicheKey: targetKey,
                              videoType: TEST_DATA.videoType,
                              selectedBgmIndex: TEST_DATA.selectedBgmIndex,
                              userId: TEST_DATA.userId // 👈 CRITICAL FIX: Worker ab user account track karke pricing deduct karega
                    });

                    // --- 🏆 FINAL FEEDBACK LOGS ---
                    console.log("\n✨ DARK PSYCHOLOGY PIPELINE TEST TRIGGERED SUCCESSFULLY! ✨");
                    console.log("--------------------------------------------------");
                    console.log("📡 Queue Operational Status: " + productionRes.data.status);
                    console.log("🆔 BullMQ Assigned Job ID: " + productionRes.data.jobId);
                    console.log("--------------------------------------------------");
                    console.log("👀 HEAD OVER TO YOUR BACKEND SERVER TERMINAL!");
                    console.log("Watch the modular engine download the BGM, run layered retries, and master the output.");
                    console.log("\n📊 POST-PRODUCTION CHECKLIST FOR BILAL:");
                    console.log("1. Open Prisma Studio / MongoDB Compass.");
                    console.log("2. Check 'User' table -> Credits should be decremented.");
                    console.log("3. Check 'Reel' and 'Scene' tables -> 'totalCreditsSpent' and 'creditsSpent' metrics must be calculated.");
                    console.log("4. Check 'UsageLog' table -> Granular forensic receipts should be populated.");

          } catch (error: any) {
                    console.error("\n❌ TEST PIPELINE EXECUTION CRASHED!");
                    if (error.response) {
                              console.error("📍 Server Diagnostics:", JSON.stringify(error.response.data, null, 2));
                              console.error("📍 HTTP Status:", error.response.status);
                    } else {
                              console.error("📍 Transport Error:", error.message);
                    }
          }
}

// Fire the test runner
runDarkPsychologyTest();