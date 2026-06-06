import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚡ FIX: Moved serverActions inside the 'experimental' object
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.tunnels.ms", // For VS Code Port Forwarding
        "*.ngrok.io",
        "*.ngrok-free.app"
      ],
    },
  },
};

export default nextConfig;