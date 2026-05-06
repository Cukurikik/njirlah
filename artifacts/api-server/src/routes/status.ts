import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface ProviderStatus {
  ok: boolean;
  latencyMs: number | null;
  label: string;
}

async function pingProvider(url: string, init?: RequestInit): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000), ...init });
    return { ok: res.ok || res.status === 401 || res.status === 400, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

router.get("/status", async (_req, res) => {
  const [replit, openrouter, cloudflare] = await Promise.all([
    pingProvider(`${process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ?? "https://api.openai.com"}/models`, {
      headers: { Authorization: `Bearer ${process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy"}` },
    }),
    pingProvider("https://openrouter.ai/api/v1/models"),
    process.env.CLOUDFLARE_ACCOUNT_ID
      ? pingProvider(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/models/search`, {
          headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
        })
      : Promise.resolve({ ok: true, latencyMs: 0 }),
  ]);

  const result: Record<string, ProviderStatus> = {
    "NJIRLAH AI": { ok: replit.ok, latencyMs: replit.latencyMs, label: "NJIRLAH AI Built-in" },
    OpenRouter: { ok: openrouter.ok, latencyMs: openrouter.latencyMs, label: "OpenRouter" },
    Cloudflare: { ok: cloudflare.ok, latencyMs: cloudflare.latencyMs, label: "Cloudflare Workers AI" },
  };

  res.json(result);
});

export default router;
