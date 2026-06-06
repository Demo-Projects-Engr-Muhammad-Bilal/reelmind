import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const videoUrls = [
          "https://res.cloudinary.com/dviouzm53/video/upload/v1778931895/aireelgen/reels/6a0855777c0dc48d5b827ad5/final/nnieo8aleg6z8ommfpix.mp4",
          "https://res.cloudinary.com/dviouzm53/video/upload/v1778871845/aireelgen/reels/6a076b1574c1110956e8e8f0/final/tnxgc0ap1grq9qado5a0.mp4",
          "https://res.cloudinary.com/dviouzm53/video/upload/v1778841839/aireelgen/reels/6a06f6870f31886c1cc2d2b7/final/q3cklvjhijppyejb81ap.mp4",
          "https://res.cloudinary.com/dviouzm53/video/upload/v1778845873/aireelgen/reels/6a0704026b93282c3b54cca5/final/vtlmwjpgxiobvcz5txco.mp4",
          "https://res.cloudinary.com/dviouzm53/video/upload/v1778826409/aireelgen/reels/6a06b8ca9189d03fbf62bd31/final/u4nc6efhoywmmpclz4yk.mp4"
];

const dummyData = [
          { topic: "The Silent Rise of Quiet Luxury", style: "Wealth Niche" },
          { topic: "Why Stoicism is the Ultimate Power", style: "Motivation" },
          { topic: "Next-Gen Tech Gadgets of 2025", style: "Tech/Review" },
          { topic: "The Psychology of Human Behavior", style: "Education" },
          { topic: "How to Scale a Zero-Investment Agency", style: "Entrepreneurship" }
];

async function seedPublicReels() {
          console.log("⏳ Connecting to Database...");

          const user = await prisma.user.findFirst();

          if (!user) {
                    // ⚡ FIX: process.exit() ki jagah throw Error use kiya
                    throw new Error("❌ ERROR: No user found in the database. Ek user zaroor hona chahiye taake Reels us se link ho sakein.");
          }

          console.log(`✅ User found. Linking public reels to User ID: ${user.id}`);

          for (let i = 0; i < videoUrls.length; i++) {
                    const newReel = await prisma.reel.create({
                              data: {
                                        userId: user.id,
                                        topic: dummyData[i].topic,
                                        style: dummyData[i].style,
                                        status: "COMPLETED",
                                        videoUrl: videoUrls[i],
                                        isPublic: true,
                                        totalCreditsSpent: 50,
                              }
                    });

                    console.log(`🎬 Inserted Reel ${i + 1}: ${newReel.topic}`);
          }

          console.log("🎉 SUCCESS: All 5 public reels have been seeded to the database!");
}

seedPublicReels()
          .catch((e) => {
                    // ⚡ FIX: process.exit() hata diya. Error log honay ke baad script khud rukk jayegi.
                    console.error("Seeding failed:", e.message || e);
          })
          .finally(async () => {
                    // Database connection lazmi close hoga
                    await prisma.$disconnect();
          });