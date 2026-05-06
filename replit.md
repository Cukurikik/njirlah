# NJIRLAH AI

An AI chat application with multi-model support (NJIRLAH Built-in via Replit, Cloudflare Workers AI, OpenRouter BYOK), client-side AES-GCM key encryption, and a 50+ animation showcase.

## Run & Operate

```bash
# Frontend (auto-started by artifact workflow)
pnpm --filter @workspace/njirlah-ai run dev       # PORT=22978 BASE_PATH=/ auto-set

# API Server (auto-started by artifact workflow at PORT=8080)
pnpm --filter @workspace/api-server run dev
```

Required secrets (all already set): `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`

## Stack

- React 18 + Vite 7, TypeScript strict
- Framer Motion (all animations)
- Tailwind CSS v4
- Zustand (chat-store, api-key-store, model-store, compare-store)
- TanStack Query (model list fetching)
- Express 5 + pino (API server, port 8080)
- Web Crypto API / AES-GCM + PBKDF2 (client-side key encryption)

## Where things live

- `artifacts/njirlah-ai/src/` — frontend source
  - `lib/encryption.ts` — AES-GCM + PBKDF2 + browser fingerprint key derivation
  - `lib/openrouter.ts` — fetchOpenRouterModels, validateOpenRouterKey, isModelFree
  - `lib/cloudflare.ts` — fetchCloudflareModels (calls `/api/cloudflare/models`)
  - `store/api-key-store.ts` — encrypt/decrypt/testConnection for OpenRouter key
  - `store/model-store.ts` — centralized model fetching for all providers
  - `store/chat-store.ts` — full chat state (messages, streaming, custom instructions)
  - `hooks/useChat.ts` — streaming SSE consumer (replit / cloudflare / openrouter)
  - `types/model-types.ts` — ModelInfo, OpenRouterRawModel, CloudflareRawModel
  - `types/chat-types.ts` — Chat, Message, ApiMessage, TokenUsage
  - `utils/derive-encryption-key.ts` — extracted CryptoKey derivation utility
  - `pages/AnimationsPage.tsx` — 50+ animation showcase at `/animations`
- `artifacts/api-server/src/routes/` — Express proxy routes
  - `chat.ts` — `/api/replit/chat`, `/api/openrouter/chat`, `/api/cloudflare/chat` (all with SSE streaming)
  - `cloudflare.ts` — `GET /api/cloudflare/models` (live fetch + 12-model fallback)
  - `status.ts` — `GET /api/status` (pings all 3 providers)
  - `health.ts` — `GET /api/healthz`

## Architecture decisions

- API server runs separately at port 8080; Vite proxies `/api/*` → `localhost:8080` so API keys never reach the client
- OpenRouter keys are BYOK — encrypted with AES-GCM using a PBKDF2 key derived from browser fingerprint, stored in localStorage; never sent to server logs
- Cloudflare Workers AI uses server-side `CLOUDFLARE_API_TOKEN` — never exposed to browser
- All three providers support Server-Sent Events streaming with transparent chunk forwarding
- Model list for OpenRouter is always fetched live after key entry (never hardcoded); Cloudflare models fetched from server route with 12-model fallback

## Product

- Free chat via NJIRLAH Built-in (GPT-5.4 via Replit AI integration — no key needed)
- Cloudflare Workers AI: 12+ open-source models, always free, no key needed
- OpenRouter BYOK: 200+ models (Claude, Mistral, Llama, Gemini, etc.) after adding key
- Side-by-side compare mode, live code preview panel, command palette (⌘K)
- 50+ Framer Motion animation demos across 8 categories
- AES-GCM encrypted API key storage, voice input, file attachment, export chat
- Agent Code Generator with canvas-confetti celebration on completion + JSZip download
- NJIRLAHLogo: neon unicorn SVG with glitch text hover, 3-click easter egg dancing unicorn overlay

## User preferences

- Animations must feel premium, smooth, 60fps
- Framer Motion is primary library; dark neon aesthetic (#05050A, #9E9EFF purple, #8DF0CC mint)

## Gotchas

- PORT and BASE_PATH required by vite.config.ts — set automatically by artifact workflow
- API server must be running on port 8080 for `/api/*` calls to resolve (not just the frontend)
- `SpeechRecognitionResultList` iteration requires explicit casting in strict TypeScript
- Duplicate `style` props on motion elements cause Vite warnings — always merge into one style object

## Pointers

- `.local/skills/react-vite/SKILL.md` — frontend build conventions
- `.local/skills/environment-secrets/SKILL.md` — secrets management
