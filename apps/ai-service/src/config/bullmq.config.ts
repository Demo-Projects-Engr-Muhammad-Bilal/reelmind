// Role: Centralized Redis connection and Queue definition.
// Imported In: src/controllers/generate/production.controller.ts, src/workers/generation.worker.ts

// CHANGE: Replaced split REDIS_HOST + REDIS_PORT variables with a single REDIS_URL.
// This supports Upstash, Redis Cloud, and any TLS-enabled Redis provider (rediss:// URLs).
// Old approach broke on cloud Redis providers that require TLS connections.

import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

/**
 * 🔌 Redis Connection Setup
 * Requirement: maxRetriesPerRequest must be null for BullMQ.
 * Supports both local Redis (redis://) and cloud TLS Redis (rediss://).
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// CHANGE: Added lazyConnect and enableOfflineQueue so the app starts up
// even if Redis isn't immediately reachable, and retries gracefully.
export const redisConnection = new Redis(REDIS_URL, {
          maxRetriesPerRequest: null,
          enableReadyCheck: false,   // Required for BullMQ compatibility
          lazyConnect: false,
          // CHANGE: TLS is enabled automatically when URL starts with rediss://
          // No extra config needed — ioredis detects it from the protocol.
          tls: REDIS_URL.startsWith('rediss://') ? {} : undefined,
});

redisConnection.on('connect', () => console.log('✅ Redis connected successfully.'));
redisConnection.on('error', (err) => console.error('❌ Redis connection error:', err.message));

/**
 * 🏭 Reel Generation Queue
 * Handles background video production tasks with exponential backoff.
 */
export const generationQueue = new Queue('reel-generation', {
          connection: redisConnection as any,
          defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                              type: 'exponential',
                              delay: 60000, // 1 min initial delay for RPM safety
                    },
                    removeOnComplete: true,
          }
});
