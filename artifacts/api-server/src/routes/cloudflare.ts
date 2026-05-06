import { Router, type IRouter } from "express";

const router: IRouter = Router();

const BUILTIN_CLOUDFLARE_MODELS = [
  { id: "@cf/meta/llama-3.1-8b-instruct", name: "Llama 3.1 8B Instruct", description: "Meta Llama 3.1 8B instruction-tuned model" },
  { id: "@cf/meta/llama-3.2-3b-instruct", name: "Llama 3.2 3B Instruct", description: "Meta Llama 3.2 3B instruction-tuned model" },
  { id: "@cf/meta/llama-3.2-11b-vision-instruct", name: "Llama 3.2 11B Vision", description: "Meta Llama 3.2 11B with vision support" },
  { id: "@cf/mistral/mistral-7b-instruct-v0.2", name: "Mistral 7B Instruct v0.2", description: "Mistral 7B instruction-tuned v0.2" },
  { id: "@cf/google/gemma-7b-it", name: "Gemma 7B IT", description: "Google Gemma 7B instruction-tuned" },
  { id: "@cf/google/gemma-2b-it", name: "Gemma 2B IT", description: "Google Gemma 2B instruction-tuned" },
  { id: "@cf/microsoft/phi-2", name: "Phi-2", description: "Microsoft Phi-2 small language model" },
  { id: "@cf/qwen/qwen1.5-7b-chat-awq", name: "Qwen 1.5 7B Chat", description: "Qwen 1.5 7B chat-optimized model" },
  { id: "@cf/deepseek-ai/deepseek-math-7b-instruct", name: "DeepSeek Math 7B", description: "DeepSeek Math 7B instruction-tuned" },
  { id: "@cf/openchat/openchat-3.5-0106", name: "OpenChat 3.5", description: "OpenChat 3.5 open-source chat model" },
  { id: "@cf/tiiuae/falcon-7b-instruct", name: "Falcon 7B Instruct", description: "TII Falcon 7B instruction-tuned" },
  { id: "@hf/thebloke/llama-2-13b-chat-awq", name: "Llama 2 13B Chat", description: "Meta Llama 2 13B chat-optimized (AWQ)" },
];

router.get("/cloudflare/models", async (req, res) => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    res.json({ models: BUILTIN_CLOUDFLARE_MODELS });
    return;
  }

  try {
    const upstream = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/models/search?task=Text%20Generation&per_page=50`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!upstream.ok) {
      res.json({ models: BUILTIN_CLOUDFLARE_MODELS });
      return;
    }
    const data = (await upstream.json()) as { result?: { id: string; name: string; description?: string }[] };
    const models = (data.result ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
    }));
    res.json({ models: models.length > 0 ? models : BUILTIN_CLOUDFLARE_MODELS });
  } catch {
    res.json({ models: BUILTIN_CLOUDFLARE_MODELS });
  }
});

export default router;
