# src/managers/

Orchestration layer between the worker and the AI providers/composer.
Each manager wraps one concern (audio, image, video, composition) and handles
provider fallback chains, retry logic, and Cloudinary upload coordination.

## Subfolders

### `generation/audio/`
**AudioManager** — tries Google TTS first, falls back to ElevenLabs. Uploads result to Cloudinary.

### `generation/image/`
**ImageManager** — tries Gemini Flash Image first, falls back to Imagen 3, then to a niche-specific
cached fallback image, and finally to the global `assets/images/fallback.png`.

**CHANGE:** All `path.resolve()` calls replaced with `import.meta.url`-based absolute paths.
Fallback image path now uses a constant derived from the file's own location, not CWD.

### `generation/video/`
**VideoManager** — tries Veo AI video generation first (veo-3.1 → veo-3.0 → veo-2.0 cascade),
falls back to Ken Burns FFmpeg effect.

**CHANGE:** Temp directory path uses `import.meta.url`-based resolution instead of `path.resolve()`.

### `composer/`
**ComposerManager** — orchestrates the 3-phase final composition pipeline:
1. `normalization.ts` — adjusts audio tempo to fit video duration
2. `captions.ts` — burns word-level subtitles using FFmpeg `drawtext` filter
3. `merging.ts` — xfade transition between scenes + BGM mixing

**CHANGE:** All temp and asset paths fixed to use `import.meta.url`-based resolution.
Font path (`assets/fonts/Anton-Regular.ttf`) and BGM fallback path
(`assets/bgm/dark-luxury.mp3`) are now absolute constants, not CWD-relative.
