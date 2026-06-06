// Role: Cleans up the temporary workspace directory after a reel is fully processed.

// CHANGE: Replaced path.resolve(`temp/${reelId}`) with import.meta.url-based absolute path.
// On cloud platforms, path.resolve() with relative strings fails because CWD is not the
// project root. Using import.meta.url ensures the correct temp/ folder is always targeted.

import { prisma } from "@aireelgen/database";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Going up 4 levels: core/ -> composer/ -> managers/ -> src/ -> project root -> temp/
const BASE_TEMP = path.join(__dirname, '..', '..', '..', '..', 'temp');

/**
 * 🧹 Global Cleanup Engine
 * Deletes the reel's temp directory and clears the cached local path from the database.
 */
export const cleanGlobalTemp = async (reelId: string) => {
          // CHANGE: Uses BASE_TEMP constant instead of path.resolve() with relative string.
          const reelDir = path.join(BASE_TEMP, reelId);

          // 1. Disk Cleanup: Delete all scene assets and the cached fallback image
          if (fs.existsSync(reelDir)) {
                    fs.rmSync(reelDir, { recursive: true, force: true });
                    console.log(`🏁 [Composer Cleanup] Temporary workspace deleted from disk for Reel: ${reelId}`);
          }

          try {
                    // 2. Database Cleanup: Reset localFallbackPath to null
                    await prisma.reel.update({
                              where: { id: reelId },
                              data: { localFallbackPath: null }
                    });
                    console.log(`🧹 [Composer Cleanup] Reset localFallbackPath field to null in database for Reel: ${reelId}`);
          } catch (err: any) {
                    console.error(`⚠️ [Composer Cleanup] Failed to update Reel record during DB cleanup: ${err.message}`);
          }
};
