# NJIRLAH AI

Multi-model AI chat platform supporting 300+ LLMs across OpenRouter, Cloudflare Workers AI, Alibaba Cloud Bailian, and custom OpenAI-compatible endpoints.

## Run & Operate

```bash
PORT=22978 BASE_PATH=/ pnpm --filter @workspace/njirlah-ai run dev
```

Workflow: `Start application` (auto-configured, port 22978)

## Stack

- React 19 + Vite 7 (TypeScript strict)
- Tailwind CSS 4 + shadcn/ui
- Framer Motion + GSAP + react-spring + anime.js
- Zustand (state management)
- Web Crypto API — AES-GCM encryption for all API keys in localStorage
- TanStack React Query

## Where things live

```
artifacts/njirlah-ai/src/
  pages/         # Route-level pages (LandingPage, ApiNjirPage, ChatPage, …)
  components/
    chat/        # ChatArea, ModelSelector, ApiKeyModal, …
    api-njir/    # ProviderCard, CustomProviderForm
    layout/      # Sidebar, Header, Background, …
  store/         # Zustand stores (all-api-keys-store, chat-store, model-store, …)
  lib/           # encryption.ts, openrouter.ts, cloudflare.ts
```

## Architecture decisions

- All API keys encrypted via AES-GCM (PBKDF2 key derivation from browser fingerprint) before localStorage
- `all-api-keys-store.ts` is the single source of truth for all 56 BYOK providers + custom providers
- Routing is simple path-based (no React Router) — `AppRouter` in `App.tsx` checks `window.location.pathname`
- ModelSelector reads from both openrouter and cloudflare models via React Query; custom providers via Zustand store
- No backend required — all AI calls go directly to provider APIs from the browser

## Product

- **Chat page (`/`)**: Multi-model chat with sidebar history, model selector (300+ models), compare mode, agent dev panel
- **API NJIR (`/api-njir`)**: Dashboard for all API keys — OpenRouter + 56 BYOK providers, Cloudflare, Alibaba Bailian, Custom (Cline-compatible)
- **Templates, Animations, Agent pages**: Additional tools

## User preferences

- Footer: "Dibuat dengan sepenuh hati oleh Andikaa Saputraa"
- Dark neon theme: purple/cyan/pink glassmorphism
- Indonesian language in UI text

## Gotchas

- Vite requires `PORT` and `BASE_PATH` env vars at startup — always pass them in workflow command
- `encryption.ts` exports both new `encryptValue`/`decryptValue` (generic, multi-key) and legacy `encryptApiKey`/`decryptApiKey` (backward compat)
- The artifact.toml `localPort` must match PORT env var (22978)
