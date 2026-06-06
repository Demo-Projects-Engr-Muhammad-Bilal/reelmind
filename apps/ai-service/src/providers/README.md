# src/providers/

Concrete AI provider implementations, each behind a base class interface.
The managers call these through the interface — adding a new provider only
requires implementing the interface and registering it in the relevant manager.

## Subfolders

### `audio/`
- **`base.audio.ts`** — base class: `ensureDirectory()` + `getOutputPath()`
  **CHANGE:** Uses `import.meta.url`-based `BASE_TEMP` constant instead of `path.resolve()`.
- **`google.audio.ts`** — Google Cloud Text-to-Speech (primary provider)
  **CHANGE:** Returns absolute `outputPath` instead of hardcoded relative string.
- **`elevenlabs.audio.ts`** — ElevenLabs TTS (fallback provider)
  **CHANGE:** Returns absolute `outputPath` instead of hardcoded relative string.

### `image/`
- **`base.image.ts`** — processes buffer with Sharp, saves to temp folder
  **CHANGE:** Uses `import.meta.url`-based `BASE_TEMP`; returns absolute path.
- **`gemini.image.ts`** — Gemini 2.0 Flash image generation via Vertex AI
- **`imagen.image.ts`** — Imagen 3 via Vertex AI

### `video/`
- **`base.video.ts`** — helper to derive output path from image path
- **`veo.video.ts`** — Veo 3.1/3.0/2.0 via Vertex AI with internal cascade fallback

### `llm/`
- **`base.llm.ts`** — LLM base interface
- **`gemini.llm.ts`** — Gemini Pro for script/hook generation

## Authentication Note

All Vertex AI providers (Gemini, Imagen, Veo) require `GOOGLE_APPLICATION_CREDENTIALS`
to be set to the path of a GCP service account JSON key file.

On cloud deployments, this is handled automatically by `start.sh`:
it reads `GOOGLE_CREDENTIALS_JSON_B64` from the environment, decodes it to a temp file,
and sets `GOOGLE_APPLICATION_CREDENTIALS` before Node.js starts.
