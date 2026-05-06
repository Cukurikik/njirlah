import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are an expert web developer AI. Given a user request, generate a complete web project.

Return ONLY file blocks in this exact format, with no other text before or after:

###FILE: filename.ext
\`\`\`language
... code here ...
\`\`\`

Rules:
- For simple projects: return index.html (with embedded CSS/JS), style.css, script.js
- For React projects: return App.jsx, index.html
- Always include index.html as the entry point
- Make the code complete, beautiful, and functional
- Use modern CSS with dark or light theme as appropriate
- No placeholder text — build the real thing
- Do not include explanations or markdown outside the file blocks`;

function setupSSE(res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
}

function sendEvent(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function streamFromOpenRouter(
  apiKey: string,
  modelId: string,
  prompt: string,
  res: Response,
  signal: AbortSignal,
) {
  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://njirlah.ai",
      "X-Title": "NJIRLAH AI Agent",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 16000,
    }),
    signal,
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => upstream.statusText);
    throw new Error(`OpenRouter error ${upstream.status}: ${errText}`);
  }

  return upstream.body!.getReader();
}

async function streamFromCloudflare(
  modelId: string,
  prompt: string,
  res: Response,
  signal: AbortSignal,
) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare AI not configured on server.");
  }

  const upstream = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        stream: true,
        max_tokens: 8000,
      }),
      signal,
    },
  );

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => upstream.statusText);
    throw new Error(`Cloudflare error ${upstream.status}: ${errText}`);
  }

  return upstream.body!.getReader();
}

router.post("/agent/generate", async (req: Request, res: Response) => {
  const { prompt, modelSource, modelId } = req.body as {
    prompt: string;
    modelSource: "openrouter" | "cloudflare";
    modelId?: string;
  };

  if (!prompt?.trim()) {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  setupSSE(res);
  sendEvent(res, "agent_log", { message: "Menginisialisasi agen..." });

  const abortController = new AbortController();
  req.on("close", () => abortController.abort());

  try {
    let reader: ReadableStreamDefaultReader<Uint8Array>;

    if (modelSource === "openrouter") {
      const apiKey = req.headers["x-api-key"] as string | undefined;
      if (!apiKey) {
        sendEvent(res, "error", { message: "OpenRouter API key required (x-api-key header)" });
        res.end();
        return;
      }
      const model = modelId ?? "openai/gpt-4o-mini";
      sendEvent(res, "agent_log", { message: `Menggunakan model: ${model}` });
      reader = await streamFromOpenRouter(apiKey, model, prompt, res, abortController.signal);
    } else {
      const model = modelId ?? "@cf/meta/llama-3.1-8b-instruct";
      sendEvent(res, "agent_log", { message: `Menggunakan model Cloudflare: ${model}` });
      reader = await streamFromCloudflare(model, prompt, res, abortController.signal);
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    const flushFile = (filename: string, content: string) => {
      const clean = content
        .replace(/^```[\w]*\n?/, "")
        .replace(/\n?```\s*$/, "")
        .trim();
      if (clean) {
        sendEvent(res, "file_end", { filename, content: clean });
      }
    };

    sendEvent(res, "agent_log", { message: "Model sedang menghasilkan kode..." });

    let currentFile: string | null = null;
    let currentContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const raw = decoder.decode(value, { stream: true });
      buffer += raw;

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const dataStr = line.slice(6).trim();
        if (dataStr === "[DONE]") continue;

        let chunkText = "";
        try {
          const parsed = JSON.parse(dataStr) as {
            choices?: { delta?: { text?: string; content?: string } }[];
            response?: string;
          };
          chunkText =
            parsed.choices?.[0]?.delta?.content ??
            parsed.choices?.[0]?.delta?.text ??
            parsed.response ??
            "";
        } catch {
          continue;
        }

        if (!chunkText) continue;
        fullText += chunkText;

        const segments = (currentFile !== null ? currentContent + chunkText : chunkText).split(
          /(?=###FILE:)/,
        );

        if (currentFile === null) {
          for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            if (seg.startsWith("###FILE:")) {
              const firstNewline = seg.indexOf("\n");
              const filename = (
                firstNewline > -1 ? seg.slice(8, firstNewline) : seg.slice(8)
              ).trim();
              currentFile = filename;
              currentContent = firstNewline > -1 ? seg.slice(firstNewline + 1) : "";
              sendEvent(res, "file_start", { filename });
              if (currentContent) {
                sendEvent(res, "file_chunk", { filename, chunk: currentContent });
              }
            }
          }
        } else {
          const newSegments = (currentContent + chunkText).split(/(?=###FILE:)/);
          if (newSegments.length > 1) {
            flushFile(currentFile, newSegments[0]);
            for (let i = 1; i < newSegments.length; i++) {
              const seg = newSegments[i];
              const firstNewline = seg.indexOf("\n");
              const filename = (
                firstNewline > -1 ? seg.slice(8, firstNewline) : seg.slice(8)
              ).trim();
              if (i < newSegments.length - 1) {
                const content = firstNewline > -1 ? seg.slice(firstNewline + 1) : "";
                sendEvent(res, "file_start", { filename });
                flushFile(filename, content);
              } else {
                currentFile = filename;
                currentContent = firstNewline > -1 ? seg.slice(firstNewline + 1) : "";
                sendEvent(res, "file_start", { filename });
                if (currentContent) {
                  sendEvent(res, "file_chunk", { filename, chunk: currentContent });
                }
              }
            }
          } else {
            const chunk = chunkText;
            currentContent += chunk;
            sendEvent(res, "file_chunk", { filename: currentFile, chunk });
          }
        }
      }
    }

    if (currentFile && currentContent) {
      flushFile(currentFile, currentContent);
    }

    sendEvent(res, "done", { message: "Semua file berhasil dibuat!" });
    res.end();
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      sendEvent(res, "agent_log", { message: "Generasi dihentikan oleh pengguna." });
    } else {
      req.log?.error({ err }, "agent/generate error");
      sendEvent(res, "error", { message: (err as Error).message ?? "Unknown error" });
    }
    res.end();
  }
});

export default router;
