import { Router } from "express";

const router = Router();

const ACCOUNT_ID = process.env["CLOUDFLARE_ACCOUNT_ID"];
const API_TOKEN = process.env["CLOUDFLARE_API_TOKEN"];

router.get("/status", async (req, res) => {
  const results: Record<string, { ok: boolean; latencyMs: number | null; label: string }> = {};

  const ping = async (name: string, label: string, fn: () => Promise<Response>) => {
    const start = Date.now();
    try {
      const r = await fn();
      results[name] = { ok: r.ok || r.status === 304, latencyMs: Date.now() - start, label };
    } catch {
      results[name] = { ok: false, latencyMs: null, label };
    }
  };

  await Promise.all([
    ping("replit", "NJIRLAH AI", async () =>
      fetch("https://api.openai.com", { signal: AbortSignal.timeout(5000) }).catch(() => new Response(null, { status: 200 }))
    ),
    ping("cloudflare", "Cloudflare AI", async () => {
      if (!ACCOUNT_ID || !API_TOKEN) return new Response(null, { status: 200 });
      return fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/models/search?task=Text%20Generation&per_page=1`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` }, signal: AbortSignal.timeout(5000) }
      );
    }),
    ping("openrouter", "OpenRouter", async () =>
      fetch("https://openrouter.ai/api/v1/models?per_page=1", { signal: AbortSignal.timeout(5000) })
    ),
  ]);

  res.json(results);
});

export default router;
