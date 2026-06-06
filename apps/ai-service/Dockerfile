# =============================================================================
# Dockerfile for ai-service
# =============================================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY apps/ai-service/package*.json ./apps/ai-service/

RUN npm install

COPY . .

RUN npx prisma@5.22.0 generate --schema=packages/database/prisma/schema.prisma && npx tsc -p apps/ai-service/tsconfig.json


# ---- Stage 2: Production Runner ----
FROM node:20-alpine AS runner

RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy compiled JS output - rootDir is ../.. so dist is inside apps/ai-service/dist
COPY --from=builder /app/apps/ai-service/dist ./dist

# Copy runtime npm dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy packages/database so @aireelgen/database resolves at runtime
COPY --from=builder /app/packages ./packages

# Copy static assets
COPY apps/ai-service/assets ./assets

# Copy startup script
COPY apps/ai-service/start.sh ./start.sh
RUN chmod +x ./start.sh

# Create temp directory for FFmpeg
RUN mkdir -p /app/temp

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5001

ENTRYPOINT ["./start.sh"]