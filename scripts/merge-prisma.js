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

          console.log("🔍 Debug: Final schema content:\n", finalContent);

          fs.writeFileSync(targetPath, finalContent, "utf-8");
          console.log("✅ Merged schema written to", targetPath);
}

// Detect Netlify environment
const isNetlify = !!process.env.NETLIFY;
console.log("🔍 Debug: isNetlify =", isNetlify);

let generatorBlockAdmin;

if (isNetlify) {
          generatorBlockAdmin = `
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["debian-openssl-3.0.x", "rhel-openssl-3.0.x", "linux-musl"]
}
`;
} else {
          generatorBlockAdmin = `
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "windows", "debian-openssl-3.0.x", "rhel-openssl-3.0.x"]
}
`;
}

// Root schema (always Linux safe)
const generatorBlockRoot = `
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["debian-openssl-3.0.x", "rhel-openssl-3.0.x", "linux-musl"]
}
`;

mergeSchema(
          path.resolve(__dirname, "../packages/database/prisma/schema.prisma"),
          generatorBlockRoot
);

mergeSchema(
          path.resolve(__dirname, "../apps/admin/prisma/schema.prisma"),
          generatorBlockAdmin
);

console.log("🔍 Debug: merge-prisma.js finished successfully");
