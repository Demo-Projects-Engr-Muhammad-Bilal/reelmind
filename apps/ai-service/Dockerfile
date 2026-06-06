# =============================================================================
# Dockerfile for ai-service
# =============================================================================

# ---- Stage 1: Build ----
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y python3 make g++ openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY apps/ai-service/package*.json ./apps/ai-service/

RUN npm install

COPY . .

RUN npx prisma@5.22.0 generate --schema=packages/database/prisma/schema.prisma && \
    npx tsc -p packages/database/tsconfig.json && \
    npx tsc -p apps/ai-service/tsconfig.json


# ---- Stage 2: Production Runner ----
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y ffmpeg openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/apps/ai-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database/dist ./node_modules/@aireelgen/database/dist
COPY --from=builder /app/packages/database/package.json ./node_modules/@aireelgen/database/package.json
COPY apps/ai-service/assets ./assets
COPY apps/ai-service/start.sh ./start.sh
RUN chmod +x ./start.sh
RUN mkdir -p /app/temp

RUN groupadd -r appgroup && useradd -r -g appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5001

ENTRYPOINT ["./start.sh"]