import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "reelmind-adminpanel.netlify.app",
        "*.netlify.app",
        "*.netlify.live",
        "*.tunnels.ms",
        "*.ngrok.io",
        "*.ngrok-free.app",
      ],
    },
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
