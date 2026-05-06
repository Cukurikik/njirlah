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

router.post("/replit/chat", async (req, res) => {
  try {
    const { model = "gpt-5.4", messages, stream: doStream = true } = req.body as {
      model?: string;
      messages: ApiMessage[];
      stream?: boolean;
    };

    const openai = getOpenAIClient();

    if (!doStream) {
      const completion = await openai.chat.completions.create({
        model,
        max_completion_tokens: 8192,
        messages,
        stream: false,
      });
      res.json(completion);
      return;
    }

    setupSSE(res);

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
  } catch (err) {
    req.log.error({ err }, "replit/chat error");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
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
    req.log.error({ err }, "cloudflare/chat error");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.end();
    }
  }
});

export default router;
