const fs = require("fs");
const path = require("path");

function mergeSchema(targetPath, generatorBlock) {
          const basePath = path.resolve(__dirname, "../packages/database/prisma/base.prisma");
          const baseContent = fs.readFileSync(basePath, "utf-8");

          const finalContent = `${generatorBlock}\n\n${baseContent}`;
          fs.writeFileSync(targetPath, finalContent, "utf-8");
          console.log(`✅ Merged schema written to ${targetPath}`);
}

// Root schema merge
mergeSchema(
          path.resolve(__dirname, "../packages/database/prisma/schema.prisma"),
          `generator client {
  provider = "prisma-client-js"
}`
);

// Admin schema merge
mergeSchema(
          path.resolve(__dirname, "../apps/admin/prisma/schema.prisma"),
          `generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["debian-openssl-3.0.x"]
}`
);
