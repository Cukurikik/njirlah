import { useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { useDevModeStore } from "@/store/dev-mode-store";

const BASE_SYSTEM_PROMPT = `You are NJIRLAH AI, an elite coding assistant built for vibe coders who ship fast.

Your personality: Sharp, direct, zero fluff. You write production-ready code immediately.

Rules:
1. Always output complete, working code — no placeholders, no "add your logic here"
2. Default to TypeScript for JS projects
3. Include proper error handling
4. Add comments only for non-obvious logic
5. When building UI, make it beautiful by default — use Tailwind CSS, dark mode, responsive
6. Ask clarifying questions ONLY when absolutely necessary
7. Prefer modern patterns: async/await, hooks, composables
8. Always consider mobile responsiveness
9. Output code in properly labeled markdown blocks with language tag
10. For standalone HTML previews, always include <script src="https://cdn.tailwindcss.com"></script>
11. After code, give a 2-line summary of what was built and next steps`;

type ApiMessage = { role: "user" | "assistant" | "system"; content: string };

function buildApiMessages(
  chatMessages: ApiMessage[],
  userContent: string,
  customInstructions?: string,
  devModePrompt?: string,
): ApiMessage[] {
  let systemContent = BASE_SYSTEM_PROMPT;

  if (devModePrompt) {
    systemContent += `\n\n## Current Development Mode\n${devModePrompt}`;
  }

  if (customInstructions?.trim()) {
    systemContent += `\n\n## Custom Instructions\n${customInstructions.trim()}`;
  }

  return [
    { role: "system", content: systemContent },
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
          error?: string;
        };

        if (parsed.error) throw new Error(parsed.error);

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
      } catch (e) {
        if ((e as Error).message && !(e as SyntaxError).stack?.includes("JSON.parse")) {
          throw e;
        }
      }
    }
  }

  return fullContent;
}

async function fetchWithProvider(
  selectedProvider: string,
  selectedModel: string,
  apiMessages: ApiMessage[],
  openRouterKey: string | null,
) {
  if (selectedProvider === "replit") {
    return fetch(`/api/replit/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: selectedModel, messages: apiMessages, stream: true }),
    });
  } else if (selectedProvider === "cloudflare") {
    return fetch(`/api/cloudflare/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: selectedModel, messages: apiMessages, stream: true }),
    });
  } else {
    if (!openRouterKey) throw new Error("OpenRouter API key required. Click 'Add API Key' to get started.");
    return fetch(`/api/openrouter/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": openRouterKey },
      body: JSON.stringify({ model: selectedModel, messages: apiMessages, stream: true }),
    });
  }
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
    customInstructions,
  } = useChatStore();
  const { openRouterKey } = useApiKeyStore();
  const { getActiveConfig } = useDevModeStore();

  const sendMessage = useCallback(
    async (content: string) => {
      let chatId = activeChatId;
      if (!chatId) chatId = createChat();

      const chat =
        useChatStore.getState().getActiveChat() ??
        useChatStore.getState().chats.find((c) => c.id === chatId);
      if (!chat) return;

      addMessage(chatId, { role: "user", content });
      const assistantMsgId = addMessage(chatId, { role: "assistant", content: "", isStreaming: true });
      setStreaming(true);

      const devConfig = getActiveConfig();
      const priorMessages = chat.messages.map(({ role, content: c }) => ({
        role: role as "user" | "assistant" | "system",
        content: c,
      }));
      const apiMessages = buildApiMessages(priorMessages, content, customInstructions, devConfig.systemPrompt);

      try {
        const response = await fetchWithProvider(selectedProvider, selectedModel, apiMessages, openRouterKey);

        if (!response.ok) {
          const errText = await response.text().catch(() => response.statusText);
          throw new Error(`Request failed (${response.status}): ${errText}`);
        }

        const fullContent = await readStream(response, (chunk) => {
          appendToMessage(chatId!, assistantMsgId, chunk);
        });

        updateMessage(chatId!, assistantMsgId, { isStreaming: false, content: fullContent });

        if (chat.messages.length === 0 && fullContent) {
          const titleWords = content.split(" ").slice(0, 6).join(" ");
          setTitle(chatId!, titleWords + (content.split(" ").length > 6 ? "…" : ""));
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
    [activeChatId, selectedModel, selectedProvider, openRouterKey, customInstructions,
     addMessage, updateMessage, appendToMessage, setTitle, createChat, setStreaming, getActiveConfig],
  );

  const regenerate = useCallback(async () => {
    const chat = getActiveChat();
    if (!chat || chat.messages.length < 2) return;

    const messages = [...chat.messages];
    const lastAssistant = messages[messages.length - 1];
    if (lastAssistant.role !== "assistant") return;

    const lastUser = messages[messages.length - 2];
    if (!lastUser || lastUser.role !== "user") return;

    useChatStore.getState().updateMessage(chat.id, lastAssistant.id, { content: "", isStreaming: true });
    setStreaming(true);

    const devConfig = getActiveConfig();
    const priorMessages = messages.slice(0, -2).map(({ role, content }) => ({
      role: role as "user" | "assistant" | "system",
      content,
    }));
    const apiMessages = buildApiMessages(
      priorMessages,
      lastUser.content,
      useChatStore.getState().customInstructions,
      devConfig.systemPrompt,
    );

    try {
      const response = await fetchWithProvider(selectedProvider, selectedModel, apiMessages, openRouterKey);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const fullContent = await readStream(response, (chunk) => {
        useChatStore.getState().appendToMessage(chat.id, lastAssistant.id, chunk);
      });

      useChatStore.getState().updateMessage(chat.id, lastAssistant.id, {
        content: fullContent,
        isStreaming: false,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      useChatStore.getState().updateMessage(chat.id, lastAssistant.id, {
        content: `❌ **Error:** ${errorMsg}`,
        isStreaming: false,
      });
    } finally {
      setStreaming(false);
    }
  }, [getActiveChat, selectedModel, selectedProvider, openRouterKey, setStreaming, getActiveConfig]);

  return { sendMessage, regenerate };
}
