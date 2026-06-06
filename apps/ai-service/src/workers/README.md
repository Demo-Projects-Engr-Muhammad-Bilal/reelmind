# src/workers/

BullMQ background worker that processes reel generation jobs.

## `generation.worker.ts`

Consumes jobs from the `reel-generation` queue. Each job runs one of 4 task types:

| Task Type | What it does |
|---|---|
| `FULL` | Runs all 3 stages sequentially |
| `ASSETS` | Stage 1 only — voiceover + image per scene |
| `VIDEO` | Stage 2 only — video clip per scene |
| `COMPOSITION` | Stage 3 only — normalize → captions → merge → BGM |

**Abort safety:** Before every scene, the worker checks `reel.status` in the database.
If the user pressed Cancel (status = `CANCELLED`), an `ABORTED_BY_USER` error is thrown
and the job stops without marking the reel as `FAILED`.

**Retry logic:** Configured in `bullmq.config.ts` — 3 attempts with exponential backoff
starting at 60 seconds (to protect against AI provider rate limits).

**Error handling:** Any unhandled error updates `reel.status = "FAILED"` in the database
before re-throwing so BullMQ records the failure.
