# assets/

Static assets required at runtime by the video pipeline.
These are baked into the Docker image during the build stage.

## Contents

### `bgm/dark-luxury.mp3`
Background music fallback. Used when no BGM URLs are configured in the Niche database record.
Referenced in `src/managers/composer/core/merging.ts` via an absolute path constant.

### `fonts/Anton-Regular.ttf`
Caption font. Used by the FFmpeg `drawtext` filter in `src/managers/composer/core/captions.ts`.
The path is passed directly to FFmpeg, so it must be an absolute path at runtime.
The `import.meta.url`-based constant in captions.ts ensures this works regardless of
where Node.js is launched from.

### `images/fallback.png`
Global image fallback. Used when all AI image providers (Gemini, Imagen) fail AND no
niche-specific fallback URL is configured. Referenced in `src/managers/generation/image/image.manager.ts`.

## Important

The `temp/` folder (sibling to `assets/`) is gitignored and created at runtime.
Do NOT commit any files from `temp/` — they are intermediate FFmpeg workspace files.
