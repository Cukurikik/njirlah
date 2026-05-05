import { useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { useApiKeyStore } from "@/store/api-key-store";


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

      const chat = useChatStore.getState().getActiveChat() ?? useChatStore.getState().chats.find((c) => c.id === chatId);
      if (!chat) return;

      addMessage(chatId, { role: "user", content });

      const userMsgId = addMessage(chatId, { role: "assistant", content: "", isStreaming: true });

      setStreaming(true);

      const messages = [
        ...chat.messages,
        { role: "user" as const, content },
      ].map(({ role, content }) => ({ role, content }));

      try {
        let response: Response;

        if (selectedProvider === "cloudflare") {
          response = await fetch(`/api/cloudflare/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: selectedModel, messages, stream: true }),
          });
        } else {
          if (!openRouterKey) throw new Error("OpenRouter API key required");
          response = await fetch(`/api/openrouter/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": openRouterKey,
            },
            body: JSON.stringify({ model: selectedModel, messages, stream: true }),
          });
        }

        if (!response.ok || !response.body) {
          throw new Error(`Request failed: ${response.status}`);
        }

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
                appendToMessage(chatId!, userMsgId, chunk);
              }
            } catch {
              // skip malformed lines
            }
          }
        }

        updateMessage(chatId!, userMsgId, { isStreaming: false, content: fullContent });

        if (chat.messages.length === 0 && fullContent) {
          const titleWords = content.split(" ").slice(0, 5).join(" ");
          setTitle(chatId!, titleWords + (content.split(" ").length > 5 ? "..." : ""));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
        updateMessage(chatId!, userMsgId, {
          content: `❌ Error: ${errorMsg}`,
          isStreaming: false,
        });
      } finally {
        setStreaming(false);
      }
    },
    [activeChatId, selectedModel, selectedProvider, openRouterKey, addMessage, updateMessage, appendToMessage, setTitle, createChat, setStreaming],
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

    const priorMessages = messages.slice(0, -1).map(({ role, content }) => ({ role, content }));

    try {
      let response: Response;
      if (selectedProvider === "cloudflare") {
        response = await fetch(`/api/cloudflare/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: selectedModel, messages: priorMessages, stream: true }),
        });
      } else {
        if (!openRouterKey) throw new Error("OpenRouter API key required");
        response = await fetch(`/api/openrouter/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": openRouterKey },
          body: JSON.stringify({ model: selectedModel, messages: priorMessages, stream: true }),
        });
      }

      if (!response.ok || !response.body) throw new Error(`Request failed: ${response.status}`);

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
            const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }>; result?: string };
            const chunk = parsed.choices?.[0]?.delta?.content ?? (typeof parsed.result === "string" ? parsed.result : "");
            if (chunk) {
              fullContent += chunk;
              useChatStore.getState().appendToMessage(chat.id, lastAssistant.id, chunk);
            }
          } catch { /* skip */ }
        }
      }

      useChatStore.getState().updateMessage(chat.id, lastAssistant.id, { content: fullContent, isStreaming: false });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      useChatStore.getState().updateMessage(chat.id, lastAssistant.id, { content: `❌ Error: ${errorMsg}`, isStreaming: false });
    } finally {
      setStreaming(false);
    }
  }, [getActiveChat, selectedModel, selectedProvider, openRouterKey, setStreaming]);

  return { sendMessage, regenerate };
}
