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

# Generate Prisma client, compile database package, then compile ai-service
RUN npx prisma@5.22.0 generate --schema=packages/database/prisma/schema.prisma && \
    npx tsc -p packages/database/tsconfig.json && \
    npx tsc -p apps/ai-service/tsconfig.json


# ---- Stage 2: Production Runner ----
FROM node:20-alpine AS runner

RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy compiled ai-service JS output
COPY --from=builder /app/apps/ai-service/dist ./dist

# Copy runtime npm dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled database package (dist only — no .ts files)
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json

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