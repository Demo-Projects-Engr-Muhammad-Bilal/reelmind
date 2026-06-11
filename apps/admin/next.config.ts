import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  turbopack: false,
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
};

export default nextConfig;