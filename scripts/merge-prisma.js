const fs = require("fs");
const path = require("path");

console.log("🔍 Debug: Starting merge-prisma.js");
console.log("🔍 Debug: NETLIFY env =", process.env.NETLIFY);

function mergeSchema(targetPath, generatorBlock) {
          console.log("🔍 Debug: Writing schema to", targetPath);
          const basePath = path.resolve(__dirname, "../packages/database/prisma/base.prisma");
          console.log("🔍 Debug: Reading base schema from", basePath);

          const baseContent = fs.readFileSync(basePath, "utf-8");
          const finalContent = `${generatorBlock}\n\n${baseContent}`;
          fs.writeFileSync(targetPath, finalContent, "utf-8");

          console.log("✅ Merged schema written to", targetPath);
}

// Detect Netlify environment
const isNetlify = !!process.env.NETLIFY;
console.log("🔍 Debug: isNetlify =", isNetlify);

// Generator block for admin schema
const generatorBlockAdmin = `
generator client {
  provider = "prisma-client-js"
  binaryTargets = ${isNetlify
                    ? '["debian-openssl-3.0.x", "rhel-openssl-3.0.x", "linux-musl"]'
                    : '["native", "windows", "debian-openssl-3.0.x", "rhel-openssl-3.0.x"]'}
}
`;

mergeSchema(
          path.resolve(__dirname, "../packages/database/prisma/schema.prisma"),
          `generator client {
  provider = "prisma-client-js"
  binaryTargets = ["debian-openssl-3.0.x", "rhel-openssl-3.0.x", "linux-musl"]
}`
);

mergeSchema(
          path.resolve(__dirname, "../apps/admin/prisma/schema.prisma"),
          generatorBlockAdmin
);

console.log("🔍 Debug: merge-prisma.js finished successfully");
