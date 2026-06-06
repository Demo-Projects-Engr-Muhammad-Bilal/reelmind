# src/controllers/

Express request handlers. Controllers are thin — they validate input, run pre-flight
checks, and delegate to services or BullMQ.

## Subfolders

### `generate/`
- **`production.controller.ts`** — dispatches generation jobs to BullMQ after checking:
  - `userId` is present
  - User has at most 2 other active reels (queue limit)
  - User has enough credits (≥ `MINIMUM_CREDIT_REQUIRED` from env)
- **`hooks.controller.ts`** — generates viral hook variations via LLM
- **`script.controller.ts`** — generates the final reel script
- **`history.controller.ts`** — fetches reel history for a user

### `niche/`
- **`niche.controller.ts`** — returns all niche configurations from the database

### `payment/`
- **`payment.controller.ts`** — handles Stripe checkout creation and webhook processing
  Note: The webhook route is mounted **before** `express.json()` in `index.ts` to
  preserve the raw body bytes required for Stripe signature verification.
