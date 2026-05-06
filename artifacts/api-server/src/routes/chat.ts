import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

type ApiMessage = { role: "user" | "assistant" | "system"; content: string };

function getOpenAIClient(): OpenAI {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy";
  return new OpenAI({ apiKey, baseURL });
}

function setupSSE(res: import("express").Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
}

// Attempt Replit AI integration; if unavailable, fall back to Cloudflare Workers AI
async function tryReplitOpenAI(
  messages: ApiMessage[],
  model: string,
  res: import("express").Response,
): Promise<boolean> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy";
  if (!baseURL) return false;

  try {
    const openai = new OpenAI({ apiKey, baseURL });
    const stream = await openai.chat.completions.create({
      model,
      max_completion_tokens: 8192,
      messages,
      stream: true,
    });
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
    return true;
  } catch {
    return false;
  }
}

function extractCfError(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { errors?: { message: string }[] };
    return parsed.errors?.[0]?.message ?? raw;
  } catch {
    return raw;
  }
}

async function fallbackCloudflare(
  messages: ApiMessage[],
  res: import("express").Response,
): Promise<void> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    res.write(`data: ${JSON.stringify({ error: "NJIRLAH AI Built-in is temporarily unavailable. Switch to Cloudflare Workers AI or add an OpenRouter key." })}\n\n`);
    res.end();
    return;
  }

  const upstream = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ messages, stream: true }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    const errText = extractCfError(await upstream.text().catch(() => upstream.statusText));
    res.write(`data: ${JSON.stringify({ error: `Cloudflare error: ${errText}. Please update your Cloudflare credentials in the sidebar.` })}\n\n`);
    res.end();
    return;
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(decoder.decode(value, { stream: true }));
  }
  res.end();
}

router.post("/replit/chat", async (req, res) => {
  const { model = "gpt-5.4", messages, stream: doStream = true } = req.body as {
    model?: string;
    messages: ApiMessage[];
    stream?: boolean;
  };

  if (!doStream) {
    // Non-streaming: try Replit first then Cloudflare
    const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
    if (baseURL) {
      try {
        const openai = new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy", baseURL });
        const completion = await openai.chat.completions.create({ model, max_completion_tokens: 8192, messages, stream: false });
        res.json(completion);
        return;
      } catch { /* fall through */ }
    }
    res.status(503).json({ error: "Built-in model unavailable. Use Cloudflare or OpenRouter instead." });
    return;
  }

  setupSSE(res);

  try {
    const ok = await tryReplitOpenAI(messages, model, res);
    if (!ok) {
      await fallbackCloudflare(messages, res);
    }
  } catch (err) {
    req.log.error({ err }, "replit/chat error");
    if (!res.writableEnded) {
      const msg = (err as Error).message ?? "Internal server error";
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    }
  }
});

router.post("/openrouter/chat", async (req, res) => {
  try {
    const { model, messages, stream: doStream = true } = req.body as {
      model: string;
      messages: ApiMessage[];
      stream?: boolean;
    };
    const apiKey = req.headers["x-api-key"] as string | undefined;
    if (!apiKey) {
      res.status(401).json({ error: "OpenRouter API key required" });
      return;
    }

    if (doStream) {
      setupSSE(res);
    }

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://njirlah.ai",
        "X-Title": "NJIRLAH AI",
      },
      body: JSON.stringify({ model, messages, stream: doStream }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => upstream.statusText);
      if (!res.headersSent) {
        res.status(upstream.status).json({ error: errText });
      } else {
        res.end();
      }
      return;
    }

    if (!doStream) {
      const data = await upstream.json();
      res.json(data);
      return;
    }

    if (!upstream.body) {
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end();
  } catch (err) {
    req.log.error({ err }, "openrouter/chat error");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.end();
    }
  }
});

router.post("/cloudflare/chat", async (req, res) => {
  try {
    const { model = "@cf/meta/llama-3.1-8b-instruct", messages, stream: doStream = true } = req.body as {
      model?: string;
      messages: ApiMessage[];
      stream?: boolean;
    };

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      res.status(503).json({ error: "Cloudflare AI not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN." });
      return;
    }

    if (doStream) {
      setupSSE(res);
    }

    const upstream = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ messages, stream: doStream }),
      },
    );

    const sendSSEError = (msg: string) => {
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    };

    if (!upstream.ok) {
      const rawErr = await upstream.text().catch(() => upstream.statusText);
      const errText = extractCfError(rawErr);
      if (!res.headersSent) {
        res.status(upstream.status).json({ error: errText });
      } else {
        sendSSEError(`Cloudflare error: ${errText}. Please update your Cloudflare credentials in the sidebar.`);
      }
      return;
    }

    if (!doStream) {
      const data = (await upstream.json()) as { success?: boolean; errors?: { message: string }[]; result?: unknown };
      if (data.success === false) {
        const cfErr = data.errors?.[0]?.message ?? "Cloudflare AI error";
        res.status(400).json({ error: cfErr });
        return;
      }
      res.json(data);
      return;
    }

    if (!upstream.body) {
      if (res.headersSent) { res.end(); } else { res.status(502).json({ error: "No response body from Cloudflare" }); }
      return;
    }

    // Buffer first chunk to detect non-SSE error bodies (e.g. auth errors returned as 200 JSON)
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let first = true;
    let leftover = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (first) {
        first = false;
        const trimmed = (leftover + chunk).trimStart();
        // Cloudflare wraps errors in {"result":null,"success":false,...}
        if (trimmed.startsWith("{") && trimmed.includes('"success":false')) {
          try {
            const parsed = JSON.parse(trimmed) as { errors?: { message: string }[] };
            const cfErr = parsed.errors?.[0]?.message ?? "Cloudflare authentication error";
            sendSSEError(cfErr);
            return;
          } catch { /* not valid JSON yet, continue streaming */ }
        }
        leftover = "";
      }
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    req.log.error({ err }, "cloudflare/chat error");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: (err as Error).message ?? "Internal server error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
