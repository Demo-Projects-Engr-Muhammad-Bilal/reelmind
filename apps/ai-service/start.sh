#!/bin/sh
# Role: Docker ENTRYPOINT script — bootstraps GCP credentials before starting the server.
#
# REASON THIS FILE EXISTS:
# Cloud platforms (Render, Railway, Fly.io) do not support uploading key files.
# They only allow environment variables. The Vertex AI SDK (used for Gemini, Imagen, Veo)
# requires GOOGLE_APPLICATION_CREDENTIALS to point to a JSON key file on disk.
# This script bridges the gap: it decodes the base64-encoded JSON from the environment
# variable GOOGLE_CREDENTIALS_JSON_B64, writes it to a temp file, and then sets
# GOOGLE_APPLICATION_CREDENTIALS to point to that file before Node.js starts.
#
# HOW TO USE:
# 1. Take your GCP service account JSON key file.
# 2. Base64-encode it:  base64 -i your-key.json
# 3. Copy the output and set it as the GOOGLE_CREDENTIALS_JSON_B64 env var on your host.
# 4. This script handles the rest automatically at container start.

set -e

GCP_KEY_PATH="/tmp/gcp-service-account-key.json"

if [ -n "$GOOGLE_CREDENTIALS_JSON_B64" ]; then
    echo "🔑 [Startup] Decoding GCP credentials from environment variable..."
    echo "$GOOGLE_CREDENTIALS_JSON_B64" | base64 -d > "$GCP_KEY_PATH"
    export GOOGLE_APPLICATION_CREDENTIALS="$GCP_KEY_PATH"
    echo "✅ [Startup] GOOGLE_APPLICATION_CREDENTIALS set to $GCP_KEY_PATH"
else
    echo "⚠️  [Startup] GOOGLE_CREDENTIALS_JSON_B64 is not set."
    echo "   Vertex AI features (Gemini, Imagen, Veo) will be unavailable."
    echo "   Set this variable if you need AI generation features."
fi

# Ensure the temp directory exists at runtime (it's gitignored so not in the image).
# FFmpeg and all pipeline stages write here during processing.
mkdir -p /app/temp

echo "🚀 [Startup] Starting AI Generation Service..."
exec node dist/src/index.js
