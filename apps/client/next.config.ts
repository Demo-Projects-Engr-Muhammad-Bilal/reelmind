// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Proper way in Next.js 16+
  turbopack: {

  },
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

module.exports = nextConfig;
