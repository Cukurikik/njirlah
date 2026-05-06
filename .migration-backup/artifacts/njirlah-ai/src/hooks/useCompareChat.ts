import { useCallback, useState } from "react";
import { useCompareStore } from "@/store/compare-store";
import { useApiKeyStore } from "@/store/api-key-store";
import type { ModelProvider } from "@/store/chat-store";

const SYSTEM_PROMPT = `You are NJIRLAH AI, an expert full-stack developer and AI assistant.
Answer clearly and concisely. When showing code, always specify the language.
Dark mode Tailwind CSS by default for any UI code.`;

async function readStream(
  response: Response,
  onChunk: (chunk: string) => void,
): Promise<string> {
  if (!response.body) throw new Error("No response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
          result?: string;
        };
        const chunk =
          parsed.choices?.[0]?.delta?.content ??
          (typeof parsed.result === "string" ? parsed.result : "");
        if (chunk) { full += chunk; onChunk(chunk); }
      } catch { /* skip */ }
    }
  }
  return full;
}

async function fetchModel(
  model: string,
  provider: ModelProvider,
  messages: { role: string; content: string }[],
  openRouterKey: string | null,
): Promise<Response> {
  const body = JSON.stringify({ model, messages, stream: true });
  if (provider === "replit") {
    return fetch("/api/replit/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body });
  }
  if (provider === "cloudflare") {
    return fetch("/api/cloudflare/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body });
  }
  if (!openRouterKey) throw new Error("OpenRouter API key required");
  return fetch("/api/openrouter/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": openRouterKey },
    body,
  });
}

export function useCompareChat() {
  const { modelA, providerA, modelB, providerB, addRound, appendA, appendB, finalizeA, finalizeB } = useCompareStore();
  const { openRouterKey } = useApiKeyStore();
  const [isComparing, setIsComparing] = useState(false);

  const compare = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isComparing) return;

    setIsComparing(true);
    const roundId = addRound(prompt);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ];

    const runA = async () => {
      try {
        const res = await fetchModel(modelA, providerA, messages, openRouterKey);
        if (!res.ok) throw new Error(`${res.status}: ${await res.text().catch(() => res.statusText)}`);
        const full = await readStream(res, (c) => appendA(roundId, c));
        finalizeA(roundId, full);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        finalizeA(roundId, `❌ **Error:** ${msg}`, msg);
      }
    };

    const runB = async () => {
      try {
        const res = await fetchModel(modelB, providerB, messages, openRouterKey);
        if (!res.ok) throw new Error(`${res.status}: ${await res.text().catch(() => res.statusText)}`);
        const full = await readStream(res, (c) => appendB(roundId, c));
        finalizeB(roundId, full);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        finalizeB(roundId, `❌ **Error:** ${msg}`, msg);
      }
    };

    await Promise.all([runA(), runB()]);
    setIsComparing(false);
  }, [modelA, providerA, modelB, providerB, openRouterKey, isComparing, addRound, appendA, appendB, finalizeA, finalizeB]);

  return { compare, isComparing };
}
