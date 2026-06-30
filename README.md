# ReelMind

**AI-powered SaaS platform that turns a single text prompt into a complete, ready-to-publish short-form video reel.**

[![Live Demo](https://img.shields.io/badge/Live-reel--mind.netlify.app-8B5CF6?style=flat-square)](https://reel-mind.netlify.app)
[![Auth Service](https://img.shields.io/badge/Auth%20Service-Live-7C3AED?style=flat-square)](https://reel-mind-auth-service.netlify.app)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Live-F43F5E?style=flat-square)](https://ai-service-gwn0.onrender.com)

---

## What is ReelMind?

ReelMind automates the entire short-form video production pipeline — the kind of work that normally takes a human editor hours, done end-to-end by AI in minutes. A user provides a single topic, and the platform generates hooks, a full script, voiceovers, AI-generated visuals, video clips, and a final captioned reel, with live progress updates throughout.

It's built as a **multi-service product**, not a single app — separating the user-facing client, authentication, the AI processing engine, and an internal admin panel into independently deployable services.

---

## Generation Pipeline

Each reel goes through a fully orchestrated, multi-stage pipeline:

```
Prompt
  │
  ▼
AI Hook Generation  ──────────►  multiple hook variations generated
  │
  ▼
ML-Based Hook Scoring  ───────►  TensorFlow.js scores & ranks hooks,
  │                              best one auto-selected
  ▼
5-Scene Script Generation  ───►  full script broken into 5 structured scenes
  │
  ▼
Per-Scene Asset Generation  ──►  AI image + AI voiceover generated per scene
  │
  ▼
Audio Normalization  ─────────►  each voiceover trimmed/stretched to match
  │                              its target clip length (e.g. 8s per scene)
  ▼
Image-to-Video Conversion  ───►  static scene images animated into video clips
  │
  ▼
Scene Merging  ────────────────►  video + normalized audio merged per scene
  │
  ▼
Final Composition (FFmpeg)  ──►  all scenes merged, captions burned in,
  │                              final reel rendered
  ▼
Published Reel
```

Every job runs asynchronously through a queue system, with real-time progress pushed to the client over WebSockets — so the user watches each stage complete live instead of waiting on a blank loading screen.

---

## Architecture

ReelMind is a **Turborepo-managed monorepo** with services that scale and deploy independently:

| Service | Description | Stack |
|---|---|---|
| **Client App** | User-facing SaaS — dashboard, pipeline UI, public gallery, billing | Next.js, TypeScript, Tailwind |
| **Auth Service** | Dedicated authentication microservice, consumed only by the client app | Next.js, TypeScript |
| **AI Generation Service** | Core engine — orchestrates AI providers, runs the generation pipeline, FFmpeg video processing | Node.js, Express, BullMQ, Socket.IO |
| **Admin Panel** | Internal dashboard for platform management | Next.js, TypeScript, Prisma |
| **Database package** | Shared data layer across all services | Prisma + MongoDB |

```
                ┌─────────────────┐
                │   Client App     │ ── reel-mind.netlify.app
                └────────┬─────────┘
                         │
           ┌─────────────┼─────────────┐
           ▼                           ▼
┌───────────────────┐       ┌─────────────────────┐
│   Auth Service     │       │   AI Generation       │
│ (Authentication)   │       │   Service (Engine)    │
└────────────────────┘       └──────────┬────────────┘
                                          │
                              ┌──────────┴──────────┐
                              │   Shared Database     │
                              │   (MongoDB + Prisma)  │
                              └──────────┬────────────┘
                                          │
                              ┌──────────┴──────────┐
                              │     Admin Panel        │
                              └─────────────────────┘
```

This separation means the heavy AI/video processing workload (CPU/FFmpeg-intensive) never blocks or shares infrastructure with the lightweight client or auth services — each piece scales based on its own load profile.

---

## Core Features

- **Prompt-to-reel generation** — full automation from a single text input
- **ML-based hook scoring** — hooks ranked by a TensorFlow.js scoring model before script generation
- **Real-time progress tracking** — Socket.IO powers live pipeline status updates in the dashboard
- **Background job processing** — BullMQ queue handles generation jobs asynchronously, with retry and failure handling
- **Multi-provider AI orchestration** — integrates Google Gemini (script/LLM), Google Veo (video), ElevenLabs & Google TTS (voice), Imagen (images)
- **FFmpeg video pipeline** — custom composition engine handling normalization, caption burn-in, and final merging
- **Pay-as-you-go billing** — credit-based system with Stripe checkout and per-provider dynamic pricing
- **Public gallery** — generated reels can be shared and showcased publicly
- **Admin control panel** — manage users, niches, pricing rates, credit packages, and full usage/audit logs
- **Dockerized AI service** — production-ready multi-stage Docker build with FFmpeg baked in

---

## Tech Stack

**Frontend**
- Next.js, React, TypeScript, Tailwind CSS

**Backend / AI Engine**
- Node.js, Express, TypeScript
- BullMQ (Redis-backed job queues)
- Socket.IO (real-time updates)
- FFmpeg (video composition, captions)
- TensorFlow.js (ML hook scoring)

**Database**
- MongoDB with Prisma ORM (shared schema across services)

**AI Providers**
- Google Gemini (LLM / script generation)
- Google Veo (video generation)
- Google Imagen (image generation)
- ElevenLabs & Google TTS (voiceover)

**Infrastructure**
- Turborepo (monorepo build orchestration)
- Docker (containerized AI service)
- Netlify (client, auth service, admin)
- Render (AI generation service)
- Stripe (payments)
- Cloudinary (media storage)

---

## Project Structure

```
aireelgen-monorepo/
├── apps/
│   ├── client/          # User-facing Next.js app
│   ├── admin/            # Admin panel (Next.js)
│   ├── auth-service/      # Authentication microservice
│   └── ai-service/        # AI generation engine (Node.js + FFmpeg)
│       └── src/
│           ├── providers/    # AI provider wrappers (Gemini, Veo, ElevenLabs...)
│           ├── managers/     # Pipeline orchestration + FFmpeg composer
│           ├── workers/      # BullMQ background worker
│           ├── controllers/  # Express route handlers
│           ├── services/     # Billing, storage, sockets, transcription
│           └── routes/       # API route definitions
├── packages/
│   └── database/          # Shared Prisma schema + MongoDB models
└── turbo.json             # Turborepo pipeline config
```

---

## Live Links

| Service | URL |
|---|---|
| Client App (Only UI)| [reel-mind.netlify.app](https://reel-mind.netlify.app) |
| Auth Service (Client Auth Service)| [reel-mind-auth-service.netlify.app](https://reel-mind-auth-service.netlify.app) |
| AI Engine (Client App AI Engine API) | [ai-service-gwn0.onrender.com](https://ai-service-gwn0.onrender.com) |
| Admin App (Ui and backend both) | [reelmind-adminpanel.netlify.app](https://reelmind-adminpanel.netlify.app) |

---

## Status

Actively in development. Core generation pipeline, billing, and admin panel are functional end-to-end on the deployed client app.

---

## Author

Built by **Muhammad Bilal** — Final-year CS student | Full Stack Developer
[LinkedIn](https://www.linkedin.com/in/muhammad-bilal-ba342b373)
