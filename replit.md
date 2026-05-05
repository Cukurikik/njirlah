# NJIRLAH AI — Project Overview

## What is this?

NJIRLAH AI is a multi-model AI chat platform built on a pnpm monorepo. It supports two AI sources:

1. **Cloudflare Workers AI** — Built-in, server-side token, no user key required
2. **OpenRouter** — BYOK (Bring Your Own Key), user provides their API key, stored encrypted in browser

Branding: edgy, playful, premium — dark neon glassmorphism with purple/cyan/pink palette.  
Tagline: "Chat AI Tersesat, Bebas Pake Kunci Sendiri"  
Footer credit: Dibuat dengan ❤️ oleh Andikaa Saputraa

---

## Architecture

### Monorepo Structure

```
artifacts/
  api-server/          — Express API server (port from $PORT env)
  njirlah-ai/          — React + Vite frontend (port from $PORT env)
lib/
  api-spec/            — OpenAPI spec + Orval codegen
  api-client-react/    — Generated React Query hooks
  api-zod/             — Generated Zod schemas
```

### API Routes (Express, `/api/...`)

- `GET  /api/healthz`              — Health check
- `GET  /api/cloudflare/models`    — Fetch available CF Workers AI models (with fallback list)
- `POST /api/cloudflare/chat`      — Proxy chat to Cloudflare (streaming SSE)
- `POST /api/openrouter/chat`      — Proxy chat to OpenRouter (streaming SSE, BYOK via x-api-key header)

### Frontend Structure (`artifacts/njirlah-ai/src/`)

```
App.tsx                          — Root app, QueryClientProvider, layout wiring
index.css                        — Dark neon theme (CSS vars, custom scrollbar, fonts)
store/
  chat-store.ts                  — Zustand: chats, messages, selected model
  api-key-store.ts               — Zustand: OpenRouter key (encrypted in localStorage)
lib/
  encryption.ts                  — AES-GCM encryption using Web Crypto API
  openrouter.ts                  — Model fetching, free model detection, key validation
  cloudflare.ts                  — Fetch Cloudflare models from API
hooks/
  useChat.ts                     — Send message + regenerate logic (streaming SSE)
components/
  layout/
    NeonBackground.tsx            — Animated canvas: neon orbs + particle network
    Header.tsx                    — Model selector bar + logo easter egg (3 clicks = unicorn dance)
    Sidebar.tsx                   — Chat history, new chat, API key status (collapsible)
    Footer.tsx                    — "Dibuat dengan ❤️ oleh Andikaa Saputraa" with beating heart
  chat/
    ChatArea.tsx                  — Message list, empty state, welcome screen
    ChatBubble.tsx                — Message bubble with copy/regenerate/like/dislike + streaming cursor
    ChatInput.tsx                 — Textarea with auto-resize, Enter to send
    ApiKeyModal.tsx               — Glass dialog: enter + test + save OpenRouter API key
    ModelSelector.tsx             — Dropdown: search, tab filter, 55 provider filters, GRATIS badges
```

---

## Security

- OpenRouter API key: **never stored server-side**. Encrypted AES-GCM (Web Crypto API) in localStorage with PBKDF2 passphrase derived from browser fingerprint.
- Cloudflare tokens: server-only via `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` environment secrets. Never sent to client.
- OpenRouter proxy: reads `x-api-key` header from request, forwards as `Authorization: Bearer`, never stores it.

---

## Environment Secrets Required

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers AI permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
| `SESSION_SECRET` | (Available, not currently used) |

---

## Key Features

- Streaming SSE chat (both Cloudflare and OpenRouter)
- Animated neon canvas background (WebGL-like via Canvas 2D)
- Collapsible glassmorphism sidebar with chat history
- GRATIS badge on free OpenRouter models
- 55 provider filter chips in ModelSelector
- OpenRouter API key test connection button
- Unicorn Easter Egg: click logo 3× → animated unicorn dance
- Animated beating heart footer by Andikaa Saputraa
- Fallback Cloudflare model list if rate-limited

---

## Running Locally

Workflows are configured automatically:
- API Server: `pnpm --filter @workspace/api-server run dev`
- Frontend: `pnpm --filter @workspace/njirlah-ai run dev`

---

## Dependencies of Note

- `zustand` — state management
- `nanoid` — unique ID generation
- `framer-motion` — animations
- `@tanstack/react-query` — API data fetching
- `date-fns` + `date-fns/locale/id` — Indonesian locale timestamps
- `lucide-react` — icons
