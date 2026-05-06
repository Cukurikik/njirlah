# NJIRLAH AI — Project Overview

## What is this?

NJIRLAH AI is a multi-model AI chat platform built on a pnpm monorepo. It supports three AI sources:

1. **NJIRLAH AI Built-in (Replit OpenAI proxy)** — Default, server-side, no user key required. Uses `gpt-5.4` by default via Replit AI Integrations.
2. **Cloudflare Workers AI** — Server-side, requires `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` env vars.
3. **OpenRouter** — BYOK (Bring Your Own Key), user provides their API key, stored encrypted in browser.

Branding: edgy, playful, premium — dark neon glassmorphism with purple/cyan/pink palette.  
Tagline: "Chat AI Tersesat, Bebas Pake Kunci Sendiri"  
Footer credit: Dibuat dengan ❤️ oleh Andikaa Saputraa

---

## Architecture

### Monorepo Structure

```
artifacts/
  api-server/          — Express API server (port 8080, handles /api/*)
  njirlah-ai/          — React + Vite frontend (port 22978)
lib/
  api-spec/            — OpenAPI spec + Orval codegen
  api-client-react/    — Generated React Query hooks
  api-zod/             — Generated Zod schemas
```

### Routing

The artifact router at port 8081 (external 80) handles path-based routing:
- `/api/*` → api-server (port 8080)
- `/` → njirlah-ai frontend (port 22978)

Vite dev server also has a proxy (`/api` → `http://localhost:8080`) so API calls work when the frontend is accessed directly on port 22978/3000.

### API Routes (Express, `/api/...`)

- `GET  /api/healthz`              — Health check
- `GET  /api/cloudflare/models`    — Fetch available CF Workers AI models (with fallback list)
- `POST /api/cloudflare/chat`      — Proxy chat to Cloudflare (streaming SSE)
- `POST /api/openrouter/chat`      — Proxy chat to OpenRouter (streaming SSE, BYOK via x-api-key header)
- `POST /api/replit/chat`          — OpenAI-compatible streaming via Replit AI proxy (gpt-5.4 default, Shadcn/Tailwind system prompt injected)

### Frontend Structure (`artifacts/njirlah-ai/src/`)

```
App.tsx                          — Root app, QueryClientProvider, layout wiring
index.css                        — Dark neon theme (CSS vars, custom scrollbar, fonts)
store/
  chat-store.ts                  — Zustand: chats, messages, selected model (default: replit/gpt-5.4)
  api-key-store.ts               — Zustand: OpenRouter key (encrypted in localStorage)
lib/
  encryption.ts                  — AES-GCM encryption using Web Crypto API
  openrouter.ts                  — Model fetching, free model detection, key validation
  cloudflare.ts                  — Fetch Cloudflare models from API
hooks/
  useChat.ts                     — Send message + regenerate logic (streaming SSE, all 3 providers)
components/
  layout/
    Background.tsx               — Animated canvas: neon orbs + particle network
    Header.tsx                   — Model selector bar + logo
    Sidebar.tsx                  — Chat history, new chat, API key status (collapsible)
    Footer.tsx                   — "Dibuat dengan ❤️ oleh Andikaa Saputraa" with beating heart
  chat/
    ChatArea.tsx                  — Message list, empty state, welcome screen with real AI provider logos
    ChatBubble.tsx                — Message bubble with copy/regenerate/like/dislike + streaming cursor
    ChatInput.tsx                 — Textarea with auto-resize, Enter to send
    ApiKeyModal.tsx               — Glass dialog: enter + test + save OpenRouter API key
    ModelSelector.tsx             — Dropdown: All/Built-in/Cloudflare/OpenRouter tabs, search, provider filters
    CodeBlock.tsx                 — Syntax-highlighted code block with copy button
    MarkdownContent.tsx           — React-markdown with custom styled components
    LivePreview.tsx               — Iframe preview modal: Tailwind CDN, element selection, error overlay
  dev/
    DevPanel.tsx                  — Split-pane IDE: file tree, code editor, live preview (Tailwind CDN)
  ui/
    AILogo.tsx                    — Animated hexagon AI logo + AIIcon component
    AIProviderLogos.tsx           — Real SVG logos: OpenAI, Anthropic, Meta, Google, Mistral, Cloudflare,
                                    DeepSeek, Qwen, xAI, Cerebras, NJIRLAH branded
    TypewriterText.tsx            — Hero brand text animation
```

---

## Live Preview Features

The LivePreview modal (opened from CodeBlock with HTML/SVG content) provides:
- **Tailwind CSS CDN** injected automatically (`https://cdn.tailwindcss.com`)
- **Element Selection Mode** — click the "Select" button, then click any element in the preview; shows a purple highlight overlay with tag/class/text info, and an instruction input to send to AI
- **Runtime Error Overlay** — JS errors in the iframe are caught and displayed as a red banner at the bottom of the preview
- **Source view** — toggle between rendered preview and raw source
- **Open in new tab** — opens the preview in a new browser window

The DevPanel editor preview also injects Tailwind CDN for HTML files.

---

## Security

- OpenRouter API key: **never stored server-side**. Encrypted AES-GCM (Web Crypto API) in localStorage with PBKDF2 passphrase derived from browser fingerprint.
- Cloudflare tokens: server-only via `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` environment secrets.
- OpenRouter proxy: reads `x-api-key` header from request, forwards as `Authorization: Bearer`, never stores it.
- Replit AI proxy: uses `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY` (auto-provisioned).

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Replit AI proxy base URL (auto-set) | Yes (default provider) |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Replit AI proxy key (auto-set, dummy for compat) | Yes (default provider) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers AI permissions | Optional |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID | Optional |

---

## System Prompt

All AI routes inject a system prompt that instructs the AI to:
- Use Tailwind CSS for all styling
- Use shadcn/ui component patterns for React
- Include Tailwind CDN in standalone HTML previews
- Default to dark mode (bg-gray-950 palette)
- Output complete, non-truncated code

---

## Key Features

- **Streaming SSE chat** — all 3 providers (Replit/OpenAI, Cloudflare, OpenRouter)
- **NJIRLAH AI Built-in** — GPT-5.4 by default, no API key needed, uses Replit AI integration
- **Real AI provider logos** — SVG logos for OpenAI, Anthropic, Meta, Google, Mistral, Cloudflare, DeepSeek, xAI, Qwen, Cerebras
- **Live Preview with Tailwind CDN** — HTML previews render with full Tailwind CSS support
- **Element Selection** — click any element in live preview → purple highlight → send instruction to AI
- **Runtime Error Overlay** — JS errors caught and displayed visually in the preview
- **Dev Panel** — split-pane IDE with file tree, code editor, live preview (Tailwind CDN)
- **Animated neon canvas background**
- **Collapsible glassmorphism sidebar** with chat history
- **OpenRouter API key** test connection button
- **Model Selector** with Built-in GPT, Cloudflare, and 200+ OpenRouter models

---

## Running

Workflows are configured automatically:
- API Server: `pnpm --filter @workspace/api-server run dev` (PORT=8080)
- Frontend: `pnpm --filter @workspace/njirlah-ai run dev` (PORT=22978)

---

## Dependencies of Note

- `zustand` — state management
- `nanoid` — unique ID generation
- `framer-motion` — animations
- `@tanstack/react-query` — API data fetching
- `openai` — OpenAI SDK (api-server, used for Replit AI proxy)
- `lucide-react` — icons
- `react-markdown` + `remark-gfm` — Markdown rendering
