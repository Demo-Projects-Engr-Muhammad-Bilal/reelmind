// Role: Socket.IO server initialization and global IO accessor.

// CHANGE: Socket.IO CORS origin is now driven by FRONTEND_URL environment variable.
// Previously hardcoded to "http://localhost:3000" which caused WebSocket connections
// from the production frontend to be rejected. Now mirrors the same env var used
// in index.ts so both HTTP and WebSocket layers are consistent.

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
    // CHANGE: Read FRONTEND_URL from environment — same variable as main CORS config.
    // Falls back to localhost only for local dev.
    const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

    io = new SocketIOServer(server, {
        cors: {
            origin: ALLOWED_ORIGIN,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`🟢 Client connected to Socket.IO: ${socket.id}`);

        // 🔗 Frontend specifically is Reel ID ke "Room" mein aayega
        socket.on("join-reel-room", (reelId: string) => {
            socket.join(reelId);
            console.log(`📺 Socket ${socket.id} joined Live Room for Reel: ${reelId}`);
        });

        socket.on("disconnect", () => {
            console.log(`🔴 Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        console.warn("Socket.io not initialized yet!");
    }
    return io;
};
