// Role: Main application server and worker bootstrapper.

// CHANGE: CORS origin is now driven by FRONTEND_URL environment variable.
// Previously hardcoded to "http://localhost:3000" which blocked all production
// frontend requests with a 403 CORS error. Now works for both local and hosted setups.

import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

import generateRoutes from "./routes/generate.route.js";
import nicheRoutes from "./routes/niche.route.js";
import reelRoutes from "./routes/reel.route.js";
import paymentRoutes from "./routes/payment.route.js";
import { handleStripeWebhook } from "./controllers/payment/payment.controller.js";

import { initSocket } from "./services/socket.service.js";

// 🚀 Initialize Background Worker
import "./workers/generation.worker.js";

const app = express();
const server = http.createServer(app);

// 🔌 Initialize Socket.io on this server
initSocket(server);

// CHANGE: Derive __dirname safely for ES Modules (import.meta.url pattern).
// process.cwd() is unreliable on cloud platforms; __dirname equivalent is the safe approach.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CHANGE: FRONTEND_URL env var controls allowed CORS origin.
// Falls back to localhost:3000 only for local development convenience.
// Both the main CORS middleware AND Socket.io use this same variable (see socket.service.ts).
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
          origin: ALLOWED_ORIGIN,
          methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
          credentials: true
}));

// 🚨 CRITICAL: Webhook mounted BEFORE express.json() to preserve raw body bytes for Stripe Signature
app.post("/api/v1/payments/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

// Global JSON Parser for all other routes
app.use(express.json());

// 📁 Static Assets Access (temp folder for serving intermediate files if needed)
// CHANGE: Uses __dirname-relative path instead of process.cwd() for reliability on cloud hosts.
app.use("/temp", express.static(path.join(__dirname, "..", "temp")));

// CHANGE: Added /health endpoint for Render/Railway health checks.
// Without this, cloud platforms mark the service as unhealthy and restart it in a loop.
app.get("/health", (_req, res) => {
          res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Mapping
app.use("/api/v1/niches", nicheRoutes);
app.use("/api/v1/generate", generateRoutes);
app.use("/api/v1/reels", reelRoutes);
app.use("/api/v1/payments", paymentRoutes);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
          console.log(`\n🚀 AI Engine roaring on port ${PORT}`);
          console.log(`🌐 CORS allowed origin: ${ALLOWED_ORIGIN}`);
          console.log("------------------------------------------");
});

server.timeout = 600000;
server.keepAliveTimeout = 600000;
