import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
          console.log("⏳ Database mein Dark Psychology niche with specific Fallback URL sync ho rahi hai...");

          const bgmList = [
                    "https://res.cloudinary.com/dviouzm53/video/upload/v1778922838/Else_-_Paris_MP3_160K_c6xipf.mp3",
                    "https://res.cloudinary.com/dviouzm53/video/upload/v1778922837/deuslower-dark-fantasy-ambient-dungeon-synth-248213_1_nyhbia.mp3",
                    "https://res.cloudinary.com/dviouzm53/video/upload/v1778922834/everything_is_dead-dark-ambient-520015_byu7it.mp3",
                    "https://res.cloudinary.com/dviouzm53/video/upload/v1778922829/deuslower-atmosphere-dark-fantasy-dungeon-synth-248210_bpafci.mp3",
                    "https://res.cloudinary.com/dviouzm53/video/upload/v1778922828/universfield-dark-80s-sci-fi-atmosphere-516363_dizmam.mp3"
          ];

          const darkPsychologyData = {
                    key: "dark-psychology-secrets",
                    name: "Dark Psychology & Manipulation",
                    systemPrompt: "You are a master behavioral psychologist, criminologist, and an elite expert in dark psychology, Machiavellianism, and covert human manipulation. Your persona is inspired by the strategic depth of Robert Greene's '48 Laws of Power' and high-suspense cinematic thrillers. Your voice is mysterious, calm, deeply authoritative, and intensely gripping. You never use corporate fluff, standard AI transitions, or generic introductory phrases like 'Welcome back' or 'Have you ever wondered'. You speak directly to the dark curiosities of the human mind, exposing psychological traps and manipulation tactics with chilling accuracy.",
                    hooksInstruction: "Generate exactly 3 raw, un-ignorable viral hooks targeting deep human psychology. Every hook must exploit either the curiosity gap, anti-hero archetypes, or the innate fear of being deceived and controlled. The structure must be hyper-aggressive, designed to stop the user from scrolling in the first 1.5 seconds. Do not ask broad questions; instead, state shocking psychological facts or hidden warning signs as absolute truth. Example frame: 'The moment someone does [X], they have already mapped your weaknesses.' Keep the length under 15 words per hook.",
                    expansionInstruction: "Expand the selected winning hook into a highly structured scene-by-scene script optimized for maximum audience retention. Follow a strict progressive narrative loop: start with (The Trap) to demonstrate the subtle, real-world execution of the manipulation tactic; transition to (The Mechanism) to reveal the underlying psychological vulnerability that makes it work; escalate to (The Damage) explaining how the victim slowly loses control without realizing it; and conclude with (The Shield) delivering a punchy, genius counter-strategy to neutralize the tactic instantly. Pacing Rules: Use ultra-short, rhythmic sentences. No filler words, no preachy conclusions, and no repetitive phrasing. Every generated scene block must sequentially progress the story and explicitly separate 'visualPrompt' and 'audioText'.",
                    imageInstruction: "Cinematic hyper-realism, cinematic chiaroscuro lighting style with deep obsidian contrast shadows, low-key dramatic illumination. Dark academia aesthetic blended with moody cyberpunk undercurrents (deep crimson, charcoal, and electric amber highlights). Anamorphic lens flare, sharp focus on subtle micro-expressions, tensed jawlines, or ominous silhouettes behind frosted glass. Volumetric smoke and dust motes catching low rays of light. Raw texture, high fidelity, shot on 35mm lens, vertical 9:16 aspect ratio framing, ultra-premium visual depth.",
                    audioInstruction: "Optimized for premium AI voice synthesis. Grounded baritone vocal profile, chillingly calm, masculine whisper-adjacent tone with cinematic resonance. Deliver with calculated pacing at approximately 125-135 Words Per Minute (WPM). Ensure implicit pauses by maintaining crisp punctuation. The cadence must feel cold, calculating, and professional—forcing deep acoustic absorption and high suspense from the listener.",
                    videoInstruction: "Ultra-slow motion cinematic footage (minimum 60fps interpreted to 24fps), macro tracking shots with smooth pan and subtle camera drift. Ominous shifting shadows moving across stone walls or modern minimalist offices. Close-ups of micro-behavioral changes—shifting pupils, calculating glances, or subtle slow-motion smirks fading into darkness. Subtle Vertigo effect (dolly zoom), high suspense visual pacing, seamless cinematic continuity between cuts.",
                    bgmUrls: bgmList,
                    bgmVolume: 0.15,

                    // 🖼️ Naya specific fallback image link Cloudinary ka
                    fallbackUrl: "https://res.cloudinary.com/dviouzm53/image/upload/v1778926466/Gemini_Generated_Image_wznbbmwznbbmwznb_jyruwa.png"
          };

          // 🛡️ Upsert Engine
          await prisma.niche.upsert({
                    where: { key: darkPsychologyData.key },
                    update: darkPsychologyData,
                    create: darkPsychologyData,
          });

          console.log("✅ Database Synced Successfully! Dark Psychology niche with specific fallback image is live.");
}

main()
          .catch((e) => {
                    console.error("❌ Seeding failed!");
                    throw e;
          })
          .finally(async () => {
                    await prisma.$disconnect();
          });