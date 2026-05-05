import { Router } from "express";

const router = Router();

router.post("/openrouter/chat", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    res.status(401).json({ error: "OpenRouter API key required in x-api-key header" });
    return;
  }

  const { model, messages, stream = true } = req.body as {
    model: string;
    messages: Array<{ role: string; content: string }>;
    stream?: boolean;
  };

  if (!model || !messages) {
    res.status(400).json({ error: "model and messages are required" });
    return;
  }

  try {
    const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://njirlah.ai",
        "X-Title": "NJIRLAH AI",
      },
      body: JSON.stringify({ model, messages, stream }),
    });

    if (!orResponse.ok) {
      const text = await orResponse.text();
      req.log.error({ status: orResponse.status, text }, "OpenRouter chat failed");
      res.status(orResponse.status).json({ error: "OpenRouter request failed", detail: text });
      return;
    }

    const contentType = orResponse.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream") && orResponse.body) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = orResponse.body.getReader();
      const decoder = new TextDecoder();

      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.write("data: [DONE]\n\n");
            res.end();
            break;
          }
          res.write(decoder.decode(value, { stream: true }));
        }
      };

      pump().catch((err) => {
        req.log.error({ err }, "Stream pump error");
        res.end();
      });
    } else {
      const data = await orResponse.json();
      res.json(data);
    }
  } catch (err) {
    req.log.error({ err }, "Error calling OpenRouter");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
