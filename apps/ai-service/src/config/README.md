# src/config/

Configuration modules for shared infrastructure connections.

## Files

### `bullmq.config.ts`
Sets up the shared Redis connection and exports the BullMQ `generationQueue`.

**CHANGE (production fix):** Redis now connects via a single `REDIS_URL` environment variable
instead of the old `REDIS_HOST` + `REDIS_PORT` pair. This supports:
- Local Redis: `redis://127.0.0.1:6379`
- Cloud Redis with TLS (Upstash, Redis Cloud): `rediss://user:password@host:port`

The `tls: {}` option is automatically applied when the URL starts with `rediss://`.

### `pricing.config.ts`
Static pricing matrix (credits per operation). This is the hardcoded fallback reference —
the live rates are fetched from the database `PricingRate` table via `billing.service.ts`.
