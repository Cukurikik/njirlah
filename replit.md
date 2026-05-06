# NJIRLAH AI

A premium multi-model AI chat platform with BYOK OpenRouter support and built-in Cloudflare Workers AI. Features a full Agent Code Generator that streams multi-file projects in real time.

## Run & Operate

| Command | Purpose |
|---|---|
| `pnpm install` | Install all workspace deps |
| `pnpm --filter @workspace/njirlah-ai run dev` | Start frontend (reads `PORT` + `BASE_PATH` env vars) |
| `pnpm --filter @workspace/api-server run dev` | Build + start API server on `:8080` |
| `pnpm --filter @workspace/njirlah-ai run build` | Production build to `dist/public/` |

**Required env vars:**
- `PORT` / `BASE_PATH` — injected by Replit for the web artifact
- `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit built-in AI (optional, falls back to Cloudflare)
- `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN` — server-side Cloudflare Workers AI (optional)
- `VITE_UNICORN_STUDIO_PROJECT_ID` — optional Unicorn.Studio background project ID

## Stack

- **Frontend**: React 19 + Vite 7 + TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Framer Motion · Zustand · TanStack Query
- **Backend**: Express + TypeScript + esbuild · pino logging · express-rate-limit
- **Crypto**: Web Crypto API (AES-GCM + PBKDF2) for encrypted key storage
- **Other**: JSZip (ZIP download) · canvas-confetti · react-syntax-highlighter · date-fns

## Where things live

```
artifacts/
  njirlah-ai/src/
    App.tsx                    # Routing + top-level layout
    pages/                     # ChatPage (AppInner), AnimationsPage, AgentPage, AppPreviewPage
    components/
      chat/                    # ChatArea, ChatBubble, ChatInput, ModelSelector, CodeBlock…
      agent/                   # AgentCodePanel, FileTree, CodeEditor
      layout/                  # Header, Sidebar, Footer, Background, NJIRLAHLogo, CommandPalette, CursorTrail
      animations/              # 8 animation showcase sections (50+ demos)
      compare/                 # CompareView, CompareModelPicker
      preview/                 # LivePreviewPanel, BrowserFrame, DeviceSimulator
    store/                     # Zustand stores: chat, api-key, agent, model, compare, appearance
    hooks/                     # useChat.ts, useCompareChat.ts
    lib/                       # openrouter.ts, cloudflare.ts, encryption.ts, build-preview-html.ts
  api-server/src/
    routes/                    # chat.ts (replit/openrouter/cloudflare), agent.ts (SSE), cloudflare.ts (models)
    app.ts                     # Express setup, rate limiting
```

Schema / API contracts: see `artifacts/api-server/src/routes/`

## Architecture decisions

- **Client-side encryption**: OpenRouter keys are encrypted with AES-GCM + PBKDF2 before persisting to localStorage — the server never receives the raw key, only forwards it
- **Vite proxy**: All `/api` calls proxy to `localhost:8080` (the api-server) to avoid CORS and keep the key forwarding seamless
- **SPA routing**: `AppRouter` in `App.tsx` reads `window.location.pathname` directly (no react-router) — fine for a 4-page app
- **SSE agent streaming**: The agent generates multi-file projects via Server-Sent Events; the frontend parses `file_start / file_chunk / file_end / done / error` events
- **Unicorn.Studio**: Background supports an optional Unicorn.Studio project via `VITE_UNICORN_STUDIO_PROJECT_ID`; falls back to a canvas-based neon orb animation

## Product

- **Chat page** (`/`): Multi-model streaming chat — switch between NJIRLAH Built-in (GPT-5.4), Cloudflare Workers AI (12+ OSS models), and OpenRouter (200+ models incl. Claude, Gemini, Grok). Features: compare mode, voice input, file attachments, per-message feedback, token speed badge, edit & regenerate, custom system instructions, chat export
- **Agent Code Generator** (`/agent`): Describe an app, get a streaming multi-file project with live preview; confetti on completion, ZIP download
- **Animation Showcase** (`/animations`): 50+ live interactive demos — Basic, Loaders, Text & Path, Interactive, Scroll, Cursor, iOS, Advanced
- **Live Preview** (`/preview`): iframe renderer for agent-generated HTML/JSX/CSS files

## User preferences

- Creator credit: "Dibuat dengan ❤️ oleh Andikaa Saputraa" — always in the footer
- Tagline: "membangun masa depan AI yang bebas, tanpa batas, ala kadarnya tapi njir lah keren"
- Color scheme: purple #A855F7, cyan #06B6D4, pink #EC4899 on `#05050A` background
- Logo: NJIRLAH unicorn SVG with glitch text + 3-click easter egg (dancing unicorn)
- All primary copy/labels in a mix of Indonesian and English

## Gotchas

- `PORT` and `BASE_PATH` env vars are required by `vite.config.ts` — it throws if missing
- API server runs on **:8080** (hard-coded in `artifacts/api-server/src/index.ts`) — Vite proxies `/api` there
- Cloudflare fallback in `/api/replit/chat`: if `AI_INTEGRATIONS_OPENAI_BASE_URL` is missing, the built-in route falls back to Cloudflare
- Run `pnpm install` from workspace root before starting workflows — individual package node_modules may be missing

## Pointers

- `.local/skills/react-vite/` — React + Vite monorepo patterns
- `.local/skills/pnpm-workspace/` — monorepo conventions
- `.local/skills/ai-integrations-openai/` — Replit OpenAI integration proxy
