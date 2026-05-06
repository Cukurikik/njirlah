# NJIRLAH AI

An AI chat application with an extensive animation showcase featuring 50+ live interactive animation demos.

## Run & Operate

```bash
# Start the app
pnpm --filter @workspace/njirlah-ai run dev
# (PORT=22978 BASE_PATH=/ are set automatically by the artifact workflow)
```

## Stack

- React 18 + Vite 7
- Framer Motion (primary animation orchestrator)
- Tailwind CSS v4 + tw-animate-css
- Zustand (state management)
- Radix UI primitives
- react-markdown + react-syntax-highlighter (chat rendering)
- TanStack Query

## Where things live

- `artifacts/njirlah-ai/src/` — main source
- `artifacts/njirlah-ai/src/App.tsx` — app entry; routes to AnimationsPage on `/animations`
- `artifacts/njirlah-ai/src/pages/AnimationsPage.tsx` — animation showcase page
- `artifacts/njirlah-ai/src/components/animations/` — 8 animation section components
- `artifacts/njirlah-ai/src/components/chat/` — chat UI components
- `artifacts/njirlah-ai/src/components/layout/` — sidebar, header, background
- `artifacts/njirlah-ai/src/store/` — Zustand stores (chat, api-key, compare)

## Architecture decisions

- Animation showcase is a separate `/animations` route within the same SPA (no page reload)
- All animations use Framer Motion as the primary orchestrator — GSAP/react-spring patterns are replicated using Framer Motion's spring physics for bundle efficiency
- Dark-only design with neon accent palette (#9E9EFF purple, #8DF0CC mint)
- Chat uses streaming token display with live tok/s counter
- API calls go through a Vite proxy to localhost:8080 (api-server)

## Product

- Full AI chat interface with model selector, custom instructions, API key management
- Animation showcase: 50+ demos across 8 categories (Basic, Loaders, Text/Path, Interactive, Scroll, Cursor, iOS, Advanced)
- Side-by-side model compare view
- Dev panel for inspecting request/response metadata

## User preferences

- Animations must feel premium, smooth, and 60fps
- Framer Motion is primary library; GSAP patterns emulated within it
- Dark neon aesthetic (#05050A background, purple/mint accents)

## Gotchas

- PORT and BASE_PATH env vars required by vite.config.ts — set by artifact workflow automatically
- The `@workspace/api-client-react` dep is a workspace package (codegen output) — must run codegen if OpenAPI spec changes
- Duplicate `style` props on motion elements cause Vite warnings — always merge into one style object

## Pointers

- `.local/skills/react-vite/SKILL.md` — frontend build conventions
- `.local/skills/design/SKILL.md` — design subagent delegation
