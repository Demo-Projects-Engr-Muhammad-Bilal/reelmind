# src/services/

Cross-cutting service classes used by controllers, workers, and managers.

## Files

### `billing.service.ts`
Atomic credit deduction system. Uses `prisma.$transaction` to simultaneously:
- Decrement user credits
- Write a `UsageLog` entry
- Increment `Reel.totalCreditsSpent`
- Increment `Scene.creditsSpent`

Zero-cost operations (fallback cache hits) skip the transaction entirely.

### `payment.service.ts`
Stripe integration. Generates checkout sessions from `CreditPackage` DB records
and processes `checkout.session.completed` webhook events.

### `scoring.service.ts`
Utility for computing content quality scores.

### `socket.service.ts`
Socket.IO server initialization and global `io` instance accessor.

**CHANGE (production fix):** The CORS `origin` is now read from `process.env.FRONTEND_URL`
instead of being hardcoded to `http://localhost:3000`. This allows WebSocket connections
from the production frontend to succeed.

### `storage.service.ts`
Cloudinary wrapper. Handles upload (with optional auto-delete of local file), delete,
and download-to-local. All credentials come from environment variables.

### `transcription.service.ts`
Google Cloud Speech-to-Text wrapper. Produces word-level timestamps for caption burning.

**CHANGE (production fix):** Temp file for remote audio download now uses `import.meta.url`-based
absolute path resolution instead of CWD-relative `path.resolve()`.
