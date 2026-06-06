import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.tunnels.ms",
        "*.ngrok.io",
        "*.ngrok-free.app"
      ],
    },
  },
};

export default nextConfig;