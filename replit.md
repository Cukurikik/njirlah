# NJIRLAH AI

A beautiful dark-themed AI chat interface supporting multiple providers (built-in GPT-5.4, Cloudflare Workers AI, OpenRouter BYOK) with streaming responses, compare mode, live code preview, and local API key encryption.

## Run & Operate

- Frontend: `pnpm --filter @workspace/njirlah-ai run dev`
- API Server: `pnpm --filter @workspace/api-server run dev`
- Install: `pnpm install`
- Typecheck: `pnpm run typecheck`

Required env vars:
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — Replit AI proxy base URL (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI proxy key (auto-provisioned)
- `CLOUDFLARE_ACCOUNT_ID` — (optional) Cloudflare account ID for Workers AI
- `CLOUDFLARE_API_TOKEN` — (optional) Cloudflare API token for Workers AI

## Stack

- Frontend: React 19 + Vite 7 + TypeScript + Tailwind CSS v4 + wouter (routing)
- UI: shadcn/ui + Radix primitives + framer-motion
- State: Zustand (persisted) + TanStack Query
- API Server: Express 5 + pino logging + esbuild
- AI: OpenAI SDK via Replit AI Integrations proxy; OpenRouter and Cloudflare via fetch proxy

## Where things live

- `artifacts/njirlah-ai/` — frontend React app
- `artifacts/njirlah-ai/src/store/` — Zustand stores (chat, compare, api-key, appearance)
- `artifacts/njirlah-ai/src/hooks/` — useChat, useCompareChat hooks
- `artifacts/njirlah-ai/src/components/chat/` — chat UI components
- `artifacts/api-server/src/routes/` — Express API routes (chat.ts, status.ts, cloudflare.ts)
- `lib/integrations-openai-ai-server/` — OpenAI SDK client wrapper

## Architecture decisions

- All provider proxying done server-side (api-server) to avoid CORS and protect keys
- OpenRouter API key is user-supplied (BYOK), passed via `x-api-key` header, never stored server-side
- API keys stored in browser using AES-GCM encryption (`lib/encryption.ts`)
- Cloudflare Workers AI falls back to a built-in model list if credentials aren't configured
- `/api/status` pings all three providers and returns latency for the status badge

## Product

- Multi-provider AI chat: NJIRLAH built-in (GPT-5.4, free), Cloudflare Workers AI (free), OpenRouter (BYOK)
- Streaming SSE responses with markdown + syntax highlighting
- Compare mode: side-by-side model comparison
- Live Code Preview panel for HTML/TSX output
- Custom instructions, export chat, appearance settings
- API key management with local AES-GCM encryption

## Gotchas

- The vite config requires `PORT` and `BASE_PATH` env vars — set by the workflow automatically
- The api-server workflow rebuilds on each start (esbuild) — takes ~300ms
- Do NOT run `pnpm dev` at workspace root — no dev script there
