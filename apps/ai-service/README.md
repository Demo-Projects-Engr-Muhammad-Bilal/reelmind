# 🏭 AI Generation Service (`@aireelgen/ai-generation-service`)

This is the core computational engine of AIreelgen. It handles AI-powered video reel generation end-to-end: script → voiceover → image → video clip → composition → final reel.

Built with **Node.js + TypeScript**, **BullMQ** (job queue), **Express** (API), **Socket.IO** (real-time updates), and **FFmpeg** (video processing).

---

## 📁 Folder Structure

```
ai-generation-service/
├── assets/                    # Static assets baked into the Docker image
│   ├── bgm/                   # BGM fallback audio (dark-luxury.mp3)
│   ├── fonts/                 # Caption font (Anton-Regular.ttf)
│   └── images/                # Global fallback image (fallback.png)
├── src/
│   ├── config/                # Redis + BullMQ queue setup
│   ├── controllers/           # Express route handlers
│   ├── interfaces/            # TypeScript type definitions
│   ├── managers/              # Orchestration logic (audio, image, video, composer)
│   │   └── composer/core/     # FFmpeg pipeline: normalize → captions → merge
│   ├── providers/             # AI provider wrappers (Gemini, Veo, ElevenLabs, Google TTS)
│   ├── routes/                # Express router definitions
│   ├── services/              # Cross-cutting services (billing, storage, socket, transcription)
│   ├── workers/               # BullMQ background worker
│   └── index.ts               # App entry point — starts Express + worker
├── .env-structure.txt         # All environment variables with documentation
├── .gitignore                 # Excludes temp/, dist/, .env, GCP key files
├── Dockerfile                 # Production Docker image (includes FFmpeg)
├── render.yaml                # Render.com infrastructure-as-code (one-click deploy)
├── start.sh                   # Docker entrypoint — bootstraps GCP credentials at startup
└── tsconfig.json              # TypeScript config (rootDir is monorepo root ../../)
```

---

## ⚙️ Environment Variables

Copy `.env-structure.txt` to `.env` and fill in all values. See that file for full documentation.

**Key variables:**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MongoDB connection string |
| `REDIS_URL` | Redis URL for BullMQ (`redis://` local, `rediss://` cloud TLS) |
| `GOOGLE_CREDENTIALS_JSON_B64` | GCP service account JSON key, base64-encoded |
| `GCLOUD_PROJECT_ID` | Your Google Cloud project ID |
| `GEMINI_API_KEY` | Gemini API key |
| `CLOUDINARY_*` | Cloudinary credentials for media storage |
| `STRIPE_*` | Stripe credentials for payments |
| `FRONTEND_URL` | Your frontend URL — controls CORS for HTTP and WebSocket |

---

## 🚀 Local Development

```bash
# From monorepo root
npm install

# Start dev server (hot reload)
cd apps/ai-generation-service
npm run dev
```

Make sure you have a local Redis running:
```bash
docker run -d -p 6379:6379 redis:alpine
```

Or set `REDIS_URL=rediss://...` to point at a cloud Redis instance.

---

## 🐳 Docker Build (Production)

**Must be run from the monorepo root** (because `tsconfig.json rootDir` is `../../`):

```bash
docker build -f apps/ai-generation-service/Dockerfile -t ai-gen-service .
docker run -p 5001:5001 --env-file apps/ai-generation-service/.env ai-gen-service
```

---

## 🌐 API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check (used by Render/Railway) |
| `POST` | `/api/v1/generate/full-production` | Start full reel generation job |
| `POST` | `/api/v1/generate/assets` | Generate assets only |
| `POST` | `/api/v1/generate/video` | Render video clips only |
| `POST` | `/api/v1/generate/composition` | Run final composition only |
| `GET` | `/api/v1/niches` | List available niches |
| `GET` | `/api/v1/reels/:id` | Get reel status |
| `POST` | `/api/v1/payments/create-checkout` | Create Stripe checkout session |
| `POST` | `/api/v1/payments/webhook` | Stripe webhook receiver |

Real-time progress is streamed via **Socket.IO**. The client joins a room with the `reelId` and listens for `step_update` events.

---

## 🔄 Production Pipeline (3 Stages)

```
[API receives request]
        ↓
[BullMQ job queued in Redis]
        ↓
[Worker picks up job]
        ↓
Stage 1 ASSETS:  Google TTS voiceover → Gemini/Imagen image → uploaded to Cloudinary
Stage 2 VIDEO:   Veo AI video (or Ken Burns FFmpeg fallback) → uploaded to Cloudinary
Stage 3 MASTERING: Audio normalization → Caption burning → Scene merging → BGM mix → Final upload
        ↓
[Socket.IO emits step_update to frontend]
```

---

## 📦 Deployment

See `render.yaml` for Render.com deployment config, and `Dockerfile` for the Docker image spec. See the **Hosting Plan** section below or the root `README.md` for the full free-tier hosting strategy.

---

## 📝 Changes Made (Production Fixes)

All fixes are documented inline as comments in each changed file. Summary:

1. **`src/config/bullmq.config.ts`** — Redis connection now uses `REDIS_URL` with TLS support
2. **`src/index.ts`** — CORS uses `FRONTEND_URL` env var; added `/health` endpoint; fixed `__dirname`
3. **`src/services/socket.service.ts`** — Socket.IO CORS uses `FRONTEND_URL` env var
4. **`src/providers/audio/base.audio.ts`** — Fixed temp path to use `import.meta.url`
5. **`src/providers/audio/elevenlabs.audio.ts`** — Returns absolute path instead of relative string
6. **`src/providers/audio/google.audio.ts`** — Returns absolute path instead of relative string
7. **`src/providers/image/base.image.ts`** — Fixed temp path to use `import.meta.url`
8. **`src/managers/generation/image/image.manager.ts`** — Fixed temp + fallback asset paths
9. **`src/managers/generation/video/video.manager.ts`** — Fixed temp path to use `import.meta.url`
10. **`src/managers/composer/core/helpers.ts`** — Fixed temp path
11. **`src/managers/composer/core/cleanup.ts`** — Fixed temp path
12. **`src/managers/composer/core/captions.ts`** — Fixed temp path + font asset path
13. **`src/managers/composer/core/merging.ts`** — Fixed temp path + BGM fallback asset path
14. **`src/services/transcription.service.ts`** — Fixed temp path
15. **`Dockerfile`** — New: production image with FFmpeg, multi-stage build
16. **`render.yaml`** — New: Render.com infrastructure-as-code
17. **`start.sh`** — New: GCP credentials bootstrap entrypoint
18. **`.env-structure.txt`** — Updated: added `REDIS_URL`, `GOOGLE_CREDENTIALS_JSON_B64`, `NODE_ENV`
19. **`.gitignore`** — New: excludes `temp/`, `dist/`, `.env`, GCP key files
