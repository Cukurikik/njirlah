import { Router } from "express";

const router = Router();

const ACCOUNT_ID = process.env["CLOUDFLARE_ACCOUNT_ID"];
const API_TOKEN = process.env["CLOUDFLARE_API_TOKEN"];

const FALLBACK_MODELS = [
  { id: "@cf/meta/llama-3.1-8b-instruct", name: "Llama 3.1 8B Instruct", description: "Meta Llama 3.1 8B", task: { name: "Text Generation" } },
  { id: "@cf/meta/llama-3.2-3b-instruct", name: "Llama 3.2 3B Instruct", description: "Meta Llama 3.2 3B", task: { name: "Text Generation" } },
  { id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", name: "Llama 3.3 70B Instruct", description: "Meta Llama 3.3 70B", task: { name: "Text Generation" } },
  { id: "@cf/mistral/mistral-7b-instruct-v0.2", name: "Mistral 7B Instruct v0.2", description: "Mistral AI 7B", task: { name: "Text Generation" } },
  { id: "@cf/google/gemma-7b-it", name: "Gemma 7B IT", description: "Google Gemma 7B", task: { name: "Text Generation" } },
  { id: "@cf/qwen/qwen1.5-14b-chat-awq", name: "Qwen 1.5 14B Chat", description: "Alibaba Qwen 14B", task: { name: "Text Generation" } },
  { id: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b", name: "DeepSeek R1 Distill 32B", description: "DeepSeek R1 distill", task: { name: "Text Generation" } },
  { id: "@cf/microsoft/phi-2", name: "Phi-2", description: "Microsoft Phi-2", task: { name: "Text Generation" } },
  { id: "@cf/openchat/openchat-3.5-0106", name: "OpenChat 3.5", description: "OpenChat 3.5", task: { name: "Text Generation" } },
  { id: "@cf/tiiuae/falcon-7b-instruct", name: "Falcon 7B Instruct", description: "TII Falcon 7B", task: { name: "Text Generation" } },
  { id: "@cf/meta/llama-2-7b-chat-fp16", name: "Llama 2 7B Chat FP16", description: "Meta Llama 2 7B", task: { name: "Text Generation" } },
  { id: "@hf/nousresearch/hermes-2-pro-mistral-7b", name: "Hermes 2 Pro Mistral 7B", description: "Nous Research", task: { name: "Text Generation" } },
];

router.get("/cloudflare/models", async (req, res) => {
  if (!ACCOUNT_ID || !API_TOKEN) {
    res.json({ models: FALLBACK_MODELS });
    return;
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/models/search?task=Text%20Generation&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      req.log.warn({ status: response.status }, "Cloudflare models fetch failed, using fallback");
      res.json({ models: FALLBACK_MODELS });
      return;
    }

    const data = (await response.json()) as {
      success: boolean;
      result: Array<{ id: string; name: string; description: string; task: { name: string } }>;
    };

    if (!data.success || !data.result?.length) {
      res.json({ models: FALLBACK_MODELS });
      return;
    }

    const models = data.result.map((m) => ({
      id: m.id,
      name: m.name || m.id,
      description: m.description || "",
      task: { name: m.task?.name || "Text Generation" },
    }));

    res.json({ models });
  } catch (err) {
    req.log.warn({ err }, "Error fetching Cloudflare models, using fallback");
    res.json({ models: FALLBACK_MODELS });
  }
});

router.post("/cloudflare/chat", async (req, res) => {
  if (!ACCOUNT_ID || !API_TOKEN) {
    res.status(500).json({ error: "Cloudflare credentials not configured" });
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
    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages, stream }),
      },
    );

    if (!cfResponse.ok) {
      const text = await cfResponse.text();
      req.log.error({ status: cfResponse.status, text }, "Cloudflare chat failed");
      res.status(cfResponse.status).json({ error: "Cloudflare AI request failed" });
      return;
    }

    const contentType = cfResponse.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream") && cfResponse.body) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = cfResponse.body.getReader();
      const decoder = new TextDecoder();

      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.write("data: [DONE]\n\n");
            res.end();
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      };

      pump().catch((err) => {
        req.log.error({ err }, "Stream pump error");
        res.end();
      });
    } else {
      const data = await cfResponse.json();
      res.json(data);
    }
  } catch (err) {
    req.log.error({ err }, "Error calling Cloudflare AI");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
