import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const client = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"] ?? "dummy",
});

const SYSTEM_PROMPT = `You are NJIRLAH AI, an expert full-stack developer and UI/UX engineer.

When generating UI, web pages, or components:
- Always use Tailwind CSS for styling. When generating standalone HTML files, include <script src="https://cdn.tailwindcss.com"></script> in <head>.
- Use shadcn/ui component patterns (Radix primitives styled with Tailwind) when building React components.
- Prefer React with TypeScript for components; vanilla HTML+Tailwind for standalone previews.
- Dark mode by default: use bg-gray-950, text-white, border-gray-800 palette unless told otherwise.
- Make components fully responsive, accessible, and production-quality.
- When asked to modify or fix a specific element, return the minimal required change with clear explanation.
- For code blocks, always specify the language (html, tsx, css, python, etc.).
- Be concise: show complete, working code — never truncate with "// ... rest of code".`;

router.post("/replit/chat", async (req, res) => {
  const { messages, model = "gpt-5.4", stream = true } = req.body as {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    stream?: boolean;
  };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
  ];

  if (!stream) {
    try {
      const response = await client.chat.completions.create({
        model,
        max_completion_tokens: 8192,
        messages: allMessages,
      });
      res.json(response);
    } catch (err) {
      req.log.error({ err }, "Error calling Replit AI (non-stream)");
      res.status(500).json({ error: "AI request failed" });
    }
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const streamResp = await client.chat.completions.create({
      model,
      max_completion_tokens: 8192,
      messages: allMessages,
      stream: true,
    });

    for await (const chunk of streamResp) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(
          `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`,
        );
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    req.log.error({ err }, "Error calling Replit AI (stream)");
    res.write(
      `data: ${JSON.stringify({ error: "AI request failed" })}\n\n`,
    );
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

export default router;
