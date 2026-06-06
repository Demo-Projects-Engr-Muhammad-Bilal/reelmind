# =============================================================================
# Dockerfile for ai-generation-service
# =============================================================================
#
# WHY THIS FILE EXISTS:
# The service requires FFmpeg and FFprobe to be installed as system binaries.
# These are not npm packages — they must be installed at the OS level.
# A Dockerfile is the only reliable way to guarantee these binaries exist
# at the correct PATH on any cloud platform (Render, Fly.io, Railway).
#
# BUILD STAGES:
# Stage 1 (builder): Installs all npm dependencies and compiles TypeScript.
# Stage 2 (runner):  Copies only the compiled output and runtime assets.
#                    This keeps the final image small.
#
# IMPORTANT — MONOREPO CONTEXT:
# This Dockerfile must be built from the MONOREPO ROOT, not from this folder.
# The tsconfig.json rootDir is set to ../../ (two levels up from this service).
# Build command from monorepo root:
#   docker build -f apps/ai-service/Dockerfile -t ai-gen-service .
# =============================================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

# Install build tools needed for native npm packages (sharp, tensorflow, etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files from monorepo root and this service
# We copy the root package.json first to leverage Docker layer caching
COPY package*.json ./
COPY apps/ai-service/package*.json ./apps/ai-service/

# Install all dependencies (including devDependencies needed for tsc)
RUN npm install

# Copy the full monorepo source needed for compilation
# tsconfig.json rootDir is ../../ so TypeScript needs the whole tree
COPY . .

# Compile TypeScript using this service's tsconfig
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma && npx tsc -p apps/ai-service/tsconfig.json


# ---- Stage 2: Production Runner ----
FROM node:20-alpine AS runner

# REASON: FFmpeg and FFprobe are required system binaries for:
# - Ken Burns video rendering (fluent-ffmpeg)
# - Audio tempo normalization
# - Caption burning with drawtext filter
# - Video merging with xfade transitions
# - Duration probing with ffprobe
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy compiled JS output from builder stage
COPY --from=builder /app/apps/ai-service/dist ./dist

# Copy runtime npm dependencies (production only)
COPY --from=builder /app/node_modules ./node_modules

# Copy static assets that the pipeline uses at runtime:
# - assets/fonts/Anton-Regular.ttf  → subtitle rendering
# - assets/bgm/dark-luxury.mp3      → BGM fallback
# - assets/images/fallback.png      → image generation fallback
COPY apps/ai-service/assets ./assets

# Copy the startup script that bootstraps GCP credentials
COPY apps/ai-service/start.sh ./start.sh
RUN chmod +x ./start.sh

# Create the temp directory — FFmpeg writes all intermediate files here.
# This directory is gitignored and must be created at runtime.
RUN mkdir -p /app/temp

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the port the Express server listens on
EXPOSE 5001

# ENTRYPOINT runs start.sh which:
# 1. Decodes GOOGLE_CREDENTIALS_JSON_B64 env var and writes it to a temp file
# 2. Sets GOOGLE_APPLICATION_CREDENTIALS to that file path
# 3. Then starts Node.js
ENTRYPOINT ["./start.sh"]
