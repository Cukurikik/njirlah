import { useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";

const SYSTEM_PROMPT = `You are NJIRLAH AI, an expert full-stack developer and UI/UX engineer.

When generating UI, web pages, or components:
- Always use Tailwind CSS for styling. For standalone HTML previews include <script src="https://cdn.tailwindcss.com"></script> in <head>.
- Use shadcn/ui component patterns (Radix primitives + Tailwind) for React components.
- Prefer React with TypeScript; use vanilla HTML+Tailwind for standalone previews.
- Dark mode by default: bg-gray-950, text-white, border-gray-800 palette.
- Make components fully responsive, accessible, and production-quality.
- Always show complete, working code — never truncate with "// ... rest of code".
- For code blocks, always specify the language (html, tsx, css, python, etc.).`;

type ApiMessage = { role: "user" | "assistant" | "system"; content: string };

function buildApiMessages(chatMessages: ApiMessage[], userContent: string): ApiMessage[] {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatMessages,
    { role: "user", content: userContent },
  ];
}

async function readStream(
  response: Response,
  onChunk: (chunk: string) => void,
): Promise<string> {
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";
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

        let chunk = "";
        if (parsed.choices?.[0]?.delta?.content) {
          chunk = parsed.choices[0].delta.content;
        } else if (typeof parsed.result === "string") {
          chunk = parsed.result;
        }

        if (chunk) {
          fullContent += chunk;
          onChunk(chunk);
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  return fullContent;
}

export function useChat() {
  const {
    activeChatId,
    addMessage,
    updateMessage,
    appendToMessage,
    setTitle,
    createChat,
    setStreaming,
    selectedModel,
    selectedProvider,
    getActiveChat,
  } = useChatStore();
  const { openRouterKey } = useApiKeyStore();

  const sendMessage = useCallback(
    async (content: string) => {
      let chatId = activeChatId;
      if (!chatId) {
        chatId = createChat();
      }

      const chat =
        useChatStore.getState().getActiveChat() ??
        useChatStore.getState().chats.find((c) => c.id === chatId);
      if (!chat) return;

      addMessage(chatId, { role: "user", content });
      const assistantMsgId = addMessage(chatId, {
        role: "assistant",
        content: "",
        isStreaming: true,
      });

      setStreaming(true);

      const priorMessages = chat.messages.map(({ role, content: c }) => ({
        role: role as "user" | "assistant" | "system",
        content: c,
      }));
      const apiMessages = buildApiMessages(priorMessages, content);

      try {
        let response: Response;

        if (selectedProvider === "replit") {
          response = await fetch(`/api/replit/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: selectedModel,
              messages: apiMessages,
              stream: true,
            }),
          });
        } else if (selectedProvider === "cloudflare") {
          response = await fetch(`/api/cloudflare/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: selectedModel,
              messages: apiMessages,
              stream: true,
            }),
          });
        } else {
          if (!openRouterKey) throw new Error("OpenRouter API key required");
          response = await fetch(`/api/openrouter/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": openRouterKey,
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: apiMessages,
              stream: true,
            }),
          });
        }

        if (!response.ok) {
          const errText = await response.text().catch(() => response.statusText);
          throw new Error(`Request failed (${response.status}): ${errText}`);
        }

        const fullContent = await readStream(response, (chunk) => {
          appendToMessage(chatId!, assistantMsgId, chunk);
        });

        updateMessage(chatId!, assistantMsgId, {
          isStreaming: false,
          content: fullContent,
        });

        if (chat.messages.length === 0 && fullContent) {
          const titleWords = content.split(" ").slice(0, 6).join(" ");
          setTitle(
            chatId!,
            titleWords + (content.split(" ").length > 6 ? "…" : ""),
          );
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        updateMessage(chatId!, assistantMsgId, {
          content: `❌ **Error:** ${errorMsg}`,
          isStreaming: false,
        });
      } finally {
        setStreaming(false);
      }
    },
    [
      activeChatId,
      selectedModel,
      selectedProvider,
      openRouterKey,
      addMessage,
      updateMessage,
      appendToMessage,
      setTitle,
      createChat,
      setStreaming,
    ],
  );

  const regenerate = useCallback(async () => {
    const chat = getActiveChat();
    if (!chat || chat.messages.length < 2) return;

    const messages = [...chat.messages];
    const lastAssistant = messages[messages.length - 1];
    if (lastAssistant.role !== "assistant") return;

    const lastUser = messages[messages.length - 2];
    if (!lastUser || lastUser.role !== "user") return;

    useChatStore
      .getState()
      .updateMessage(chat.id, lastAssistant.id, { content: "", isStreaming: true });
    setStreaming(true);

    const priorMessages = messages
      .slice(0, -2)
      .map(({ role, content }) => ({
        role: role as "user" | "assistant" | "system",
        content,
      }));
    const apiMessages = buildApiMessages(priorMessages, lastUser.content);

    try {
      let response: Response;

      if (selectedProvider === "replit") {
        response = await fetch(`/api/replit/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: selectedModel,
            messages: apiMessages,
            stream: true,
          }),
        });
      } else if (selectedProvider === "cloudflare") {
        response = await fetch(`/api/cloudflare/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: selectedModel,
            messages: apiMessages,
            stream: true,
          }),
        });
      } else {
        if (!openRouterKey) throw new Error("OpenRouter API key required");
        response = await fetch(`/api/openrouter/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": openRouterKey },
          body: JSON.stringify({
            model: selectedModel,
            messages: apiMessages,
            stream: true,
          }),
        });
      }

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const fullContent = await readStream(response, (chunk) => {
        useChatStore.getState().appendToMessage(chat.id, lastAssistant.id, chunk);
      });

      useChatStore
        .getState()
        .updateMessage(chat.id, lastAssistant.id, {
          content: fullContent,
          isStreaming: false,
        });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      useChatStore
        .getState()
        .updateMessage(chat.id, lastAssistant.id, {
          content: `❌ **Error:** ${errorMsg}`,
          isStreaming: false,
        });
    } finally {
      setStreaming(false);
    }
  }, [getActiveChat, selectedModel, selectedProvider, openRouterKey, setStreaming]);

  return { sendMessage, regenerate };
}
